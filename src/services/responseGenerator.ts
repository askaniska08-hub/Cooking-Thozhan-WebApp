/**
 * Chef Tara — Response Generator
 *
 * Orchestrates all modules: intent detection, cooking knowledge,
 * conversation memory, and recipe search to produce a natural,
 * helpful response for every user message.
 *
 * Priority order:
 *   1. Greeting
 *   2. Conversation memory (follow-up)
 *   3. Favourites / recent / shopping list
 *   4. Missing ingredients
 *   5. Recipe info (recipe name in query) — BEFORE ingredient search
 *   6. Cooking knowledge
 *   7. Conversation
 *   8. Recipe recommendation
 *   9. Recipe search / ingredient search / category / meal / healthy / quick
 *  10. Clarifying question
 *  11. Friendly fallback
 */

import { RECIPES } from '@/data/recipes';
import { INGREDIENTS } from '@/data/ingredients';
import { searchKnowledge } from '@/data/cookingKnowledge';
import type { Recipe } from '@/types';
import { normalizeIngredient, getIngredientStatus, extractIngredientsFromText } from '@/utils';
import { detectIntent, findRecipeInQuery } from './intentDetector';
import {
  type ConversationContext,
  createContext,
  updateContext,
} from './conversationMemory';

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

export interface TaraResponse {
  text: string;
  recipes?: TaraRecipeResult[];
  tip?: string;
}

const INGREDIENT_LOWER = new Map(INGREDIENTS.map((i) => [normalizeIngredient(i.name), i.name]));

// ───────────────────────── Ingredient Substitution Suggestions ─────────────────────────
// Used when a user is 1-2 ingredients short of a recipe.
const SUBSTITUTION_SUGGESTIONS: Record<string, string> = {
  'Paneer': 'firm tofu (press it first) works beautifully as a paneer substitute',
  'Butter': 'a little ghee or even cooking oil will do the trick',
  'Curd': 'buttermilk thinned with water, or lemon juice mixed with milk',
  'Coconut': 'desiccated coconut soaked in warm water for 10 minutes',
  'Tomato': 'tamarind pulp or lemon juice with a pinch of jaggery for tanginess',
  'Onion': 'shallots or extra ginger with a pinch of asafoetida',
  'Garlic': 'a pinch of asafoetida (hing) mimics garlic beautifully',
  'Curry Leaves': 'the dish will still taste wonderful — add extra coriander at the end',
  'Coriander Leaves': 'the dish will be fine without it, or use mint leaves',
  'Ghee': 'butter or cooking oil works in a pinch',
  'Jaggery': 'brown sugar or palm sugar in the same amount',
  'Rava': 'rice rava or broken wheat (dalia) works well',
  'Besan': 'rice flour for coating, or cornstarch for thickening',
  'Cornstarch': 'rice flour or besan in equal amounts',
  'Milk': 'coconut milk or cashew milk for a dairy-free option',
  'Egg': '1 tbsp flaxseed + 3 tbsp water (let sit 5 min) for baking, or silken tofu for savoury',
  'Lemon': 'a splash of vinegar or tamarind water',
  'Tamarind': 'lemon juice with a pinch of jaggery',
  'Mustard Seeds': 'cumin seeds work in a pinch for tempering',
  'Spinach': 'any leafy green — methi or cabbage work too',
};

function getSubstitutionSuggestion(missingIngredient: string): string | null {
  return SUBSTITUTION_SUGGESTIONS[missingIngredient] ?? null;
}

const CATEGORIES = [
  'Rice Dishes', 'Breakfast', 'Bread Recipes', 'Sandwiches',
  'Pasta & Noodles', 'Egg Dishes', 'Curries & Gravies', 'Poriyal & Fries',
  'Kothu Items', 'Dal & Snacks', 'Chutneys', 'Soups',
  'Desserts', 'Beverages', 'Quick Meals',
];

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Beverage'];

const RANDOM_TIPS = [
  'Adding salt while boiling potatoes helps season them evenly from the inside out.',
  'Soak cut potatoes in water for 10 minutes before frying — this removes excess starch and makes them crispier.',
  'Add a pinch of sugar to tomato-based curries to balance the acidity.',
  'Resting dough for 15-20 minutes before rolling makes it softer and easier to work with.',
  'Always heat the pan before adding oil — this prevents food from sticking.',
  'To check if oil is hot enough, drop in a tiny piece of bread — it should sizzle immediately.',
  'Grate ginger with the peel on — the peel contains the most flavour.',
  'Add a splash of lemon juice to rice right after cooking to keep the grains separate.',
  'Toast whole spices in a dry pan before grinding — it wakes up their essential oils.',
  'Never overcrowd the pan when frying — the temperature drops and food becomes soggy.',
  'A pinch of salt in sweet dishes enhances the sweetness without making them salty.',
  'Use cold water for kneading dough for flaky pastries; warm water for soft chapathis.',
  'Add a teaspoon of vinegar to the water when boiling eggs — it makes peeling easier.',
];

export function getRandomTip(): string {
  return RANDOM_TIPS[Math.floor(Math.random() * RANDOM_TIPS.length)];
}

