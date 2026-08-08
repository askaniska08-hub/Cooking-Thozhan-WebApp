import { motion } from 'framer-motion';
import { Sparkles, Check, Leaf } from 'lucide-react';
import { cn } from '@/utils';
import type { PlannerConfig, PlannerGoal, MealType } from '@/types';
import { GOAL_META, DURATION_META, MEAL_META } from '@/services/mealPlanner';
import { ServingsDropdown } from './ServingsDropdown';

interface PlannerSetupProps {
  config: PlannerConfig;
  onChange: (config: PlannerConfig) => void;
  onGenerate: () => void;
  availableIngredientCount: number;
}

export function PlannerSetup({ config, onChange, onGenerate, availableIngredientCount }: PlannerSetupProps) {
  const toggleMeal = (meal: MealType) => {
    const has = config.meals.includes(meal);
    onChange({
      ...config,
      meals: has ? config.meals.filter((m) => m !== meal) : [...config.meals, meal],
    });
  };

  const canGenerate = config.meals.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl px-4 py-8 sm:px-6"
    >
      {/* Hero header */}
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
          <Sparkles size={16} /> AI Meal Planner
        </div>
        <h1 className="font-display text-3xl font-extrabold text-ink dark:text-white sm:text-4xl">
          Plan your week, <span className="text-primary">smartly</span>
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-gray-600 dark:text-gray-400">
          Tell us your goal and we'll build a meal plan around what you already have — reducing waste and saving money.
        </p>
      </div>

      {/* Goal selection */}
      <Section title="Choose Your Goal" emoji="🎯">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {(Object.keys(GOAL_META) as PlannerGoal[]).map((goal) => {
            const meta = GOAL_META[goal];
            const active = config.goal === goal;
            return (
              <button
                key={goal}
                onClick={() => onChange({ ...config, goal })}
                className={cn(
                  'group relative flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all duration-200',
                  active
                    ? 'border-primary bg-primary/5 shadow-glow'
                    : 'border-gray-100 bg-white hover:border-primary/30 hover:bg-primary/5 dark:border-white/10 dark:bg-white/5',
                )}
              >
                <span className="text-3xl">{meta.emoji}</span>
                <span className="text-sm font-bold text-ink dark:text-white">{meta.label}</span>
                <span className="text-[11px] leading-tight text-gray-500 dark:text-gray-400">{meta.description}</span>
                {active && (
                  <motion.div
                    layoutId="goal-check"
                    className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-primary text-white shadow"
                  >
                    <Check size={14} />
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Duration */}
      <Section title="Plan Duration" emoji="📅">
        <div className="flex flex-wrap gap-3">
          {DURATION_META.map((d) => (
            <button
              key={d.value}
              onClick={() => onChange({ ...config, duration: d.value })}
              className={cn(
                'flex items-center gap-2 rounded-2xl border-2 px-5 py-3 font-bold transition-all',
                config.duration === d.value
                  ? 'border-primary bg-primary/5 text-primary shadow-glow'
                  : 'border-gray-100 bg-white text-ink hover:border-primary/30 dark:border-white/10 dark:bg-white/5 dark:text-white',
              )}
            >
              <span className="text-xl">{d.emoji}</span> {d.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Meals */}
      <Section title="Meals to Include" emoji="🍽">
        <div className="flex flex-wrap gap-3">
          {MEAL_META.map((m) => {
            const active = config.meals.includes(m.value);
            return (
              <button
                key={m.value}
                onClick={() => toggleMeal(m.value)}
                className={cn(
                  'flex items-center gap-2 rounded-2xl border-2 px-5 py-3 font-bold transition-all',
                  active
                    ? 'border-accent bg-accent/5 text-accent shadow-glow-accent'
                    : 'border-gray-100 bg-white text-gray-400 hover:border-accent/30 dark:border-white/10 dark:bg-white/5',
                )}
              >
                <span className="text-xl">{m.emoji}</span> {m.label}
                {active && <Check size={16} />}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Servings + Ingredients toggle */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Section title="Number of Servings" emoji="👥">
          <ServingsDropdown
            value={config.servings}
            onChange={(v) => onChange({ ...config, servings: v })}
          />
        </Section>

        <Section title="Use Available Ingredients" emoji="🥬">
          <button
            onClick={() => onChange({ ...config, useAvailableIngredients: !config.useAvailableIngredients })}
            className={cn(
              'flex w-full items-center justify-between rounded-2xl border-2 p-4 transition-all',
              config.useAvailableIngredients
                ? 'border-accent bg-accent/5'
                : 'border-gray-100 bg-white dark:border-white/10 dark:bg-white/5',
            )}
          >
            <div className="flex items-center gap-3">
              <Leaf size={20} className={config.useAvailableIngredients ? 'text-accent' : 'text-gray-400'} />
              <div className="text-left">
                <p className="font-bold text-ink dark:text-white">
                  {config.useAvailableIngredients ? 'Enabled' : 'Disabled'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {availableIngredientCount > 0
                    ? `${availableIngredientCount} ingredients selected`
                    : 'Select ingredients on the home page'}
                </p>
              </div>
            </div>
            <span
              className={cn(
                'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors',
                config.useAvailableIngredients ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-600',
              )}
            >
              <span
                className={cn(
                  'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
                  config.useAvailableIngredients ? 'translate-x-5' : 'translate-x-0',
                )}
              />
            </span>
          </button>
        </Section>
      </div>

      {/* Generate button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={onGenerate}
          disabled={!canGenerate}
          className="btn-primary flex items-center gap-2 px-8 py-3.5 text-base disabled:opacity-40"
        >
          <Sparkles size={20} /> Generate Meal Plan
        </button>
      </div>
      {!canGenerate && (
        <p className="mt-2 text-center text-sm text-gray-400">Select at least one meal to continue</p>
      )}
    </motion.div>
  );
}

function Section({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-ink dark:text-white">
        <span className="text-xl">{emoji}</span> {title}
      </h2>
      {children}
    </div>
  );
}
