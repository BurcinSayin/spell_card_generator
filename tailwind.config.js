/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: 'var(--paper)',
          alt: 'var(--paper2)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          soft: 'var(--ink2)',
          muted: 'var(--muted)',
        },
        rule: {
          DEFAULT: 'var(--rule)',
          strong: 'var(--rule2)',
        },
        bg: 'var(--bg)',
        accent: 'var(--accent)',
        school: {
          abjuration: '#3B82F6',
          conjuration: '#10B981',
          divination: '#A78BFA',
          enchantment: '#EC4899',
          evocation: '#EF4444',
          illusion: '#8B5CF6',
          necromancy: '#374151',
          transmutation: '#F59E0B',
          universal: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"IM Fell English SC"', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
