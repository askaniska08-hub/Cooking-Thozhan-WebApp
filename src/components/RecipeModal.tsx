import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Clock, Flame, Users, ArrowLeft, ChefHat, Check, ShoppingBasket,
  Copy, CheckCheck, Heart, ListOrdered, MessageCircle, Share2, Printer,
} from 'lucide-react';
import type { RecipeWithMatch } from '@/types';
import { Stars } from './ui/Stars';
import { RippleButton } from './ui/RippleButton';
import { cn, pluralize, isIngredientAvailable, getMissingIngredients } from '@/utils';

interface RecipeModalProps {
  recipe: RecipeWithMatch | null;
  selectedIngredients: string[];
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
  onCookAnother: () => void;
  onAskTara: () => void;
}

const diffColor: Record<string, string> = {
  Easy: 'text-accent bg-accent/10',
  Medium: 'text-amber-600 bg-amber-100 dark:bg-amber-500/15',
  Hard: 'text-red-600 bg-red-100 dark:bg-red-500/15',
};

export function RecipeModal({ recipe, selectedIngredients, isFavorite, onClose, onToggleFavorite, onCookAnother, onAskTara }: RecipeModalProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const missing = recipe ? getMissingIngredients(recipe.ingredients, selectedIngredients) : [];

  const shoppingText = recipe
    ? `Shopping list for ${recipe.name}:\n${missing.map((m) => `• ${m}`).join('\n')}`
    : '';

  const copyShoppingList = () => {
    if (!recipe || missing.length === 0) return;
    navigator.clipboard?.writeText(shoppingText).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareShoppingList = async () => {
    if (!recipe || missing.length === 0) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Shopping list — ${recipe.name}`, text: shoppingText });
      } catch {
        /* user cancelled */
      }
    } else {
      copyShoppingList();
      setShared(true);
      window.setTimeout(() => setShared(false), 2000);
    }
  };

  const printShoppingList = () => {
    if (!recipe || missing.length === 0) return;
    const win = window.open('', '_blank', 'width=400,height=600');
    if (!win) return;
    win.document.write(`<html><head><title>Shopping List — ${recipe.name}</title><style>body{font-family:system-ui,sans-serif;padding:32px}h1{font-size:20px}ul{font-size:16px;line-height:1.8}</style></head><body><h1>Shopping List — ${recipe.name}</h1><ul>${missing.map((m) => `<li>${m}</li>`).join('')}</ul></body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  useEffect(() => {
    if (!recipe) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [recipe, onClose]);

  return (
    <AnimatePresence>
      {recipe && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/50 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${recipe.name} recipe details`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-card dark:bg-[#1c1c1c] flex flex-col"
          >
            {/* Hero */}
            <div className="relative bg-gradient-to-br from-primary/25 via-cream to-accent/20 p-6 dark:from-primary/25 dark:to-accent/15">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <motion.span
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, delay: 0.1 }}
                    className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white text-4xl shadow-soft dark:bg-white/10"
                    aria-hidden
                  >
                    {recipe.emoji}
                  </motion.span>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wide text-primary">{recipe.category}</span>
                    <h2 className="font-display text-2xl font-extrabold leading-tight text-ink dark:text-white sm:text-3xl">
                      {recipe.name}
                    </h2>
                    <div className="mt-2 flex items-center gap-2">
                      <Stars count={recipe.stars} size={15} />
                      <span className="text-sm font-bold text-primary">{recipe.matchPercent}% match</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/80 text-gray-600 hover:bg-white dark:bg-white/10 dark:text-gray-300"
                  aria-label="Close recipe"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Meta pills */}
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-sm font-semibold text-ink dark:bg-white/10 dark:text-white">
                  <Clock size={15} className="text-primary" /> {recipe.time} min
                </span>
                <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold', diffColor[recipe.difficulty])}>
                  <Flame size={14} /> {recipe.difficulty}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-sm font-semibold text-ink dark:bg-white/10 dark:text-white">
                  <Users size={15} className="text-primary" /> {pluralize(recipe.servings, 'serving')}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Description */}
              <p className="mb-5 rounded-2xl bg-primary/5 p-3 text-sm leading-relaxed text-gray-700 dark:bg-white/5 dark:text-gray-300">
                {recipe.description}
              </p>
              {/* Ingredients */}
              <section>
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink dark:text-white">
                  <ChefHat size={18} className="text-primary" /> Ingredients
                </h3>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {recipe.ingredients.map((ing) => {
                    const have = isIngredientAvailable(ing, selectedIngredients);
                    return (
                      <div
                        key={ing}
                        className={cn(
                          'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium',
                          have
                            ? 'bg-accent/10 text-accent-600 dark:text-accent'
                            : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
                        )}
                      >
                        {have ? <Check size={15} className="shrink-0" /> : <X size={15} className="shrink-0" />}
                        <span className="flex-1">{ing}</span>
                        <span className="text-[10px] font-bold uppercase">{have ? 'Available' : 'Missing'}</span>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Shopping list */}
              {missing.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="flex items-center gap-2 font-display text-base font-bold text-ink dark:text-white">
                      <ShoppingBasket size={16} className="text-primary" /> Shopping List
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">{missing.length}</span>
                    </h4>
                    <div className="flex flex-wrap items-center gap-2">
                      <RippleButton
                        onClick={copyShoppingList}
                        className="btn-ghost gap-1.5 px-3 py-1.5 text-xs"
                      >
                        {copied ? <CheckCheck size={14} className="text-accent" /> : <Copy size={14} />}
                        {copied ? 'Copied!' : 'Copy'}
                      </RippleButton>
                      <RippleButton
                        onClick={shareShoppingList}
                        className="btn-ghost gap-1.5 px-3 py-1.5 text-xs"
                      >
                        {shared ? <CheckCheck size={14} className="text-accent" /> : <Share2 size={14} />}
                        {shared ? 'Sent!' : 'Share'}
                      </RippleButton>
                      <RippleButton
                        onClick={printShoppingList}
                        className="btn-ghost gap-1.5 px-3 py-1.5 text-xs"
                      >
                        <Printer size={14} /> Print
                      </RippleButton>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {missing.join(', ')}
                  </p>
                </motion.section>
              )}

              {/* Steps */}
              <section className="mt-6">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold text-ink dark:text-white">
                  <ListOrdered size={18} className="text-primary" /> How to cook
                </h3>
                <ol className="mt-4 space-y-3">
                  {recipe.steps.map((step, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i + 0.2 }}
                      className="flex gap-3"
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      <p className="pt-0.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{step}</p>
                    </motion.li>
                  ))}
                </ol>
              </section>

              {recipe.tip && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 rounded-2xl bg-accent/10 p-4 text-sm text-accent-600 dark:text-accent"
                >
                  <span className="font-bold">💡 Pro tip: </span>
                  {recipe.tip}
                </motion.div>
              )}
            </div>

            {/* Footer actions */}
            <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 bg-white/80 p-4 backdrop-blur dark:border-white/10 dark:bg-[#1c1c1c]/80">
              <RippleButton onClick={onCookAnother} className="btn-ghost gap-1.5 px-4 py-2.5 text-sm">
                <ArrowLeft size={16} /> Cook Another Dish
              </RippleButton>
              <RippleButton onClick={onAskTara} className="btn-ghost gap-1.5 border border-primary/30 px-4 py-2.5 text-sm hover:bg-primary/10">
                <MessageCircle size={16} /> Ask Tara
              </RippleButton>
              <RippleButton
                onClick={onToggleFavorite}
                className={cn(
                  'btn gap-1.5 px-4 py-2.5 text-sm',
                  isFavorite ? 'bg-red-500 text-white hover:brightness-105' : 'border border-red-200 bg-white text-red-500 dark:border-red-500/30 dark:bg-transparent',
                )}
              >
                <Heart size={16} className={isFavorite ? 'fill-white' : ''} />
                {isFavorite ? 'Saved' : 'Save'}
              </RippleButton>
              <RippleButton onClick={onClose} className="btn-primary ml-auto px-5 py-2.5 text-sm">
                Close
              </RippleButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
