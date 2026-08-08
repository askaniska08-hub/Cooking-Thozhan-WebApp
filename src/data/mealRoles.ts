import type { Recipe, MealRole } from '@/types';

/**
 * Derives a meal role from recipe properties without modifying recipe data.
 * Based on category, name, and id patterns.
 */
export function getMealRole(recipe: Recipe): MealRole {
  const { category, id, name } = recipe;

  // Complete rice meals — standalone, don't need accompaniment
  const completeRiceIds = [
    'biriyani', 'vegetable-biriyani', 'mushroom-biriyani', 'egg-biriyani',
    'sambar-rice', 'dal-rice', 'rasam-rice', 'curd-rice',
    'vegetable-khichdi',
  ];
  if (completeRiceIds.includes(id)) return 'main';

  if (category === 'Rice Dishes') return 'rice';

  // Breads
  const breadIds = ['chapathi', 'poori', 'parotta', 'stuffed-chapathi'];
  if (breadIds.includes(id)) return 'bread';

  // Breakfast — main dishes
  if (category === 'Breakfast') {
    if (breadIds.includes(id)) return 'bread';
    return 'main';
  }

  if (category === 'Pasta & Noodles') return 'main';
  if (category === 'Kothu Items') return 'main';
  if (category === 'Quick Meals') return 'main';

  // Egg dishes — split between main and gravy
  if (category === 'Egg Dishes') {
    const gravyEggIds = ['egg-curry', 'egg-masala', 'egg-roast', 'egg-pepper-fry'];
    if (gravyEggIds.includes(id)) return 'gravy';
    return 'main';
  }

  if (category === 'Curries & Gravies') return 'gravy';
  if (category === 'Poriyal & Fries') return 'side';
  if (category === 'Chutneys') return 'chutney';
  if (category === 'Desserts') return 'dessert';
  if (category === 'Beverages') return 'beverage';
  if (category === 'Salads') return 'side';

  // Soups — pepper-rasam is a gravy-like side
  if (category === 'Soups') {
    if (id === 'pepper-rasam') return 'gravy';
    return 'side';
  }

  // Bread recipes — split
  if (category === 'Bread Recipes') {
    const mainBreadIds = ['bread-omelette', 'bread-upma', 'egg-toast', 'french-toast'];
    if (mainBreadIds.includes(id)) return 'main';
    return 'snack';
  }

  if (category === 'Sandwiches') return 'snack';
  if (category === 'Dal & Snacks') return 'snack';

  return 'main';
}

// ─── Meal Compatibility ───────────────────────────────────────────

/**
 * Defines which roles can accompany which main roles.
 * Each entry lists roles that are compatible accompaniments.
 */
export const COMPATIBLE_ACCOMPANIMENTS: Record<MealRole, MealRole[]> = {
  bread: ['gravy', 'side', 'chutney'],
  rice: ['gravy', 'side', 'chutney'],
  main: ['chutney', 'gravy', 'side', 'beverage'],
  gravy: [],
  side: [],
  chutney: [],
  snack: ['beverage'],
  beverage: ['snack', 'dessert'],
  dessert: ['beverage'],
};

/**
 * Which roles need an accompaniment to form a complete meal.
 */
export const NEEDS_ACCOMPANIMENT: MealRole[] = ['bread', 'rice'];

/**
 * Which roles are considered complete standalone meals.
 */
export const COMPLETE_STANDALONE: MealRole[] = ['main', 'snack', 'dessert', 'beverage'];

/**
 * Which roles are considered accompaniments.
 */
export const ACCOMPANIMENT_ROLES: MealRole[] = ['gravy', 'side', 'chutney', 'beverage'];

/**
 * For lunch, rice dishes can have up to 2 accompaniments (gravy + side).
 * For breakfast/dinner, typically 1 accompaniment.
 */
export function maxAccompaniments(role: MealRole, mealType: string): number {
  if (role === 'rice' && mealType === 'Lunch') return 2;
  if (role === 'main' && (mealType === 'Breakfast' || mealType === 'Lunch')) return 1;
  if (role === 'bread') return 1;
  if (role === 'snack') return 1;
  return 0;
}

/**
 * Checks if two recipes are compatible to be served together.
 */
export function areCompatible(recipe1: Recipe, recipe2: Recipe): boolean {
  const role1 = getMealRole(recipe1);
  const role2 = getMealRole(recipe2);

  // Same recipe can't pair with itself
  if (recipe1.id === recipe2.id) return false;

  // Don't pair two mains, two gravies, two sides etc.
  if (role1 === role2) return false;

  // Check if role2 is a valid accompaniment for role1
  const accompaniments = COMPATIBLE_ACCOMPANIMENTS[role1];
  if (!accompaniments.includes(role2)) {
    // Try reverse
    const reverseAccompaniments = COMPATIBLE_ACCOMPANIMENTS[role2];
    if (!reverseAccompaniments.includes(role1)) return false;
  }

  // Don't pair tea/coffee with gravies — that's nonsensical
  if ((role1 === 'beverage' && role2 === 'gravy') || (role2 === 'beverage' && role1 === 'gravy')) return false;
  if ((role1 === 'beverage' && role2 === 'chutney') || (role2 === 'beverage' && role1 === 'chutney')) return false;
  if ((role1 === 'dessert' && role2 === 'gravy') || (role2 === 'dessert' && role1 === 'gravy')) return false;

  return true;
}

/**
 * Get the primary role label for display.
 */
export function roleLabel(role: MealRole): string {
  const labels: Record<MealRole, string> = {
    main: 'Main',
    gravy: 'Accompaniment',
    side: 'Side',
    chutney: 'Chutney',
    rice: 'Rice',
    bread: 'Bread',
    snack: 'Snack',
    beverage: 'Beverage',
    dessert: 'Dessert',
  };
  return labels[role];
}
