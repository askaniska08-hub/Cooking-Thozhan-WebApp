export type Difficulty = 'Easy' | 'Medium' | 'Hard';

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

export interface PlannerConfig {
  goal: PlannerGoal;
  duration: 1 | 3 | 5 | 7;
  meals: MealType[];
  servings: 1 | 2 | 4 | 6;
  useAvailableIngredients: boolean;
}

export interface PlannedMeal {
  recipe: Recipe;
  matchPercent: number;
  matched: string[];
  missing: string[];
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
}

export interface PlannerResult {
  days: PlannedDay[];
  shoppingList: ShoppingListItem[];
  wasteSavedPercent: number;
  grocerySavingsRs: number;
  ingredientsUtilizedPercent: number;
  extraIngredientsNeeded: number;
  unusedAvailableIngredients: string[];
  allUsedIngredients: string[];
}

export interface PlannerRequestOptions {
  goal?: PlannerGoal;
  duration?: 1 | 3 | 5 | 7;
  meals?: MealType[];
  servings?: 1 | 2 | 4 | 6;
  useAvailableIngredients?: boolean;
}
