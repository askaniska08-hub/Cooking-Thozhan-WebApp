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
 * Includes accompaniment roles themselves — a gravy/side/chutney
 * should NEVER be the sole dish; it needs a main to pair with.
 */
export const NEEDS_ACCOMPANIMENT: MealRole[] = ['bread', 'rice', 'gravy', 'side', 'chutney'];

/**
 * Which roles are considered complete standalone meals.
 */
export const COMPLETE_STANDALONE: MealRole[] = ['main', 'snack', 'dessert', 'beverage'];

/**
 * Which roles are considered accompaniments (cannot be a sole dish).
 */
export const ACCOMPANIMENT_ROLES: MealRole[] = ['gravy', 'side', 'chutney', 'beverage'];

/**
 * Roles that can serve as a primary / main dish for a meal.
 */
export const PRIMARY_ROLES: MealRole[] = ['main', 'bread', 'rice', 'snack', 'dessert'];

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

// ─── Cultural Pairing Groups ──────────────────────────────────────
// Classifies mains and accompaniments into culturally coherent groups
// so that generated meals represent something a real person would cook.

type MainGroup =
  | 'idli'        // idli, mini-idli, ghee-podi-idli
  | 'dosa'        // plain-dosa, masala-dosa, onion-dosa, podi-dosa, ghee-roast, rava-dosa, wheat-dosa, egg-dosa
  | 'poori'       // poori
  | 'chapathi'    // chapathi, stuffed-chapathi, parotta, kothu-chapathi, kothu-parotta
  | 'pongal'     // pongal, sweet-pongal
  | 'upma'       // rava-upma, oats-upma, vegetable-upma, semiya-upma, aval-upma, bread-upma, masala-oats
  | 'appam'      // appam, idiyappam
  | 'vada'       // paruppu-vada, ulundhu-vada, bonda
  | 'biryani'    // biriyani, vegetable-biriyani, mushroom-biriyani, egg-biriyani
  | 'flavored-rice' // tomato-rice, lemon-rice, tamarind-rice, coconut-rice, etc.
  | 'plain-rice' // white rice served with gravy/dal
  | 'rice-meal'  // sambar-rice, dal-rice, rasam-rice, curd-rice, vegetable-khichdi
  | 'pulao'      // paneer-pulao, mushroom-pulao, peas-pulao, vegetable-pulao, ghee-rice, jeera-rice
  | 'fried-rice' // vegetable-fried-rice, schezwan-fried-rice, egg-fried-rice, etc.
  | 'noodles'    // noodles, hakka-noodles, egg-noodles, garlic-noodles, etc.
  | 'pasta'      // red-sauce-pasta, white-sauce-pasta, arrabbiata-pasta, etc.
  | 'bread-main' // bread-omelette, bread-pizza, cheese-toast, sandwich, etc.
  | 'snack'      // bajji, samosa, spring-roll, paniyaram, etc.
  | 'egg-main'   // omelette, egg-bhurji, masala-omelette, boiled-egg
  | 'other-main';

type AccompGroup =
  | 'sambar'
  | 'chutney'
  | 'raita'
  | 'dal'
  | 'gravy'      // vegetable kurma, paneer masala, channa masala, etc.
  | 'side'       // poriyal, fry, roast
  | 'rasam'
  | 'beverage'
  | 'dessert'
  | 'other';

