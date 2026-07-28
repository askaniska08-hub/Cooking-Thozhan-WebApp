import { motion } from 'framer-motion';
import { RotateCcw, UtensilsCrossed, Plus } from 'lucide-react';
import { RippleButton } from './ui/RippleButton';

interface EmptyStateProps {
  onReset: () => void;
  title?: string;
  message?: string;
  variant?: 'recipes' | 'favorites';
  ctaLabel?: string;
}

export function EmptyState({
  onReset,
  title = 'No matching dishes found',
  message = 'Try adding more ingredients so we can find recipes for you.',
  variant = 'recipes',
  ctaLabel,
}: EmptyStateProps) {
  const isFavorites = variant === 'favorites';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/60 px-6 py-16 text-center dark:border-white/10 dark:bg-white/5"
    >
      <motion.div
        animate={{ rotate: isFavorites ? [0, -6, 6, 0] : [0, -8, 8, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="text-7xl"
      >
        {isFavorites ? '❤️' : '🍽️'}
      </motion.div>
      <h3 className="mt-4 font-display text-2xl font-bold text-ink dark:text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-gray-600 dark:text-gray-400">{message}</p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {isFavorites ? (
          <RippleButton onClick={onReset} className="btn-primary px-6 py-3">
            <Plus size={18} /> {ctaLabel ?? 'Browse Recipes'}
          </RippleButton>
        ) : (
          <>
            <RippleButton onClick={onReset} className="btn-primary px-6 py-3">
              <Plus size={18} /> Add Ingredients
            </RippleButton>
            <RippleButton onClick={onReset} className="btn-ghost px-6 py-3">
              <RotateCcw size={18} /> Reset
            </RippleButton>
          </>
        )}
      </div>

      {!isFavorites && (
        <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-gray-400">
          <UtensilsCrossed size={13} /> Tip: staples like salt &amp; oil are assumed available.
        </p>
      )}
    </motion.div>
  );
}
