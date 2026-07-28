import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SectionHeaderProps {
  emoji: string;
  title: string;
  subtitle: string;
  count: number;
}

export function SectionHeader({ emoji, title, subtitle, count }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 dark:border-white/10"
    >
      <h3 className="flex items-center gap-2 font-display text-xl font-extrabold text-ink dark:text-white sm:text-2xl">
        <span aria-hidden>{emoji}</span> {title}
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-sm font-bold text-primary">{count}</span>
      </h3>
      <span className="hidden text-sm text-gray-500 dark:text-gray-400 sm:block">{subtitle}</span>
    </motion.div>
  );
}

interface RecipeGridProps {
  children: ReactNode;
}

export function RecipeGrid({ children }: RecipeGridProps) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{children}</div>;
}
