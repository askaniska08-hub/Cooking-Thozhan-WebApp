import { motion } from 'framer-motion';
import { Heart, ArrowLeft } from 'lucide-react';
import type { Recipe, RecipeWithMatch } from '@/types';
import { RecipeCard } from './RecipeCard';
import { EmptyState } from './EmptyState';
import { RippleButton } from './ui/RippleButton';
import { getIngredientStatus } from '@/utils';

interface FavoritesViewProps {
  recipes: Recipe[];
  favorites: string[];
  recent: string[];
  isLoaded: boolean;
  selected: string[];
  onToggleFavorite: (id: string) => void;
  onView: (recipe: RecipeWithMatch) => void;
  onBack: () => void;
  onAskTara: (recipeName: string) => void;
}

function toWithMatch(r: Recipe, selected: string[]): RecipeWithMatch {
  const status = getIngredientStatus(r.ingredients, selected);
  const stars = status.matchPercentage >= 100 ? 5 : status.matchPercentage >= 70 ? 4 : status.matchPercentage >= 45 ? 3 : 2;
  return {
    ...r,
    matchPercent: status.matchPercentage,
    matched: status.availableIngredients,
    missing: status.missingIngredients,
    stars,
  };
}

export function FavoritesView({
  recipes,
  favorites,
  recent,
  isLoaded,
  selected,
  onToggleFavorite,
  onView,
  onBack,
  onAskTara,
}: FavoritesViewProps) {
  const favRecipes = recipes.filter((r) => favorites.includes(r.id));
  const recentRecipes = recent
    .map((id) => recipes.find((r) => r.id === id))
    .filter((r): r is Recipe => Boolean(r));

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center gap-3">
        <RippleButton onClick={onBack} className="btn-ghost px-3 py-2 text-sm">
          <ArrowLeft size={16} /> Back
        </RippleButton>
        <h2 className="font-display text-3xl font-extrabold text-ink dark:text-white">
          <Heart size={26} className="mr-2 inline fill-red-500 text-red-500" />
          Your Favourites
        </h2>
      </div>

      {!isLoaded ? (
        <div className="flex items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white/60 px-6 py-16 text-center dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading your favourites…</p>
          </div>
        </div>
      ) : favRecipes.length === 0 ? (
        <EmptyState
          variant="favorites"
          onReset={onBack}
          title="No favourites yet"
          message="Tap the heart on any recipe to save it here for quick access later."
          ctaLabel="Browse Recipes"
        />
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {favRecipes.map((r, i) => (
            <RecipeCard
              key={r.id}
              recipe={toWithMatch(r, selected)}
              isFavorite
              onView={() => onView(toWithMatch(r, selected))}
              onToggleFavorite={() => onToggleFavorite(r.id)}
              onAskTara={() => onAskTara(r.name)}
              index={i}
            />
          ))}
        </motion.div>
      )}

      {recentRecipes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12"
        >
          <h3 className="mb-4 flex items-center gap-2 font-display text-2xl font-bold text-ink dark:text-white">
            <span aria-hidden>🕑</span> Recently Viewed
          </h3>
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recentRecipes.map((r, i) => (
              <RecipeCard
                key={r.id}
                recipe={toWithMatch(r, selected)}
                isFavorite={favorites.includes(r.id)}
                onView={() => onView(toWithMatch(r, selected))}
                onToggleFavorite={() => onToggleFavorite(r.id)}
                onAskTara={() => onAskTara(r.name)}
                index={i}
              />
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}
