import { RECIPES } from '@/data/recipes';
import { getIngredientStatus } from '@/utils';
import type {
  PlannerConfig,
  PlannerResult,
  PlannedDay,
  PlannedMeal,
  ShoppingListItem,
  Recipe,
  MealType,
} from '@/types';

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const MEAL_EMOJI: Record<MealType, string> = {
  Breakfast: '🌅',
  Lunch: '🍛',
  Dinner: '🍽',
  Snacks: '🥪',
};

export function getMealEmoji(meal: MealType): string {
  return MEAL_EMOJI[meal];
}

interface ScoredRecipe {
  recipe: Recipe;
  matchPercent: number;
  matched: string[];
  missing: string[];
  reuseBonus: number;
}

const GOAL_FILTERS: Record<PlannerConfig['goal'], (r: Recipe) => boolean> = {
  family: () => true,
  hostel: (r) => r.difficulty !== 'Hard' && r.time <= 35,
  protein: (r) => !r.veg || r.ingredients.includes('Egg') || r.ingredients.includes('Toor Dal (Thuvaram Paruppu)') || r.ingredients.includes('Bengal Gram (Kadalai Paruppu)'),
  'weight-loss': (r) => r.veg && r.time <= 30,
  balanced: () => true,
  budget: (r) => r.ingredients.length <= 8,
  quick: (r) => r.time <= 20,
};

const GOAL_DIFFICULTY_PREF: Record<PlannerConfig['goal'], string[]> = {
  family: ['Easy', 'Medium', 'Hard'],
  hostel: ['Easy', 'Easy', 'Medium'],
  protein: ['Easy', 'Medium', 'Medium'],
  'weight-loss': ['Easy', 'Easy', 'Medium'],
  balanced: ['Easy', 'Medium', 'Hard'],
  budget: ['Easy', 'Easy', 'Medium'],
  quick: ['Easy', 'Easy', 'Easy'],
};

function scoreRecipe(
  recipe: Recipe,
  available: string[],
  usedIngredients: Set<string>,
  goal: PlannerConfig['goal'],
): ScoredRecipe | null {
  const status = getIngredientStatus(recipe.ingredients, available);
  if (status.matchPercentage < 30) return null;

  // reuse bonus: how many of this recipe's ingredients have already been used in the plan
  let reuseBonus = 0;
  for (const ing of recipe.ingredients) {
    if (usedIngredients.has(ing)) reuseBonus += 3;
  }

  // goal-based difficulty preference
  const pref = GOAL_DIFFICULTY_PREF[goal];
  const diffIdx = pref.indexOf(recipe.difficulty);
  const diffBonus = diffIdx >= 0 ? (3 - diffIdx) * 2 : 0;

  return {
    recipe,
    matchPercent: status.matchPercentage,
    matched: status.availableIngredients,
    missing: status.missingIngredients,
    reuseBonus,
    diffBonus: diffBonus + reuseBonus,
  } as ScoredRecipe;
}

function pickBest(
  candidates: ScoredRecipe[],
  previousRecipeId: string | null,
  usedRecipeIds: Set<string>,
): ScoredRecipe | null {
  if (candidates.length === 0) return null;

  const filtered = previousRecipeId
    ? candidates.filter((c) => c.recipe.id !== previousRecipeId)
    : candidates;

  const pool = filtered.length > 0 ? filtered : candidates;

  // sort by combined score
  const sorted = [...pool].sort((a, b) => {
    const sa = a.matchPercent + a.reuseBonus + a.diffBonus;
    const sb = b.matchPercent + b.reuseBonus + b.diffBonus;
    return sb - sa;
  });

  // pick from top 3 with slight randomization for variety
  const topN = Math.min(3, sorted.length);
  const pick = sorted[Math.floor(Math.random() * topN)];
  return pick;
}

