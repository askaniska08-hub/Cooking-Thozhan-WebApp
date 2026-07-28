/**
 * Chef Tara — Intent Detector
 *
 * Analyzes a user message and determines the most likely intent.
 * Priority: recipe name match BEFORE ingredient extraction, so
 * "Tell me about Onion Dosa" is a recipe query, not an ingredient search.
 */

import { RECIPES } from '@/data/recipes';
import { INGREDIENTS } from '@/data/ingredients';
import { searchKnowledge } from '@/data/cookingKnowledge';
import type { ConversationContext } from './conversationMemory';

export type TaraIntent =
  | 'greeting'
  | 'conversation'
  | 'follow_up'
  | 'recipe_info'          // "tell me about X", "how do I make X", "recipe for X"
  | 'missing_ingredients'  // "what am I missing for X"
  | 'shopping_list'        // "add to shopping list"
  | 'favourites'           // "show favourites", "favourite this"
  | 'recent'              // "show recent recipes"
  | 'cooking_question'
  | 'ingredient_substitution'
  | 'cooking_technique'
  | 'recipe_recommendation'
  | 'recipe_search'
  | 'ingredient_search'
  | 'category_search'
  | 'meal_search'
  | 'healthy_suggestion'
  | 'quick_recipe'
  | 'clarifying_question'
  | 'cooking_tip'
  | 'fallback';

const GREETINGS = ['hi', 'hello', 'hey', 'hai', 'vanakkam', 'namaste', 'good morning', 'good afternoon', 'good evening', 'yo', 'sup'];

const CONVERSATION_KEYWORDS = [
  'thank you', 'thanks', 'thx', 'tysm', 'how are you', 'how are u', 'how r u', 'how you doing',
  'whats up', "what's up", 'you are amazing', "you're amazing", 'you are great', "you're great",
  'you are awesome', "you're awesome", 'you are the best', 'love you', 'good job', 'well done',
  'good night', 'goodnight', 'bye', 'goodbye', 'gtg', 'see you', 'see ya', 'cya',
  'you are funny', "you're funny", 'tell me a joke', 'joke', "you're the best", 'love this',
  'i love you', 'who are you', 'what are you', 'your name', 'who is tara', 'about you',
  'what can you do', 'help me', 'how do you work', 'what do you do',
  'nice', 'cool', 'awesome', 'great', 'wow', 'super', 'lovely', 'perfect', 'amazing',
  'i am bored', "i'm bored", 'im bored', 'bored',
];

const FOLLOW_UP_KEYWORDS = [
  'can i make it', 'can i add', 'can i skip', 'can i reduce', 'can i use',
  'make it spicy', 'make it less', 'make it healthier', 'make it vegan',
  'what goes with it', 'what to serve with it', 'side for it', 'pair with it',
  'how long does it take', 'how long to cook it', 'cook time for it',
  'what ingredients', 'what do i need for it', 'ingredients for it',
  'similar to it', 'like it', 'other options', 'what else',
  'serve with it', 'with it',
];

const SUBSTITUTION_KEYWORDS = ['substitute', 'substitution', 'replacement for', 'instead of', 'alternative for', 'replace', 'swap', 'no curd', 'no milk', 'no ghee', 'no butter', 'no egg', 'no coconut', 'no besan', 'no rava', 'no onion', 'no garlic', 'no tomato', 'no paneer', 'no oil', 'no sugar', 'no jaggery', 'no flour'];

const TECHNIQUE_KEYWORDS = ['how to boil', 'how to steam', 'how to roast', 'how to grill', 'how to fry', 'how to deep fry', 'how to shallow fry', 'how to temper', 'how to saute', 'how to blanch', 'how to pressure cook', 'how to slow cook', 'what is tempering', 'what is boiling', 'what is steaming', 'what is roasting', 'what is blanching', 'technique'];

