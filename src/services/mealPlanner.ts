import { RECIPES } from '@/data/recipes';
import { getIngredientStatus, normalizeIngredient } from '@/utils';
import {
  getMealRole,
  areCompatible,
  COMPATIBLE_ACCOMPANIMENTS,
  NEEDS_ACCOMPANIMENT,
  COMPLETE_STANDALONE,
  ACCOMPANIMENT_ROLES,
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
  MealExplanation,
  MealNutrition,
  WeeklySummary,
  DietType,
  NutritionPref,
  AllergenExclusion,
  RegenerateReason,
  SwapReason,
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

// ─── Allergen → Ingredient mapping ─────────────────────────────

const ALLERGEN_INGREDIENTS: Record<AllergenExclusion, string[]> = {
  peanuts: ['Peanut', 'Peanuts'],
  dairy: ['Milk', 'Curd', 'Paneer', 'Butter', 'Ghee', 'Cheese'],
  gluten: ['Wheat Flour', 'Maida', 'Rava', 'Vermicelli', 'Bread'],
  soy: ['Soy', 'Soya'],
  'tree-nuts': ['Cashew', 'Almond', 'Badam', 'Walnut', 'Pista'],
};

function isExcluded(recipe: Recipe, config: PlannerConfig): boolean {
  // Custom exclusions — hard filter
  const customSet = new Set(config.customExclusions.map(normalizeIngredient));
  if (customSet.size > 0) {
    for (const ing of recipe.ingredients) {
      if (customSet.has(normalizeIngredient(ing))) return true;
    }
  }
  // Allergen exclusions — hard filter
  for (const allergen of config.exclusions) {
    const banned = ALLERGEN_INGREDIENTS[allergen];
    if (!banned) continue;
    const bannedSet = new Set(banned.map(normalizeIngredient));
    for (const ing of recipe.ingredients) {
      if (bannedSet.has(normalizeIngredient(ing))) return true;
    }
  }
  // Diet type — hard filter
  if (config.dietType === 'veg' && !recipe.veg) return true;
  if (config.dietType === 'vegan') {
    if (!recipe.veg) return true;
    const veganBanned = new Set(['Milk', 'Curd', 'Paneer', 'Butter', 'Ghee', 'Cheese', 'Egg'].map(normalizeIngredient));
    for (const ing of recipe.ingredients) {
      if (veganBanned.has(normalizeIngredient(ing))) return true;
    }
  }
  if (config.dietType === 'egg' && !recipe.veg && !recipe.ingredients.some((i) => normalizeIngredient(i) === 'egg')) {
    return true;
  }
  return false;
}

// ─── Nutrition estimation ──────────────────────────────────────

const NUTRITION_PER_CATEGORY: Record<string, { calories: number; protein: number; carbs: number; fat: number; fiber: number }> = {
  'Rice Dishes': { calories: 320, protein: 6, carbs: 55, fat: 6, fiber: 2 },
  Breakfast: { calories: 280, protein: 8, carbs: 42, fat: 8, fiber: 3 },
  'Pasta & Noodles': { calories: 350, protein: 10, carbs: 50, fat: 12, fiber: 3 },
  'Kothu Items': { calories: 380, protein: 12, carbs: 45, fat: 14, fiber: 3 },
  'Curries & Gravies': { calories: 220, protein: 8, carbs: 18, fat: 12, fiber: 4 },
  'Poriyal & Fries': { calories: 150, protein: 4, carbs: 15, fat: 8, fiber: 5 },
  Chutneys: { calories: 80, protein: 2, carbs: 10, fat: 4, fiber: 2 },
  Desserts: { calories: 250, protein: 4, carbs: 40, fat: 9, fiber: 1 },
  Beverages: { calories: 120, protein: 3, carbs: 18, fat: 3, fiber: 1 },
  'Egg Dishes': { calories: 260, protein: 16, carbs: 10, fat: 16, fiber: 2 },
  'Bread Recipes': { calories: 240, protein: 8, carbs: 30, fat: 10, fiber: 2 },
  Sandwiches: { calories: 280, protein: 10, carbs: 30, fat: 12, fiber: 3 },
  Soups: { calories: 140, protein: 5, carbs: 15, fat: 5, fiber: 3 },
  Salads: { calories: 130, protein: 4, carbs: 12, fat: 7, fiber: 5 },
  'Dal & Snacks': { calories: 200, protein: 9, carbs: 25, fat: 6, fiber: 4 },
  'Quick Meals': { calories: 260, protein: 8, carbs: 35, fat: 9, fiber: 3 },
};

const PROTEIN_RICH_INGREDIENTS = new Set(['Egg', 'Toor Dal (Thuvaram Paruppu)', 'Bengal Gram (Kadalai Paruppu)', 'Moong Dal (Paasi Paruppu)', 'Paneer', 'Chicken', 'Rajma'].map(normalizeIngredient));

const CARB_INGREDIENTS = new Set(['Rice', 'Wheat Flour', 'Rava', 'Bread', 'Poha', 'Vermicelli', 'Pasta', 'Noodles', 'Besan', 'Maida', 'Rice Flour', 'Batter'].map(normalizeIngredient));

function estimateNutrition(recipe: Recipe): MealNutrition {
  const base = NUTRITION_PER_CATEGORY[recipe.category] ?? { calories: 250, protein: 7, carbs: 30, fat: 10, fiber: 3 };
  const proteinBoost = recipe.ingredients.some((i) => PROTEIN_RICH_INGREDIENTS.has(normalizeIngredient(i))) ? 5 : 0;
  const scale = recipe.servings > 0 ? 1 / Math.max(1, recipe.servings / 2) : 1;
  return {
    calories: Math.round(base.calories * scale),
    protein: Math.round((base.protein + proteinBoost) * scale),
    carbs: Math.round(base.carbs * scale),
    fat: Math.round(base.fat * scale),
    fiber: Math.round(base.fiber * scale),
    isEstimated: true,
  };
}

function sumNutrition(dishes: PlannedDish[]): MealNutrition {
  let calories = 0, protein = 0, carbs = 0, fat = 0, fiber = 0;
  let allNull = true;
  for (const d of dishes) {
    const n = d.recipe.nutrition ?? estimateNutrition(d.recipe);
    if (n.calories !== null) { calories += n.calories; allNull = false; }
    if (n.protein !== null) protein += n.protein;
    if (n.carbs !== null) carbs += n.carbs;
    if (n.fat !== null) fat += n.fat;
    if (n.fiber !== null) fiber += n.fiber;
  }
  return {
    calories: allNull ? null : calories,
    protein: allNull ? null : protein,
    carbs: allNull ? null : carbs,
    fat: allNull ? null : fat,
    fiber: allNull ? null : fiber,
    isEstimated: true,
  };
}

// ─── Scoring ───────────────────────────────────────────────────

const MIN_MATCH_THRESHOLD = 45;

interface ScoredRecipe {
  recipe: Recipe;
  role: MealRole;
  matchPercent: number;
  matched: string[];
  missing: string[];
  reuseBonus: number;
  goalBonus: number;
  nutritionBonus: number;
  varietyPenalty: number;
  totalScore: number;
}

const GOAL_FILTERS: Record<PlannerConfig['goal'], (r: Recipe) => boolean> = {
  family: () => true,
  hostel: (r) => r.difficulty !== 'Hard' && r.time <= 35,
  protein: (r) => !r.veg || r.ingredients.includes('Egg') || r.ingredients.includes('Toor Dal (Thuvaram Paruppu)') || r.ingredients.includes('Bengal Gram (Kadalai Paruppu)') || r.ingredients.includes('Paneer'),
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

const NUTRITION_PREF_BONUS: Record<NutritionPref, (r: Recipe) => number> = {
  'high-protein': (r) => r.ingredients.some((i) => PROTEIN_RICH_INGREDIENTS.has(normalizeIngredient(i))) ? 8 : 0,
  'high-fiber': (r) => r.ingredients.some((i) => ['Beetroot', 'Carrot', 'Beans', 'Spinach', 'Cabbage'].includes(i)) ? 5 : 0,
  'more-vegetables': (r) => r.ingredients.filter((i) => ['Beetroot', 'Carrot', 'Beans', 'Spinach', 'Cabbage', 'Tomato', 'Onion', 'Capsicum', 'Potato'].includes(i)).length * 2,
  'low-sugar': (r) => r.category === 'Desserts' ? -10 : 0,
  'low-sodium': (r) => 0,
  'balanced-nutrition': (r) => r.ingredients.length > 6 ? 4 : 0,
};

function scoreRecipe(
  recipe: Recipe,
  available: string[],
  usedIngredients: Set<string>,
  goal: PlannerConfig['goal'],
  nutritionPrefs: NutritionPref[],
  usedRecipeIds: Set<string>,
  cuisineUsed: Map<string, number>,
  carbUsed: Map<string, number>,
): ScoredRecipe | null {
  const status = getIngredientStatus(recipe.ingredients, available, recipe.must);
  if (status.matchPercentage < MIN_MATCH_THRESHOLD) return null;

  const role = getMealRole(recipe);

  let reuseBonus = 0;
  for (const ing of recipe.ingredients) {
    if (usedIngredients.has(ing)) reuseBonus += 3;
  }

  const pref = GOAL_DIFFICULTY_PREF[goal];
  const diffIdx = pref.indexOf(recipe.difficulty);
  const goalBonus = diffIdx >= 0 ? (3 - diffIdx) * 2 : 0;

  let nutritionBonus = 0;
  for (const np of nutritionPrefs) {
    nutritionBonus += NUTRITION_PREF_BONUS[np](recipe);
  }

  // Weekly variety: heavily penalize recipes already used in the plan
  let varietyPenalty = 0;
  if (usedRecipeIds.has(recipe.id)) {
    varietyPenalty = -35;
  }

  // Penalize cuisine repetition (same recipe category used multiple times)
  const cat = recipe.category;
  const cuisineCount = cuisineUsed.get(cat) ?? 0;
  if (cuisineCount > 0) {
    varietyPenalty -= Math.min(15, cuisineCount * 5);
  }

  // Penalize major carb repetition (rice every meal, bread every meal, etc.)
  for (const ing of recipe.ingredients) {
    const norm = normalizeIngredient(ing);
    if (CARB_INGREDIENTS.has(norm)) {
      const carbCount = carbUsed.get(norm) ?? 0;
      if (carbCount > 0) {
        varietyPenalty -= Math.min(12, carbCount * 4);
      }
      break; // only count the first carb ingredient per recipe
    }
  }

  const totalScore = status.matchPercentage + reuseBonus + goalBonus + nutritionBonus + varietyPenalty;

  return {
    recipe,
    role,
    matchPercent: status.matchPercentage,
    matched: status.availableIngredients,
    missing: status.missingIngredients,
    reuseBonus,
    goalBonus,
    nutritionBonus,
    varietyPenalty,
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
      completenessScore = -25;
    } else if (needsAccompaniment && dishes.length >= 2) {
      completenessScore = 40;
    } else if (COMPLETE_STANDALONE.includes(primaryRole)) {
      completenessScore = dishes.length > 1 ? 35 : 30;
    } else {
      completenessScore = dishes.length > 1 ? 20 : 10;
    }

    if (mealType === 'Lunch' && primaryRole === 'rice' && dishes.length >= 3) {
      completenessScore += 15;
    }

    if (dishes.length > 1) {
      completenessScore += (dishes.length - 1) * 5;
    }
  }

  const totalScore = avgMatch + completenessScore + dishes.reduce((s, d) => s + d.reuseBonus + d.goalBonus + d.nutritionBonus + d.varietyPenalty, 0);

  return { dishes, totalTime, overallMatch: avgMatch, completenessScore, totalScore };
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

// ─── Explainability ────────────────────────────────────────────

function buildExplanation(
  dish: ScoredRecipe,
  available: string[],
  mealType: MealType,
  config: PlannerConfig,
): MealExplanation {
  const reasons: string[] = [];
  const pantryUsed = dish.matched.length;
  const additionalNeeded = dish.missing.length;

  if (pantryUsed >= 3) {
    reasons.push(`Uses ${pantryUsed} ingredient${pantryUsed === 1 ? '' : 's'} already in your kitchen`);
  } else if (pantryUsed > 0) {
    reasons.push(`Uses ${pantryUsed} ingredient${pantryUsed === 1 ? '' : 's'} from your pantry`);
  }

  if (additionalNeeded <= 2 && additionalNeeded > 0) {
    reasons.push(`Only ${additionalNeeded} additional ingredient${additionalNeeded === 1 ? '' : 's'} required`);
  } else if (additionalNeeded === 0) {
    reasons.push('All ingredients available');
  }

  if (dish.nutritionBonus > 0) {
    const prefs: string[] = [];
    if (config.nutritionPrefs.includes('high-protein')) prefs.push('high in protein');
    if (config.nutritionPrefs.includes('high-fiber')) prefs.push('fiber-rich');
    if (config.nutritionPrefs.includes('more-vegetables')) prefs.push('vegetable-packed');
    if (config.nutritionPrefs.includes('balanced-nutrition')) prefs.push('nutritionally balanced');
    if (prefs.length > 0) reasons.push(`Fits your ${prefs.slice(0, 2).join(' and ')} preference`);
  }

  if (dish.recipe.time <= 20) {
    reasons.push(`Quick to cook (${dish.recipe.time} min)`);
  }

  if (dish.goalBonus > 0) {
    const goalLabels: Record<string, string> = {
      protein: 'high-protein',
      quick: 'quick-cook',
      budget: 'budget-friendly',
      balanced: 'balanced',
      hostel: 'hostel-friendly',
      family: 'family-friendly',
      'weight-loss': 'light and healthy',
    };
    const label = goalLabels[config.goal];
    if (label) reasons.push(`Matches your ${label} goal`);
  }

  if (dish.role === 'gravy' || dish.role === 'side' || dish.role === 'chutney') {
    reasons.push(`Complements the main dish`);
  }

  if (reasons.length === 0) {
    reasons.push(`${dish.matchPercent}% ingredient match`);
  }

  return { reasons: reasons.slice(0, 4), pantryUsed, additionalNeeded };
}

// ─── Meal Building ─────────────────────────────────────────────

function buildCompleteMeal(
  mealType: MealType,
  recipePool: ScoredRecipe[],
  usedRecipeIds: Set<string>,
  forceInclude: string[],
  goal: PlannerConfig['goal'],
  nutritionPrefs: NutritionPref[],
  cuisineUsed: Map<string, number>,
  carbUsed: Map<string, number>,
  regenerateReason?: RegenerateReason,
): MealCombination | null {
  let candidates = filterByMealType(recipePool, mealType);

  // Don't reuse recipes already in the plan (unless we have no choice)
  const fresh = candidates.filter((c) => !usedRecipeIds.has(c.recipe.id));
  if (fresh.length > 0) candidates = fresh;

  // Apply regenerate reason adjustments
  if (regenerateReason) {
    candidates = candidates.map((c) => {
      let score = c.totalScore;
      switch (regenerateReason) {
        case 'more-pantry':
          score += c.matched.length * 4;
          break;
        case 'more-protein':
          if (c.recipe.ingredients.some((i) => PROTEIN_RICH_INGREDIENTS.has(normalizeIngredient(i)))) score += 15;
          break;
        case 'better-nutrition':
          score += c.nutritionBonus * 2;
          break;
        case 'less-shopping':
          score -= c.missing.length * 5;
          break;
        case 'less-time':
          if (c.recipe.time > 25) score -= 15;
          if (c.recipe.time <= 15) score += 10;
          break;
        case 'more-variety':
          if (usedRecipeIds.has(c.recipe.id)) score -= 30;
          break;
        case 'less-repetition':
          if (usedRecipeIds.has(c.recipe.id)) score -= 35;
          break;
      }
      return { ...c, totalScore: score };
    });
  }

  // Boost recipes containing force-included ingredients
  if (forceInclude.length > 0) {
    const forceSet = new Set(forceInclude.map(normalizeIngredient));
    candidates = candidates.map((c) => {
      const hasForced = c.recipe.ingredients.some((ing) => forceSet.has(normalizeIngredient(ing)));
      return { ...c, totalScore: c.totalScore + (hasForced ? 25 : 0) };
    });
  }

  if (candidates.length === 0) return null;

  const sorted = [...candidates].sort((a, b) => b.totalScore - a.totalScore);

  // Pick primary dish — must be a primary role (main/bread/rice/snack/dessert),
  // never an accompaniment-only role (gravy/side/chutney/beverage) as sole dish.
  const primaryCandidates = sorted.filter((c) => !ACCOMPANIMENT_ROLES.includes(c.role));
  const primaryPool = primaryCandidates.length > 0 ? primaryCandidates : sorted;

  const topN = Math.min(3, primaryPool.length);
  const primary = primaryPool[Math.floor(Math.random() * topN)];

  const maxAcc = maxAccompaniments(primary.role, mealType);

  if (maxAcc === 0) {
    if (primary.role === 'snack' || primary.role === 'dessert') {
      const bev = findAccompaniment(recipePool, 'beverage', [primary], usedRecipeIds, goal, forceInclude, regenerateReason);
      if (bev) return scoreMealCombination([primary, bev], mealType);
    }
    return scoreMealCombination([primary], mealType);
  }

  const dishes: ScoredRecipe[] = [primary];
  const allowedRoles = COMPATIBLE_ACCOMPANIMENTS[primary.role];

  for (let i = 0; i < maxAcc; i++) {
    const usedRoles = dishes.map((d) => d.role);
    let bestAccomp: ScoredRecipe | null = null;
    let bestScore = -Infinity;

    for (const candidate of recipePool) {
      if (usedRecipeIds.has(candidate.recipe.id)) continue;
      if (dishes.some((d) => d.recipe.id === candidate.recipe.id)) continue;
      if (!allowedRoles.includes(candidate.role)) continue;
      if (usedRoles.includes(candidate.role)) continue;
      if (!areCompatible(primary.recipe, candidate.recipe)) continue;

      let score = candidate.totalScore;
      if (forceInclude.length > 0) {
        const forceSet = new Set(forceInclude.map(normalizeIngredient));
        const hasForced = candidate.recipe.ingredients.some((ing) => forceSet.has(normalizeIngredient(ing)));
        if (hasForced) score += 25;
      }
      if (goal === 'quick' && candidate.recipe.time > 20) score -= 15;
      if (regenerateReason === 'less-time' && candidate.recipe.time > 25) score -= 15;

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
    const side = findAccompaniment(recipePool, 'side', dishes, usedRecipeIds, goal, forceInclude, regenerateReason);
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
  regenerateReason?: RegenerateReason,
): ScoredRecipe | null {
  let best: ScoredRecipe | null = null;
  let bestScore = -Infinity;
  const forceSet = new Set(forceInclude.map(normalizeIngredient));

  for (const candidate of pool) {
    if (usedRecipeIds.has(candidate.recipe.id)) continue;
    if (currentDishes.some((d) => d.recipe.id === candidate.recipe.id)) continue;
    if (candidate.role !== role) continue;
    if (!currentDishes.every((d) => areCompatible(d.recipe, candidate.recipe))) continue;

    let score = candidate.totalScore;
    if (forceInclude.length > 0) {
      const hasForced = candidate.recipe.ingredients.some((ing) => forceSet.has(normalizeIngredient(ing)));
      if (hasForced) score += 25;
    }
    if (goal === 'quick' && candidate.recipe.time > 20) score -= 15;
    if (regenerateReason === 'less-time' && candidate.recipe.time > 25) score -= 15;

    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  return best;
}

function filterByMealType(pool: ScoredRecipe[], mealType: MealType): ScoredRecipe[] {
  if (mealType === 'Snacks') {
    return pool.filter((s) => s.role === 'snack' || s.role === 'beverage' || s.recipe.category === 'Dal & Snacks');
  }
  // Soups are standalone light meals — only allowed at Dinner, never as
  // accompaniments for breakfast/lunch. They are excluded from all other meal types.
  if (mealType !== 'Dinner') {
    pool = pool.filter((s) => s.role !== 'soup');
  }

  // Mains must match the meal type (Breakfast mains for breakfast, Lunch mains for lunch).
  // Accompaniments (chutney, sambar, gravy, side, dal, rasam) are universal — they can
  // accompany any meal type. Without this, Idli (Breakfast) can never pair with Sambar (Lunch).
  const accompRoles: MealRole[] = ['chutney', 'gravy', 'side'];
  const mains = pool.filter((s) => !accompRoles.includes(s.role) && s.recipe.meal === mealType);
  // Soups that match Dinner are treated as mains (standalone light meal)
  const soupMains = pool.filter((s) => s.role === 'soup' && mealType === 'Dinner');
  const allMains = [...mains, ...soupMains];
  const accomp = pool.filter((s) => accompRoles.includes(s.role));

  if (allMains.length > 0) return [...allMains, ...accomp];

  // Fallback: if no exact-match mains, allow any main/bread/rice
  const fallbackMains = pool.filter((s) => ['main', 'bread', 'rice'].includes(s.role));
  return [...fallbackMains, ...accomp];
}

// ─── Shopping Quantity System ───────────────────────────────────

const UNIT_MAP: { match: string[]; unit: string; perRecipe: number; min: number }[] = [
  { match: ['rice', 'rava', 'flour', 'vermicelli', 'pasta', 'noodles'], unit: 'kg', perRecipe: 0.25, min: 0.5 },
  { match: ['oil', 'ghee'], unit: 'ml', perRecipe: 30, min: 100 },
  { match: ['milk'], unit: 'L', perRecipe: 0.25, min: 0.5 },
  { match: ['curd'], unit: 'g', perRecipe: 100, min: 200 },
  { match: ['tomato', 'onion', 'potato', 'capsicum', 'carrot', 'chilli'], unit: 'pcs', perRecipe: 2, min: 2 },
  { match: ['egg'], unit: 'pcs', perRecipe: 2, min: 2 },
  { match: ['dal', 'gram'], unit: 'g', perRecipe: 50, min: 100 },
  { match: ['red chilli powder', 'chilli powder'], unit: 'tbsp', perRecipe: 1, min: 1 },
  { match: ['turmeric'], unit: 'tsp', perRecipe: 0.5, min: 1 },
  { match: ['salt'], unit: 'tsp', perRecipe: 1, min: 1 },
  { match: ['pepper', 'cumin powder', 'garam masala', 'sambar powder'], unit: 'tsp', perRecipe: 1, min: 1 },
  { match: ['paneer'], unit: 'g', perRecipe: 100, min: 200 },
  { match: ['ginger', 'garlic'], unit: 'pcs', perRecipe: 2, min: 2 },
  { match: ['coriander leaves', 'curry leaves', 'mint leaves'], unit: 'bunch', perRecipe: 0.5, min: 1 },
];

function consolidateQuantity(ingredient: string, recipeCount: number): { quantity: string; unit: string } {
  const lower = ingredient.toLowerCase();

  for (const entry of UNIT_MAP) {
    if (entry.match.some((m) => lower.includes(m))) {
      const raw = entry.perRecipe * recipeCount;
      const value = Math.max(entry.min, raw);

      if (entry.unit === 'kg') {
        const kg = Math.ceil(value * 2) / 2;
        return { quantity: `${kg} kg`, unit: 'kg' };
      }
      if (entry.unit === 'ml') {
        const ml = Math.ceil(value / 50) * 50;
        return { quantity: `${ml} ml`, unit: 'ml' };
      }
      if (entry.unit === 'L') {
        const l = Math.ceil(value * 2) / 2;
        return { quantity: `${l} L`, unit: 'L' };
      }
      if (entry.unit === 'g') {
        const g = Math.ceil(value / 50) * 50;
        return { quantity: `${g} g`, unit: 'g' };
      }
      if (entry.unit === 'tbsp' || entry.unit === 'tsp') {
        const v = Math.ceil(value);
        return { quantity: `${v} ${entry.unit}`, unit: entry.unit };
      }
      if (entry.unit === 'pcs') {
        return { quantity: `${Math.ceil(value)} pcs`, unit: 'pcs' };
      }
      if (entry.unit === 'bunch') {
        return { quantity: `${Math.ceil(value)} bunch`, unit: 'bunch' };
      }
    }
  }

  return { quantity: `${recipeCount} × ${ingredient}`, unit: 'unit' };
}

// ─── Main Plan Generation ──────────────────────────────────────

export function generateMealPlan(
  config: PlannerConfig,
  availableIngredients: string[],
  forceInclude: string[] = [],
  regenerateReason?: RegenerateReason,
): PlannerResult {
  const today = new Date();
  const days: PlannedDay[] = [];
  const usedIngredients = new Set<string>();
  const usedRecipeIds = new Set<string>();
  const cuisineUsed = new Map<string, number>(); // track cuisine repetition
  const carbUsed = new Map<string, number>(); // track major carb repetition

  const goalFilter = GOAL_FILTERS[config.goal];

  // Pre-filter recipes: goal + dietary exclusions + allergens
  const eligibleRecipes = RECIPES.filter((r) => {
    if (!goalFilter(r)) return false;
    if (isExcluded(r, config)) return false;
    return true;
  });

  let incompleteMeals = 0;
  const mealTypes = config.meals;

  for (let d = 0; d < config.duration; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dayLabel = DAY_LABELS[date.getDay()];

    const dayMeals: Partial<Record<MealType, PlannedMeal>> = {};

    for (const mealType of mealTypes) {
      const currentPool: ScoredRecipe[] = eligibleRecipes
        .map((r) => scoreRecipe(r, availableIngredients, usedIngredients, config.goal, config.nutritionPrefs, usedRecipeIds, cuisineUsed, carbUsed))
        .filter((s): s is ScoredRecipe => s !== null);

      const combo = buildCompleteMeal(
        mealType,
        currentPool,
        usedRecipeIds,
        forceInclude,
        config.goal,
        config.nutritionPrefs,
        cuisineUsed,
        carbUsed,
        regenerateReason,
      );

      if (combo && combo.dishes.length > 0) {
        const dishes: PlannedDish[] = combo.dishes.map((s) => ({
          recipe: s.recipe,
          role: s.role,
          matchPercent: s.matchPercent,
          matched: s.matched,
          missing: s.missing,
          explanation: buildExplanation(s, availableIngredients, mealType, config),
        }));

        const isComplete = combo.completenessScore >= 0 && !(
          NEEDS_ACCOMPANIMENT.includes(dishes[0].role) && dishes.length === 1
        );

        if (!isComplete) incompleteMeals++;

        const nutrition = sumNutrition(dishes);

        dayMeals[mealType] = {
          dishes,
          totalTime: combo.totalTime,
          overallMatchPercent: combo.overallMatch,
          isComplete,
          nutrition,
        };

        for (const dish of dishes) {
          usedRecipeIds.add(dish.recipe.id);
          for (const ing of dish.recipe.ingredients) {
            usedIngredients.add(ing);
            // Track major carb repetition
            const norm = normalizeIngredient(ing);
            if (CARB_INGREDIENTS.has(norm)) {
              carbUsed.set(norm, (carbUsed.get(norm) ?? 0) + 1);
            }
          }
          // Track cuisine repetition
          const cat = dish.recipe.category;
          cuisineUsed.set(cat, (cuisineUsed.get(cat) ?? 0) + 1);
        }
      }
    }

    days.push({ dayLabel, date, meals: dayMeals });
  }

  // ── Stats ──
  const allUsedIngredients = Array.from(usedIngredients).sort();
  const availableSet = new Set(availableIngredients.map(normalizeIngredient));
  const usedFromAvailable = allUsedIngredients.filter((ing) => availableSet.has(normalizeIngredient(ing)));

  const totalAvailable = availableIngredients.length;
  const pantryUsedCount = usedFromAvailable.length;
  const pantryUtilizationPercent =
    totalAvailable > 0 ? Math.round((pantryUsedCount / totalAvailable) * 100) : 100;

  const unusedAvailableIngredients = availableIngredients
    .filter((a) => !allUsedIngredients.some((u) => normalizeIngredient(u) === normalizeIngredient(a)))
    .sort();

  // ── Shopping list — only missing ingredients not in user's pantry ──
  const shoppingMap = new Map<string, ShoppingListItem>();
  for (const day of days) {
    for (const mealType of mealTypes) {
      const meal = day.meals[mealType];
      if (!meal) continue;
      for (const dish of meal.dishes) {
        for (const ing of dish.missing) {
          const key = normalizeIngredient(ing);
          const existing = shoppingMap.get(key);
          if (existing) {
            existing.recipeCount += 1;
          } else {
            shoppingMap.set(key, {
              ingredient: ing,
              totalQuantity: '',
              recipeCount: 1,
              isAvailable: false,
              unit: '',
            });
          }
        }
      }
    }
  }

  const shoppingList = Array.from(shoppingMap.values())
    .map((item) => {
      const { quantity, unit } = consolidateQuantity(item.ingredient, item.recipeCount);
      return { ...item, totalQuantity: quantity, unit };
    })
    .sort((a, b) => a.ingredient.localeCompare(b.ingredient));

  const itemsToBuy = shoppingList.length;

  // ── Weekly summary ──
  let totalCalories = 0, totalProtein = 0, totalFiber = 0;
  let calorieDays = 0, proteinDays = 0, fiberDays = 0;
  let totalTime = 0;
  let timeMeals = 0;

  for (const day of days) {
    let dayCalories = 0, dayProtein = 0, dayFiber = 0;
    let hasCalories = false, hasProtein = false, hasFiber = false;
    let mealCount = 0;

    for (const mt of mealTypes) {
      const meal = day.meals[mt];
      if (!meal) continue;
      mealCount++;
      totalTime += meal.totalTime;
      timeMeals++;

      if (meal.nutrition.calories !== null) {
        dayCalories += meal.nutrition.calories;
        hasCalories = true;
      }
      if (meal.nutrition.protein !== null) {
        dayProtein += meal.nutrition.protein;
        hasProtein = true;
      }
      if (meal.nutrition.fiber !== null) {
        dayFiber += meal.nutrition.fiber;
        hasFiber = true;
      }
    }

    if (hasCalories && mealCount > 0) { totalCalories += Math.round(dayCalories / mealCount); calorieDays++; }
    if (hasProtein && mealCount > 0) { totalProtein += Math.round(dayProtein / mealCount); proteinDays++; }
    if (hasFiber && mealCount > 0) { totalFiber += Math.round(dayFiber / mealCount); fiberDays++; }
  }

  const avgCaloriesPerDay = calorieDays > 0 ? Math.round(totalCalories / calorieDays) : null;
  const avgProteinPerDay = proteinDays > 0 ? Math.round(totalProtein / proteinDays) : null;
  const avgFiberPerDay = fiberDays > 0 ? Math.round(totalFiber / fiberDays) : null;
  const avgCookingTime = timeMeals > 0 ? Math.round(totalTime / timeMeals) : 0;

  // Meal variety: unique recipes / total recipes
  const totalRecipes = usedRecipeIds.size;
  const uniqueRecipes = totalRecipes; // usedRecipeIds is a Set, so all are unique by definition
  const mealVarietyScore = totalRecipes > 0 ? Math.round((uniqueRecipes / totalRecipes) * 100) : 100;

  const weeklySummary: WeeklySummary = {
    avgCaloriesPerDay,
    avgProteinPerDay,
    avgFiberPerDay,
    pantryUtilizationPercent,
    pantryUsedCount,
    pantryTotalCount: totalAvailable,
    itemsToBuy,
    avgCookingTime,
    mealVarietyScore,
    uniqueRecipes,
    totalRecipes,
  };

  return {
    days,
    shoppingList,
    weeklySummary,
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
  regenerateReason?: RegenerateReason,
): PlannedDay[] {
  const goalFilter = GOAL_FILTERS[config.goal];

  const usedRecipeIds = new Set<string>();
  const usedIngredients = new Set<string>();
  const cuisineUsed = new Map<string, number>();
  const carbUsed = new Map<string, number>();

  for (let d = 0; d < currentDays.length; d++) {
    for (const mt of config.meals) {
      if (d === dayIndex && mt === mealType) continue;
      const meal = currentDays[d].meals[mt];
      if (!meal) continue;
      for (const dish of meal.dishes) {
        usedRecipeIds.add(dish.recipe.id);
        for (const ing of dish.recipe.ingredients) {
          usedIngredients.add(ing);
          const norm = normalizeIngredient(ing);
          if (CARB_INGREDIENTS.has(norm)) {
            carbUsed.set(norm, (carbUsed.get(norm) ?? 0) + 1);
          }
        }
        cuisineUsed.set(dish.recipe.category, (cuisineUsed.get(dish.recipe.category) ?? 0) + 1);
      }
    }
  }

  const eligibleRecipes = RECIPES.filter((r) => {
    if (!goalFilter(r)) return false;
    if (isExcluded(r, config)) return false;
    return true;
  });

  const recipePool: ScoredRecipe[] = eligibleRecipes
    .map((r) => scoreRecipe(r, availableIngredients, usedIngredients, config.goal, config.nutritionPrefs, usedRecipeIds, cuisineUsed, carbUsed))
    .filter((s): s is ScoredRecipe => s !== null);

  const combo = buildCompleteMeal(mealType, recipePool, usedRecipeIds, forceInclude, config.goal, config.nutritionPrefs, cuisineUsed, carbUsed, regenerateReason);

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
      explanation: buildExplanation(s, availableIngredients, mealType, config),
    }));

    const isComplete = combo.completenessScore >= 0 && !(
      NEEDS_ACCOMPANIMENT.includes(dishes[0].role) && dishes.length === 1
    );

    newMeals[mealType] = {
      dishes,
      totalTime: combo.totalTime,
      overallMatchPercent: combo.overallMatch,
      isComplete,
      nutrition: sumNutrition(dishes),
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
  swapReason?: SwapReason,
): PlannedDay[] {
  const meal = currentDays[dayIndex].meals[mealType];
  if (!meal || dishIndex >= meal.dishes.length) return currentDays;

  const dishToSwap = meal.dishes[dishIndex];
  const otherDishes = meal.dishes.filter((_, i) => i !== dishIndex);

  const usedRecipeIds = new Set<string>();
  const usedIngredients = new Set<string>();
  const cuisineUsed = new Map<string, number>();
  const carbUsed = new Map<string, number>();

  for (let d = 0; d < currentDays.length; d++) {
    for (const mt of config.meals) {
      const m = currentDays[d].meals[mt];
      if (!m) continue;
      for (const dish of m.dishes) {
        if (d === dayIndex && mt === mealType && dish.recipe.id === dishToSwap.recipe.id) continue;
        usedRecipeIds.add(dish.recipe.id);
        for (const ing of dish.recipe.ingredients) {
          usedIngredients.add(ing);
          const norm = normalizeIngredient(ing);
          if (CARB_INGREDIENTS.has(norm)) {
            carbUsed.set(norm, (carbUsed.get(norm) ?? 0) + 1);
          }
        }
        cuisineUsed.set(dish.recipe.category, (cuisineUsed.get(dish.recipe.category) ?? 0) + 1);
      }
    }
  }

  const goalFilter = GOAL_FILTERS[config.goal];
  const eligibleRecipes = RECIPES.filter((r) => {
    if (!goalFilter(r)) return false;
    if (isExcluded(r, config)) return false;
    return true;
  });

  const pool: ScoredRecipe[] = eligibleRecipes
    .map((r) => scoreRecipe(r, availableIngredients, usedIngredients, config.goal, config.nutritionPrefs, usedRecipeIds, cuisineUsed, carbUsed))
    .filter((s): s is ScoredRecipe => s !== null)
    .filter((s) => !usedRecipeIds.has(s.recipe.id));

  const roleToFind = dishToSwap.role;
  let replacement: ScoredRecipe | null = null;
  let bestScore = -Infinity;

  for (const candidate of pool) {
    if (candidate.role !== roleToFind) continue;
    if (candidate.recipe.id === dishToSwap.recipe.id) continue;
    if (!otherDishes.every((d) => areCompatible(d.recipe, candidate.recipe))) continue;

    let score = candidate.totalScore;

    // Apply swap reason adjustments
    if (swapReason) {
      switch (swapReason) {
        case 'dislike':
          break;
        case 'missing-ingredients':
          score += candidate.matched.length * 3;
          break;
        case 'too-time-consuming':
          if (candidate.recipe.time <= 20) score += 15;
          if (candidate.recipe.time > 30) score -= 15;
          break;
        case 'healthier':
          score += candidate.nutritionBonus * 2;
          if (candidate.recipe.ingredients.some((i) => PROTEIN_RICH_INGREDIENTS.has(normalizeIngredient(i)))) score += 5;
          break;
        case 'more-protein':
          if (candidate.recipe.ingredients.some((i) => PROTEIN_RICH_INGREDIENTS.has(normalizeIngredient(i)))) score += 20;
          break;
        case 'more-variety':
          break;
      }
    }

    if (score > bestScore) {
      bestScore = score;
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
    explanation: buildExplanation(replacement, availableIngredients, mealType, config),
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
    nutrition: sumNutrition(newDishes),
  };
  day.meals = newMeals;
  newDays[dayIndex] = day;
  return newDays;
}

// ─── TARA Integration: suggest complete meal ────────────────────

export function suggestMealForIngredient(
  ingredient: string,
  mealType?: MealType,
): { main: Recipe; accompaniments: Recipe[] } | null {
  const pool = RECIPES.filter((r) => {
    const status = getIngredientStatus(r.ingredients, [ingredient]);
    return status.matchPercentage >= 30;
  });

  if (pool.length === 0) return null;

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

// ─── Metadata for UI ───────────────────────────────────────────

export const GOAL_META: Record<
  PlannerConfig['goal'],
  { label: string; emoji: string; description: string }
> = {
  family: { label: 'Family Meals', emoji: '🏠', description: 'Crowd-pleasing dishes for everyone' },
  hostel: { label: 'Hostel Friendly', emoji: '🎓', description: 'Quick, minimal-equipment meals' },
  protein: { label: 'High Protein', emoji: '💪', description: 'Protein-packed energy boosters' },
  'weight-loss': { label: 'Healthy Weight', emoji: '⚖️', description: 'Light, balanced veg meals' },
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

export const DIET_META: { value: DietType; label: string; emoji: string }[] = [
  { value: 'veg', label: 'Vegetarian', emoji: '🥬' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱' },
  { value: 'egg', label: 'Egg-friendly', emoji: '🥚' },
  { value: 'non-veg', label: 'Non-veg', emoji: '🍗' },
];

export const NUTRITION_PREF_META: { value: NutritionPref; label: string; emoji: string }[] = [
  { value: 'high-protein', label: 'Higher Protein', emoji: '💪' },
  { value: 'high-fiber', label: 'More Fiber', emoji: '🌾' },
  { value: 'more-vegetables', label: 'More Vegetables', emoji: '🥬' },
  { value: 'low-sugar', label: 'Lower Added Sugar', emoji: '🍬' },
  { value: 'low-sodium', label: 'Lower Sodium', emoji: '🧂' },
  { value: 'balanced-nutrition', label: 'Balanced Nutrition', emoji: '🥗' },
];

export const ALLERGEN_META: { value: AllergenExclusion; label: string; emoji: string }[] = [
  { value: 'peanuts', label: 'Peanuts', emoji: '🥜' },
  { value: 'dairy', label: 'Dairy', emoji: '🥛' },
  { value: 'gluten', label: 'Gluten', emoji: '🌾' },
  { value: 'soy', label: 'Soy', emoji: '🫘' },
  { value: 'tree-nuts', label: 'Tree Nuts', emoji: '🌰' },
];

export const REGENERATE_REASON_META: { value: RegenerateReason; label: string; emoji: string }[] = [
  { value: 'more-pantry', label: 'Use more pantry ingredients', emoji: '🥬' },
  { value: 'more-protein', label: 'Increase protein', emoji: '💪' },
  { value: 'better-nutrition', label: 'Improve nutrition balance', emoji: '🥗' },
  { value: 'less-shopping', label: 'Reduce shopping', emoji: '💰' },
  { value: 'less-time', label: 'Reduce cooking time', emoji: '⏱️' },
  { value: 'more-variety', label: 'Increase cuisine variety', emoji: '🌍' },
  { value: 'less-repetition', label: 'Reduce repetition', emoji: '🔄' },
];

export const SWAP_REASON_META: { value: SwapReason; label: string; emoji: string }[] = [
  { value: 'dislike', label: "Don't like this", emoji: '👎' },
  { value: 'missing-ingredients', label: 'Missing ingredients', emoji: '🔍' },
  { value: 'too-time-consuming', label: 'Too time-consuming', emoji: '⏱️' },
  { value: 'healthier', label: 'Want healthier option', emoji: '🥗' },
  { value: 'more-protein', label: 'Want more protein', emoji: '💪' },
  { value: 'more-variety', label: 'Want more variety', emoji: '🌍' },
];
