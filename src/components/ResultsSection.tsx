import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import type { RecipeWithMatch } from '@/types';
import type { MatchBuckets } from '@/hooks/useRecipeMatch';
import { RecipeGrid, SectionHeader } from './RecipeGrid';
import { RecipeCard } from './RecipeCard';
import { EmptyState } from './EmptyState';
import { RippleButton } from './ui/RippleButton';

interface ResultsSectionProps {
  buckets: MatchBuckets;
  favorites: string[];
  onView: (r: RecipeWithMatch) => void;
  onToggleFavorite: (id: string) => void;
  onReset: () => void;
  onAskTara: (recipeName: string) => void;
  onAddIngredients: () => void;
}

export function ResultsSection({ buckets, favorites, onView, onToggleFavorite, onReset, onAskTara, onAddIngredients }: ResultsSectionProps) {
  if (buckets.total === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <EmptyState onReset={onReset} onAddIngredients={onAddIngredients} />
      </section>
    );
  }

  return (
    <section id="results" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h2 className="font-display text-3xl font-extrabold text-ink dark:text-white sm:text-4xl">
          🎉 We found <span className="text-primary">{buckets.total}</span> matching {buckets.total === 1 ? 'recipe' : 'recipes'} for you!
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Sorted by how many ingredients you already have.</p>
        <RippleButton onClick={onReset} className="btn-ghost mt-4 px-4 py-2 text-sm">
          <RotateCcw size={15} /> Reset ingredients
        </RippleButton>
      </motion.div>

      <div className="space-y-10">
        {buckets.perfect.length > 0 && (
          <div>
            <SectionHeader
              emoji="⭐"
              title="Perfect Matches"
              subtitle="You have everything — cook now!"
              count={buckets.perfect.length}
            />
            <RecipeGrid>
              {buckets.perfect.map((r, i) => (
                <RecipeCard key={r.id} recipe={r} isFavorite={favorites.includes(r.id)} onView={() => onView(r)} onToggleFavorite={() => onToggleFavorite(r.id)} onAskTara={() => onAskTara(r.name)} index={i} />
              ))}
            </RecipeGrid>
          </div>
        )}

        {buckets.great.length > 0 && (
          <div>
            <SectionHeader
              emoji="⭐⭐"
              title="Great Matches"
              subtitle="Almost there — a quick shop and you're set."
              count={buckets.great.length}
            />
            <RecipeGrid>
              {buckets.great.map((r, i) => (
                <RecipeCard key={r.id} recipe={r} isFavorite={favorites.includes(r.id)} onView={() => onView(r)} onToggleFavorite={() => onToggleFavorite(r.id)} onAskTara={() => onAskTara(r.name)} index={i} />
              ))}
            </RecipeGrid>
          </div>
        )}

        {buckets.tryAlso.length > 0 && (
          <div>
            <SectionHeader
              emoji="💡"
              title="You can try"
              subtitle="A few ingredients short, but worth it."
              count={buckets.tryAlso.length}
            />
            <RecipeGrid>
              {buckets.tryAlso.map((r, i) => (
                <RecipeCard key={r.id} recipe={r} isFavorite={favorites.includes(r.id)} onView={() => onView(r)} onToggleFavorite={() => onToggleFavorite(r.id)} onAskTara={() => onAskTara(r.name)} index={i} />
              ))}
            </RecipeGrid>
          </div>
        )}
      </div>
    </section>
  );
}
