import { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import type { PlannerConfig, PlannerResult, RecipeWithMatch, MealType } from '@/types';
import { generateMealPlan, regenerateSingleMeal, swapDish } from '@/services/mealPlanner';
import { PlannerSetup } from './PlannerSetup';
import { PlannerResults } from './PlannerResults';
import { PlannerSummary } from './PlannerSummary';
import { ShoppingList } from './ShoppingList';

export const DEFAULT_PLANNER_CONFIG: PlannerConfig = {
  goal: 'balanced',
  duration: 3,
  meals: ['Breakfast', 'Lunch', 'Dinner'],
  servings: 2,
  useAvailableIngredients: true,
  dietType: 'veg',
  nutritionPrefs: [],
  exclusions: [],
  customExclusions: [],
};

export type PlannerPhase = 'setup' | 'loading' | 'results';

export interface PlannerPersistedState {
  config: PlannerConfig;
  phase: PlannerPhase;
  result: PlannerResult | null;
  forceInclude: string[];
}

export function createInitialPlannerState(): PlannerPersistedState {
  return {
    config: { ...DEFAULT_PLANNER_CONFIG },
    phase: 'setup',
    result: null,
    forceInclude: [],
  };
}

interface MealPlannerViewProps {
  availableIngredients: string[];
  onViewRecipe: (recipe: RecipeWithMatch) => void;
  onBack: () => void;
  onSelectIngredients: () => void;
  state: PlannerPersistedState;
  setState: (updater: (prev: PlannerPersistedState) => PlannerPersistedState) => void;
}

export function MealPlannerView({ availableIngredients, onViewRecipe, onBack, onSelectIngredients, state, setState }: MealPlannerViewProps) {
  const { config, phase, result, forceInclude } = state;
  const resultsRef = useRef<HTMLDivElement>(null);

  const update = useCallback(
    (patch: Partial<PlannerPersistedState>) => {
      setState((prev) => ({ ...prev, ...patch }));
    },
    [setState],
  );

  // Scroll to results heading ONLY on loading→results transition (not on remount)
  const prevPhase = useRef<PlannerPhase>(phase);
  useEffect(() => {
    if (prevPhase.current !== 'results' && phase === 'results' && resultsRef.current) {
      const timer = setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(timer);
    }
    prevPhase.current = phase;
  }, [phase]);

  const handleGenerate = useCallback(() => {
    update({ phase: 'loading' });
    const ingredients = config.useAvailableIngredients ? availableIngredients : [];
    setTimeout(() => {
      const plan = generateMealPlan(config, ingredients, forceInclude);
      update({ phase: 'results', result: plan });
    }, 1600);
  }, [config, availableIngredients, forceInclude, update]);

  const handleRegenerate = useCallback(() => {
    const newForce = result && result.unusedAvailableIngredients.length > 0 ? result.unusedAvailableIngredients : forceInclude;
    update({ phase: 'loading', forceInclude: newForce });
    const ingredients = config.useAvailableIngredients ? availableIngredients : [];
    setTimeout(() => {
      const plan = generateMealPlan(config, ingredients, newForce);
      update({ phase: 'results', result: plan });
    }, 1400);
  }, [config, availableIngredients, forceInclude, result, update]);

  const handleRegenerateMeal = useCallback(
    (dayIndex: number, mealType: MealType) => {
      if (!result) return;
      const ingredients = config.useAvailableIngredients ? availableIngredients : [];
      const newDays = regenerateSingleMeal(config, ingredients, dayIndex, mealType, result.days, forceInclude);
      update({ result: { ...result, days: newDays } });
    },
    [config, availableIngredients, result, forceInclude, update],
  );

  const handleSwapDish = useCallback(
    (dayIndex: number, mealType: MealType, dishIndex: number) => {
      if (!result) return;
      const ingredients = config.useAvailableIngredients ? availableIngredients : [];
      const newDays = swapDish(config, ingredients, dayIndex, mealType, dishIndex, result.days);
      update({ result: { ...result, days: newDays } });
    },
    [config, availableIngredients, result, update],
  );

  const loadingMessages = useMemo(
    () => [
      'Analyzing your ingredients...',
      'Finding the best recipe combinations...',
      'Optimizing for food waste reduction...',
      'Building your personalized plan...',
    ],
    [],
  );

  return (
    <div className="min-h-screen pb-12">
      {/* Top bar */}
      <div className="sticky top-[64px] z-30 glass-strong border-b border-black/5 dark:border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <button onClick={onBack} className="btn-ghost flex items-center gap-1.5 px-3 py-2 text-sm">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            <span className="font-display text-sm font-extrabold text-ink dark:text-white">AI Meal Planner</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'setup' && (
          <motion.div key="setup" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
            <PlannerSetup
              config={config}
              onChange={(c) => update({ config: c })}
              onGenerate={handleGenerate}
              availableIngredientCount={availableIngredients.length}
              onSelectIngredients={onSelectIngredients}
            />
          </motion.div>
        )}

        {phase === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[60vh] flex-col items-center justify-center px-4"
          >
            <LoadingAnimation messages={loadingMessages} />
          </motion.div>
        )}

        {phase === 'results' && result && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div ref={resultsRef} className="scroll-mt-[140px]">
              {/* Summary at top */}
              <div className="pt-6">
                <PlannerSummary result={result} />
              </div>
            </div>

            {/* Day-by-day plan */}
            <PlannerResults
              days={result.days}
              onViewRecipe={onViewRecipe}
              onRegenerate={handleRegenerate}
              onRegenerateMeal={handleRegenerateMeal}
              onSwapDish={handleSwapDish}
              config={config}
            />

            {/* Shopping list */}
            <ShoppingList items={result.shoppingList} />

            {/* Regenerate button at bottom */}
            <div className="flex justify-center pb-4">
              <button onClick={handleRegenerate} className="btn-primary flex items-center gap-2 px-6 py-3 text-sm">
                <Sparkles size={16} /> Regenerate Plan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LoadingAnimation({ messages }: { messages: string[] }) {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % messages.length);
    }, 800);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Animated ring */}
      <div className="relative h-24 w-24">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-3 rounded-full border-4 border-accent/20 border-b-accent"
        />
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-3xl">🍳</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={msgIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 font-display text-sm font-semibold text-gray-600 dark:text-gray-300"
        >
          <Loader2 size={14} className="animate-spin text-primary" />
          {messages[msgIdx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