const RECOMMENDATION_KEYWORDS = ['recommend', 'suggest', 'idea', 'ideas', 'confused', 'dont know', "don't know", 'what should', 'surprise me', 'what to cook', 'what should i make', 'what to make'];

const HUNGRY_KEYWORDS = ['hungry', 'starving', 'craving', 'want to eat', 'want food'];

const HEALTHY_KEYWORDS = ['healthy', 'light', 'diet', 'salad', 'oats', 'nutritious', 'low oil', 'low fat', 'high protein', 'protein rich', 'fiber', 'fibre', 'weight loss', 'diabetic', 'sugar free', 'low sugar', 'low calorie'];

const QUICK_KEYWORDS = ['quick', 'fast', 'short', 'rapid', 'under ', 'less than ', 'within ', 'below ', 'max ', '<= ', '< '];

const SICK_KEYWORDS = ['sick', 'ill', 'cold', 'fever', 'flu', 'sore throat', 'recover', 'unwell', 'cough'];

const SPICY_KEYWORDS = ['spicy', 'hot', 'chilli', 'chili', 'masala', 'pepper'];
const SWEET_KEYWORDS = ['sweet', 'dessert', 'sugar', 'payasam', 'halwa', 'ladoo', 'burfi', 'kheer'];
const GUEST_KEYWORDS = ['guest', 'guests', 'party', 'friends', 'family', 'dinner party'];
const NOTHING_KEYWORDS = ['nothing', 'empty', 'bare', 'no ingredients', 'pantry is empty'];

const FAVOURITES_KEYWORDS = ['favourite', 'favorite', 'favourites', 'favorites', 'show fav', 'my fav'];
const RECENT_KEYWORDS = ['recent', 'history', 'recently viewed', 'recently viewed'];

const SHOPPING_KEYWORDS = ['shopping list', 'shopping', 'buy list', 'add to list', 'add missing'];
const MISSING_INGREDIENTS_KEYWORDS = ['missing', 'what am i missing', 'what do i need', 'what else do i need'];

const RECIPE_INFO_PHRASES = [
  'tell me about', 'how do i make', 'how to make', 'how do i cook', 'how to cook',
  'how do i prepare', 'how to prepare', 'recipe for', 'recipe of', 'give me the recipe',
  'show recipe', 'show me the recipe', 'steps for', 'steps of', 'explain',
  'what is', "what's", 'can i make', 'i want to make', 'i want to cook',
  'i want to try', 'i feel like making', 'i feel like having',
];

const CATEGORIES = [
  'Rice Dishes', 'Breakfast', 'Bread Recipes', 'Sandwiches',
  'Pasta & Noodles', 'Egg Dishes', 'Curries & Gravies', 'Poriyal & Fries',
  'Kothu Items', 'Dal & Snacks', 'Chutneys', 'Soups',
  'Desserts', 'Beverages', 'Quick Meals',
];

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Beverage'];

const VEG_KEYWORDS = ['veg', 'vegetarian', 'vegan'];
const NONVEG_KEYWORDS = ['non veg', 'nonveg', 'non-veg', 'meat', 'chicken', 'mutton', 'fish'];
const EGG_KEYWORDS = ['egg', 'eggs', 'anda', 'muttai'];

const EASY_KEYWORDS = ['easy', 'simple', 'beginner'];
const MEDIUM_KEYWORDS = ['medium', 'moderate'];
const HARD_KEYWORDS = ['hard', 'difficult', 'advanced', 'complex'];

const INGREDIENT_NAMES = INGREDIENTS.map((i) => i.name);
const INGREDIENT_LOWER = new Map(INGREDIENT_NAMES.map((n) => [n.toLowerCase(), n]));

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, ' ');
}

function hasAny(text: string, keywords: string[]): boolean {
  return keywords.some((k) => text.includes(k));
}

