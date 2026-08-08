import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import type { PlannerConfig, PlannerResult, RecipeWithMatch } from '@/types';
import { generateMealPlan } from '@/services/mealPlanner';
import { PlannerSetup } from './PlannerSetup';
import { PlannerResults } from './PlannerResults';
import { PlannerSummary } from './PlannerSummary';
import { ShoppingList } from './ShoppingList';

interface MealPlannerViewProps {
  availableIngredients: string[];
  onViewRecipe: (recipe: RecipeWithMatch) => void;
  onBack: () => void;
  onSelectIngredients: () => void;
}

type Phase = 'setup' | 'loading' | 'results';

const DEFAULT_CONFIG: PlannerConfig = {
  goal: 'balanced',
  duration: 3,
  meals: ['Breakfast', 'Lunch', 'Dinner'],
  servings: 2,
  useAvailableIngredients: true,
};

export function MealPlannerView({ availableIngredients, onViewRecipe, onBack, onSelectIngredients }: MealPlannerViewProps) {
  const [config, setConfig] = useState<PlannerConfig>(DEFAULT_CONFIG);
  const [phase, setPhase] = useState<Phase>('setup');
  const [result, setResult] = useState<PlannerResult | null>(null);
  const [forceInclude, setForceInclude] = useState<string[]>([]);

  const handleGenerate = useCallback(() => {
    setPhase('loading');
    const ingredients = config.useAvailableIngredients ? availableIngredients : [];
    // Simulate AI processing for premium feel
    setTimeout(() => {
      const plan = generateMealPlan(config, ingredients, forceInclude);
      setResult(plan);
      setPhase('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1600);
  }, [config, availableIngredients, forceInclude]);

  const handleRegenerate = useCallback(() => {
    // On regenerate, force-include any unused ingredients
    if (result && result.unusedAvailableIngredients.length > 0) {
      setForceInclude(result.unusedAvailableIngredients);
    }
    setPhase('loading');
    const ingredients = config.useAvailableIngredients ? availableIngredients : [];
    setTimeout(() => {
      const plan = generateMealPlan(config, ingredients, forceInclude);
      setResult(plan);
      setPhase('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1400);
  }, [config, availableIngredients, forceInclude, result]);

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
              onChange={setConfig}
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
            {/* Summary at top */}
            <div className="pt-6">
              <PlannerSummary result={result} />
            </div>

            {/* Day-by-day plan */}
            <PlannerResults
              days={result.days}
              onViewRecipe={onViewRecipe}
              onRegenerate={handleRegenerate}
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
