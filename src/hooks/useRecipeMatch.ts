import type { Recipe, RecipeWithMatch } from '@/types';
import { isIngredientAvailable, normalizeIngredient } from '@/utils';

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

  const matched: string[] = [];
  const missing: string[] = [];

  recipe.ingredients.forEach((ing) => {
    if (isIngredientAvailable(ing, selected)) {
      matched.push(ing);
    } else {
      missing.push(ing);
    }
  });

  // Match percent is based on ALL ingredients (pantry items count as available)
  const matchPercent = Math.min(100, Math.max(0, Math.round((matched.length / (recipe.ingredients.length || 1)) * 100)));

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
  const withMatches = recipes
    .map((r) => computeMatch(r, selected))
    .filter((r): r is RecipeWithMatch => r !== null && r.matchPercent >= 60)
    .sort((a, b) => {
      if (b.matchPercent !== a.matchPercent) return b.matchPercent - a.matchPercent;
      if (a.missing.length !== b.missing.length) return a.missing.length - b.missing.length;
      return a.time - b.time;
    });

  return {
    perfect: withMatches.filter((r) => r.matchPercent === 100),
    great: withMatches.filter((r) => r.matchPercent >= 80 && r.matchPercent < 100),
    tryAlso: withMatches.filter((r) => r.matchPercent >= 60 && r.matchPercent < 80),
    total: withMatches.length,
  };
}

export function searchRecipes(recipes: Recipe[], query: string): Recipe[] {
  const q = query.trim().toLowerCase();
  if (!q) return recipes;
  return recipes.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.meal.toLowerCase().includes(q) ||
      r.ingredients.some((i) => i.toLowerCase().includes(q)),
  );
}
