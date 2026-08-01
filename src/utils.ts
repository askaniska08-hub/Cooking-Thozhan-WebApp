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

/**
 * Check whether a recipe ingredient is available to the user.
 *
 * An ingredient is "available" if:
 *   1. It is in the user's selected ingredients (case-insensitive, whitespace-normalized), OR
 *   2. It is a pantry staple (Salt, Cooking Oil, etc.) that is assumed to be on hand.
 *
 * This is the SINGLE source of truth for ingredient availability.
 */
export function isIngredientAvailable(ingredient: string, selected: string[]): boolean {
  const norm = normalizeIngredient(ingredient);
  if (PANTRY_ALL.has(norm)) return true;
  return selected.some((s) => normalizeIngredient(s) === norm);
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
 * (selected or pantry). De-duplicated, preserves recipe order.
 */
export function getMatchedIngredients(recipeIngredients: string[], selected: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const ing of recipeIngredients) {
    const n = normalizeIngredient(ing);
    if (!isIngredientAvailable(ing, selected) || seen.has(n)) continue;
    seen.add(n);
    result.push(ing);
  }
  return result;
}

/**
 * Returns the display names of ingredients the user does NOT have.
 * Pantry staples are excluded — they are assumed on hand.
 * De-duplicated, preserves recipe order.
 */
export function getMissingIngredients(recipeIngredients: string[], selected: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const ing of recipeIngredients) {
    const n = normalizeIngredient(ing);
    if (isIngredientAvailable(ing, selected) || seen.has(n)) continue;
    seen.add(n);
    result.push(ing);
  }
  return result;
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