export function generateMealPlan(
  config: PlannerConfig,
  availableIngredients: string[],
  forceInclude: string[] = [],
): PlannerResult {
  const today = new Date();
  const days: PlannedDay[] = [];
  const usedIngredients = new Set<string>();
  const usedRecipeIds = new Set<string>();
  let previousRecipeId: string | null = null;

  const goalFilter = GOAL_FILTERS[config.goal];
  const recipePool = RECIPES.filter(goalFilter);

  const mealTypes = config.meals;

  for (let d = 0; d < config.duration; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dayLabel = DAY_LABELS[date.getDay()];

    const dayMeals: Partial<Record<MealType, PlannedMeal>> = {};

    for (const mealType of mealTypes) {
      // filter recipes by meal type
      let candidates: ScoredRecipe[] = recipePool
        .map((r) => scoreRecipe(r, availableIngredients, usedIngredients, config.goal))
        .filter((s): s is ScoredRecipe => s !== null)
        .filter((s) => s.recipe.meal === mealType || (mealType === 'Snacks' && s.recipe.category === 'Snacks'));

      // boost recipes that use force-included ingredients
      if (forceInclude.length > 0) {
        candidates = candidates.map((c) => {
          const hasForced = c.recipe.ingredients.some((ing) =>
            forceInclude.some((f) => f.toLowerCase() === ing.toLowerCase()),
          );
          return { ...c, reuseBonus: c.reuseBonus + (hasForced ? 20 : 0) };
        });
      }

      // if no exact meal match, allow any recipe from the pool
      if (candidates.length === 0) {
        candidates = recipePool
          .map((r) => scoreRecipe(r, availableIngredients, usedIngredients, config.goal))
          .filter((s): s is ScoredRecipe => s !== null);
      }

      const picked = pickBest(candidates, previousRecipeId, usedRecipeIds);
      if (picked) {
        dayMeals[mealType] = {
          recipe: picked.recipe,
          matchPercent: picked.matchPercent,
          matched: picked.matched,
          missing: picked.missing,
        };
        usedRecipeIds.add(picked.recipe.id);
        previousRecipeId = picked.recipe.id;
        for (const ing of picked.recipe.ingredients) {
          usedIngredients.add(ing);
        }
      }
    }

    days.push({ dayLabel, date, meals: dayMeals });
  }

  // Calculate stats
  const allUsedIngredients = Array.from(usedIngredients).sort();
  const availableSet = new Set(availableIngredients.map((a) => a.toLowerCase()));

  const usedFromAvailable = allUsedIngredients.filter((ing) =>
    availableSet.has(ing.toLowerCase()),
  );

  const totalAvailable = availableIngredients.length;
  const ingredientsUtilizedPercent =
    totalAvailable > 0
      ? Math.round((usedFromAvailable.length / totalAvailable) * 100)
      : 100;

  const unusedAvailableIngredients = availableIngredients
    .filter((a) => !allUsedIngredients.some((u) => u.toLowerCase() === a.toLowerCase()))
    .sort();

  // Shopping list — ingredients not available
  const shoppingMap = new Map<string, ShoppingListItem>();
  for (const day of days) {
    for (const mealType of mealTypes) {
      const meal = day.meals[mealType];
      if (!meal) continue;
      for (const ing of meal.missing) {
        const key = ing.toLowerCase();
        const existing = shoppingMap.get(key);
        if (existing) {
          existing.recipeCount += 1;
        } else {
          shoppingMap.set(key, {
            ingredient: ing,
            totalQuantity: '1 unit',
            recipeCount: 1,
            isAvailable: false,
          });
        }
      }
    }
  }

  // Consolidate quantities heuristically
  const shoppingList = Array.from(shoppingMap.values())
    .map((item) => {
      const qty = consolidateQuantity(item.ingredient, item.recipeCount);
      return { ...item, totalQuantity: qty };
    })
    .sort((a, b) => a.ingredient.localeCompare(b.ingredient));

  const extraIngredientsNeeded = shoppingList.length;

  // Waste saved: how many available ingredients were used
  const wasteSavedPercent =
    totalAvailable > 0
      ? Math.round((usedFromAvailable.length / totalAvailable) * 100)
      : 95;

  // Grocery savings estimate: each extra ingredient ~₹50, savings = what you didn't buy
  const baseGroceryCost = allUsedIngredients.length * 45;
  const extraCost = extraIngredientsNeeded * 50;
  const grocerySavingsRs = Math.max(0, baseGroceryCost - extraCost);

  return {
    days,
    shoppingList,
    wasteSavedPercent,
    grocerySavingsRs,
    ingredientsUtilizedPercent,
    extraIngredientsNeeded,
    unusedAvailableIngredients,
    allUsedIngredients,
  };
}

