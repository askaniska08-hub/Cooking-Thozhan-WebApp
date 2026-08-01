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
