import { useCallback, useMemo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Loader2, Check } from 'lucide-react';
import { cn } from '@/utils';
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
  const mealPlanResultsRef = useRef<HTMLDivElement>(null);
  const plannerTopRef = useRef<HTMLDivElement>(null);
  // Track whether this is a full-plan generation (not a single swap)
  const isFullGeneration = useRef(false);

  const update = useCallback(
    (patch: Partial<PlannerPersistedState>) => {
      setState((prev) => ({ ...prev, ...patch }));
    },
    [setState],
  );

  // 1. Instant scroll-to-top before paint when entering loading phase.
  useLayoutEffect(() => {
    if (phase === 'loading') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [phase]);

  // 2. Re-assert scroll after paint to counter layout shifts from AnimatePresence exit animations.
  useEffect(() => {
    if (phase !== 'loading') return;
    window.scrollTo({ top: 0, behavior: 'auto' });
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 300);
    return () => clearTimeout(timeout);
  }, [phase]);

  // 3. Scroll to top when results appear after a full generation.
  useLayoutEffect(() => {
    if (phase === 'results' && isFullGeneration.current) {
      const raf = requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
      });
      isFullGeneration.current = false;
      return () => cancelAnimationFrame(raf);
    }
  }, [phase]);

  const handleGenerate = useCallback(() => {
    isFullGeneration.current = true;
    window.scrollTo({ top: 0, behavior: 'auto' });
    update({ phase: 'loading' });
    const ingredients = config.useAvailableIngredients ? availableIngredients : [];
    setTimeout(() => {
      const plan = generateMealPlan(config, ingredients, forceInclude);
      update({ phase: 'results', result: plan });
    }, 1600);
  }, [config, availableIngredients, forceInclude, update]);

  const handleRegenerate = useCallback(() => {
    isFullGeneration.current = true;
    window.scrollTo({ top: 0, behavior: 'auto' });
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
      // Single meal swap — NOT a full generation, don't trigger scroll
      isFullGeneration.current = false;
      const ingredients = config.useAvailableIngredients ? availableIngredients : [];
      const newDays = regenerateSingleMeal(config, ingredients, dayIndex, mealType, result.days, forceInclude);
      update({ result: { ...result, days: newDays } });
    },
    [config, availableIngredients, result, forceInclude, update],
  );

  const handleSwapDish = useCallback(
    (dayIndex: number, mealType: MealType, dishIndex: number) => {
      if (!result) return;
      isFullGeneration.current = false;
      const ingredients = config.useAvailableIngredients ? availableIngredients : [];
      const newDays = swapDish(config, ingredients, dayIndex, mealType, dishIndex, result.days);
      update({ result: { ...result, days: newDays } });
    },
    [config, availableIngredients, result, update],
  );

  const loadingMessages = useMemo(
    () => [
      { icon: '🥗', text: 'Balancing your meals' },
      { icon: '🥘', text: 'Finding compatible dishes' },
      { icon: '🌱', text: 'Using your available ingredients' },
      { icon: '💚', text: 'Checking your preferences' },
    ],
    [],
  );

  return (
    <div ref={plannerTopRef} className="min-h-screen pb-12">
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

      <AnimatePresence>
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
            className="flex min-h-screen flex-col items-center justify-center px-4"
          >
            <LoadingAnimation messages={loadingMessages} />
          </motion.div>
        )}

        {phase === 'results' && result && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <div ref={mealPlanResultsRef} className="scroll-mt-[140px] min-h-[60vh]">
              {/* Summary at top */}
              <div className="pt-6">
                <PlannerSummary result={result} />
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LoadingAnimation({ messages }: { messages: { icon: string; text: string }[] }) {
  const [completedIdx, setCompletedIdx] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCompletedIdx((prev) => {
        if (prev >= messages.length - 1) return prev;
        return prev + 1;
      });
    }, 380);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
          <Sparkles size={16} /> Creating your personalized meal plan...
        </div>
      </motion.div>

      {/* Animated cooking indicator */}
      <div className="relative h-20 w-20">
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
          <span className="text-2xl">🍳</span>
        </div>
      </div>

      {/* Progress messages */}
      <div className="flex flex-col items-center gap-3">
        {messages.map((msg, idx) => {
          const isDone = idx <= completedIdx;
          const isCurrent = idx === completedIdx + 1;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: idx <= completedIdx + 1 ? 1 : 0.3,
                x: 0,
              }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <span className="text-lg">{msg.icon}</span>
              <span
                className={cn(
                  'text-sm font-semibold transition-colors duration-300',
                  isDone
                    ? 'text-accent'
                    : isCurrent
                      ? 'text-primary'
                      : 'text-gray-400 dark:text-gray-500',
                )}
              >
                {msg.text}
              </span>
              {isDone && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="text-accent"
                >
                  <Check size={16} />
                </motion.span>
              )}
              {isCurrent && (
                <Loader2 size={14} className="animate-spin text-primary" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
