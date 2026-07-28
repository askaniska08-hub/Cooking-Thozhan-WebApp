import { motion } from 'framer-motion';
import { cn } from '@/utils';

interface MatchRingProps {
  percent: number;
  size?: number;
  className?: string;
}

export function MatchRing({ percent, size = 52, className }: MatchRingProps) {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  const color = percent === 100 ? '#34C759' : percent >= 70 ? '#FF7A00' : '#FFB020';

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-gray-200 dark:text-gray-700" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </svg>
      <span className="absolute text-[11px] font-bold" style={{ color }}>
        {percent}%
      </span>
    </div>
  );
}
