/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF7A00',
          50: '#FFF4E6',
          100: '#FFE4C2',
          200: '#FFCB85',
          300: '#FFAF47',
          400: '#FF9A1F',
          500: '#FF7A00',
          600: '#E66A00',
          700: '#BF5700',
          800: '#994600',
          900: '#7A3800',
        },
        accent: {
          DEFAULT: '#34C759',
          50: '#E8F9EE',
          100: '#C7F0D4',
          200: '#8FE3A9',
          300: '#5BD683',
          400: '#34C759',
          500: '#28A847',
          600: '#1F8A3A',
          700: '#186C2E',
          800: '#124D22',
          900: '#0C3317',
        },
        cream: '#FFF4E6',
        ink: '#222222',
        surface: '#FAFAFA',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(0,0,0,0.08)',
        card: '0 8px 30px -8px rgba(0,0,0,0.12)',
        glow: '0 8px 30px -6px rgba(255,122,0,0.35)',
        'glow-accent': '0 8px 30px -6px rgba(52,199,89,0.35)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        float: 'float 5s ease-in-out infinite',
        shimmer: 'shimmer 1.5s infinite',
        pop: 'pop 0.3s ease-out both',
      },
    },
  },
  plugins: [],
};
