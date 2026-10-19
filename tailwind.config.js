/** @type {import('tailwindcss').Config} */
const token = (name) => `hsl(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        raised: token('raised'),
        line: token('line'),
        fg: token('fg'),
        muted: token('muted'),
        subtle: token('subtle'),
        primary: {
          DEFAULT: token('primary'),
          strong: token('primary-strong'),
          fg: token('primary-fg'),
        },
        p1: token('p1'),
        p2: token('p2'),
        board: token('board'),
        hole: token('hole'),
        success: token('success'),
        danger: token('danger'),
        warning: token('warning'),
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px hsl(var(--shadow) / 0.06), 0 8px 24px -12px hsl(var(--shadow) / 0.25)',
        pop: '0 12px 40px -12px hsl(var(--shadow) / 0.45)',
        glow: '0 0 0 1px hsl(var(--primary) / 0.35), 0 8px 30px -8px hsl(var(--primary) / 0.55)',
      },
      keyframes: {
        drop: {
          '0%': { transform: 'translateY(var(--drop-from, -400%))' },
          '70%': { transform: 'translateY(0)' },
          '85%': { transform: 'translateY(-8%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'scale-in': { from: { opacity: 0, transform: 'scale(0.96)' }, to: { opacity: 1, transform: 'scale(1)' } },
        'slide-up': { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        'win-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 hsl(var(--fg) / 0.0)' },
          '50%': { boxShadow: '0 0 0 4px hsl(var(--fg) / 0.85)' },
        },
      },
      animation: {
        drop: 'drop var(--drop-ms, 450ms) cubic-bezier(0.33, 0, 0.67, 1) both',
        'fade-in': 'fade-in 150ms ease-out both',
        'scale-in': 'scale-in 180ms cubic-bezier(0.2, 0.9, 0.3, 1.2) both',
        'slide-up': 'slide-up 220ms ease-out both',
        'win-pulse': 'win-pulse 1.1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