const MAIN_GROUP_MAP: Record<string, MainGroup> = {
  // Idli family
  'idli': 'idli', 'mini-idli': 'idli', 'ghee-podi-idli': 'idli',
  // Dosa family
  'plain-dosa': 'dosa', 'masala-dosa': 'dosa', 'onion-dosa': 'dosa',
  'podi-dosa': 'dosa', 'ghee-roast': 'dosa', 'rava-dosa': 'dosa',
  'wheat-dosa': 'dosa', 'egg-dosa': 'dosa',
  // Poori
  'poori': 'poori',
  // Chapathi / Parotta
  'chapathi': 'chapathi', 'stuffed-chapathi': 'chapathi',
  'parotta': 'chapathi', 'kothu-chapathi': 'chapathi', 'kothu-parotta': 'chapathi',
  // Pongal
  'pongal': 'pongal', 'sweet-pongal': 'pongal',
  // Upma family
  'rava-upma': 'upma', 'oats-upma': 'upma', 'vegetable-upma': 'upma',
  'semiya-upma': 'upma', 'aval-upma': 'upma', 'bread-upma': 'upma',
  'masala-oats': 'upma',
  // Appam family
  'appam': 'appam', 'idiyappam': 'appam',
  // Vada family
  'paruppu-vada': 'vada', 'ulundhu-vada': 'vada', 'bonda': 'vada',
  // Biryani
  'biriyani': 'biryani', 'vegetable-biriyani': 'biryani',
  'mushroom-biriyani': 'biryani', 'egg-biriyani': 'biryani',
  // Rice meals (complete)
  'sambar-rice': 'rice-meal', 'dal-rice': 'rice-meal', 'rasam-rice': 'rice-meal',
  'curd-rice': 'rice-meal', 'vegetable-khichdi': 'rice-meal',
  // Pulao
  'paneer-pulao': 'pulao', 'mushroom-pulao': 'pulao', 'peas-pulao': 'pulao',
  'vegetable-pulao': 'pulao', 'ghee-rice': 'pulao', 'jeera-rice': 'pulao',
  // Fried rice
  'vegetable-fried-rice': 'fried-rice', 'schezwan-fried-rice': 'fried-rice',
  'paneer-fried-rice': 'fried-rice', 'mushroom-fried-rice': 'fried-rice',
  'egg-fried-rice': 'fried-rice', 'corn-fried-rice': 'fried-rice',
  // Noodles
  'noodles': 'noodles', 'hakka-noodles': 'noodles', 'egg-noodles': 'noodles',
  'garlic-noodles': 'noodles', 'butter-noodles': 'noodles', 'cheese-noodles': 'noodles',
  'schezwan-noodles': 'noodles', 'vegetable-noodles': 'noodles',
  // Pasta
  'red-sauce-pasta': 'pasta', 'white-sauce-pasta': 'pasta', 'pink-sauce-pasta': 'pasta',
  'arrabbiata-pasta': 'pasta', 'cheese-pasta': 'pasta', 'egg-pasta': 'pasta',
  'egg-stir-fried-pasta': 'pasta', 'vegetable-pasta': 'pasta',
  // Bread mains
  'bread-omelette': 'bread-main', 'bread-pizza': 'bread-main', 'cheese-toast': 'bread-main',
  'cheese-sandwich': 'bread-main', 'corn-sandwich': 'bread-main', 'egg-sandwich': 'bread-main',
  'grilled-sandwich': 'bread-main', 'veg-sandwich': 'bread-main', 'tomato-cheese-sandwich': 'bread-main',
  'egg-toast': 'bread-main', 'french-toast': 'bread-main', 'vegetable-toast': 'bread-main',
  'garlic-bread': 'bread-main',
  // Snacks
  'bajji': 'snack', 'samosa': 'snack', 'spring-roll': 'snack',
  'kuzhi-paniyaram': 'snack', 'veg-roll': 'snack', 'bread-pakoda': 'snack',
  'onion-pakoda': 'snack', 'bread-cutlet': 'snack', 'vegetable-cutlet': 'snack',
  'bread-roll': 'snack', 'masala-corn': 'snack', 'corn-chaat': 'snack',
  'channa-sundal': 'snack', 'peanut-sundal': 'snack',
  // Egg mains
  'omelette': 'egg-main', 'masala-omelette': 'egg-main', 'egg-bhurji': 'egg-main',
  'egg-mushroom-bhurji': 'egg-main', 'boiled-egg': 'egg-main', 'egg-podimas': 'egg-main',
};

