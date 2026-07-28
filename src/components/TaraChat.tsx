import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, RotateCcw, User, ChefHat, Lightbulb } from 'lucide-react';
import type { ChatMessage, TaraRecipeResult } from '@/types';
import { processQuery, getSuggestionSet } from '@/services/responseGenerator';
import { detectIntent } from '@/services/intentDetector';
import { createContext, type ConversationContext } from '@/services/conversationMemory';
import { useFavorites } from '@/context/FavoritesContext';
import { RECIPES } from '@/data/recipes';
import { cn } from '@/utils';
import { RippleButton } from './ui/RippleButton';
import { Logo } from './Logo';

interface TaraChatProps {
  open: boolean;
  onClose: () => void;
  onRecipeClick?: (recipeId: string) => void;
  initialQuestion?: string | null;
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const GREETING: ChatMessage = {
  id: 'greeting',
  role: 'assistant',
  content:
    "👋 Hi! I'm Chef Tara.\n\nTell me what ingredients you have, what you're craving, or ask me anything about cooking!\n\nI'm here to help you cook.",
  timestamp: Date.now(),
};

export function TaraChat({ open, onClose, onRecipeClick, initialQuestion }: TaraChatProps) {
  const { favorites, recent, isLoaded, toggleFavorite, isFavorite } = useFavorites();
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(getSuggestionSet());
  const contextRef = useRef<ConversationContext>(createContext());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingQuestionRef = useRef<string | null>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    });
  }, []);

  useEffect(() => {
    if (open) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;

      const userMsg: ChatMessage = { id: uid(), role: 'user', content: trimmed, timestamp: Date.now() };
      const assistantId = uid();
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        streaming: true,
        thinking: true,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput('');
      setBusy(true);

      // Simulate 500-800ms typing delay
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 300));

      try {
        const { response, newContext } = processQuery(trimmed, contextRef.current);
        contextRef.current = newContext;

        // Intercept favourites and recent intents to inject real data
        const intent = detectIntent(trimmed, contextRef.current);
        let finalResponse = response;

        if (intent === 'favourites') {
          const favRecipes = RECIPES.filter((r) => favorites.includes(r.id));
          if (isLoaded && favRecipes.length > 0) {
            finalResponse = {
              text: `❤️ Your favourite recipes (${favRecipes.length}):

${favRecipes.map((r) => `${r.emoji} ${r.name}`).join('\n')}\n\nTap any recipe to view it.`,
              recipes: favRecipes.map((r) => ({
                id: r.id, name: r.name, emoji: r.emoji, category: r.category,
                description: r.description, time: r.time, difficulty: r.difficulty,
                servings: r.servings, veg: r.veg, meal: r.meal,
              })),
            };
          } else if (isLoaded) {
            finalResponse = { text: '❤️ You don\'t have any favourites yet!\n\nTap the heart icon on any recipe to add it to your favourites.' };
          }
        } else if (intent === 'recent') {
          const recentRecipes = recent.map((id) => RECIPES.find((r) => r.id === id)).filter((r): r is typeof RECIPES[number] => r !== undefined);
          if (isLoaded && recentRecipes.length > 0) {
            finalResponse = {
              text: `🕘 Your recently viewed recipes:

${recentRecipes.map((r) => `${r.emoji} ${r.name}`).join('\n')}\n\nTap any recipe to view it again.`,
              recipes: recentRecipes.map((r) => ({
                id: r.id, name: r.name, emoji: r.emoji, category: r.category,
                description: r.description, time: r.time, difficulty: r.difficulty,
                servings: r.servings, veg: r.veg, meal: r.meal,
              })),
            };
          } else if (isLoaded) {
            finalResponse = { text: '🕘 You haven\'t viewed any recipes yet!\n\nBrowse some recipes and they\'ll show up here.' };
          }
        }

        // Rotate suggestions after each message
        setSuggestions(getSuggestionSet());

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: finalResponse.text, streaming: false, thinking: null, recipes: finalResponse.recipes, tip: finalResponse.tip }
              : m,
          ),
        );
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "😅 Sorry!\n\nI couldn't find anything related to that.\n\nTry asking by:\n• recipe name\n• ingredient\n• category\n• breakfast\n• lunch\n• dinner\n• dessert\n• beverages", streaming: false, thinking: null }
              : m,
          ),
        );
      } finally {
        setBusy(false);
      }
    },
    [busy],
  );

  useEffect(() => {
    if (open && initialQuestion && initialQuestion !== pendingQuestionRef.current) {
      pendingQuestionRef.current = initialQuestion;
      send(initialQuestion);
    }
    if (!open) {
      pendingQuestionRef.current = null;
    }
  }, [open, initialQuestion, send]);

  const reset = useCallback(() => {
    setMessages([GREETING]);
    setBusy(false);
    contextRef.current = createContext();
    setSuggestions(getSuggestionSet());
  }, []);

  const handleRecipeClick = useCallback(
    (recipeId: string) => {
      onRecipeClick?.(recipeId);
    },
    [onRecipeClick],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-end justify-end bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Chat with Chef Tara"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-[88vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-card dark:bg-[#1c1c1c] sm:h-[640px] sm:max-w-md sm:rounded-3xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-primary to-accent p-4 text-white">
              <div className="flex items-center gap-3">
                <Logo size={40} className="ring-white/30" />
                <div className="leading-tight">
                  <div className="font-display text-base font-extrabold">Chef Tara</div>
                  <div className="flex items-center gap-1.5 text-xs text-white/85">
                    <span className="h-2 w-2 rounded-full bg-green-300" /> Recipe Assistant
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={reset}
                  aria-label="Clear conversation"
                  className="grid h-9 w-9 place-items-center rounded-full text-white/90 transition hover:bg-white/15"
                >
                  <RotateCcw size={17} />
                </button>
                <button
                  onClick={onClose}
                  aria-label="Close chat"
                  className="grid h-9 w-9 place-items-center rounded-full text-white/90 transition hover:bg-white/15"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn('flex gap-2.5', m.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  {m.role === 'assistant' && (
                    <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent">
                      <ChefHat size={16} className="text-white" />
                    </div>
                  )}

                  <div className={cn('flex max-w-[80%] flex-col', m.role === 'user' ? 'items-end' : 'items-start')}>
                    <div
                      className={cn(
                        'rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                        m.role === 'user'
                          ? 'rounded-br-md bg-primary text-white'
                          : 'rounded-bl-md bg-gray-100 text-ink dark:bg-white/10 dark:text-gray-100',
                      )}
                    >
                      {m.streaming && m.thinking ? (
                        <ThinkingIndicator />
                      ) : (
                        <FormattedContent text={m.content} recipes={m.recipes} onRecipeClick={handleRecipeClick} />
                      )}
                    </div>

                    {/* Random cooking tip */}
                    {m.tip && !m.streaming && (
                      <div className="mt-1.5 flex items-start gap-1.5 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">
                        <Lightbulb size={13} className="mt-0.5 shrink-0 text-amber-500" />
                        <span><strong>Chef's Tip:</strong> {m.tip}</span>
                      </div>
                    )}

                    {/* Timestamp */}
                    {m.timestamp && (
                      <span className="mt-1 px-1 text-[10px] text-gray-400 dark:text-gray-500">
                        {formatTime(m.timestamp)}
                      </span>
                    )}
                  </div>

                  {m.role === 'user' && (
                    <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-gray-300">
                      <User size={16} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && !busy && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2 px-4 pb-2"
              >
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/10 active:scale-95 dark:text-primary-light dark:border-primary/40"
                  >
                    <Sparkles size={12} /> {s}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Input */}
            <div className="border-t border-gray-100 p-3 dark:border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Tara anything…"
                  className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-ink outline-none transition focus:border-primary dark:border-white/10 dark:bg-white/5 dark:text-gray-100"
                  disabled={busy}
                />
                <RippleButton
                  type="submit"
                  disabled={!input.trim() || busy}
                  className="btn-primary grid h-10 w-10 place-items-center p-0"
                  aria-label="Send message"
                >
                  <Send size={17} />
                </RippleButton>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Typing animation shown while Chef Tara prepares an answer. */
function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-2 py-0.5">
      <motion.span
        animate={{ scale: [1, 1.15, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        className="text-base"
      >
        👩🏻‍🍳
      </motion.span>
      <span className="text-sm text-gray-500 dark:text-gray-400">Tara is thinking</span>
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-500"
            animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </span>
    </div>
  );
}

/** Lightweight markdown-ish renderer with clickable recipe names. */
function FormattedContent({
  text,
  recipes,
  onRecipeClick,
}: {
  text: string;
  recipes?: TaraRecipeResult[];
  onRecipeClick?: (id: string) => void;
}) {
  if (!text) return null;

  const lines = text.split('\n');
  const recipeMap = new Map((recipes ?? []).map((r) => [r.name, r]));

  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;
        if (trimmed.startsWith('---') || trimmed.startsWith('──')) {
          return <div key={i} className="my-1 border-t border-current/15" />;
        }
        if (/^#{1,3}\s/.test(trimmed)) {
          const content = trimmed.replace(/^#{1,3}\s/, '');
          return (
            <div key={i} className="font-display text-sm font-bold text-primary dark:text-primary-light">
              {content}
            </div>
          );
        }
        if (/^[-•]\s/.test(trimmed)) {
          const content = trimmed.replace(/^[-•]\s/, '');
          const recipe = recipeMap.get(content);
          if (recipe && onRecipeClick) {
            return (
              <button
                key={i}
                onClick={() => onRecipeClick(recipe.id)}
                className="flex w-full gap-1.5 pl-1 text-left text-primary transition hover:underline dark:text-primary-light"
              >
                <span className="text-primary dark:text-primary-light">•</span>
                <span>{content}</span>
              </button>
            );
          }
          return (
            <div key={i} className="flex gap-1.5 pl-1">
              <span className="text-primary dark:text-primary-light">•</span>
              <span>{content}</span>
            </div>
          );
        }
        // Check for lines like "✅ Tomato Rice (85% match)" or "🟡 Recipe Name"
        const recipeLineMatch = trimmed.match(/^([✅🟡])\s+(.+?)(?:\s*\((\d+)%\s*match\))?$/);
        if (recipeLineMatch) {
          const recipeName = recipeLineMatch[2].replace(/^\S+\s/, '').trim();
          const recipe = recipeMap.get(recipeName) || recipeMap.get(recipeLineMatch[2].trim());
          if (recipe && onRecipeClick) {
            return (
              <button
                key={i}
                onClick={() => onRecipeClick(recipe.id)}
                className="block w-full text-left text-primary transition hover:underline dark:text-primary-light"
              >
                {trimmed}
              </button>
            );
          }
        }
        if (/^\d+\.\s/.test(trimmed)) {
          return <div key={i} className="pl-1">{trimmed}</div>;
        }
        // Bold text **like this**
        const parts = trimmed.split(/(\*\*[^*]+\*\*)/);
        return (
          <div key={i}>
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j}>{part.slice(2, -2)}</strong>;
              }
              return <span key={j}>{part}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
}
