import { motion } from 'framer-motion';
import { Recycle, IndianRupee, Sprout, ShoppingBasket } from 'lucide-react';
import type { PlannerResult } from '@/types';

interface PlannerSummaryProps {
  result: PlannerResult;
}

export function PlannerSummary({ result }: PlannerSummaryProps) {
  const stats = [
    {
      label: 'Food Waste Saved',
      value: `${result.wasteSavedPercent}%`,
      icon: Recycle,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-500/10',
    },
    {
      label: 'Grocery Savings',
      value: `₹${result.grocerySavingsRs}`,
      icon: IndianRupee,
      color: 'from-orange-400 to-amber-500',
      bgColor: 'bg-orange-50 dark:bg-orange-500/10',
    },
    {
      label: 'Ingredients Utilized',
      value: `${result.ingredientsUtilizedPercent}%`,
      icon: Sprout,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      label: 'Extra to Buy',
      value: `${result.extraIngredientsNeeded}`,
      icon: ShoppingBasket,
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
          <Recycle size={20} className="text-accent" /> Your Plan Impact
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

        {/* Unused ingredients warning */}
        {result.unusedAvailableIngredients.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10"
          >
            <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
              🥔 You still have: {result.unusedAvailableIngredients.slice(0, 6).join(', ')}
              {result.unusedAvailableIngredients.length > 6 && ` +${result.unusedAvailableIngredients.length - 6} more`}
            </p>
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400/80">
              These ingredients weren't used. Try regenerating to include them!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