const ACCOMP_GROUP_MAP: Record<string, AccompGroup> = {
  // Sambar
  'sambar': 'sambar', 'drumstick-sambar': 'sambar',
  // Chutneys
  'coconut-chutney': 'chutney', 'tomato-chutney': 'chutney', 'onion-chutney': 'chutney',
  'mint-chutney': 'chutney', 'coriander-chutney': 'chutney', 'garlic-chutney': 'chutney',
  'beetroot-chutney': 'chutney', 'curry-leaves-chutney': 'chutney',
  'peanut-chutney': 'chutney', 'onion-tomato-chutney': 'chutney',
  // Dal
  'dal-fry': 'dal', 'dal-tadka': 'dal', 'moong-dal-curry': 'dal',
  'masoor-dal-curry': 'dal', 'spinach-dal': 'dal',
  // Rasam
  'pepper-rasam': 'rasam', 'tomato-rasam': 'rasam',
  // Poriyal / Fry / Roast (sides)
  'beans-poriyal': 'side', 'beetroot-poriyal': 'side', 'cabbage-poriyal': 'side',
  'carrot-poriyal': 'side', 'pumpkin-poriyal': 'side', 'spinach-poriyal': 'side',
  'potato-fry': 'side', 'potato-roast': 'side', 'crispy-potato-fry': 'side',
  'brinjal-fry': 'side', 'capsicum-fry': 'side', 'cauliflower-fry': 'side',
  'ladies-finger-fry': 'side', 'mushroom-fry': 'side',
  'green-peas-stir-fry': 'side', 'egg-pepper-fry': 'side', 'egg-roast': 'side',
  // Gravies
  'vegetable-kurma': 'gravy', 'mushroom-kurma': 'gravy', 'paneer-kurma': 'gravy',
  'channa-masala': 'gravy', 'channa-gravy': 'gravy', 'rajka-masala': 'gravy',
  'paneer-butter-masala': 'gravy', 'paneer-masala': 'gravy', 'kadai-paneer': 'gravy',
  'palak-paneer': 'gravy', 'mushroom-masala': 'gravy', 'mushroom-gravy': 'gravy',
  'beetroot-masala': 'gravy', 'capsicum-masala': 'gravy', 'green-peas-masala': 'gravy',
  'mixed-vegetable-curry': 'gravy', 'pumpkin-curry': 'gravy',
  'egg-curry': 'gravy', 'egg-masala': 'gravy',
  'potato-masala': 'gravy', // poori masala is a gravy-style accompaniment
  // Beverages
  'tea': 'beverage', 'coffee': 'beverage', 'filter-coffee': 'beverage',
  'masala-tea': 'beverage', 'lemon-tea': 'beverage', 'dalgona-coffee': 'beverage',
  'badam-milk': 'beverage', 'hot-chocolate': 'beverage',
  'buttermilk': 'beverage', 'masala-buttermilk': 'beverage',
  'lemon-juice': 'beverage', 'mint-lemon-juice': 'beverage',
  'banana-milkshake': 'beverage', 'mango-milkshake': 'beverage', 'rose-milk': 'beverage',
  // Desserts
  'aval-payasam': 'dessert', 'milk-payasam': 'dessert', 'rice-kheer': 'dessert',
  'semiya-payasam': 'dessert', 'carrot-halwa': 'dessert', 'coconut-burfi': 'dessert',
  'coconut-ladoo': 'dessert', 'peanut-burfi': 'dessert', 'rava-ladoo': 'dessert',
  'gulab-jamun': 'dessert', 'bread-halwa': 'dessert',
  // Soups (treated as side for pairing)
  'carrot-soup': 'side', 'corn-vegetable-soup': 'side', 'mushroom-soup': 'side',
  'pumpkin-soup': 'side', 'spinach-soup': 'side', 'sweet-corn-soup': 'side',
  'tomato-soup': 'side', 'vegetable-soup': 'side', 'egg-soup': 'side',
  'egg-noodle-soup': 'side',
};

