import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { RECIPES } from '@/data/recipes';

const FAV_KEY = 'ct_favorites';
const RECENT_KEY = 'ct_recent';

const VALID_IDS = new Set(RECIPES.map((r) => r.id));

interface FavoritesContextValue {
  favorites: string[];
  recent: string[];
  isLoaded: boolean;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  pushRecent: (id: string) => void;
  clearRecent: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function readAndValidate(key: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    const result: string[] = [];
    for (const item of parsed) {
      if (typeof item === 'string' && VALID_IDS.has(item) && !seen.has(item)) {
        seen.add(item);
        result.push(item);
      }
    }
    return result;
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const favs = readAndValidate(FAV_KEY);
    const recents = readAndValidate(RECENT_KEY);
    setFavorites(favs);
    setRecent(recents);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      window.localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
    } catch {
      /* ignore */
    }
  }, [favorites, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    } catch {
      /* ignore */
    }
  }, [recent, isLoaded]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [id, ...prev]));
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const pushRecent = useCallback((id: string) => {
    setRecent((prev) => [id, ...prev.filter((r) => r !== id)].slice(0, 12));
  }, []);

  const clearRecent = useCallback(() => setRecent([]), []);

  const value = useMemo<FavoritesContextValue>(
    () => ({ favorites, recent, isLoaded, toggleFavorite, isFavorite, pushRecent, clearRecent }),
    [favorites, recent, isLoaded, toggleFavorite, isFavorite, pushRecent, clearRecent],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
