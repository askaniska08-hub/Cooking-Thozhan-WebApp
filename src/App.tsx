import { useCallback, useMemo, useRef, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { IngredientSelector } from '@/components/IngredientSelector';
import { ResultsSection } from '@/components/ResultsSection';
import { RecipeModal } from '@/components/RecipeModal';
import { FavoritesView } from '@/components/FavoritesView';
import { Footer } from '@/components/Footer';
import { TaraChat } from '@/components/TaraChat';
import { useTheme } from '@/hooks/useTheme';
import { bucketMatches, computeMatch } from '@/hooks/useRecipeMatch';
import { RECIPES } from '@/data/recipes';
import type { RecipeWithMatch } from '@/types';
import { useFavorites } from '@/context/FavoritesContext';
import { MessageCircle } from 'lucide-react';

type View = 'home' | 'favorites';

export default function App() {
  const { theme, toggle } = useTheme();
  const { favorites, recent, isLoaded, toggleFavorite, isFavorite, pushRecent } = useFavorites();

  const [selected, setSelected] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeRecipe, setActiveRecipe] = useState<RecipeWithMatch | null>(null);
  const [view, setView] = useState<View>('home');

  // Chef Tara chat state
  const [taraOpen, setTaraOpen] = useState(false);
  const [taraSeed, setTaraSeed] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  const buckets = useMemo(
    () => (hasSearched ? bucketMatches(RECIPES, selected) : { perfect: [], great: [], tryAlso: [], total: 0 }),
    [hasSearched, selected],
  );

  const toggleIngredient = useCallback((name: string) => {
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
    setHasSearched(false);
  }, []);

  const clearIngredients = useCallback(() => {
    setSelected([]);
    setHasSearched(false);
  }, []);

  const findRecipes = useCallback(() => {
    setHasSearched(true);
    setView('home');
    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }, []);

  const openRecipe = useCallback(
    (r: RecipeWithMatch) => {
      setActiveRecipe(r);
      pushRecent(r.id);
    },
    [pushRecent],
  );

  const randomRecipe = useCallback(() => {
    const pick = RECIPES[Math.floor(Math.random() * RECIPES.length)];
    const matched = computeMatch(pick, selected) ?? {
      ...pick,
      matchPercent: 0,
      matched: [],
      missing: pick.ingredients,
      stars: 3,
    };
    openRecipe(matched);
  }, [selected, openRecipe]);

  const cookAnother = useCallback(() => {
    setActiveRecipe(null);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const askTara = useCallback((recipeName?: string) => {
    setTaraSeed(recipeName ? `Tell me about ${recipeName} — how do I make it and any tips?` : null);
    setTaraOpen(true);
  }, []);

  const handleTaraRecipeClick = useCallback(
    (recipeId: string) => {
      const recipe = RECIPES.find((r) => r.id === recipeId);
      if (!recipe) return;
      const matched = computeMatch(recipe, selected) ?? {
        ...recipe,
        matchPercent: 0,
        matched: [],
        missing: recipe.ingredients,
        stars: 3,
      };
      setActiveRecipe(matched);
      pushRecent(recipe.id);
    },
    [selected, pushRecent],
  );

  const activeRecipeFavorite = activeRecipe ? isFavorite(activeRecipe.id) : false;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        theme={theme}
        onToggleTheme={toggle}
        onShowFavorites={() => setView('favorites')}
        onRandom={randomRecipe}
        favoritesCount={favorites.length}
        favoritesLoaded={isLoaded}
        activeView={view}
        onAskTara={() => askTara()}
      />

      <main className="flex-1">
        {view === 'home' ? (
          <>
            <Hero
              onStart={() => document.getElementById('ingredients')?.scrollIntoView({ behavior: 'smooth' })}
              onAskTara={() => askTara()}
            />
            <IngredientSelector
              selected={selected}
              onToggle={toggleIngredient}
              onClear={clearIngredients}
              onFind={findRecipes}
            />
            <div ref={resultsRef}>
              {hasSearched && (
                <ResultsSection
                  buckets={buckets}
                  favorites={favorites}
                  onView={openRecipe}
                  onToggleFavorite={toggleFavorite}
                  onReset={clearIngredients}
                  onAskTara={(name) => askTara(name)}
                />
              )}
            </div>
          </>
        ) : (
          <FavoritesView
            recipes={RECIPES}
            favorites={favorites}
            recent={recent}
            isLoaded={isLoaded}
            onToggleFavorite={toggleFavorite}
            onView={openRecipe}
            onBack={() => setView('home')}
            onAskTara={(name) => askTara(name)}
          />
        )}
      </main>

      <Footer />

      <RecipeModal
        recipe={activeRecipe}
        isFavorite={activeRecipeFavorite}
        onClose={() => setActiveRecipe(null)}
        onToggleFavorite={() => activeRecipe && toggleFavorite(activeRecipe.id)}
        onCookAnother={cookAnother}
        onAskTara={() => activeRecipe && askTara(activeRecipe.name)}
      />

      {/* Floating Chef Tara launcher */}
      <button
        onClick={() => askTara()}
        aria-label="Chat with Chef Tara"
        className="fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-glow transition-transform hover:scale-105 active:scale-95"
      >
        <MessageCircle size={24} />
        <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-[#141414]" />
      </button>

      <TaraChat
        open={taraOpen}
        onClose={() => setTaraOpen(false)}
        onRecipeClick={handleTaraRecipeClick}
        initialQuestion={taraSeed}
      />
    </div>
  );
}
