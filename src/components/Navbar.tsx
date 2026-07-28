import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Heart, Sparkles, MessageCircle } from 'lucide-react';
import type { Theme } from '@/hooks/useTheme';
import { cn } from '@/utils';
import { Logo } from './Logo';

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
  onShowFavorites: () => void;
  onRandom: () => void;
  favoritesCount: number;
  favoritesLoaded: boolean;
  activeView: 'home' | 'favorites';
  onAskTara: () => void;
}

export function Navbar({ theme, onToggleTheme, onShowFavorites, onRandom, favoritesCount, favoritesLoaded, activeView, onAskTara }: NavbarProps) {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40"
    >
      <div className="glass-strong border-b border-black/5 dark:border-white/5">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <a href="#top" className="flex items-center gap-2.5" aria-label="Cooking Thozhan home">
            <Logo size={44} />
            <span className="leading-tight">
              <span className="block font-display text-base font-extrabold tracking-tight text-ink dark:text-white">
                Cooking <span className="text-primary">Thozhan</span>
              </span>
              <span className="hidden text-[10px] font-medium text-gray-500 dark:text-gray-400 sm:block">
                Your smart recipe buddy
              </span>
            </span>
          </a>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onAskTara}
              className="btn-ghost hidden px-3 py-2 text-sm sm:inline-flex"
              aria-label="Ask Chef Tara"
            >
              <MessageCircle size={16} className="text-primary" />
              <span className="hidden md:inline">Ask Tara</span>
            </button>

            <button
              onClick={onRandom}
              className="btn-ghost px-3 py-2 text-sm"
              aria-label="Surprise me with a random recipe"
            >
              <Sparkles size={16} className="text-accent" />
              <span className="hidden sm:inline">Surprise Me</span>
            </button>

            <button
              onClick={onShowFavorites}
              className={cn('btn-ghost relative px-3 py-2 text-sm', activeView === 'favorites' && 'bg-primary/10')}
              aria-label={`Favorites, ${favoritesCount} saved`}
            >
              <Heart size={16} className={favoritesLoaded && favoritesCount > 0 ? 'fill-red-500 text-red-500' : ''} />
              <span className="hidden sm:inline">Favourites</span>
              <AnimatePresence>
                {favoritesLoaded && favoritesCount > 0 && (
                  <motion.span
                    key={favoritesCount}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
                  >
                    {favoritesCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={onToggleTheme}
              className="btn-ghost grid h-10 w-10 place-items-center p-0"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'light' ? (
                  <motion.span key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <Moon size={18} />
                  </motion.span>
                ) : (
                  <motion.span key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Sun size={18} className="text-amber-400" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
