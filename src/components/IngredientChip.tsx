import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import type { Ingredient } from '@/types';
import { cn } from '@/utils';

interface IngredientChipProps {
  ingredient: Ingredient;
  selected: boolean;
  onToggle: (name: string) => void;
}

export function IngredientChip({ ingredient, selected, onToggle }: IngredientChipProps) {
  return (
    <motion.button
      layout
      whileTap={{ scale: 0.92 }}
      onClick={() => onToggle(ingredient.name)}
      aria-pressed={selected}
      aria-label={`${selected ? 'Remove' : 'Add'} ${ingredient.name}`}
      className={cn(
        'group flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-sm font-semibold transition-all duration-200',
        selected
          ? 'border-primary bg-primary/15 text-primary-600 shadow-glow dark:text-primary'
          : 'border-gray-200 bg-white text-gray-700 hover:border-primary hover:bg-primary/5 hover:shadow-soft dark:border-white/10 dark:bg-white/5 dark:text-gray-200',
      )}
    >
      <span className="text-lg" aria-hidden>{ingredient.emoji}</span>
      <span className="flex-1 text-left">{ingredient.name}</span>
      <span
        className={cn(
          'grid h-5 w-5 place-items-center rounded-full transition',
          selected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-primary/20 dark:bg-white/10',
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {selected ? (
            <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Check size={13} />
            </motion.span>
          ) : (
            <motion.span key="p" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Plus size={13} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}
