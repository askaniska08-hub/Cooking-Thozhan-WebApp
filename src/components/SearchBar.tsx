import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function SearchBar({ value, onChange, placeholder = 'Search…', onClear }: SearchBarProps) {
  return (
    <div className="relative flex items-center">
      <Search size={18} className="pointer-events-none absolute left-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-10 text-sm text-ink shadow-soft outline-none transition focus:border-primary dark:border-white/10 dark:bg-white/5 dark:text-white"
      />
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => (onClear ? onClear() : onChange(''))}
            className="absolute right-3 grid h-6 w-6 place-items-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300"
            aria-label="Clear search"
          >
            <X size={14} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
