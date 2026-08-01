import { useRef } from 'react';
import { useRipple } from '@/hooks/useRipple';

export function RippleButton({ className = '', children, onClick, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useRef<HTMLButtonElement>(null);
  const ripple = useRipple(ref);

  return (
    <button
      ref={ref}
      className={className}
      onClick={(e) => {
        ripple(e);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
