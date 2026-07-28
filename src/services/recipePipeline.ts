import { RECIPES } from '@/data/recipes';
import { PANTRY_STAPLES } from '@/data/ingredients';
import { computeMatch } from '@/hooks/useRecipeMatch';
import type { Recipe, RecipeWithMatch } from '@/types';

/**
 * Chef Tara recipe pipeline.
 *
 * Cooking Thozhan's recipe database is always the source of truth. This
 * module ranks recipes against the user's recognised ingredients and
 * packages them into four match levels so Gemini can enhance (never
 * replace) the recommendations with explanations, substitutions and tips.
 */

export type MatchLevel = 'perfect' | 'great' | 'good' | 'almost';

export interface RankedRecipe extends RecipeWithMatch {
  level: MatchLevel;
  levelLabel: string;
  starsDisplay: string;
}

export interface RecipeRanking {
  perfect: RankedRecipe[];
  great: RankedRecipe[];
  good: RankedRecipe[];
  almost: RankedRecipe[];
  total: number;
  hasAny: boolean;
}

function levelFor(matchPercent: number): MatchLevel {
  if (matchPercent >= 100) return 'perfect';
  if (matchPercent >= 80) return 'great';
  if (matchPercent >= 60) return 'good';
  return 'almost';
}

function levelLabel(level: MatchLevel): string {
  switch (level) {
    case 'perfect': return 'Perfect Match';
    case 'great': return 'Great Match';
    case 'good': return 'Good Match';
    case 'almost': return 'Almost There';
  }
}

function starsFor(level: MatchLevel): string {
  switch (level) {
    case 'perfect': return '⭐⭐⭐⭐⭐';
    case 'great': return '⭐⭐⭐⭐';
    case 'good': return '⭐⭐⭐';
    case 'almost': return '⭐';
  }
}

/** Rank all recipes against the given ingredients. */
export function rankRecipes(ingredients: string[]): RecipeRanking {
  const ranked: RankedRecipe[] = [];

  for (const recipe of RECIPES) {
    const match = computeMatch(recipe, ingredients);
    if (!match) continue;
    const level = levelFor(match.matchPercent);
    ranked.push({
      ...match,
      level,
      levelLabel: levelLabel(level),
      starsDisplay: starsFor(level),
    });
  }

  ranked.sort((a, b) => b.matchPercent - a.matchPercent || a.name.localeCompare(b.name));

  return {
    perfect: ranked.filter((r) => r.level === 'perfect'),
    great: ranked.filter((r) => r.level === 'great'),
    good: ranked.filter((r) => r.level === 'good'),
    almost: ranked.filter((r) => r.level === 'almost'),
    total: ranked.length,
    hasAny: ranked.length > 0,
  };
}

/**
 * Build a compact, structured context string that summarises the ranked
 * recipes for Gemini. Gemini uses this to enhance its answer — it never
 * invents recipes that already exist in the database.
 */
export function buildRecipeContext(ranking: RecipeRanking, ingredients: string[]): string {
  const lines: string[] = [];

  if (ingredients.length > 0) {
    lines.push(`User's available ingredients: ${ingredients.join(', ')}.`);
  } else {
    lines.push('User has not specified any ingredients yet.');
  }

  const sections: [MatchLevel, RankedRecipe[]][] = [
    ['perfect', ranking.perfect],
    ['great', ranking.great],
    ['good', ranking.good],
    ['almost', ranking.almost],
  ];

  for (const [level, recipes] of sections) {
    if (recipes.length === 0) continue;
    const label = levelLabel(level);
    lines.push(`\n${label} (${recipes.length}):`);
    for (const r of recipes.slice(0, 4)) {
      const missing = r.missing.length
        ? ` | missing: ${r.missing.join(', ')}`
        : ' | has everything';
      lines.push(
        `- ${r.name} (${r.category}, ${r.time}min, ${r.difficulty}, ${r.matchPercent}% match${missing})`,
      );
    }
  }

  if (!ranking.hasAny) {
    lines.push('\nNo recipes matched the user\'s current ingredients. Suggest substitutions or ask them to add more staples.');
  }

  return lines.join('\n');
}

/** Quick lookup for a single recipe by name (used for "tell me about X"). */
export function findRecipeByName(query: string): Recipe | undefined {
  const q = query.toLowerCase();
  return RECIPES.find(
    (r) =>
      r.name.toLowerCase() === q ||
      r.name.toLowerCase().includes(q) ||
      q.includes(r.name.toLowerCase()),
  );
}

export { PANTRY_STAPLES, RECIPES };
