import { INGREDIENTS, PANTRY_STAPLES, INGREDIENT_ALIASES } from '@/data/ingredients';

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
  availableIngredients: string[];
  missingIngredients: string[];
  matchedCount: number;
  totalIngredients: number;
  matchPercentage: number;
}

/**
 * THE single source of truth for ingredient matching.
 *
 * Normalizes every ingredient name (trim, lowercase, Unicode NFC) before
 * comparison.  Compares ingredient names only — never objects, references,
 * or categories.  No ingredient is ever hardcoded or special-cased.
 *
 * Returns available/missing lists (de-duplicated, recipe order preserved),
 * counts, and a match percentage rounded to the nearest whole number.
 */
export function getIngredientStatus(
  recipeIngredients: string[],
  selected: string[],
): IngredientStatus {
  const selectedSet = new Set(selected.map(normalizeIngredient));

  const seen = new Set<string>();
  const availableIngredients: string[] = [];
  const missingIngredients: string[] = [];

  for (const ing of recipeIngredients) {
    const norm = normalizeIngredient(ing);
    if (seen.has(norm)) continue;
    seen.add(norm);

    const isAvailable = PANTRY_ALL.has(norm) || selectedSet.has(norm);
    if (isAvailable) {
      availableIngredients.push(ing);
    } else {
      missingIngredients.push(ing);
    }
  }

  const matchedCount = availableIngredients.length;
  const totalIngredients = matchedCount + missingIngredients.length;
  const matchPercentage = totalIngredients === 0
    ? 0
    : Math.round((matchedCount / totalIngredients) * 100);

  return {
    availableIngredients,
    missingIngredients,
    matchedCount,
    totalIngredients,
    matchPercentage,
  };
}

/**
 * Check whether a recipe ingredient is available to the user.
 * Delegates to getIngredientStatus — never duplicates matching logic.
 */
export function isIngredientAvailable(ingredient: string, selected: string[]): boolean {
  const norm = normalizeIngredient(ingredient);
  const selectedSet = new Set(selected.map(normalizeIngredient));
  return PANTRY_ALL.has(norm) || selectedSet.has(norm);
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
 * (selected or pantry). Delegates to getIngredientStatus.
 */
export function getMatchedIngredients(recipeIngredients: string[], selected: string[]): string[] {
  return getIngredientStatus(recipeIngredients, selected).availableIngredients;
}

/**
 * Returns the display names of ingredients the user does NOT have.
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
