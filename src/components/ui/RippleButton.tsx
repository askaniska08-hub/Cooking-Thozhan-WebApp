import { useRef } from 'react';
import { useRipple } from '@/hooks/useRipple';

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  as?: 'button';
}

export function RippleButton({ className = '', children, onClick, ...rest }: RippleButtonProps) {
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
