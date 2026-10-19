import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
const token = (name) => `hsl(var(--${name}) / <alpha-value>)`

export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // shadcn/ui semantic tokens
        background: token('background'),
        foreground: token('foreground'),
        card: { DEFAULT: token('card'), foreground: token('foreground') },
        popover: { DEFAULT: token('card'), foreground: token('foreground') },
        primary: { DEFAULT: token('yellow'), foreground: token('on-yellow') },
        secondary: { DEFAULT: token('card'), foreground: token('foreground') },
        muted: { DEFAULT: token('muted'), foreground: token('muted-foreground') },
        accent: { DEFAULT: token('accent'), foreground: token('foreground') },
        destructive: { DEFAULT: token('red'), foreground: token('on-red') },
        border: token('ink'),
        input: token('ink'),
        ring: token('ring'),
        // Toy palette
        ink: token('ink'),
        board: token('board'),
        'board-rim': token('board-rim'),
        hole: token('hole'),
        red: token('red'),
        yellow: token('yellow'),
        green: token('green'),
        'on-board': token('on-board'),
      },
      fontFamily: {
        sans: ['"M PLUS Rounded 1c"', 'ui-rounded', 'system-ui', 'sans-serif'],
        display: ['"Titan One"', '"M PLUS Rounded 1c"', 'ui-rounded', 'sans-serif'],
      },
      // Modular scale, ratio 1.25 from 16px.
      fontSize: {
        'display-xl': ['3.815rem', { lineHeight: '1', letterSpacing: '0.005em' }],
        'display-lg': ['3.052rem', { lineHeight: '1.05', letterSpacing: '0.005em' }],
        'display-md': ['2.441rem', { lineHeight: '1.1' }],
        'display-sm': ['1.953rem', { lineHeight: '1.15' }],
      },
      borderRadius: {
        board: '1.75rem',
        panel: '1.125rem',
        btn: '0.875rem',
      },
      borderWidth: {
        3: '3px',
      },
      boxShadow: {
        // Hard, straight-down "moulded plastic" depth: no blur.
        plastic: '0 4px 0 0 hsl(var(--ink))',
        'plastic-lg': '0 6px 0 0 hsl(var(--ink))',
        'plastic-sm': '0 2px 0 0 hsl(var(--ink))',
      },
      keyframes: {
        drop: {
          '0%': { transform: 'translateY(var(--drop-from, -400%))' },
          '72%': { transform: 'translateY(0)' },
          '86%': { transform: 'translateY(-7%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'win-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 hsl(var(--on-board) / 0)' },
          '50%': { boxShadow: '0 0 0 4px hsl(var(--on-board) / 0.95)' },
        },
      },
      animation: {
        drop: 'drop var(--drop-ms, 450ms) cubic-bezier(0.33, 0, 0.67, 1) both',
        'win-glow': 'win-glow 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [animate],
}
