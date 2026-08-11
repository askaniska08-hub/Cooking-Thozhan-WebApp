import { INGREDIENTS, PANTRY_STAPLES, INGREDIENT_ALIASES } from '@/data/ingredients';
import type { IngredientCategory } from '@/types';

/**
 * Normalize an ingredient name for reliable comparison.
 * - trims whitespace
 * - collapses internal whitespace to single space
 * - lowercases
 * - normalizes Unicode to NFC form
 * - removes zero-width characters and BOM
 */
export function normalizeIngredient(name: string): string {
  return name
    .normalize('NFC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

// Pre-computed normalized sets for O(1) lookups
const INGREDIENT_SET = new Set(INGREDIENTS.map((i) => normalizeIngredient(i.name)));
const PANTRY_ALL = new Set<string>([
  ...[...PANTRY_STAPLES].map(normalizeIngredient),
]);

// Normalized alias map for O(1) lookup
const ALIAS_MAP = new Map<string, string>();
for (const [alias, canonical] of Object.entries(INGREDIENT_ALIASES)) {
  ALIAS_MAP.set(normalizeIngredient(alias), canonical);
}

/**
 * Resolve a raw ingredient string (alias, plural, misspelling) to its
 * canonical display name from the master INGREDIENTS list.
 * Returns the original string if no alias is found.
 */
export function resolveIngredient(raw: string): string {
  const norm = normalizeIngredient(raw);
  return ALIAS_MAP.get(norm) ?? raw;
}

/**
 * Escape a string for safe use inside a RegExp.
 */
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Extract all known ingredients mentioned in a free-text string.
 * Handles aliases, plurals, common misspellings, and case variations.
 * Returns canonical display names (e.g. "Capsicum" for "bell pepper").
 */
export function extractIngredientsFromText(text: string): string[] {
  const norm = normalizeIngredient(text);
  const found = new Set<string>();
  for (const [lowerName, canonicalName] of ALIAS_MAP) {
    const re = new RegExp(`\\b${escapeRegex(lowerName)}\\b`, 'i');
    if (re.test(norm)) {
      found.add(canonicalName);
    }
  }
  for (const ing of INGREDIENTS) {
    const ln = normalizeIngredient(ing.name);
    const re = new RegExp(`\\b${escapeRegex(ln)}\\b`, 'i');
    if (re.test(norm)) {
      found.add(ing.name);
    }
  }
  return [...found];
}

export interface IngredientStatus {
  /** Ingredients the user explicitly selected — shown as ✅ Selected by You */
  availableIngredients: string[];
  /** Pantry staples assumed on hand — shown as 🟡 Pantry Staple (never ✅) */
  pantryIngredients: string[];
  /** Everything else — shown as ❌ Missing */
  missingIngredients: string[];
  /** Count of available + pantry (used for match %) */
  matchedCount: number;
  totalIngredients: number;
  matchPercentage: number;
  /** Core (must-have) ingredients that are missing — drives heavy penalty */
  missingCore: string[];
}

/**
 * THE single source of truth for ingredient matching.
 *
 * Splits recipe ingredients into three buckets:
 *   1. available  — explicitly selected by the user (✅ Selected by You)
 *   2. pantry     — assumed on-hand staples (🟡 Pantry Staple, never ✅)
 *   3. missing    — everything else (❌ Missing)
 *
 * Normalizes every ingredient name (trim, lowercase, Unicode NFC) before
 * comparison.  Compares ingredient names only — never objects, references,
 * or categories.  No ingredient is ever hardcoded or special-cased.
 *
 * Pantry staples are NEVER treated as user-selected.  They count toward
 * match percentage but display separately so users are never misled.
 *
 * Returns de-duplicated lists (recipe order preserved), counts, and a
 * match percentage rounded to the nearest whole number.
 */
const SEASONING_CATEGORIES = new Set<IngredientCategory>(['Herbs & Flavourings']);

const INGREDIENT_CATEGORY_MAP = new Map<string, IngredientCategory>();
for (const ing of INGREDIENTS) {
  INGREDIENT_CATEGORY_MAP.set(normalizeIngredient(ing.name), ing.category);
}

function isSeasoning(ingredient: string): boolean {
  const cat = INGREDIENT_CATEGORY_MAP.get(normalizeIngredient(ingredient));
  return cat !== undefined && SEASONING_CATEGORIES.has(cat);
}

export function getIngredientStatus(
  recipeIngredients: string[],
  selected: string[],
  must: string[] = [],
): IngredientStatus {
  const selectedSet = new Set(selected.map(normalizeIngredient));
  const mustSet = new Set(must.map(normalizeIngredient));

  const seen = new Set<string>();
  const availableIngredients: string[] = [];
  const pantryIngredients: string[] = [];
  const missingIngredients: string[] = [];
  const missingCore: string[] = [];

  for (const ing of recipeIngredients) {
    const norm = normalizeIngredient(ing);
    if (seen.has(norm)) continue;
    seen.add(norm);

    const isCore = mustSet.has(norm);

    if (selectedSet.has(norm)) {
      availableIngredients.push(ing);
    } else if (PANTRY_ALL.has(norm)) {
      pantryIngredients.push(ing);
    } else {
      missingIngredients.push(ing);
      if (isCore) missingCore.push(ing);
    }
  }

  const matchedCount = availableIngredients.length + pantryIngredients.length;
  const totalIngredients = matchedCount + missingIngredients.length;

  // Weighted scoring: core ingredients carry 3x weight, seasonings 0.5x, optional 1x
  let totalWeight = 0;
  let matchedWeight = 0;
  for (const ing of recipeIngredients) {
    const norm = normalizeIngredient(ing);
    const isCore = mustSet.has(norm);
    const isSeasoningIng = isSeasoning(ing);
    const weight = isCore ? 3 : isSeasoningIng ? 0.5 : 1;

    totalWeight += weight;
    if (selectedSet.has(norm) || PANTRY_ALL.has(norm)) {
      matchedWeight += weight;
    }
  }

  const matchPercentage = totalWeight === 0
    ? 0
    : Math.round((matchedWeight / totalWeight) * 100);

  return {
    availableIngredients,
    pantryIngredients,
    missingIngredients,
    matchedCount,
    totalIngredients,
    matchPercentage,
    missingCore,
  };
}

/**
 * Check whether a recipe ingredient is available to the user
 * (either explicitly selected or a pantry staple).
 * Delegates to getIngredientStatus — never duplicates matching logic.
 */
export function isIngredientAvailable(ingredient: string, selected: string[]): boolean {
  const status = getIngredientStatus([ingredient], selected);
  return status.availableIngredients.length > 0 || status.pantryIngredients.length > 0;
}

/**
 * Returns true if an ingredient string exactly matches (after normalization)
 * an entry in the master INGREDIENTS list.
 */
export function isKnownIngredient(ingredient: string): boolean {
  return INGREDIENT_SET.has(normalizeIngredient(ingredient));
}

/**
 * Returns the display names of ingredients the user HAS available
 * (explicitly selected). Does NOT include pantry staples — those are
 * separate. Delegates to getIngredientStatus.
 */
export function getMatchedIngredients(recipeIngredients: string[], selected: string[]): string[] {
  return getIngredientStatus(recipeIngredients, selected).availableIngredients;
}

/**
 * Returns the display names of ingredients the user does NOT have.
 * Pantry staples are excluded — they are assumed on hand.
 * Delegates to getIngredientStatus.
 */
export function getMissingIngredients(recipeIngredients: string[], selected: string[]): string[] {
  return getIngredientStatus(recipeIngredients, selected).missingIngredients;
}

/**
 * Normalize an array of ingredient names, returning unique values.
 */
export function normalizeIngredientList(ingredients: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const ing of ingredients) {
    const n = normalizeIngredient(ing);
    if (!seen.has(n)) {
      seen.add(n);
      result.push(ing);
    }
  }
  return result;
}

export function pluralize(n: number, singular: string, plural?: string) {
  if (n === 1) return `${n} ${singular}`;
  return `${n} ${plural ?? singular + 's'}`;
}

export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ');
}
