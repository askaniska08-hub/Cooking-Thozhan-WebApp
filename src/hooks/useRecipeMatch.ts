import type { Recipe, RecipeWithMatch } from '@/types';
import { getIngredientStatus, normalizeIngredient } from '@/utils';

/** Minimum match percentage for a recipe to be shown anywhere. */
export const MIN_MATCH_THRESHOLD = 45;

function computeStars(match: number): number {
  if (match >= 100) return 5;
  if (match >= 70) return 4;
  if (match >= 45) return 3;
  return 2;
}

export function computeMatch(recipe: Recipe, selected: string[]): RecipeWithMatch | null {
  const status = getIngredientStatus(recipe.ingredients, selected);

  // All "must" ingredients must be available (selected or pantry)
  const mustOk = recipe.must.every((m) => {
    const norm = normalizeIngredient(m);
    return status.availableIngredients.some((a) => normalizeIngredient(a) === norm);
  });
  if (!mustOk) return null;

  // Below threshold — treat as non-existent
  if (status.matchPercentage < MIN_MATCH_THRESHOLD) return null;

  return {
    ...recipe,
    matchPercent: status.matchPercentage,
    matched: status.availableIngredients,
    pantryIngredients: status.pantryIngredients,
    missing: status.missingIngredients,
    stars: computeStars(status.matchPercentage),
  };
}

export interface MatchBuckets {
  perfect: RecipeWithMatch[];
  great: RecipeWithMatch[];
  tryAlso: RecipeWithMatch[];
  total: number;
}

export function bucketMatches(recipes: Recipe[], selected: string[]): MatchBuckets {
  const withMatches = recipes
    .map((r) => computeMatch(r, selected))
    .filter((r): r is RecipeWithMatch => r !== null)
    .sort((a, b) => {
      if (b.matchPercent !== a.matchPercent) return b.matchPercent - a.matchPercent;
      if (a.missing.length !== b.missing.length) return a.missing.length - b.missing.length;
      return a.time - b.time;
    });

  return {
    perfect: withMatches.filter((r) => r.matchPercent === 100),
    great: withMatches.filter((r) => r.matchPercent >= 70 && r.matchPercent < 100),
    tryAlso: withMatches.filter((r) => r.matchPercent >= 45 && r.matchPercent < 70),
    total: withMatches.length,
  };
}

export function searchRecipes(recipes: Recipe[], query: string): Recipe[] {
  const q = normalizeIngredient(query);
  if (!q) return recipes;
  return recipes.filter(
    (r) =>
      normalizeIngredient(r.name).includes(q) ||
      normalizeIngredient(r.category).includes(q) ||
      normalizeIngredient(r.meal).includes(q) ||
      r.ingredients.some((i) => normalizeIngredient(i).includes(q)),
  );
}
