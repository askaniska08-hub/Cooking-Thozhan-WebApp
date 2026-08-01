/**
 * Chef Tara — Conversation Memory
 *
 * Tracks the conversation context while the chat window is open.
 * Memory is cleared when the chat is reset or closed.
 */

export interface ConversationContext {
  /** The last recipe the user asked about. */
  lastRecipeId: string | null;
  /** The last recipe name (for natural references like "it"). */
  lastRecipeName: string | null;
  /** The last ingredient the user mentioned. */
  lastIngredient: string | null;
  /** The last category discussed. */
  lastCategory: string | null;
  /** Whether the user has shared ingredients in this session. */
  hasSharedIngredients: boolean;
  /** All ingredients mentioned in this session. */
  mentionedIngredients: string[];
  /** Count of messages exchanged. */
  messageCount: number;
}

export function createContext(): ConversationContext {
  return {
    lastRecipeId: null,
    lastRecipeName: null,
    lastIngredient: null,
    lastCategory: null,
    hasSharedIngredients: false,
    mentionedIngredients: [],
    messageCount: 0,
  };
}

export function updateContext(
  context: ConversationContext,
  update: Partial<ConversationContext>,
): ConversationContext {
  return { ...context, ...update, messageCount: context.messageCount + 1 };
}