function extractIngredients(text: string): string[] {
  const lower = normalize(text);
  const found: string[] = [];
  for (const [lowerName, name] of INGREDIENT_LOWER) {
    const wordBoundary = new RegExp(`\\b${lowerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (wordBoundary.test(lower)) found.push(name);
  }
  return found;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function isGreeting(text: string): boolean {
  const lower = normalize(text);
  return GREETINGS.some((g) => lower === g || lower.startsWith(g + ' ') || lower.startsWith(g + '!') || lower.startsWith(g + ','));
}

/**
 * Try to find a recipe name within the user query.
 * Strips common filler phrases first ("tell me about", "how do I make", etc.)
 * then checks for exact and fuzzy recipe name matches.
 * Returns the matched Recipe or undefined.
 */
export function findRecipeInQuery(query: string): { recipe: typeof RECIPES[number]; strippedQuery: string } | undefined {
  const lower = normalize(query);

  // Strip filler phrases to isolate the recipe name
  let stripped = lower;
  for (const phrase of RECIPE_INFO_PHRASES) {
    if (stripped.startsWith(phrase + ' ')) {
      stripped = stripped.slice(phrase.length + 1);
      break;
    }
  }
  // Strip trailing question marks and filler
  stripped = stripped.replace(/[?!]+$/g, '').replace(/\s+(please|pls|recipe|dish)$/g, '').trim();
  if (!stripped) return undefined;

  // Exact match
  let match = RECIPES.find((r) => normalize(r.name) === stripped);
  if (match) return { recipe: match, strippedQuery: stripped };

  // Recipe name contained in stripped query
  match = RECIPES.find((r) => {
    const rn = normalize(r.name);
    return stripped.includes(rn);
  });
  if (match) return { recipe: match, strippedQuery: stripped };

  // Stripped query contained in recipe name
  match = RECIPES.find((r) => {
    const rn = normalize(r.name);
    return rn.includes(stripped) && stripped.length >= 4;
  });
  if (match) return { recipe: match, strippedQuery: stripped };

  // Fuzzy word-overlap match (at least 50% of recipe name words present)
  for (const r of RECIPES) {
    const rn = normalize(r.name);
    const rWords = rn.split(' ').filter((w) => w.length >= 3);
    if (rWords.length === 0) continue;
    let matched = 0;
    for (const rw of rWords) {
      if (stripped.includes(rw)) { matched++; continue; }
      for (const sw of stripped.split(' ')) {
        if (sw.length >= 3 && levenshtein(sw, rw) <= 2) { matched++; break; }
      }
    }
    if (matched / rWords.length >= 0.5 && matched >= 1) {
      return { recipe: r, strippedQuery: stripped };
    }
  }

  return undefined;
}

/**
 * Check if the query looks like a recipe-info request.
 * True if it contains a recipe-info phrase OR if a recipe name is found in the query.
 */
function isRecipeInfoQuery(query: string): boolean {
  const lower = normalize(query);
  const hasPhrase = RECIPE_INFO_PHRASES.some((p) => lower.startsWith(p + ' ') || lower.includes(' ' + p + ' '));
  if (hasPhrase) return true;
  // Even without a phrase, if a recipe name is clearly present, treat as recipe info
  const found = findRecipeInQuery(query);
  return !!found;
}

/**
 * Detect the intent of a user message.
 * Priority order:
 *   1. Greeting
 *   2. Follow-up about last recipe
 *   3. Favourites / recent / shopping list
 *   4. Missing ingredients
 *   5. Recipe info (recipe name in query) — BEFORE ingredient search
 *   6. Cooking knowledge
 *   7. Conversation
 *   8. Recommendation
 *   9. Category / meal / healthy / quick
 *  10. Ingredient search
 *  11. Clarifying question
 *  12. Fallback
 */
export function detectIntent(query: string, context: ConversationContext): TaraIntent {
  const lower = normalize(query);

  // 1. Greeting
  if (isGreeting(query)) return 'greeting';

  // 2. Follow-up about last recipe
  if (context.lastRecipeId) {
    const refersToIt = ['it', 'that', 'this', 'the same', 'the recipe', 'the dish'].some(
      (p) => lower === p || lower.includes(` ${p} `) || lower.startsWith(`${p} `) || lower.endsWith(` ${p}`) || lower.includes(`${p}?`),
    );
    if (refersToIt || hasAny(lower, FOLLOW_UP_KEYWORDS)) {
      return 'follow_up';
    }
  }

  // 3. Favourites / recent / shopping list
  if (hasAny(lower, FAVOURITES_KEYWORDS)) return 'favourites';
  if (hasAny(lower, RECENT_KEYWORDS)) return 'recent';
  if (hasAny(lower, SHOPPING_KEYWORDS)) return 'shopping_list';

  // 4. Missing ingredients
  if (hasAny(lower, MISSING_INGREDIENTS_KEYWORDS)) {
    // Only if a recipe name is also present
    const found = findRecipeInQuery(query);
    if (found) return 'missing_ingredients';
  }

  // 5. Recipe info — MUST come before ingredient search
  if (isRecipeInfoQuery(query)) return 'recipe_info';

  // 6. Cooking knowledge (questions about techniques, substitutions, problems, storage, etc.)
  const knowledgeAnswer = searchKnowledge(query);
  if (knowledgeAnswer) {
    if (hasAny(lower, SUBSTITUTION_KEYWORDS)) return 'ingredient_substitution';
    if (hasAny(lower, TECHNIQUE_KEYWORDS)) return 'cooking_technique';
    return 'cooking_question';
  }

  // 7. General conversation
  if (hasAny(lower, CONVERSATION_KEYWORDS)) return 'conversation';

  // 8. Recipe recommendation
  if (hasAny(lower, RECOMMENDATION_KEYWORDS) || hasAny(lower, HUNGRY_KEYWORDS)) return 'recipe_recommendation';

  // 9. Special intents
  if (hasAny(lower, SICK_KEYWORDS)) return 'healthy_suggestion';
  if (hasAny(lower, NOTHING_KEYWORDS)) return 'recipe_recommendation';
  if (hasAny(lower, GUEST_KEYWORDS)) return 'recipe_recommendation';
  if (hasAny(lower, SWEET_KEYWORDS)) return 'category_search';
  if (hasAny(lower, SPICY_KEYWORDS) && !lower.includes('not spicy') && !lower.includes('less spicy')) return 'recipe_search';

  // 10. Healthy
  if (hasAny(lower, HEALTHY_KEYWORDS)) return 'healthy_suggestion';

  // 11. Quick recipes
  if (hasAny(lower, QUICK_KEYWORDS) || /\d+\s*(min|minute|minutes)/.test(lower)) return 'quick_recipe';

  // 12. Veg/non-veg/egg filter
  if (hasAny(lower, VEG_KEYWORDS) || hasAny(lower, NONVEG_KEYWORDS) || hasAny(lower, EGG_KEYWORDS)) {
    return 'recipe_search';
  }

  // 13. Difficulty
  if (hasAny(lower, EASY_KEYWORDS) || hasAny(lower, MEDIUM_KEYWORDS) || hasAny(lower, HARD_KEYWORDS)) {
    return 'recipe_search';
  }

  // 14. Category search
  for (const cat of CATEGORIES) {
    if (lower.includes(cat.toLowerCase())) return 'category_search';
  }

  // 15. Meal search
  for (const meal of MEAL_TYPES) {
    if (lower.includes(meal.toLowerCase())) return 'meal_search';
  }

  // 16. Ingredient search (AFTER recipe matching)
  const mentioned = extractIngredients(query);
  if (mentioned.length >= 2) return 'ingredient_search';
  if (mentioned.length === 1) return 'clarifying_question';

  // 17. Fallback
  return 'fallback';
}
