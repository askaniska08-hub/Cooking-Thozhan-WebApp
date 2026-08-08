import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Flame, ChefHat, ArrowRight, RefreshCw, Repeat, AlertCircle } from 'lucide-react';
import type { PlannedDay, MealType, RecipeWithMatch, PlannedDish, PlannerConfig } from '@/types';
import { getMealEmoji } from '@/services/mealPlanner';
import { roleLabel } from '@/data/mealRoles';
import { cn } from '@/utils';

interface PlannerResultsProps {
  days: PlannedDay[];
  onViewRecipe: (recipe: RecipeWithMatch) => void;
  onRegenerate: () => void;
  onRegenerateMeal: (dayIndex: number, mealType: MealType) => void;
  onSwapDish: (dayIndex: number, mealType: MealType, dishIndex: number) => void;
  config: PlannerConfig;
}

const diffColor: Record<string, string> = {
  Easy: 'text-accent bg-accent/10',
  Medium: 'text-amber-600 bg-amber-100 dark:bg-amber-500/15',
  Hard: 'text-red-600 bg-red-100 dark:bg-red-500/15',
};

const MEAL_ORDER: MealType[] = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

export function PlannerResults({ days, onViewRecipe, onRegenerate, onRegenerateMeal, onSwapDish }: PlannerResultsProps) {
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
                <MealCard
                  key={mealType}
                  dayIndex={dayIdx}
                  mealType={mealType}
                  meal={meal}
                  onViewRecipe={onViewRecipe}
                  onRegenerateMeal={onRegenerateMeal}
                  onSwapDish={onSwapDish}
                />
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* Regenerate full plan */}
      <div className="flex justify-center pt-2">
        <button onClick={onRegenerate} className="btn-ghost flex items-center gap-2 px-6 py-3 text-sm">
          <ArrowRight size={16} className="text-primary" /> Regenerate Full Plan
        </button>
      </div>
    </div>
  );
}

interface MealCardProps {
  dayIndex: number;
  mealType: MealType;
  meal: PlannedDay['meals'][MealType];
  onViewRecipe: (recipe: RecipeWithMatch) => void;
  onRegenerateMeal: (dayIndex: number, mealType: MealType) => void;
  onSwapDish: (dayIndex: number, mealType: MealType, dishIndex: number) => void;
}

function MealCard({ dayIndex, mealType, meal, onViewRecipe, onRegenerateMeal, onSwapDish }: MealCardProps) {
  const [swapping, setSwapping] = useState<number | null>(null);

  if (!meal) return null;

  const handleSwap = (dishIndex: number) => {
    setSwapping(dishIndex);
    setTimeout(() => {
      onSwapDish(dayIndex, mealType, dishIndex);
      setSwapping(null);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative mb-4"
    >
      {/* Timeline dot */}
      <div className="absolute -left-[31px] top-5 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/15" />

      <div className="glass rounded-2xl p-4 shadow-soft transition hover:shadow-card">
        {/* Meal header row */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wide text-primary">
            {getMealEmoji(mealType)} {mealType}
          </span>
          <div className="flex items-center gap-2">
            {!meal.isComplete && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
                <AlertCircle size={10} /> Needs accompaniment
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              <Clock size={10} /> ~{meal.totalTime} min
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
              {meal.overallMatchPercent}% match
            </span>
            <button
              onClick={() => onRegenerateMeal(dayIndex, mealType)}
              className="rounded-lg p-1 text-gray-400 transition hover:bg-primary/10 hover:text-primary"
              title="Regenerate this meal"
            >
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        {/* Dishes */}
        <div className="space-y-2">
          {meal.dishes.map((dish, dishIdx) => (
            <DishRow
              key={dish.recipe.id}
              dish={dish}
              dishIndex={dishIdx}
              isSwapping={swapping === dishIdx}
              onViewRecipe={onViewRecipe}
              onSwap={() => handleSwap(dishIdx)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function DishRow({
  dish,
  dishIndex,
  isSwapping,
  onViewRecipe,
  onSwap,
}: {
  dish: PlannedDish;
  dishIndex: number;
  isSwapping: boolean;
  onViewRecipe: (recipe: RecipeWithMatch) => void;
  onSwap: () => void;
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-3 transition-all',
        dishIndex === 0
          ? 'border-primary/20 bg-primary/5'
          : 'border-gray-100 bg-white dark:border-white/10 dark:bg-white/5',
        isSwapping && 'animate-pulse',
      )}
    >
      {/* Emoji */}
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-2xl shadow-soft dark:bg-white/10">
        {dish.recipe.emoji}
      </span>

      <div className="min-w-0 flex-1">
        {/* Role label */}
        {dishIndex > 0 && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {roleLabel(dish.role)}
          </span>
        )}
        <h4 className="truncate font-display text-sm font-bold text-ink dark:text-white">
          {dish.recipe.name}
        </h4>

        {/* Meta */}
        <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-gray-600 dark:text-gray-300">
          <span className="inline-flex items-center gap-1">
            <Clock size={10} className="text-primary" /> {dish.recipe.time} min
          </span>
          <span className={cn('inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-bold', diffColor[dish.recipe.difficulty])}>
            <Flame size={8} /> {dish.recipe.difficulty}
          </span>
          <span className="font-bold text-primary">{dish.matchPercent}% match</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex shrink-0 flex-col gap-1.5">
        <button
          onClick={() => onViewRecipe({ ...dish.recipe, matchPercent: dish.matchPercent, matched: dish.matched, pantryIngredients: [], missing: dish.missing, stars: 0 })}
          className="btn-ghost rounded-lg px-2.5 py-1.5 text-[11px]"
        >
          <ChefHat size={12} /> View
        </button>
        <button
          onClick={onSwap}
          disabled={isSwapping}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-gray-400 transition hover:bg-accent/10 hover:text-accent disabled:opacity-50"
          title="Swap this dish"
        >
          {isSwapping ? <RefreshCw size={12} className="animate-spin" /> : <Repeat size={12} />} Swap
        </button>
      </div>
    </div>
  );
}
