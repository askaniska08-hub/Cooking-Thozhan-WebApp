import type { Recipe, RecipeWithMatch } from '@/types';
import { PANTRY_STAPLES, PANTRY_OPTIONAL } from '@/data/ingredients';

const PANTRY_ALL = new Set<string>([...PANTRY_STAPLES, ...PANTRY_OPTIONAL]);

function norm(s: string): string {
  return s.toLowerCase();
}

function computeStars(match: number): number {
  if (match >= 100) return 5;
  if (match >= 80) return 4;
  if (match >= 60) return 3;
  return 2;
}

export function computeMatch(recipe: Recipe, selected: string[]): RecipeWithMatch | null {
  const selectedSet = new Set(selected.map(norm));
  const mustOk = recipe.must.every((m) => selectedSet.has(norm(m)) || PANTRY_ALL.has(m));
  if (!mustOk) return null;

  const matched: string[] = [];
  const missing: string[] = [];
  recipe.ingredients.forEach((ing) => {
    if (PANTRY_ALL.has(ing)) return; // pantry items are always "available"
    if (selectedSet.has(norm(ing))) matched.push(ing);
    else missing.push(ing);
  });

  const totalIng = recipe.ingredients.filter((i) => !PANTRY_ALL.has(i)).length || 1;
  const matchPercent = Math.min(100, Math.max(0, Math.round((matched.length / totalIng) * 100)));

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
