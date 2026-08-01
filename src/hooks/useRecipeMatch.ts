import type { Recipe, RecipeWithMatch } from '@/types';
import { isIngredientAvailable, normalizeIngredient, getMatchedIngredients, getMissingIngredients } from '@/utils';

function computeStars(match: number): number {
  if (match >= 100) return 5;
  if (match >= 80) return 4;
  if (match >= 60) return 3;
  return 2;
}

export function computeMatch(recipe: Recipe, selected: string[]): RecipeWithMatch | null {
  // All "must" ingredients must be available (selected or pantry)
  const mustOk = recipe.must.every((m) => isIngredientAvailable(m, selected));
  if (!mustOk) return null;

  const matched = getMatchedIngredients(recipe.ingredients, selected);
  const missing = getMissingIngredients(recipe.ingredients, selected);
  const total = matched.length + missing.length;

  // Match percent uses de-duplicated counts (no double-counting duplicates)
  const matchPercent = Math.min(100, Math.max(0, Math.round((matched.length / (total || 1)) * 100)));

  return {
    ...recipe,
    matchPercent,
    matched,
    missing,
    stars: computeStars(matchPercent),
  };
}

export interface MatchBuckets {
  perfect: RecipeWithMatch[];
  great: RecipeWithMatch[];
  tryAlso: RecipeWithMatch[];
  total: number;
}

export function bucketMatches(recipes: Recipe[], selected: string[]): MatchBuckets {
  // Any recipe whose must ingredients are all available should appear,
  // regardless of overall match percentage. The must-ingredient check in
  // computeMatch is the gatekeeper — the percentage only controls ranking.
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
    great: withMatches.filter((r) => r.matchPercent >= 80 && r.matchPercent < 100),
    tryAlso: withMatches.filter((r) => r.matchPercent < 80),
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
