import type { RefObject } from 'react';

export function useRipple<T extends HTMLElement>(ref: RefObject<T>) {
  return (e: React.MouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const wave = document.createElement('span');
    wave.className = 'ripple-wave';
    wave.style.width = wave.style.height = `${size}px`;
    wave.style.left = `${e.clientX - rect.left - size / 2}px`;
    wave.style.top = `${e.clientY - rect.top - size / 2}px`;
    el.classList.add('ripple');
    el.appendChild(wave);
    window.setTimeout(() => { wave.remove(); el.classList.remove('ripple'); }, 650);
  };
}