function normalize(s: string): string {
  return normalizeIngredient(s);
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

function toResult(r: Recipe, extra?: Partial<TaraRecipeResult>): TaraRecipeResult {
  return {
    id: r.id,
    name: r.name,
    emoji: r.emoji,
    category: r.category,
    description: r.description,
    time: r.time,
    difficulty: r.difficulty,
    servings: r.servings,
    veg: r.veg,
    meal: r.meal,
    ...extra,
  };
}

function extractIngredients(text: string): string[] {
  return extractIngredientsFromText(text);
}

export function findExactRecipe(query: string): Recipe | undefined {
  const lower = normalize(query);
  return RECIPES.find((r) => normalize(r.name) === lower) ||
    RECIPES.find((r) => normalize(r.name).includes(lower)) ||
    RECIPES.find((r) => lower.includes(normalize(r.name)));
}

function findFuzzyRecipes(query: string): Recipe[] {
  const lower = normalize(query);
  const scored = RECIPES.map((r) => {
    const name = normalize(r.name);
    let score = 0;
    if (name === lower) score = 100;
    else if (name.includes(lower)) score = 80;
    else if (lower.includes(name)) score = 70;
    else {
      const words = lower.split(' ');
      let wordMatches = 0;
      for (const w of words) {
        if (w.length < 3) continue;
        if (name.includes(w)) wordMatches++;
        else {
          for (const nw of name.split(' ')) {
            if (levenshtein(w, nw) <= 2) { wordMatches++; break; }
          }
        }
      }
      score = wordMatches * 15;
      if (levenshtein(lower, name) <= 3) score = Math.max(score, 40);
    }
    return { r, score };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
  return scored.slice(0, 6).map((x) => x.r);
}

export function searchByIngredient(ingredient: string): Recipe[] {
  const norm = normalizeIngredient(ingredient);
  return RECIPES.filter((r) =>
    r.ingredients.some((i) => normalizeIngredient(i) === norm) ||
    r.must.some((m) => normalizeIngredient(m) === norm),
  );
}

export function searchByMultipleIngredients(ingredients: string[]): TaraRecipeResult[] {
  const results = RECIPES.map((r) => {
    const status = getIngredientStatus(r.ingredients, ingredients);
    return { r, ...status };
  })
    .filter((x) => x.matchPercentage > 0)
    .sort((a, b) => b.matchPercentage - a.matchPercentage || a.missingIngredients.length - b.missingIngredients.length);
  return results.slice(0, 8).map((x) => toResult(x.r, {
    matchPercent: x.matchPercentage,
    matched: x.availableIngredients,
    missing: x.missingIngredients,
  }));
}

export function findSimilarRecipes(recipe: Recipe): Recipe[] {
  const recipeIngSet = new Set(recipe.ingredients.map(normalizeIngredient));
  const sameCategory = RECIPES.filter((r) => r.category === recipe.category && r.id !== recipe.id);
  const sharedIngredients = RECIPES.filter((r) => r.id !== recipe.id).map((r) => {
    const shared = r.ingredients.filter((i) => recipeIngSet.has(normalizeIngredient(i))).length;
    return { r, shared };
  }).sort((a, b) => b.shared - a.shared).slice(0, 5).map((x) => x.r);

  const combined = [...sameCategory.slice(0, 2), ...sharedIngredients.slice(0, 3)];
  const seen = new Set<string>([recipe.id]);
  const unique: Recipe[] = [];
  for (const r of combined) {
    if (!seen.has(r.id)) { seen.add(r.id); unique.push(r); }
  }
  return unique.slice(0, 4);
}

function getSidesForRecipe(recipe: Recipe): Recipe[] {
  if (recipe.category === 'Rice Dishes') {
    return RECIPES.filter((r) => ['Curries & Gravies', 'Poriyal & Fries', 'Chutneys'].includes(r.category)).slice(0, 5);
  }
  if (recipe.category === 'Curries & Gravies' || recipe.category === 'Dal & Snacks') {
    return RECIPES.filter((r) => r.category === 'Rice Dishes').slice(0, 5);
  }
  if (recipe.category === 'Breakfast') {
    return RECIPES.filter((r) => r.category === 'Chutneys').slice(0, 4);
  }
  return findSimilarRecipes(recipe).slice(0, 4);
}

function formatRecipeList(recipes: Recipe[], header: string, intro?: string): TaraResponse {
  if (recipes.length === 0) {
    return { text: `😅 I couldn't find any recipes in that category. Try another category like Rice Dishes, Breakfast, or Desserts!` };
  }
  const list = recipes.map((r) => `${r.emoji} ${r.name}`).join('\n');
  const introText = intro ? `${intro}\n\n` : '';
  return {
    text: `${header} (${recipes.length})\n\n${introText}${list}\n\nTap any recipe name to view the full recipe.`,
    recipes: recipes.map((r) => toResult(r)),
  };
}

// ───────────────────────── Greeting responses ─────────────────────────
const GREETING_VARIANTS = [
  "👋 Hi! I'm TARA, your AI cooking companion inside Cooking Thozhan 👩‍🍳\n\nTell me what ingredients you have, ask for recipes, cooking tips, or anything food-related.\n\nWhy fear when your THOZHAN is here! 🍛✨",
  "👋 Hey there! I'm TARA 👩‍🍳\n\nWhat are we cooking today? Tell me your ingredients or pick a quick action below.\n\nWhy fear when your THOZHAN is here! 🍛",
  "👩‍🍳 Hello! TARA here, your kitchen companion.\n\nGot ingredients? Got cravings? I've got recipes. Let's cook something delicious together!\n\nWhy fear when your THOZHAN is here! ✨",
];

// ───────────────────────── Conversation responses ─────────────────────────
const CONVERSATION_REPLIES: { keys: string[]; response: string }[] = [
  { keys: ['how are you', 'how are u', 'how r u', 'how you doing', 'whats up', "what's up"], response: "I'm doing great! 😊\nReady to help you cook something delicious.\n\nWhat are we making today?" },
  { keys: ['thank you', 'thanks', 'thx', 'tysm', 'thanku', 'thank u'], response: "You're welcome! ❤️\nHappy cooking! 🍳" },
  { keys: ['you are amazing', "you're amazing", 'you are great', "you're great", 'you are awesome', "you're awesome", 'you are the best', "you're the best", 'love you tara', 'good job tara', 'well done tara', 'love this'], response: "Aww, thank you! 😊\nThat made my day.\nLet's cook something tasty together! 👩🏻‍🍳" },
  { keys: ['good night', 'goodnight', 'good night tara'], response: "Good night! 🌙\nHope your next meal is delicious.\nSee you soon! 👋" },
  { keys: ['bye', 'goodbye', 'gtg', 'got to go', 'see you', 'see ya', 'cya'], response: "Bye! 👋\nCome back whenever you're hungry. 🍽️" },
  { keys: ['good morning', 'morning'], response: "Good morning! ☀️\nA perfect time to plan something delicious.\nWhat would you like to cook today?" },
  { keys: ['good afternoon', 'afternoon'], response: "Good afternoon! 🌤️\nLunch time? I have plenty of ideas.\nWhat are you in the mood for?" },
  { keys: ['good evening', 'evening'], response: "Good evening! 🌅\nReady to cook something special for dinner?\nTell me what you have!" },
  { keys: ['i love you', 'love you'], response: "Aww, I love helping you too! ❤️\nNow let's make something delicious! 🍳" },
  { keys: ['who are you', 'what are you', 'your name', 'who is tara', 'about you', 'who are u'], response: "Hi! I'm TARA, your AI cooking companion inside Cooking Thozhan 👩‍🍳\n\nMy job is to help you discover delicious recipes using the ingredients already available in your kitchen.\n\nWhy fear when your THOZHAN is here! 🍛✨" },
  { keys: ['what can you do', 'help me', 'how do you work', 'what do you do', 'help'], response: "I can help you with:\n\n🔍 Find recipes by name, ingredient, or category\n🍳 Suggest what to cook with your ingredients\n🥣 Answer cooking questions (how to boil eggs, why is my dosa sticking, etc.)\n🍽️ Filter by veg, non-veg, egg, easy, quick, or time\n💡 Share cooking tips and substitutions\n\nJust type naturally — I'll understand! 😊\n\nWhy fear when your THOZHAN is here! 🍛" },
  { keys: ["you're funny", 'you are funny', 'tell me a joke', 'joke'], response: "Why did the tomato turn red? 🍅\n\nBecause it saw the salad dressing! 😄\n\nNow, what are we cooking today?" },
  { keys: ['nice', 'cool', 'awesome', 'great', 'wow', 'super', 'lovely', 'perfect', 'amazing'], response: "Glad you think so! 😊\nWhat else can I help you with?" },
  { keys: ['i am bored', "i'm bored", 'im bored', 'bored'], response: "Bored? Let's fix that with some cooking! 🍳\n\nHow about trying a new recipe?\n\n• Ask me for a recommendation\n• Tell me what ingredients you have\n• Or pick a category like Desserts or Breakfast!\n\nCooking is the best cure for boredom. 😊" },
];

function findConversationReply(query: string): string | null {
  const lower = normalize(query);
  for (const reply of CONVERSATION_REPLIES) {
    if (reply.keys.some((k) => lower === k || lower.includes(k))) {
      return reply.response;
    }
  }
  return null;
}

// ───────────────────────── Main response generator ─────────────────────────

/**
 * Process a user query and return a natural, helpful response.
 * Uses conversation context to handle follow-up questions.
 */
export function processQuery(
  rawQuery: string,
  context: ConversationContext = createContext(),
): { response: TaraResponse; newContext: ConversationContext } {
  try {
    const query = rawQuery.trim();
    if (!query) {
      return { response: fallbackResponse(), newContext: context };
    }

    const intent = detectIntent(query, context);
    const shouldShowTip = Math.random() < 0.3;
    let newContext = context;
    let response: TaraResponse;

    switch (intent) {
      case 'greeting':
        response = { text: GREETING_VARIANTS[Math.floor(Math.random() * GREETING_VARIANTS.length)], ...(shouldShowTip ? { tip: getRandomTip() } : {}) };
        break;

      case 'conversation': {
        const reply = findConversationReply(query);
        response = { text: reply ?? "😊 Tell me what you'd like to cook!", ...(shouldShowTip ? { tip: getRandomTip() } : {}) };
        break;
      }

      case 'follow_up': {
        response = handleFollowUp(query, context);
        break;
      }

      case 'favourites': {
        response = handleFavourites();
        break;
      }

      case 'recent': {
        response = handleRecent();
        break;
      }

      case 'shopping_list': {
        response = handleShoppingList(context);
        break;
      }

      case 'missing_ingredients': {
        response = handleMissingIngredients(query, context);
        break;
      }

      case 'recipe_info': {
        response = handleRecipeInfo(query, context);
        if (response.recipes && response.recipes.length === 1) {
          newContext = updateContext(context, {
            lastRecipeId: response.recipes[0].id,
            lastRecipeName: response.recipes[0].name,
          });
        }
        break;
      }

      case 'cooking_question':
      case 'ingredient_substitution':
      case 'cooking_technique': {
        const answer = searchKnowledge(query);
        response = answer
          ? { text: answer, ...(shouldShowTip ? { tip: getRandomTip() } : {}) }
          : fallbackResponse();
        break;
      }

      case 'recipe_recommendation': {
        response = handleRecommendation(query);
        break;
      }

      case 'recipe_search': {
        response = handleRecipeSearch(query);
        if (response.recipes && response.recipes.length === 1) {
          newContext = updateContext(context, {
            lastRecipeId: response.recipes[0].id,
            lastRecipeName: response.recipes[0].name,
          });
        }
        break;
      }

      case 'ingredient_search': {
        response = handleIngredientSearch(query, context);
        const mentioned = extractIngredients(query);
        if (mentioned.length > 0) {
          newContext = updateContext(context, {
            hasSharedIngredients: true,
            mentionedIngredients: [...new Set([...context.mentionedIngredients, ...mentioned])],
            lastIngredient: mentioned[0],
          });
        }
        break;
      }

      case 'category_search': {
        response = handleCategorySearch(query);
        break;
      }

      case 'meal_search': {
        response = handleMealSearch(query);
        break;
      }

      case 'healthy_suggestion': {
        response = handleHealthySuggestion(query);
        break;
      }

      case 'quick_recipe': {
        response = handleQuickRecipe(query);
        break;
      }

      case 'clarifying_question': {
        response = handleClarifyingQuestion(query, context);
        const mentioned = extractIngredients(query);
        if (mentioned.length > 0) {
          newContext = updateContext(context, {
            lastIngredient: mentioned[0],
            hasSharedIngredients: true,
            mentionedIngredients: [...new Set([...context.mentionedIngredients, ...mentioned])],
          });
        }
        break;
      }

      case 'cooking_tip': {
        const answer = searchKnowledge(query);
        response = answer ? { text: answer } : { text: "👩‍🍳 Here's a tip: always taste as you cook and adjust seasoning gradually. The secret ingredient is always love — and a little extra ghee! 😊" };
        break;
      }

      default: {
        // Check for impossible requests (e.g. "make pizza with only water")
        const impossible = detectImpossibleRequest(query);
        if (impossible) {
          response = impossible;
        } else {
          response = fallbackResponse();
        }
      }
    }

    return { response, newContext: newContext === context ? updateContext(newContext, {}) : newContext };
  } catch {
    return { response: fallbackResponse(), newContext };
  }
}

// ───────────────────────── Handlers ─────────────────────────

/**
 * Handle recipe info requests: "Tell me about Onion Dosa", "How do I make Tea", etc.
 * Finds the recipe in the query and returns a full recipe card.
 */
function handleRecipeInfo(query: string, context: ConversationContext): TaraResponse {
  const found = findRecipeInQuery(query);

  if (!found) {
    // No recipe found — try fuzzy search
    const fuzzy = findFuzzyRecipes(query);
    if (fuzzy.length > 0) {
      return {
        text: `😅 I couldn't find an exact match, but here are some similar recipes you might enjoy.\n\n${fuzzy.map((r) => `${r.emoji} ${r.name}`).join('\n')}\n\nTap any recipe name to view it.`,
        recipes: fuzzy.map((r) => toResult(r)),
      };
    }
    return fallbackResponse();
  }

  return formatRecipeCard(found.recipe, context);
}

/**
 * Format a full recipe card with description, time, ingredients, steps, and tips.
 */
function formatRecipeCard(recipe: Recipe, context: ConversationContext): TaraResponse {
  const mentioned = context.mentionedIngredients.length > 0 ? context.mentionedIngredients : extractIngredients(recipe.name);
  const status = getIngredientStatus(recipe.ingredients, mentioned);
  const matchPercent = mentioned.length > 0 ? status.matchPercentage : 0;

  const matchLine = mentioned.length > 0
    ? `\n\n**Match:** ${matchPercent}% — You have ${status.matchedCount} of ${status.totalIngredients} ingredients`
    : '';

  const matchedText = status.availableIngredients.length > 0
    ? `\n\n✅ **Available:** ${status.availableIngredients.join(', ')}`
    : '';

  const pantryText = status.pantryIngredients.length > 0
    ? `\n\n🟡 **Pantry Staples:** ${status.pantryIngredients.join(', ')}`
    : '';

  let missingText = '';
  if (status.missingIngredients.length > 0) {
    missingText = `\n\n❌ **Missing:** ${status.missingIngredients.join(', ')}`;
    // Add substitution suggestions for missing ingredients
    const subs = status.missingIngredients
      .map((m) => {
        const sub = getSubstitutionSuggestion(m);
        return sub ? `• No ${m}? ${sub}.` : null;
      })
      .filter((s): s is string => s !== null);
    if (subs.length > 0) {
      missingText += `\n\n💡 **Substitutions:**\n${subs.join('\n')}`;
    }
  }

  const similar = findSimilarRecipes(recipe);
  const similarText = similar.length > 0
    ? `\n\n---\n\n👩‍🍳 **You may also enjoy:**\n${similar.map((r) => `${r.emoji} ${r.name}`).join('\n')}`
    : '';

  return {
    text:
      `🍛 **${recipe.name}**\n\n` +
      `⏱ ${recipe.time} mins | 🥣 Serves ${recipe.servings} | 🔥 ${recipe.difficulty} | ${recipe.veg ? '🟢 Veg' : '🔴 Non-Veg'}` +
      matchLine + matchedText + pantryText + missingText +
      `\n\n**Ingredients**\n${recipe.ingredients.map((i) => `• ${i}`).join('\n')}` +
      `\n\n**Cooking Steps**\n${recipe.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}` +
      (recipe.tip ? `\n\n💡 **Pro Tip:** ${recipe.tip}` : '') +
      similarText,
    recipes: [toResult(recipe, { matchPercent, matched: status.availableIngredients, missing: status.missingIngredients }), ...similar.map((r) => toResult(r))],
  };
}

/**
 * Handle missing ingredients query: "What am I missing for X?"
 */
function handleMissingIngredients(query: string, context: ConversationContext): TaraResponse {
  const found = findRecipeInQuery(query);
  if (!found) return fallbackResponse();

  const recipe = found.recipe;
  const mentioned = context.mentionedIngredients.length > 0 ? context.mentionedIngredients : extractIngredients(query);
  const status = getIngredientStatus(recipe.ingredients, mentioned);

  if (status.missingIngredients.length === 0) {
    return {
      text: `🎉 Great news! You have everything you need for **${recipe.name}**.

No missing ingredients — you're ready to cook!`,
      recipes: [toResult(recipe)],
    };
  }

  // Add substitution suggestions for missing ingredients
  const subs = status.missingIngredients
    .map((m) => {
      const sub = getSubstitutionSuggestion(m);
      return sub ? `• No ${m}? ${sub}.` : null;
    })
    .filter((s): s is string => s !== null);
  const subText = subs.length > 0 ? `\n\n💡 **Substitutions:**\n${subs.join('\n')}` : '';

  return {
    text: `🛒 For **${recipe.name}**, you're still missing:\n\n${status.missingIngredients.map((m) => `• ${m}`).join('\n')}\n\nYou already have: ${status.availableIngredients.join(', ') || 'none mentioned yet'}.${subText}\n\nWant me to add these to a shopping list? Just say "add to shopping list"!`,
    recipes: [toResult(recipe, { missing: status.missingIngredients })],
  };
}

/**
 * Handle favourites query.
 */
function handleFavourites(): TaraResponse {
  // This is handled client-side in TaraChat via the favorites context.
  // Return a prompt that the chat component can intercept.
  return {
    text: `❤️ Let me check your favourites for you!`,
  };
}

/**
 * Handle recently viewed query.
 */
function handleRecent(): TaraResponse {
  return {
    text: `🕘 Let me pull up your recently viewed recipes!`,
  };
}

/**
 * Handle shopping list query.
 */
function handleShoppingList(context: ConversationContext): TaraResponse {
  if (!context.lastRecipeId) {
    return { text: `🛒 I'd be happy to help with a shopping list!\n\nFirst, tell me which recipe you'd like to make, and I'll list the ingredients you need to buy.` };
  }
  const recipe = RECIPES.find((r) => r.id === context.lastRecipeId);
  if (!recipe) return fallbackResponse();

  const mentioned = context.mentionedIngredients;
  const status = getIngredientStatus(recipe.ingredients, mentioned);

  if (status.missingIngredients.length === 0) {
    return { text: `🎉 You already have everything you need for **${recipe.name}** — no shopping required! 🛍️` };
  }

  return {
    text: `🛒 **Shopping List for ${recipe.name}:**\n\n${status.missingIngredients.map((m) => `☐ ${m}`).join('\n')}\n\nTake this to the store and you'll be ready to cook! 🛍️`,
    recipes: [toResult(recipe, { missing: status.missingIngredients })],
  };
}

function handleFollowUp(query: string, context: ConversationContext): TaraResponse {
  const lower = normalize(query);
  const lastRecipe = RECIPES.find((r) => r.id === context.lastRecipeId);
  if (!lastRecipe) return fallbackResponse();

  if (lower.includes('spicy') || lower.includes('spice')) {
    return {
      text: `🌶️ Yes! To make **${lastRecipe.name}** spicier:\n\n• Add an extra pinch of red chilli powder or garam masala.\n• Slit an extra green chilli and add it while cooking.\n• Sprinkle some black pepper powder before serving.\n• For a smoky heat, add a dash of sambar powder.\n\n💡 Taste as you add — you can always add more, but you can't take it back!`,
    };
  }
  if (lower.includes('less spice') || lower.includes('reduce spice') || lower.includes('less hot')) {
    return {
      text: `🌶️ To make **${lastRecipe.name}** less spicy:\n\n• Add a dollop of curd or coconut milk.\n• Stir in a teaspoon of sugar or jaggery.\n• Add more tomato or a splash of lemon.\n• Dilute with water and simmer longer.\n• Serve with raita or curd rice to cool it down.\n\n💡 Dairy (curd, milk) neutralises chilli heat best!`,
    };
  }
  if (lower.includes('serve with') || lower.includes('side') || lower.includes('pair') || lower.includes('what goes') || lower.includes('with it')) {
    const sides = getSidesForRecipe(lastRecipe);
    return {
      text: `🍽️ **${lastRecipe.name}** pairs beautifully with:\n\n${sides.map((s) => `${s.emoji} ${s.name}`).join('\n')}\n\nTap any to view the recipe. Enjoy your meal! 😊`,
      recipes: sides.map((r) => toResult(r)),
    };
  }
  if (lower.includes('similar') || lower.includes('other') || lower.includes('else') || lower.includes('more like')) {
    const similar = findSimilarRecipes(lastRecipe);
    return {
      text: `👩🏻‍🍳 If you liked **${lastRecipe.name}**, you may also enjoy:\n\n${similar.map((r) => `${r.emoji} ${r.name}`).join('\n')}\n\nTap any to view the recipe.`,
      recipes: similar.map((r) => toResult(r)),
    };
  }
  if (lower.includes('how long') || lower.includes('time') || lower.includes('cook time')) {
    return { text: `⏱️ **${lastRecipe.name}** takes about ${lastRecipe.time} minutes to cook and serves ${lastRecipe.servings} people.` };
  }
  if (lower.includes('ingredient') || lower.includes('need') || lower.includes('what goes') || lower.includes('what do i need')) {
    return {
      text: `🥘 Here's what you need for **${lastRecipe.name}**:\n\n${lastRecipe.ingredients.map((i) => `• ${i}`).join('\n')}\n\n💡 The key ingredients are: ${lastRecipe.must.join(', ')}.`,
    };
  }
  if (lower.includes('add paneer') || lower.includes('add cheese') || lower.includes('add vegetable') || lower.includes('add egg')) {
    return { text: `👩🏻‍🍳 Great idea! You can definitely add that to **${lastRecipe.name}**. Add it in the last 5 minutes of cooking so it does not overcook. Taste and adjust the seasoning after adding. 😊` };
  }
  if (lower.includes('vegan')) {
    return { text: `🌱 To make **${lastRecipe.name}** vegan:\n\n• Replace ghee with oil.\n• Replace curd with coconut curd or lemon water.\n• Replace milk with coconut milk.\n• Replace paneer with tofu.\n\n💡 Most South Indian rice dishes are naturally vegan — just swap the ghee!` };
  }
  if (lower.includes('healthier')) {
    return { text: `🥗 To make **${lastRecipe.name}** healthier:\n\n• Use less oil — sauté in water instead.\n• Add extra vegetables.\n• Reduce salt — use lemon for flavour.\n• Use brown rice instead of white if it is a rice dish.\n\n💡 Small changes add up — even 1 tablespoon less oil makes a difference!` };
  }
  if (lower.includes('skip onion') || lower.includes('no onion')) {
    return { text: `🧅 Yes, you can skip onions in **${lastRecipe.name}**! Add extra ginger and a pinch of hing (asafoetida) for flavour depth. The dish will still be delicious! 😊` };
  }
  if (lower.includes('skip garlic') || lower.includes('no garlic')) {
    return { text: `🧄 Yes, you can skip garlic in **${lastRecipe.name}**! Add a pinch of hing (asafoetida) in the tempering — it mimics garlic's savoury depth perfectly. 😊` };
  }

  // Generic follow-up
  return {
    text: `👩🏻‍🍳 About **${lastRecipe.name}** — it takes ${lastRecipe.time} minutes, serves ${lastRecipe.servings}, and is ${lastRecipe.difficulty} to make.\n\nYou can ask me:\n• "Can I make it spicy?"\n• "What goes well with it?"\n• "Show me similar recipes"\n• "What ingredients do I need?"\n\nWhat would you like to know? 😊`,
  };
}

function handleRecommendation(query: string): TaraResponse {
  const lower = normalize(query);

  if (lower.includes('sick') || lower.includes('ill') || lower.includes('cold') || lower.includes('fever')) {
    const ids = ['pepper-rasam', 'tomato-soup', 'spinach-soup', 'vegetable-soup'];
    const recipes = RECIPES.filter((r) => ids.includes(r.id));
    return {
      text: `🤒 Feeling under the weather? Don't worry, I've got you.\n\nHere are some soothing, comforting recipes that will help you feel better:\n\n${recipes.map((r) => `${r.emoji} ${r.name}`).join('\n')}\n\nTap any recipe to view it. Rest well and eat warm! 💛`,
      recipes: recipes.map((r) => toResult(r)),
      tip: 'A bowl of warm pepper rasam with rice is nature\'s medicine for colds and fevers.',
    };
  }

  if (lower.includes('guest') || lower.includes('party') || lower.includes('friends') || lower.includes('family')) {
    const recipes = RECIPES.filter((r) => r.servings >= 4).sort((a, b) => b.servings - a.servings).slice(0, 8);
    return {
      text: `🎉 Cooking for guests? Wonderful!\n\nThese recipes serve 4 or more and are sure to impress:\n\n${recipes.map((r) => `${r.emoji} ${r.name} (serves ${r.servings})`).join('\n')}\n\nTap any recipe to view it. Your guests are in for a treat! 😊`,
      recipes: recipes.map((r) => toResult(r)),
    };
  }

  if (lower.includes('nothing') || lower.includes('empty') || lower.includes('bare')) {
    const recipes = RECIPES.filter((r) => r.ingredients.length <= 6).sort((a, b) => a.ingredients.length - b.ingredients.length).slice(0, 8);
    return {
      text: `🍳 Almost nothing in the pantry? No problem!\n\nThese recipes need very few ingredients — you probably have what it takes:\n\n${recipes.map((r) => `${r.emoji} ${r.name} (${r.ingredients.length} ingredients)`).join('\n')}\n\nTap any recipe to view it.`,
      recipes: recipes.map((r) => toResult(r)),
    };
  }

  // Default recommendation
  const popularIds = ['tomato-rice', 'vegetable-soup', 'podi-dosa', 'aval-payasam', 'lemon-rice', 'masala-dosa'];
  const recipes = popularIds.map((id) => RECIPES.find((r) => r.id === id)).filter((r): r is Recipe => r !== undefined).slice(0, 6);
  return {
    text: `🤔 Can't decide? How about trying one of these?\n\n${recipes.map((r) => `${r.emoji} ${r.name}`).join('\n')}\n\nTap any recipe to view it. Sometimes the best meals start with a little inspiration! ✨`,
    recipes: recipes.map((r) => toResult(r)),
  };
}

function handleRecipeSearch(query: string): TaraResponse {
  const lower = normalize(query);

  // Veg/non-veg/egg filter
  if (lower.includes('veg') || lower.includes('nonveg') || lower.includes('non veg') || lower.includes('non-veg') || lower.includes('egg')) {
    let recipes: Recipe[] = [];
    let label = '';
    if ((lower.includes('egg') && !lower.includes('no egg'))) {
      recipes = RECIPES.filter((r) => !r.veg && r.ingredients.includes('Egg'));
      label = '🥚 Egg recipes';
    } else if (lower.includes('nonveg') || lower.includes('non veg') || lower.includes('non-veg') || lower.includes('meat') || lower.includes('chicken') || lower.includes('mutton') || lower.includes('fish')) {
      recipes = RECIPES.filter((r) => !r.veg);
      label = '🔴 Non-Veg recipes';
    } else {
      recipes = RECIPES.filter((r) => r.veg);
      label = '🥕 Vegetarian recipes';
    }
    return formatRecipeList(recipes, label, 'Here you go:');
  }

  // Difficulty
  if (lower.includes('easy') || lower.includes('simple') || lower.includes('beginner')) {
    return formatRecipeList(RECIPES.filter((r) => r.difficulty === 'Easy'), '🟢 Easy recipes', 'Perfect for beginners:');
  }
  if (lower.includes('medium') || lower.includes('moderate')) {
    return formatRecipeList(RECIPES.filter((r) => r.difficulty === 'Medium'), '🟡 Medium recipes', 'A little more effort:');
  }
  if (lower.includes('hard') || lower.includes('difficult') || lower.includes('advanced')) {
    return formatRecipeList(RECIPES.filter((r) => r.difficulty === 'Hard'), '🔴 Hard recipes', 'For experienced cooks:');
  }

  // Spicy
  if ((lower.includes('spicy') || lower.includes('hot')) && !lower.includes('not spicy') && !lower.includes('less spicy')) {
    const recipes = RECIPES.filter((r) =>
      r.ingredients.some((i) => ['Red Chilli Powder', 'Green Chilli', 'Black Pepper', 'Pepper Powder', 'Garam Masala', 'Sambar Powder', 'Dried Red Chilli'].includes(i)) && r.difficulty !== 'Hard',
    ).slice(0, 8);
    return {
      text: `🌶️ You like it spicy? So do I!\n\nHere are some recipes with a nice kick:\n\n${recipes.map((r) => `${r.emoji} ${r.name}`).join('\n')}\n\nTap any recipe to view it. Handle with care! 🔥`,
      recipes: recipes.map((r) => toResult(r)),
    };
  }

  // Exact recipe
  const exact = findExactRecipe(query);
  if (exact) {
    return formatRecipeCard(exact, createContext());
  }

  // Fuzzy
  const fuzzy = findFuzzyRecipes(query);
  if (fuzzy.length > 0) {
    return {
      text: `😅 I couldn't find an exact match, but here are some similar recipes you might enjoy.\n\n${fuzzy.map((r) => `${r.emoji} ${r.name}`).join('\n')}\n\nTap any recipe name to view it.`,
      recipes: fuzzy.map((r) => toResult(r)),
    };
  }

  return fallbackResponse();
}

/**
 * Handle ingredient search with context awareness.
 * If the user has shared ingredients before, combine with new ones.
 */
function handleIngredientSearch(query: string, context: ConversationContext): TaraResponse {
  // Combine previously mentioned ingredients with new ones
  const newMentioned = extractIngredients(query);
  const allMentioned = [...new Set([...context.mentionedIngredients, ...newMentioned])];

  if (allMentioned.length >= 2) {
    const results = searchByMultipleIngredients(allMentioned);
    if (results.length > 0) {
      const lines = results.map((r) => {
        const icon = r.matchPercent === 100 ? '✅' : '🟡';
        const missingText = r.missing && r.missing.length > 0
          ? `\n   Need: ${r.missing.slice(0, 5).join(', ')}${r.missing.length > 5 ? '…' : ''}`
          : '';
        return `${icon} ${r.emoji} ${r.name} (${r.matchPercent}% match)${missingText}`;
      }).join('\n\n');

      const perfect = results.filter((r) => r.matchPercent === 100);
      const great = results.filter((r) => (r.matchPercent ?? 0) >= 70 && (r.matchPercent ?? 0) < 100);
      const canTry = results.filter((r) => (r.matchPercent ?? 0) >= 45 && (r.matchPercent ?? 0) < 70);

      let intro = `🍳 Nice! With ${allMentioned.join(', ')} you can make:\n\n`;
      if (perfect.length > 0) {
        intro += `**Perfect Matches**\n`;
      }
      if (great.length > 0 && perfect.length > 0) intro += `\n**Great Matches**\n`;
      if (canTry.length > 0 && (perfect.length > 0 || great.length > 0)) intro += `\n**Can Also Try**\n`;

      return {
        text: `${intro}${lines}\n\nTap any recipe name to view the full recipe.`,
        recipes: results,
      };
    }
  }
  if (allMentioned.length === 1) {
    const results = searchByIngredient(allMentioned[0]);
    if (results.length > 0) {
      const ing = INGREDIENT_LOWER.get(allMentioned[0].toLowerCase()) ?? allMentioned[0];
      const emoji = INGREDIENTS.find((i) => i.name === ing)?.emoji ?? '🍴';
      return formatRecipeList(results, `${emoji} Recipes using ${ing}`, `Here are all the recipes that use ${ing}:`);
    }
  }
  return fallbackResponse();
}

function handleCategorySearch(query: string): TaraResponse {
  const lower = normalize(query);

  // Sweet/dessert
  if (lower.includes('sweet') || lower.includes('dessert')) {
    const recipes = RECIPES.filter((r) => r.category === 'Desserts');
    return {
      text: `🍰 Craving something sweet? I love it!\n\nHere are all our dessert recipes:\n\n${recipes.map((r) => `${r.emoji} ${r.name}`).join('\n')}\n\nTap any recipe to view it. Time for a treat! 🍮`,
      recipes: recipes.map((r) => toResult(r)),
    };
  }

  for (const cat of CATEGORIES) {
    if (lower.includes(cat.toLowerCase())) {
      return formatRecipeList(RECIPES.filter((r) => r.category === cat), `${getCategoryEmoji(cat)} ${cat}`, `Here are all our ${cat.toLowerCase()}:`);
    }
  }

  return fallbackResponse();
}

function handleMealSearch(query: string): TaraResponse {
  const lower = normalize(query);
  for (const meal of MEAL_TYPES) {
    if (lower.includes(meal.toLowerCase())) {
      return formatRecipeList(RECIPES.filter((r) => r.meal === meal), `${getMealEmoji(meal)} ${meal} ideas`, `Here are some great ${meal.toLowerCase()} options:`);
    }
  }
  return fallbackResponse();
}

function handleHealthySuggestion(query: string): TaraResponse {
  const lower = normalize(query);

  if (lower.includes('sick') || lower.includes('cold') || lower.includes('fever') || lower.includes('ill')) {
    const ids = ['pepper-rasam', 'tomato-soup', 'spinach-soup', 'vegetable-soup'];
    const recipes = RECIPES.filter((r) => ids.includes(r.id));
    return {
      text: `🤒 Feeling under the weather? Don't worry, I've got you.\n\nHere are some soothing, comforting recipes that will help you feel better:\n\n${recipes.map((r) => `${r.emoji} ${r.name}`).join('\n')}\n\nTap any recipe to view it. Rest well and eat warm! 💛`,
      recipes: recipes.map((r) => toResult(r)),
      tip: 'A bowl of warm pepper rasam with rice is nature\'s medicine for colds and fevers.',
    };
  }

  if (lower.includes('protein')) {
    const recipes = RECIPES.filter((r) => r.ingredients.includes('Egg') || r.ingredients.includes('Paneer') || r.ingredients.includes('Toor Dal (Thuvaram Paruppu)') || r.ingredients.includes('Channa') || r.ingredients.includes('Moong Dal (Paasi Paruppu)')).slice(0, 8);
    return {
      text: `💪 Looking for high-protein options? Here are some great choices:\n\n${recipes.map((r) => `${r.emoji} ${r.name}`).join('\n')}\n\nTap any recipe to view it. 💪`,
      recipes: recipes.map((r) => toResult(r)),
    };
  }

  // General healthy
  const recipes = RECIPES.filter((r) =>
    ['Soups', 'Poriyal & Fries', 'Breakfast'].includes(r.category) && r.veg && r.difficulty === 'Easy',
  ).slice(0, 8);
  return {
    text: `🥗 Eating healthy? Good choice!\n\nHere are some light and nutritious options:\n\n${recipes.map((r) => `${r.emoji} ${r.name}`).join('\n')}\n\nTap any recipe to view it. Healthy can be delicious too! 💪`,
    recipes: recipes.map((r) => toResult(r)),
  };
}

function handleQuickRecipe(query: string): TaraResponse {
  const lower = normalize(query);
  let mins = 20;

  // Try to extract a number
  const numMatch = lower.match(/(\d+)\s*(min|minute|minutes)/);
  if (numMatch) {
    mins = parseInt(numMatch[1], 10);
  } else if (lower.includes('quick') || lower.includes('fast')) {
    mins = 20;
  }

  const recipes = RECIPES.filter((r) => r.time <= mins).sort((a, b) => a.time - b.time);
  return formatRecipeList(recipes, `⏱ Quick recipes (under ${mins} min)`, 'Short on time? These are fast and delicious:');
}

/**
 * Handle clarifying question for single ingredient.
 * Now context-aware: if user has shared ingredients before, combine them.
 */
function handleClarifyingQuestion(query: string, context: ConversationContext): TaraResponse {
  const mentioned = extractIngredients(query);
  const allMentioned = [...new Set([...context.mentionedIngredients, ...mentioned])];

  if (allMentioned.length >= 2) {
    // Now we have enough ingredients — do a real search
    const results = searchByMultipleIngredients(allMentioned);
    if (results.length > 0) {
      const lines = results.map((r) => {
        const icon = r.matchPercent === 100 ? '✅' : '🟡';
        const missingText = r.missing && r.missing.length > 0
          ? `\n   Need: ${r.missing.slice(0, 5).join(', ')}${r.missing.length > 5 ? '…' : ''}`
          : '';
        return `${icon} ${r.emoji} ${r.name} (${r.matchPercent}% match)${missingText}`;
      }).join('\n\n');
      return {
        text: `🍳 With ${allMentioned.join(', ')} you can make:\n\n${lines}\n\nTap any recipe name to view the full recipe.`,
        recipes: results,
      };
    }
  }

  if (mentioned.length === 1) {
    const ing = mentioned[0];
    const emoji = INGREDIENTS.find((i) => i.name === ing)?.emoji ?? '🍴';
    return {
      text: `Great! 😊 You have ${emoji} ${ing}.\n\nDo you also have onions, tomatoes, or any other ingredients?\n\nThat will help me recommend the best recipe for you!`,
    };
  }
  return fallbackResponse();
}

function fallbackResponse(): TaraResponse {
  const fuzzy = findFuzzyRecipes('tomato rice');
  return {
    text: `Hmm... I couldn't find an exact match for that 😊\n\nHere are some popular recipes you might enjoy:\n\n${(fuzzy.length > 0 ? fuzzy : RECIPES.slice(0, 4)).map((r) => `${r.emoji} ${r.name}`).join('\n')}\n\nTry asking by:\n• recipe name\n• ingredient\n• category\n• breakfast / lunch / dinner\n• dessert / beverages`,
    recipes: (fuzzy.length > 0 ? fuzzy : RECIPES.slice(0, 4)).map((r) => toResult(r)),
  };
}

function detectImpossibleRequest(query: string): TaraResponse | null {
  const lower = normalizeIngredient(query);
  const impossiblePatterns = [
    /make .+ with only water/,
    /cook .+ with (just )?water/,
    /pizza with (only )?water/,
    /cake with (only )?water/,
    /biryani with (only )?water/,
    /make .+ with nothing/,
    /cook .+ with (just )?salt/,
  ];
  if (impossiblePatterns.some((p) => p.test(lower))) {
    return {
      text: "I don't think that's possible with just that 😊\n\nBut if you have a few more ingredients, I can help you make something delicious!\n\nTell me what ingredients you have and I'll find recipes you can cook right now.\n\nWhy fear when your THOZHAN is here! 🍛",
    };
  }
  return null;
}

function getCategoryEmoji(cat: string): string {
  const map: Record<string, string> = {
    'Rice Dishes': '🍚', 'Breakfast': '🥣', 'Bread Recipes': '🍞', 'Sandwiches': '🥪',
    'Pasta & Noodles': '🍝', 'Egg Dishes': '🥚', 'Curries & Gravies': '🍛', 'Poriyal & Fries': '🥘',
    'Kothu Items': '🍲', 'Dal & Snacks': '🫘', 'Chutneys': '🥣', 'Soups': '🥛',
    'Desserts': '🍰', 'Beverages': '🥤', 'Quick Meals': '⚡',
  };
  return map[cat] ?? '🍴';
}

function getMealEmoji(meal: string): string {
  const map: Record<string, string> = {
    'Breakfast': '🌅', 'Lunch': '☀️', 'Dinner': '🌙', 'Snack': '🍿', 'Beverage': '🥤',
  };
  return map[meal] ?? '🍴';
}

// ───────────────────────── Suggestion chips ─────────────────────────

export const TARA_SUGGESTION_SETS = [
  ['🥘 Suggest Recipes', '🥬 What can I cook?', '🛒 Shopping Help', '🍳 Quick Breakfast', '🍛 Dinner Ideas', '🥣 Healthy Recipes', '🎲 Surprise Me', '💡 Cooking Tips'],
  ['🥘 Suggest Recipes', '🥬 What can I cook?', '🍳 Quick Breakfast', '🍛 Dinner Ideas', '🥣 Healthy Recipes', '🎲 Surprise Me', '💡 Cooking Tips', '🛒 Shopping Help'],
  ['🥘 Suggest Recipes', '🥬 What can I cook?', '🍛 Dinner Ideas', '🥣 Healthy Recipes', '🎲 Surprise Me', '💡 Cooking Tips', '🛒 Shopping Help', '🍳 Quick Breakfast'],
];

export function getSuggestionSet(): string[] {
  return TARA_SUGGESTION_SETS[Math.floor(Math.random() * TARA_SUGGESTION_SETS.length)];
}
