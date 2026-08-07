import { motion } from 'framer-motion';
import { Clock, Flame, ChefHat, ArrowRight } from 'lucide-react';
import type { PlannedDay, MealType, RecipeWithMatch } from '@/types';
import { getMealEmoji } from '@/services/mealPlanner';
import { cn } from '@/utils';

interface PlannerResultsProps {
  days: PlannedDay[];
  onViewRecipe: (recipe: RecipeWithMatch) => void;
  onRegenerate: () => void;
}

const diffColor: Record<string, string> = {
  Easy: 'text-accent bg-accent/10',
  Medium: 'text-amber-600 bg-amber-100 dark:bg-amber-500/15',
  Hard: 'text-red-600 bg-red-100 dark:bg-red-500/15',
};

const MEAL_ORDER: MealType[] = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

export function PlannerResults({ days, onViewRecipe, onRegenerate }: PlannerResultsProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {days.map((day, dayIdx) => (
        <motion.div
          key={dayIdx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: dayIdx * 0.1, duration: 0.4 }}
          className="mb-6"
        >
          {/* Day header */}
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-glow">
              <span className="font-display text-lg font-extrabold">{dayIdx + 1}</span>
            </div>
            <div>
              <h3 className="font-display text-xl font-extrabold text-ink dark:text-white">{day.dayLabel}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {day.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
            </div>
          </div>

          {/* Meal cards */}
          <div className="relative ml-6 border-l-2 border-primary/20 pl-6">
            {MEAL_ORDER.filter((m) => day.meals[m]).map((mealType) => {
              const meal = day.meals[mealType]!;
              return (
                <motion.div
                  key={mealType}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative mb-4"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-[31px] top-5 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/15" />

                  <div className="glass rounded-2xl p-4 shadow-soft transition hover:shadow-card">
                    <div className="flex items-start gap-3">
                      {/* Emoji */}
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-2xl shadow-soft dark:bg-white/10">
                        {meal.recipe.emoji}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wide text-primary">
                            {getMealEmoji(mealType)} {mealType}
                          </span>
                        </div>
                        <h4 className="truncate font-display text-base font-bold text-ink dark:text-white">
                          {meal.recipe.name}
                        </h4>

                        {/* Meta */}
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 dark:text-gray-300">
                          <span className="inline-flex items-center gap-1">
                            <Clock size={12} className="text-primary" /> {meal.recipe.time} min
                          </span>
                          <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold', diffColor[meal.recipe.difficulty])}>
                            <Flame size={10} /> {meal.recipe.difficulty}
                          </span>
                          <span className="inline-flex items-center gap-1 font-bold text-primary">
                            {meal.matchPercent}% match
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onViewRecipe({ ...meal.recipe, matchPercent: meal.matchPercent, matched: meal.matched, pantryIngredients: [], missing: meal.missing, stars: 0 })}
                        className="btn-ghost shrink-0 rounded-xl px-3 py-2 text-xs"
                      >
                        <ChefHat size={14} /> View
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* Regenerate */}
      <div className="flex justify-center pt-2">
        <button onClick={onRegenerate} className="btn-ghost flex items-center gap-2 px-6 py-3 text-sm">
          <ArrowRight size={16} className="text-primary" /> Regenerate Plan
        </button>
      </div>
    </div>
  );
}