function getMainGroup(recipe: Recipe): MainGroup {
  const group = MAIN_GROUP_MAP[recipe.id];
  if (group) return group;
  // Rice dishes not explicitly mapped are flavored-rice
  if (recipe.category === 'Rice Dishes') return 'flavored-rice';
  return 'other-main';
}

function getAccompGroup(recipe: Recipe): AccompGroup {
  const group = ACCOMP_GROUP_MAP[recipe.id];
  if (group) return group;
  const role = getMealRole(recipe);
  if (role === 'chutney') return 'chutney';
  if (role === 'gravy') return 'gravy';
  if (role === 'side') return 'side';
  if (role === 'beverage') return 'beverage';
  if (role === 'dessert') return 'dessert';
  return 'other';
}

/**
 * Defines which accompaniment groups are culturally appropriate for each main group.
 * A pairing outside this map is rejected even if role-level compatibility passes.
 */
const CULTURAL_PAIRINGS: Record<MainGroup, AccompGroup[]> = {
  'idli':        ['sambar', 'chutney', 'gravy'],
  'dosa':        ['sambar', 'chutney'],
  'poori':       ['gravy', 'side'],           // potato masala, kurma
  'chapathi':    ['gravy', 'side', 'dal'],     // kurma, dal, poriyal
  'pongal':      ['chutney', 'sambar', 'gravy'],
  'upma':        ['chutney', 'beverage'],
  'appam':       ['gravy', 'chutney'],         // vegetable stew, coconut milk
  'vada':        ['sambar', 'chutney'],
  'biryani':     ['raita', 'gravy', 'side'],   // raita, brinjal fry
  'flavored-rice': ['raita', 'side', 'beverage'], // raita, papad, buttermilk
  'plain-rice':  ['sambar', 'dal', 'rasam', 'gravy', 'side', 'raita'],
  'rice-meal':   ['side', 'beverage'],         // already complete, maybe a side
  'pulao':       ['raita', 'gravy', 'side'],
  'fried-rice':  ['beverage'],                  // Indo-Chinese, no Indian gravy
  'noodles':     ['beverage'],                  // Indo-Chinese, no Indian gravy
  'pasta':       ['beverage'],                  // Italian, no Indian gravy
  'bread-main':  ['beverage', 'side'],          // toast/sandwich + juice/tea
  'snack':       ['beverage', 'chutney'],
  'egg-main':    ['side', 'bread-main', 'beverage'],
  'other-main':  ['chutney', 'gravy', 'side', 'dal', 'sambar', 'beverage'],
};

/**
 * Checks if two recipes are compatible to be served together.
 * Enforces both role-level and cultural pairing rules.
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

  // ─── Cultural pairing enforcement ───
  // Identify which recipe is the main and which is the accompaniment
  const isMain1 = !ACCOMPANIMENT_ROLES.includes(role1);
  const isMain2 = !ACCOMPANIMENT_ROLES.includes(role2);

  let mainRecipe: Recipe;
  let accompRecipe: Recipe;

  if (isMain1 && !isMain2) {
    mainRecipe = recipe1;
    accompRecipe = recipe2;
  } else if (isMain2 && !isMain1) {
    mainRecipe = recipe2;
    accompRecipe = recipe1;
  } else {
    // Both mains or both accompaniments — role check already handled this
    return true;
  }

  const mainGroup = getMainGroup(mainRecipe);
  const accompGroup = getAccompGroup(accompRecipe);
  const allowed = CULTURAL_PAIRINGS[mainGroup];

  // If we have a defined cultural pairing list, enforce it strictly
  if (allowed && accompGroup !== 'other') {
    if (!allowed.includes(accompGroup)) return false;
  }

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