function consolidateQuantity(ingredient: string, recipeCount: number): string {
  const lower = ingredient.toLowerCase();

  if (lower.includes('rice') || lower.includes('rava') || lower.includes('flour') || lower.includes('vermicelli') || lower.includes('pasta') || lower.includes('noodles')) {
    const kg = Math.max(0.5, Math.ceil(recipeCount * 0.25 * 2) / 2);
    return `${kg} kg`;
  }
  if (lower.includes('oil') || lower.includes('ghee') || lower.includes('milk') || lower.includes('curd')) {
    if (lower.includes('milk') || lower.includes('curd')) return `${Math.max(0.5, Math.ceil(recipeCount * 0.25 * 2) / 2)} litre`;
    return `${Math.max(0.25, Math.ceil(recipeCount * 0.1 * 4) / 4)} kg`;
  }
  if (lower.includes('tomato') || lower.includes('onion') || lower.includes('chilli') || lower.includes('potato') || lower.includes('capsicum') || lower.includes('carrot')) {
    return `${Math.max(2, recipeCount * 2)} pcs`;
  }
  if (lower.includes('egg')) {
    return `${Math.max(2, recipeCount * 2)} pcs`;
  }
  if (lower.includes('dal') || lower.includes('gram') || lower.includes('pepper')) {
    return `${Math.max(0.25, Math.ceil(recipeCount * 0.1 * 4) / 4)} kg`;
  }
  return `${recipeCount} × ${ingredient}`;
}

export const GOAL_META: Record<
  PlannerConfig['goal'],
  { label: string; emoji: string; description: string }
> = {
  family: { label: 'Family Meals', emoji: '🏠', description: 'Crowd-pleasing dishes for everyone' },
  hostel: { label: 'Hostel Friendly', emoji: '🎓', description: 'Quick, minimal-equipment meals' },
  protein: { label: 'High Protein', emoji: '💪', description: 'Protein-packed energy boosters' },
  'weight-loss': { label: 'Weight Loss', emoji: '⚖️', description: 'Light, low-calorie veg meals' },
  balanced: { label: 'Balanced Diet', emoji: '🌿', description: 'A mix of nutrients and flavours' },
  budget: { label: 'Budget Friendly', emoji: '💸', description: 'Fewer ingredients, great taste' },
  quick: { label: 'Quick Meals', emoji: '⚡', description: 'Under 20 minutes flat' },
};

export const DURATION_META: { value: 1 | 3 | 5 | 7; label: string; emoji: string }[] = [
  { value: 1, label: 'Today', emoji: '📍' },
  { value: 3, label: '3 Days', emoji: '📅' },
  { value: 5, label: '5 Days', emoji: '🗓' },
  { value: 7, label: '7 Days', emoji: '📆' },
];

export const MEAL_META: { value: MealType; label: string; emoji: string }[] = [
  { value: 'Breakfast', label: 'Breakfast', emoji: '🌅' },
  { value: 'Lunch', label: 'Lunch', emoji: '🍛' },
  { value: 'Dinner', label: 'Dinner', emoji: '🍽' },
  { value: 'Snacks', label: 'Snacks', emoji: '🥪' },
];
