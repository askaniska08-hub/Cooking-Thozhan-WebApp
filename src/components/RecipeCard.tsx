import { motion } from 'framer-motion';
import { Clock, Flame, Users, Heart, ChefHat, CheckCircle2, AlertCircle, MessageCircle } from 'lucide-react';
import type { RecipeWithMatch } from '@/types';
import { MatchRing } from './ui/MatchRing';
import { Stars } from './ui/Stars';
import { RippleButton } from './ui/RippleButton';
import { pluralize } from '@/utils';
import { cn } from '@/utils';

interface RecipeCardProps {
  recipe: RecipeWithMatch;
  isFavorite: boolean;
  onView: () => void;
  onToggleFavorite: () => void;
  onAskTara: () => void;
  index: number;
}

const diffColor: Record<string, string> = {
  Easy: 'text-accent bg-accent/10',
  Medium: 'text-amber-600 bg-amber-100 dark:bg-amber-500/15',
  Hard: 'text-red-600 bg-red-100 dark:bg-red-500/15',
};

export function RecipeCard({ recipe, isFavorite, onView, onToggleFavorite, onAskTara, index }: RecipeCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-soft transition-shadow hover:shadow-card dark:border-white/10 dark:bg-white/5"
    >
      {/* Header band */}
      <div className="relative flex items-center justify-between gap-3 bg-gradient-to-br from-primary/15 via-cream to-accent/10 p-4 dark:from-primary/20 dark:to-accent/10">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-3xl shadow-soft dark:bg-white/10" aria-hidden>
            {recipe.emoji}
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-display text-lg font-bold text-ink dark:text-white">{recipe.name}</h3>
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">{recipe.category}</span>
          </div>
        </div>
        <MatchRing percent={recipe.matchPercent} />
      </div>

      <div className="flex flex-1 flex-col p-4">
        {/* Meta: time, difficulty, servings, stars */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
          <span className="inline-flex items-center gap-1.5">
            <Clock size={15} className="text-primary" /> {recipe.time} min
          </span>
          <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-bold', diffColor[recipe.difficulty])}>
            <Flame size={13} /> {recipe.difficulty}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users size={15} className="text-primary" /> {pluralize(recipe.servings, 'serving')}
          </span>
          <Stars count={recipe.stars} size={14} />
        </div>

        {/* Description */}
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {recipe.description}
        </p>

        {/* Missing ingredients */}
        <div className="mt-3">
          {recipe.missing.length === 0 ? (
            <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              <CheckCircle2 size={15} /> All ingredients ready!
            </p>
          ) : (
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                <AlertCircle size={13} /> Missing {pluralize(recipe.missing.length, 'item')}:
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {recipe.missing.slice(0, 4).map((m) => (
                  <span key={m} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-white/10 dark:text-gray-300">
                    {m}
                  </span>
                ))}
                {recipe.missing.length > 4 && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500 dark:bg-white/10 dark:text-gray-400">
                    +{recipe.missing.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 pt-2">
          <RippleButton onClick={onView} className="btn-primary flex-1 px-4 py-2.5 text-sm">
            <ChefHat size={16} /> View Recipe
          </RippleButton>
          <button
            onClick={onAskTara}
            aria-label={`Ask Chef Tara about ${recipe.name}`}
            className="grid h-10 w-10 place-items-center rounded-full border border-primary/30 bg-primary/5 text-primary transition hover:bg-primary/10"
          >
            <MessageCircle size={18} />
          </button>
          <button
            onClick={onToggleFavorite}
            aria-label={isFavorite ? `Remove ${recipe.name} from favourites` : `Add ${recipe.name} to favourites`}
            aria-pressed={isFavorite}
            className={cn(
              'grid h-10 w-10 place-items-center rounded-full border transition',
              isFavorite
                ? 'border-red-200 bg-red-50 text-red-500 dark:border-red-500/30 dark:bg-red-500/10'
                : 'border-gray-200 bg-white text-gray-400 hover:border-red-300 hover:text-red-400 dark:border-white/10 dark:bg-white/5',
            )}
          >
            <Heart size={18} className={isFavorite ? 'fill-red-500' : ''} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
