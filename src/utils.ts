import { INGREDIENTS, PANTRY_STAPLES, PANTRY_OPTIONAL } from '@/data/ingredients';

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
  ...[...PANTRY_OPTIONAL].map(normalizeIngredient),
]);

/**
 * Check whether a recipe ingredient is available to the user.
 *
 * An ingredient is "available" if:
 *   1. It is in the user's selected ingredients (case-insensitive, whitespace-normalized), OR
 *   2. It is a pantry staple (Salt, Cooking Oil, etc.) that is assumed to be on hand.
 *
 * This is the SINGLE source of truth for ingredient availability.
 * Every component — Recipe Cards, Recipe Modal, Tara AI, Shopping List,
 * Match Percentage, Missing Ingredients — must call this function.
 * No component should perform its own ingredient comparison.
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
