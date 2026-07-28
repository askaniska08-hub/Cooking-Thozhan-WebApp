import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Sparkles } from 'lucide-react';
import { INGREDIENTS, CATEGORY_META } from '@/data/ingredients';
import type { IngredientCategory } from '@/types';
import { SearchBar } from './SearchBar';
import { CategoryFilter } from './CategoryFilter';
import { SelectedPills } from './SelectedPills';
import { IngredientChip } from './IngredientChip';
import { RippleButton } from './ui/RippleButton';

interface IngredientSelectorProps {
  selected: string[];
  onToggle: (name: string) => void;
  onClear: () => void;
  onFind: () => void;
}

export function IngredientSelector({ selected, onToggle, onClear, onFind }: IngredientSelectorProps) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<IngredientCategory | 'All'>('All');

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    INGREDIENTS.forEach((i) => {
      c[i.category] = (c[i.category] ?? 0) + 1;
    });
    return c;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return INGREDIENTS.filter((i) => {
      const matchQ = !q || i.name.toLowerCase().includes(q);
      const matchC = activeCat === 'All' || i.category === activeCat;
      return matchQ && matchC;
    });
  }, [query, activeCat]);

  const grouped = useMemo(() => {
    if (activeCat !== 'All' || query) return null;
    const map = new Map<IngredientCategory, typeof INGREDIENTS>();
    INGREDIENTS.forEach((i) => {
      if (!map.has(i.category)) map.set(i.category, []);
      map.get(i.category)!.push(i);
    });
    return map;
  }, [activeCat, query]);

  return (
    <section id="ingredients" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-6 text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
          <SlidersHorizontal size={14} /> Step 1 · Pick your ingredients
        </span>
        <h2 className="mt-3 font-display text-3xl font-extrabold text-ink dark:text-white sm:text-4xl">
          What&apos;s in your kitchen?
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Tap ingredients to add them. The more you add, the better we match.</p>
      </motion.div>

      <div className="space-y-4">
        <SearchBar value={query} onChange={setQuery} placeholder="Search ingredients (e.g. egg, tomato, rice)…" onClear={() => setQuery('')} />

        <SelectedPills selected={selected} ingredients={INGREDIENTS} onRemove={onToggle} onClear={onClear} />

        <CategoryFilter active={activeCat} onChange={setActiveCat} counts={counts} />

        <div className="glass-strong rounded-3xl p-4 sm:p-5">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              <div className="mb-2 text-4xl">🔍</div>
              No ingredients match &ldquo;{query}&rdquo;
            </div>
          ) : grouped ? (
            <div className="space-y-6">
              {CATEGORY_META.map((cat) => {
                const items = grouped.get(cat.key);
                if (!items || items.length === 0) return null;
                return (
                  <div key={cat.key}>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      <span className="text-lg" aria-hidden>{cat.emoji}</span> {cat.label}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {items.map((ing) => (
                        <IngredientChip key={ing.name} ingredient={ing} selected={selectedSet.has(ing.name)} onToggle={onToggle} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filtered.map((ing) => (
                <IngredientChip key={ing.name} ingredient={ing} selected={selectedSet.has(ing.name)} onToggle={onToggle} />
              ))}
            </div>
          )}
        </div>

        <div className="sticky bottom-4 z-20 flex justify-center">
          <RippleButton
            onClick={onFind}
            disabled={selected.length === 0}
            className="btn-primary px-8 py-3.5 text-base shadow-glow"
          >
            <Sparkles size={18} />
            {selected.length === 0 ? 'Select ingredients to continue' : `Find Recipes · ${selected.length} selected`}
          </RippleButton>
        </div>
      </div>
    </section>
  );
}
