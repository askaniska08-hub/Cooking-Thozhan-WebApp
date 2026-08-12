export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type MealRole =
  | 'main'
  | 'gravy'
  | 'side'
  | 'chutney'
  | 'rice'
  | 'bread'
  | 'snack'
  | 'beverage'
  | 'dessert'
  | 'soup';

export type IngredientCategory =
  | 'Vegetables'
  | 'Herbs & Flavourings'
  | 'Essentials & Staples'
  | 'Dal Varieties'
  | 'Fruits & Nuts'
  | 'Dairy'
  | 'Eggs';

export interface Ingredient {
  name: string;
  emoji: string;
  category: IngredientCategory;
}

export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  category: string;
  description: string;
  must: string[];
  ingredients: string[];
  time: number; // minutes
  difficulty: Difficulty;
  servings: number;
  veg: boolean;
  meal: string;
  steps: string[];
  tip?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
  error?: boolean;
  timestamp?: number;
  thinking?: boolean;
  recipes?: TaraRecipeResult[];
  tip?: string;
}

export interface TaraRecipeResult {
  id: string;
  name: string;
  emoji: string;
  category: string;
  description: string;
  time: number;
  difficulty: string;
  servings: number;
  veg: boolean;
  meal: string;
  matchPercent?: number;
  missing?: string[];
  matched?: string[];
}

export interface RecipeWithMatch extends Recipe {
  matchPercent: number;
  matched: string[];
  pantryIngredients: string[];
  missing: string[];
  stars: number;
}

// ───────────────────────── Meal Planner ─────────────────────────

export type PlannerGoal =
  | 'family'
  | 'hostel'
  | 'protein'
  | 'weight-loss'
  | 'balanced'
  | 'budget'
  | 'quick';

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

export type DietType = 'veg' | 'vegan' | 'egg' | 'non-veg';

export type NutritionPref =
  | 'high-protein'
  | 'high-fiber'
  | 'more-vegetables'
  | 'low-sugar'
  | 'low-sodium'
  | 'balanced-nutrition';

export type AllergenExclusion =
  | 'peanuts'
  | 'dairy'
  | 'gluten'
  | 'soy'
  | 'tree-nuts';

export type RegenerateReason =
  | 'more-pantry'
  | 'more-protein'
  | 'better-nutrition'
  | 'less-shopping'
  | 'less-time'
  | 'more-variety'
  | 'less-repetition';

export type SwapReason =
  | 'dislike'
  | 'missing-ingredients'
  | 'too-time-consuming'
  | 'healthier'
  | 'more-protein'
  | 'more-variety';

export interface PlannerConfig {
  goal: PlannerGoal;
  duration: 1 | 3 | 5 | 7;
  meals: MealType[];
  servings: 1 | 2 | 4 | 6;
  useAvailableIngredients: boolean;
  dietTypes: DietType[];
  nutritionPrefs: NutritionPref[];
  exclusions: AllergenExclusion[];
  customExclusions: string[];
}

export interface MealExplanation {
  reasons: string[];
  pantryUsed: number;
  additionalNeeded: number;
}

export interface PlannedDish {
  recipe: Recipe;
  role: MealRole;
  matchPercent: number;
  matched: string[];
  missing: string[];
  explanation?: MealExplanation;
}

export interface PlannedMeal {
  dishes: PlannedDish[];
  totalTime: number;
  overallMatchPercent: number;
  isComplete: boolean;
  nutrition: MealNutrition;
}

export interface MealNutrition {
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  fiber: number | null;
  isEstimated: boolean;
}

export interface PlannedDay {
  dayLabel: string;
  date: Date;
  meals: Partial<Record<MealType, PlannedMeal>>;
}

export interface ShoppingListItem {
  ingredient: string;
  totalQuantity: string;
  recipeCount: number;
  isAvailable: boolean;
  unit: string;
}

export interface WeeklySummary {
  avgCaloriesPerDay: number | null;
  avgProteinPerDay: number | null;
  avgFiberPerDay: number | null;
  pantryUtilizationPercent: number;
  pantryUsedCount: number;
  pantryTotalCount: number;
  itemsToBuy: number;
  avgCookingTime: number;
  mealVarietyScore: number;
  uniqueRecipes: number;
  totalRecipes: number;
}

export interface PlannerResult {
  days: PlannedDay[];
  shoppingList: ShoppingListItem[];
  weeklySummary: WeeklySummary;
  unusedAvailableIngredients: string[];
  allUsedIngredients: string[];
  incompleteMeals: number;
}
