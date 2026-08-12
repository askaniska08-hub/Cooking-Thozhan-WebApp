import { motion } from 'framer-motion';
import { Sparkles, Check, Leaf, ShoppingBasket, AlertCircle } from 'lucide-react';
import { cn } from '@/utils';
import type { PlannerConfig, PlannerGoal, MealType, DietType, NutritionPref, AllergenExclusion } from '@/types';
import {
  GOAL_META,
  DURATION_META,
  MEAL_META,
  DIET_META,
  NUTRITION_PREF_META,
  ALLERGEN_META,
} from '@/services/mealPlanner';
import { ServingsDropdown } from './ServingsDropdown';

interface PlannerSetupProps {
  config: PlannerConfig;
  onChange: (config: PlannerConfig) => void;
  onGenerate: () => void;
  availableIngredientCount: number;
  onSelectIngredients: () => void;
}

export function PlannerSetup({ config: rawConfig, onChange, onGenerate, availableIngredientCount, onSelectIngredients }: PlannerSetupProps) {
  // Defensive defaults: never crash if a partial/legacy config is passed
  const config: PlannerConfig = {
    goal: rawConfig.goal ?? 'balanced',
    duration: rawConfig.duration ?? 3,
    meals: rawConfig.meals ?? ['Breakfast', 'Lunch', 'Dinner'],
    servings: rawConfig.servings ?? 2,
    useAvailableIngredients: rawConfig.useAvailableIngredients ?? true,
    dietTypes: rawConfig.dietTypes ?? ['veg'],
    nutritionPrefs: rawConfig.nutritionPrefs ?? [],
    exclusions: rawConfig.exclusions ?? [],
    customExclusions: rawConfig.customExclusions ?? [],
  };

  const toggleMeal = (meal: MealType) => {
    const has = config.meals.includes(meal);
    onChange({
      ...config,
      meals: has ? config.meals.filter((m) => m !== meal) : [...config.meals, meal],
    });
  };

  const toggleNutritionPref = (pref: NutritionPref) => {
    const has = config.nutritionPrefs.includes(pref);
    onChange({
      ...config,
      nutritionPrefs: has
        ? config.nutritionPrefs.filter((p) => p !== pref)
        : [...config.nutritionPrefs, pref],
    });
  };

  const toggleExclusion = (allergen: AllergenExclusion) => {
    const has = config.exclusions.includes(allergen);
    onChange({
      ...config,
      exclusions: has
        ? config.exclusions.filter((a) => a !== allergen)
        : [...config.exclusions, allergen],
    });
  };

  const hasNoIngredients = config.useAvailableIngredients && availableIngredientCount === 0;
  const canGenerate = config.meals.length > 0 && !hasNoIngredients;

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
                    : 'No ingredients selected yet'}
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

          {/* Select Ingredients button / empty state */}
          {config.useAvailableIngredients && hasNoIngredients ? (
            <div className="mt-3 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-4 text-center dark:border-amber-500/30 dark:bg-amber-500/10">
              <div className="mb-1 flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
                <AlertCircle size={18} />
                <span className="font-bold text-sm">No ingredients selected yet</span>
              </div>
              <p className="mb-3 text-xs text-amber-600/80 dark:text-amber-400/80">
                Select the ingredients you currently have so we can build a smarter meal plan.
              </p>
              <button
                onClick={onSelectIngredients}
                className="btn-primary inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm"
              >
                <ShoppingBasket size={16} /> Select Ingredients
              </button>
            </div>
          ) : (
            <button
              onClick={onSelectIngredients}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary/30 bg-primary/5 px-4 py-3 font-bold text-primary transition-all hover:border-primary hover:bg-primary/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <ShoppingBasket size={18} /> Select Ingredients
            </button>
          )}
        </Section>
      </div>

      {/* Dietary Preference */}
      <Section title="Dietary Preference" emoji="🥗">
        <div className="flex flex-wrap gap-3">
          {DIET_META.map((d) => {
            const active = config.dietTypes.includes(d.value);
            return (
              <button
                key={d.value}
                onClick={() => {
                  const has = config.dietTypes.includes(d.value);
                  onChange({
                    ...config,
                    dietTypes: has
                      ? config.dietTypes.filter((t) => t !== d.value)
                      : [...config.dietTypes, d.value as DietType],
                  });
                }}
                className={cn(
                  'flex items-center gap-2 rounded-2xl border-2 px-5 py-3 font-bold transition-all',
                  active
                    ? 'border-accent bg-accent/5 text-accent shadow-glow-accent'
                    : 'border-gray-100 bg-white text-gray-400 hover:border-accent/30 dark:border-white/10 dark:bg-white/5',
                )}
              >
                <span className="text-xl">{d.emoji}</span> {d.label}
                {active && <Check size={16} />}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Allergies / Exclusions */}
      <Section title="Allergies & Exclusions" emoji="⚠️">
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
          Recipes containing these will be completely excluded from your plan.
        </p>
        <div className="flex flex-wrap gap-3">
          {ALLERGEN_META.map((a) => {
            const active = config.exclusions.includes(a.value);
            return (
              <button
                key={a.value}
                onClick={() => toggleExclusion(a.value)}
                className={cn(
                  'flex items-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-sm font-bold transition-all',
                  active
                    ? 'border-red-400 bg-red-50 text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400'
                    : 'border-gray-100 bg-white text-gray-400 hover:border-red-200 dark:border-white/10 dark:bg-white/5',
                )}
              >
                <span className="text-lg">{a.emoji}</span> {a.label}
                {active && <Check size={14} />}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Nutrition Preferences */}
      <Section title="Nutrition Priorities" emoji="📊">
        <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
          Select one or more priorities to influence meal ranking.
        </p>
        <div className="flex flex-wrap gap-3">
          {NUTRITION_PREF_META.map((np) => {
            const active = config.nutritionPrefs.includes(np.value);
            return (
              <button
                key={np.value}
                onClick={() => toggleNutritionPref(np.value)}
                className={cn(
                  'flex items-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-sm font-bold transition-all',
                  active
                    ? 'border-primary bg-primary/5 text-primary shadow-glow'
                    : 'border-gray-100 bg-white text-gray-400 hover:border-primary/30 dark:border-white/10 dark:bg-white/5',
                )}
              >
                <span className="text-lg">{np.emoji}</span> {np.label}
                {active && <Check size={14} />}
              </button>
            );
          })}
        </div>
      </Section>

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
        <p className="mt-2 text-center text-sm text-gray-400">
          {hasNoIngredients
            ? 'Select ingredients first to generate a smart meal plan'
            : 'Select at least one meal to continue'}
        </p>
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
