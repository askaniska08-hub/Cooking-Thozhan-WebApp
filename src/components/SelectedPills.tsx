import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';
import type { Ingredient } from '@/types';

interface SelectedPillsProps {
  selected: string[];
  ingredients: Ingredient[];
  onRemove: (name: string) => void;
  onClear: () => void;
}

const emojiByName = (name: string, list: Ingredient[]) =>
  list.find((i) => i.name === name)?.emoji ?? '🥄';

export function SelectedPills({ selected, ingredients, onRemove, onClear }: SelectedPillsProps) {
  return (
    <AnimatePresence>
      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="glass rounded-2xl p-3 sm:p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Selected ingredients · {selected.length}
              </span>
              <button
                onClick={onClear}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300"
              >
                <RotateCcw size={12} /> Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {selected.map((name) => (
                  <motion.span
                    key={name}
                    layout
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-white shadow-soft"
                  >
                    <span aria-hidden>{emojiByName(name, ingredients)}</span>
                    {name}
                    <button
                      onClick={() => onRemove(name)}
                      className="grid h-4 w-4 place-items-center rounded-full bg-white/25 hover:bg-white/40"
                      aria-label={`Remove ${name}`}
                    >
                      <X size={11} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
