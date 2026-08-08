import { RECIPES } from '@/data/recipes';
import { getIngredientStatus } from '@/utils';
import {
  getMealRole,
  areCompatible,
  COMPATIBLE_ACCOMPANIMENTS,
  NEEDS_ACCOMPANIMENT,
  COMPLETE_STANDALONE,
  maxAccompaniments,
} from '@/data/mealRoles';
import type {
  PlannerConfig,
  PlannerResult,
  PlannedDay,
  PlannedMeal,
  PlannedDish,
  ShoppingListItem,
  Recipe,
  MealType,
  MealRole,
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

// ─── Scoring ───────────────────────────────────────────────────

interface ScoredRecipe {
  recipe: Recipe;
  role: MealRole;
  matchPercent: number;
  matched: string[];
  missing: string[];
  reuseBonus: number;
  goalBonus: number;
  totalScore: number;
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

  const role = getMealRole(recipe);

  let reuseBonus = 0;
  for (const ing of recipe.ingredients) {
    if (usedIngredients.has(ing)) reuseBonus += 3;
  }

  const pref = GOAL_DIFFICULTY_PREF[goal];
  const diffIdx = pref.indexOf(recipe.difficulty);
  const goalBonus = diffIdx >= 0 ? (3 - diffIdx) * 2 : 0;

  const totalScore = status.matchPercentage + reuseBonus + goalBonus;

  return {
    recipe,
    role,
    matchPercent: status.matchPercentage,
    matched: status.availableIngredients,
    missing: status.missingIngredients,
    reuseBonus,
    goalBonus,
    totalScore,
  };
}

// ─── Meal Combination Scoring ──────────────────────────────────

interface MealCombination {
  dishes: ScoredRecipe[];
  totalTime: number;
  overallMatch: number;
  completenessScore: number;
  totalScore: number;
}

function scoreMealCombination(dishes: ScoredRecipe[], mealType: MealType): MealCombination {
  const totalTime = estimateMealTime(dishes.map((d) => d.recipe));
  const avgMatch = dishes.length > 0
    ? Math.round(dishes.reduce((sum, d) => sum + d.matchPercent, 0) / dishes.length)
    : 0;

  let completenessScore = 0;
  if (dishes.length === 0) {
    completenessScore = -100;
  } else {
    const primary = dishes[0];
    const primaryRole = primary.role;
    const needsAccompaniment = NEEDS_ACCOMPANIMENT.includes(primaryRole);

    if (needsAccompaniment && dishes.length === 1) {
      // incomplete — bread or rice alone
      completenessScore = -25;
    } else if (needsAccompaniment && dishes.length >= 2) {
      completenessScore = 40;
    } else if (COMPLETE_STANDALONE.includes(primaryRole)) {
      // standalone meal — completeness is fine even with 1 dish
      completenessScore = dishes.length > 1 ? 35 : 30;
    } else {
      completenessScore = dishes.length > 1 ? 20 : 10;
    }

    // Lunch rice + 2 accompaniments bonus
    if (mealType === 'Lunch' && primaryRole === 'rice' && dishes.length >= 3) {
      completenessScore += 15;
    }

    // Variety: each additional compatible dish adds a bit
    if (dishes.length > 1) {
      completenessScore += (dishes.length - 1) * 5;
    }
  }

  const totalScore = avgMatch + completenessScore + dishes.reduce((s, d) => s + d.reuseBonus + d.goalBonus, 0);

  return {
    dishes,
    totalTime,
    overallMatch: avgMatch,
    completenessScore,
    totalScore,
  };
}

/**
 * Estimate total meal time considering parallel cooking.
 * The longest dish takes full time; additional dishes add ~60% of their time.
 */
export function estimateMealTime(recipes: Recipe[]): number {
  if (recipes.length === 0) return 0;
  if (recipes.length === 1) return recipes[0].time;
  const sorted = [...recipes].sort((a, b) => b.time - a.time);
  let total = sorted[0].time;
  for (let i = 1; i < sorted.length; i++) {
    total += Math.round(sorted[i].time * 0.6);
  }
  return total;
}

// ─── Meal Building ─────────────────────────────────────────────

function buildCompleteMeal(
  mealType: MealType,
  recipePool: ScoredRecipe[],
  usedRecipeIds: Set<string>,
  forceInclude: string[],
  goal: PlannerConfig['goal'],
): MealCombination | null {
  // Filter by meal type
  let candidates = filterByMealType(recipePool, mealType);

  // Don't reuse recipes already in the plan
  const fresh = candidates.filter((c) => !usedRecipeIds.has(c.recipe.id));
  if (fresh.length > 0) candidates = fresh;

  // Boost recipes containing force-included ingredients
  if (forceInclude.length > 0) {
    candidates = candidates.map((c) => {
      const hasForced = c.recipe.ingredients.some((ing) =>
        forceInclude.some((f) => f.toLowerCase() === ing.toLowerCase()),
      );
      return { ...c, totalScore: c.totalScore + (hasForced ? 25 : 0) };
    });
  }

  if (candidates.length === 0) return null;

  // Sort by score
  const sorted = [...candidates].sort((a, b) => b.totalScore - a.totalScore);

  // Pick primary dish from top candidates
  const topN = Math.min(3, sorted.length);
  const primary = sorted[Math.floor(Math.random() * topN)];

  // Check if primary needs accompaniment
  const maxAcc = maxAccompaniments(primary.role, mealType);

  if (maxAcc === 0) {
    // Standalone meal — maybe add a beverage for snacks
    if (primary.role === 'snack' || primary.role === 'dessert') {
      const bev = findAccompaniment(recipePool, 'beverage', [primary], usedRecipeIds, goal, forceInclude);
      if (bev) {
        return scoreMealCombination([primary, bev], mealType);
      }
    }
    return scoreMealCombination([primary], mealType);
  }

  // Build accompaniments
  const dishes: ScoredRecipe[] = [primary];
  const allowedRoles = COMPATIBLE_ACCOMPANIMENTS[primary.role];

  for (let i = 0; i < maxAcc; i++) {
    const usedRoles = dishes.map((d) => d.role);
    // Find compatible accompaniment that isn't already in the meal
    let bestAccomp: ScoredRecipe | null = null;
    let bestScore = -Infinity;

    for (const candidate of recipePool) {
      if (usedRecipeIds.has(candidate.recipe.id)) continue;
      if (dishes.some((d) => d.recipe.id === candidate.recipe.id)) continue;
      if (!allowedRoles.includes(candidate.role)) continue;
      if (usedRoles.includes(candidate.role)) continue;
      if (!areCompatible(primary.recipe, candidate.recipe)) continue;

      // Check force-include bonus
      let score = candidate.totalScore;
      if (forceInclude.length > 0) {
        const hasForced = candidate.recipe.ingredients.some((ing) =>
          forceInclude.some((f) => f.toLowerCase() === ing.toLowerCase()),
        );
        if (hasForced) score += 25;
      }

      // Quick meals goal: penalize long cooking time accompaniments
      if (goal === 'quick' && candidate.recipe.time > 20) {
        score -= 15;
      }

      if (score > bestScore) {
        bestScore = score;
        bestAccomp = candidate;
      }
    }

    if (bestAccomp) {
      dishes.push(bestAccomp);
    } else {
      break;
    }
  }

  // For lunch, if primary is rice and we only got 1 accompaniment, try to add a side
  if (mealType === 'Lunch' && primary.role === 'rice' && dishes.length === 2) {
    const side = findAccompaniment(recipePool, 'side', dishes, usedRecipeIds, goal, forceInclude);
    if (side && areCompatible(primary.recipe, side.recipe)) {
      dishes.push(side);
    }
  }

  return scoreMealCombination(dishes, mealType);
}

function findAccompaniment(
  pool: ScoredRecipe[],
  role: MealRole,
  currentDishes: ScoredRecipe[],
  usedRecipeIds: Set<string>,
  goal: PlannerConfig['goal'],
  forceInclude: string[],
): ScoredRecipe | null {
  let best: ScoredRecipe | null = null;
  let bestScore = -Infinity;

  for (const candidate of pool) {
    if (usedRecipeIds.has(candidate.recipe.id)) continue;
    if (currentDishes.some((d) => d.recipe.id === candidate.recipe.id)) continue;
    if (candidate.role !== role) continue;
    if (!currentDishes.every((d) => areCompatible(d.recipe, candidate.recipe))) continue;

    let score = candidate.totalScore;
    if (forceInclude.length > 0) {
      const hasForced = candidate.recipe.ingredients.some((ing) =>
        forceInclude.some((f) => f.toLowerCase() === ing.toLowerCase()),
      );
      if (hasForced) score += 25;
    }
    if (goal === 'quick' && candidate.recipe.time > 20) score -= 15;

    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  return best;
}

function filterByMealType(pool: ScoredRecipe[], mealType: MealType): ScoredRecipe[] {
  // Snacks slot: snacks + beverages
  if (mealType === 'Snacks') {
    return pool.filter((s) => s.role === 'snack' || s.role === 'beverage' || s.recipe.category === 'Dal & Snacks');
  }

  // Match by recipe.meal field, with fallback to role-based logic
  const exactMatch = pool.filter((s) => s.recipe.meal === mealType);
  if (exactMatch.length > 0) return exactMatch;

  // Fallback: allow any main/bread/rice dishes
  return pool.filter((s) => ['main', 'bread', 'rice', 'gravy', 'side'].includes(s.role));
}

// ─── Main Plan Generation ──────────────────────────────────────

export function generateMealPlan(
  config: PlannerConfig,
  availableIngredients: string[],
  forceInclude: string[] = [],
): PlannerResult {
  const today = new Date();
  const days: PlannedDay[] = [];
  const usedIngredients = new Set<string>();
  const usedRecipeIds = new Set<string>();

  const goalFilter = GOAL_FILTERS[config.goal];
  const recipePool: ScoredRecipe[] = RECIPES.filter(goalFilter)
    .map((r) => scoreRecipe(r, availableIngredients, usedIngredients, config.goal))
    .filter((s): s is ScoredRecipe => s !== null);

  let incompleteMeals = 0;
  const mealTypes = config.meals;

  for (let d = 0; d < config.duration; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dayLabel = DAY_LABELS[date.getDay()];

    const dayMeals: Partial<Record<MealType, PlannedMeal>> = {};

    for (const mealType of mealTypes) {
      // Re-score with updated usedIngredients for reuse bonus
      const currentPool: ScoredRecipe[] = RECIPES.filter(goalFilter)
        .map((r) => scoreRecipe(r, availableIngredients, usedIngredients, config.goal))
        .filter((s): s is ScoredRecipe => s !== null);

      const combo = buildCompleteMeal(mealType, currentPool, usedRecipeIds, forceInclude, config.goal);

      if (combo && combo.dishes.length > 0) {
        const dishes: PlannedDish[] = combo.dishes.map((s) => ({
          recipe: s.recipe,
          role: s.role,
          matchPercent: s.matchPercent,
          matched: s.matched,
          missing: s.missing,
        }));

        const isComplete = combo.completenessScore >= 0 && !(
          NEEDS_ACCOMPANIMENT.includes(dishes[0].role) && dishes.length === 1
        );

        if (!isComplete) incompleteMeals++;

        dayMeals[mealType] = {
          dishes,
          totalTime: combo.totalTime,
          overallMatchPercent: combo.overallMatch,
          isComplete,
        };

        for (const dish of dishes) {
          usedRecipeIds.add(dish.recipe.id);
          for (const ing of dish.recipe.ingredients) {
            usedIngredients.add(ing);
          }
        }
      }
    }

    days.push({ dayLabel, date, meals: dayMeals });
  }

  // ── Stats ──
  const allUsedIngredients = Array.from(usedIngredients).sort();
  const availableSet = new Set(availableIngredients.map((a) => a.toLowerCase()));
  const usedFromAvailable = allUsedIngredients.filter((ing) => availableSet.has(ing.toLowerCase()));

  const totalAvailable = availableIngredients.length;
  const ingredientsUtilizedPercent =
    totalAvailable > 0 ? Math.round((usedFromAvailable.length / totalAvailable) * 100) : 100;

  const unusedAvailableIngredients = availableIngredients
    .filter((a) => !allUsedIngredients.some((u) => u.toLowerCase() === a.toLowerCase()))
    .sort();

  // Shopping list — deduplicate missing ingredients across all dishes
  const shoppingMap = new Map<string, ShoppingListItem>();
  for (const day of days) {
    for (const mealType of mealTypes) {
      const meal = day.meals[mealType];
      if (!meal) continue;
      for (const dish of meal.dishes) {
        for (const ing of dish.missing) {
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
  }

  const shoppingList = Array.from(shoppingMap.values())
    .map((item) => ({ ...item, totalQuantity: consolidateQuantity(item.ingredient, item.recipeCount) }))
    .sort((a, b) => a.ingredient.localeCompare(b.ingredient));

  const extraIngredientsNeeded = shoppingList.length;
  const wasteSavedPercent =
    totalAvailable > 0 ? Math.round((usedFromAvailable.length / totalAvailable) * 100) : 95;

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
    incompleteMeals,
  };
}

// ─── Per-Meal Regeneration ─────────────────────────────────────

export function regenerateSingleMeal(
  config: PlannerConfig,
  availableIngredients: string[],
  dayIndex: number,
  mealType: MealType,
  currentDays: PlannedDay[],
  forceInclude: string[] = [],
): PlannedDay[] {
  const goalFilter = GOAL_FILTERS[config.goal];

  // Collect used recipe IDs from all other meals
  const usedRecipeIds = new Set<string>();
  const usedIngredients = new Set<string>();

  for (let d = 0; d < currentDays.length; d++) {
    for (const mt of config.meals) {
      if (d === dayIndex && mt === mealType) continue;
      const meal = currentDays[d].meals[mt];
      if (!meal) continue;
      for (const dish of meal.dishes) {
        usedRecipeIds.add(dish.recipe.id);
        for (const ing of dish.recipe.ingredients) {
          usedIngredients.add(ing);
        }
      }
    }
  }

  const recipePool: ScoredRecipe[] = RECIPES.filter(goalFilter)
    .map((r) => scoreRecipe(r, availableIngredients, usedIngredients, config.goal))
    .filter((s): s is ScoredRecipe => s !== null);

  const combo = buildCompleteMeal(mealType, recipePool, usedRecipeIds, forceInclude, config.goal);

  const newDays = [...currentDays];
  const day = { ...newDays[dayIndex] };
  const newMeals = { ...day.meals };

  if (combo && combo.dishes.length > 0) {
    const dishes: PlannedDish[] = combo.dishes.map((s) => ({
      recipe: s.recipe,
      role: s.role,
      matchPercent: s.matchPercent,
      matched: s.matched,
      missing: s.missing,
    }));

    const isComplete = combo.completenessScore >= 0 && !(
      NEEDS_ACCOMPANIMENT.includes(dishes[0].role) && dishes.length === 1
    );

    newMeals[mealType] = {
      dishes,
      totalTime: combo.totalTime,
      overallMatchPercent: combo.overallMatch,
      isComplete,
    };
  }

  day.meals = newMeals;
  newDays[dayIndex] = day;
  return newDays;
}

// ─── Per-Dish Swap ─────────────────────────────────────────────

export function swapDish(
  config: PlannerConfig,
  availableIngredients: string[],
  dayIndex: number,
  mealType: MealType,
  dishIndex: number,
  currentDays: PlannedDay[],
): PlannedDay[] {
  const meal = currentDays[dayIndex].meals[mealType];
  if (!meal || dishIndex >= meal.dishes.length) return currentDays;

  const dishToSwap = meal.dishes[dishIndex];
  const otherDishes = meal.dishes.filter((_, i) => i !== dishIndex);

  // Collect used recipe IDs (excluding the dish being swapped)
  const usedRecipeIds = new Set<string>();
  const usedIngredients = new Set<string>();

  for (let d = 0; d < currentDays.length; d++) {
    for (const mt of config.meals) {
      const m = currentDays[d].meals[mt];
      if (!m) continue;
      for (const dish of m.dishes) {
        if (d === dayIndex && mt === mealType && dish.recipe.id === dishToSwap.recipe.id) continue;
        usedRecipeIds.add(dish.recipe.id);
        for (const ing of dish.recipe.ingredients) {
          usedIngredients.add(ing);
        }
      }
    }
  }

  const goalFilter = GOAL_FILTERS[config.goal];
  const pool: ScoredRecipe[] = RECIPES.filter(goalFilter)
    .map((r) => scoreRecipe(r, availableIngredients, usedIngredients, config.goal))
    .filter((s): s is ScoredRecipe => s !== null)
    .filter((s) => !usedRecipeIds.has(s.recipe.id));

  // Find a compatible replacement with the same role
  const roleToFind = dishToSwap.role;
  let replacement: ScoredRecipe | null = null;
  let bestScore = -Infinity;

  for (const candidate of pool) {
    if (candidate.role !== roleToFind) continue;
    if (candidate.recipe.id === dishToSwap.recipe.id) continue;
    // Must be compatible with all other dishes in the meal
    if (!otherDishes.every((d) => areCompatible(d.recipe, candidate.recipe))) continue;

    if (candidate.totalScore > bestScore) {
      bestScore = candidate.totalScore;
      replacement = candidate;
    }
  }

  if (!replacement) return currentDays;

  const newDishes = [...meal.dishes];
  newDishes[dishIndex] = {
    recipe: replacement.recipe,
    role: replacement.role,
    matchPercent: replacement.matchPercent,
    matched: replacement.matched,
    missing: replacement.missing,
  };

  const totalTime = estimateMealTime(newDishes.map((d) => d.recipe));
  const overallMatch = Math.round(newDishes.reduce((s, d) => s + d.matchPercent, 0) / newDishes.length);
  const isComplete = !(NEEDS_ACCOMPANIMENT.includes(newDishes[0].role) && newDishes.length === 1);

  const newDays = [...currentDays];
  const day = { ...newDays[dayIndex] };
  const newMeals = { ...day.meals };
  newMeals[mealType] = {
    dishes: newDishes,
    totalTime,
    overallMatchPercent: overallMatch,
    isComplete,
  };
  day.meals = newMeals;
  newDays[dayIndex] = day;
  return newDays;
}

// ─── TARA Integration: suggest complete meal ───────────────────

export function suggestMealForIngredient(
  ingredient: string,
  mealType?: MealType,
): { main: Recipe; accompaniments: Recipe[] } | null {
  const pool = RECIPES.filter((r) => {
    const status = getIngredientStatus(r.ingredients, [ingredient]);
    return status.matchPercentage >= 30;
  });

  if (pool.length === 0) return null;

  // Score and find the best main dish
  const scored = pool
    .map((r) => {
      const status = getIngredientStatus(r.ingredients, [ingredient]);
      const role = getMealRole(r);
      return { recipe: r, role, matchPercent: status.matchPercentage, score: status.matchPercentage + (NEEDS_ACCOMPANIMENT.includes(role) ? 10 : 0) };
    })
    .sort((a, b) => b.score - a.score);

  const main = scored[0];
  if (!main) return null;

  const accompaniments: Recipe[] = [];
  const allowedRoles = COMPATIBLE_ACCOMPANIMENTS[main.role];
  const max = maxAccompaniments(main.role, mealType ?? 'Dinner');

  if (max > 0 && allowedRoles.length > 0) {
    const accompPool = RECIPES.filter((r) => {
      if (r.id === main.recipe.id) return false;
      const role = getMealRole(r);
      if (!allowedRoles.includes(role)) return false;
      return areCompatible(main.recipe, r);
    })
      .map((r) => {
        const status = getIngredientStatus(r.ingredients, [ingredient]);
        return { recipe: r, score: status.matchPercentage };
      })
      .sort((a, b) => b.score - a.score);

    for (let i = 0; i < Math.min(max, accompPool.length); i++) {
      accompaniments.push(accompPool[i].recipe);
    }
  }

  return { main: main.recipe, accompaniments };
}

// ─── Quantity Consolidation ────────────────────────────────────

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

// ─── Metadata for UI ───────────────────────────────────────────

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
