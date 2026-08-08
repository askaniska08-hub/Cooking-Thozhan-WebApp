import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils';

interface ServingsDropdownProps {
  value: 1 | 2 | 4 | 6;
  onChange: (value: 1 | 2 | 4 | 6) => void;
}

const OPTIONS: { value: 1 | 2 | 4 | 6; label: string }[] = [
  { value: 1, label: '1 serving' },
  { value: 2, label: '2 servings' },
  { value: 4, label: '4 servings' },
  { value: 6, label: '6 servings' },
];

export function ServingsDropdown({ value, onChange }: ServingsDropdownProps) {
  const [open, setOpen] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedLabel = OPTIONS.find((o) => o.value === value)?.label ?? `${value} servings`;
  const selectedIdx = OPTIONS.findIndex((o) => o.value === value);

  const close = useCallback(() => {
    setOpen(false);
    setHighlightedIdx(-1);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, close]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (open && highlightedIdx >= 0 && listRef.current) {
      const el = listRef.current.children[highlightedIdx] as HTMLElement | undefined;
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIdx, open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
        setHighlightedIdx(selectedIdx >= 0 ? selectedIdx : 0);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIdx((prev) => (prev + 1) % OPTIONS.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIdx((prev) => (prev - 1 + OPTIONS.length) % OPTIONS.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (highlightedIdx >= 0) {
          onChange(OPTIONS[highlightedIdx].value);
          close();
        }
        break;
    }
  };

  return (
    <div ref={rootRef} className="relative w-full">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => {
          if (open) {
            close();
          } else {
            setOpen(true);
            setHighlightedIdx(selectedIdx >= 0 ? selectedIdx : 0);
          }
        }}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Number of servings"
        className={cn(
          'flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-left font-bold transition-all duration-200',
          'border-gray-100 bg-white text-ink hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
          'dark:border-white/10 dark:bg-white/5 dark:text-white',
          open && 'border-primary ring-2 ring-primary/20',
        )}
      >
        <span className="flex items-center gap-3">
          <Users size={20} className="shrink-0 text-primary" />
          <span>{selectedLabel}</span>
        </span>
        <ChevronDown
          size={18}
          className={cn(
            'shrink-0 text-gray-400 transition-transform duration-200',
            open && 'rotate-180 text-primary',
          )}
        />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            role="listbox"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border-2 shadow-card',
              'border-gray-100 bg-white dark:border-white/10 dark:bg-[#1a1a1a]',
            )}
          >
            {OPTIONS.map((opt, idx) => {
              const isSelected = opt.value === value;
              const isHighlighted = idx === highlightedIdx;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(opt.value);
                    close();
                  }}
                  onMouseEnter={() => setHighlightedIdx(idx)}
                  className={cn(
                    'flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-semibold transition-colors duration-100',
                    'text-ink dark:text-white',
                    isHighlighted && 'bg-primary/10',
                    isSelected && 'text-primary',
                    !isHighlighted && !isSelected && 'hover:bg-primary/5',
                  )}
                >
                  <span className="flex items-center gap-2">
                    {opt.label}
                  </span>
                  {isSelected && <Check size={16} className="text-primary" />}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
