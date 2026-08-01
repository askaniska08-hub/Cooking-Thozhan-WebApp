import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/utils';

interface StarsProps {
  count: number;
  className?: string;
  size?: number;
}

export function Stars({ count, className, size = 16 }: StarsProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
        >
          <Star
            size={size}
            aria-hidden="true"
            className={i < count ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-gray-300 dark:text-gray-600'}
          />
        </motion.span>
      ))}
    </div>
  );
}
