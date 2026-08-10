import { motion } from 'framer-motion';
import { Sprout, ShoppingBasket, Clock, Repeat, Flame, Wheat } from 'lucide-react';
import type { PlannerResult } from '@/types';

interface PlannerSummaryProps {
  result: PlannerResult;
}

export function PlannerSummary({ result }: PlannerSummaryProps) {
  const { weeklySummary: s } = result;

  const stats: { label: string; value: string; icon: typeof Sprout; color: string; bgColor: string }[] = [
    {
      label: 'Pantry Utilization',
      value: `${s.pantryUtilizationPercent}%`,
      icon: Sprout,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-500/10',
    },
    {
      label: 'Items to Buy',
      value: `${s.itemsToBuy}`,
      icon: ShoppingBasket,
      color: 'from-orange-400 to-amber-500',
      bgColor: 'bg-orange-50 dark:bg-orange-500/10',
    },
    {
      label: 'Avg Cook Time',
      value: `~${s.avgCookingTime} min`,
      icon: Clock,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      label: 'Meal Variety',
      value: `${s.uniqueRecipes} dishes`,
      icon: Repeat,
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-500/10',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl px-4 sm:px-6"
    >
      <div className="glass-strong rounded-3xl p-5 shadow-card sm:p-6">
        <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold text-ink dark:text-white">
          <Sprout size={20} className="text-accent" /> Your Weekly Plan
        </h3>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className={`rounded-2xl ${stat.bgColor} p-4 text-center`}
              >
                <div className={`mx-auto mb-2 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow`}>
                  <Icon size={18} />
                </div>
                <p className="font-display text-2xl font-extrabold text-ink dark:text-white">{stat.value}</p>
                <p className="mt-0.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Nutrition averages */}
        {(s.avgCaloriesPerDay !== null || s.avgProteinPerDay !== null || s.avgFiberPerDay !== null) && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-gray-50 p-3 dark:bg-white/5">
            {s.avgCaloriesPerDay !== null && (
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ink dark:text-white">
                <Flame size={15} className="text-orange-500" /> ~{s.avgCaloriesPerDay} kcal/day
              </span>
            )}
            {s.avgProteinPerDay !== null && (
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ink dark:text-white">
                <Sprout size={15} className="text-green-500" /> ~{s.avgProteinPerDay}g protein/day
              </span>
            )}
            {s.avgFiberPerDay !== null && (
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ink dark:text-white">
                <Wheat size={15} className="text-amber-500" /> ~{s.avgFiberPerDay}g fiber/day
              </span>
            )}
            <span className="text-[10px] text-gray-400">Estimated nutrition</span>
          </div>
        )}

        {/* Unused ingredients */}
        {result.unusedAvailableIngredients.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10"
          >
            <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
              🥬 {result.unusedAvailableIngredients.length} ingredient{result.unusedAvailableIngredients.length === 1 ? '' : 's'} remain unused
            </p>
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400/80">
              {result.unusedAvailableIngredients.slice(0, 6).join(' • ')}
              {result.unusedAvailableIngredients.length > 6 && ` +${result.unusedAvailableIngredients.length - 6} more`}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
