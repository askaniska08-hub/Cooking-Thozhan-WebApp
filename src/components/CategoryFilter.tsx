import { motion } from 'framer-motion';
import { CATEGORY_META } from '@/data/ingredients';
import type { IngredientCategory } from '@/types';
import { cn } from '@/utils';

interface CategoryFilterProps {
  active: IngredientCategory | 'All';
  onChange: (c: IngredientCategory | 'All') => void;
  counts: Record<string, number>;
}

export function CategoryFilter({ active, onChange, counts }: CategoryFilterProps) {
  const tabs: { key: IngredientCategory | 'All'; label: string; emoji: string }[] = [
    { key: 'All', label: 'All', emoji: '🍽️' },
    ...CATEGORY_META,
  ];

  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
      {tabs.map((t) => {
        const isActive = active === t.key;
        const count = t.key === 'All' ? Object.values(counts).reduce((a, b) => a + b, 0) : counts[t.key] ?? 0;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={cn(
              'relative flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition',
              isActive ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300',
            )}
            aria-pressed={isActive}
          >
            {isActive && (
              <motion.span
                layoutId="cat-pill"
                className="absolute inset-0 -z-10 rounded-full bg-primary shadow-glow"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span aria-hidden>{t.emoji}</span>
            {t.label}
            <span className={cn('rounded-full px-1.5 text-[10px]', isActive ? 'bg-white/25' : 'bg-black/10 dark:bg-white/10')}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
