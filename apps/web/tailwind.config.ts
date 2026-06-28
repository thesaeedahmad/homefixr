import type { Config } from 'tailwindcss';

/**
 * HomeFixr design tokens.
 *
 * These values come directly from the design system
 * (docs/03-hci/03-design-system.md) and are defined ONCE here, then reused
 * across every screen. This is the practical implementation of DRY and visual
 * consistency: changing a token here updates the whole product.
 *
 * Colours are WCAG AA-checked for text contrast. Status colours carry meaning
 * (success = verified/released, warning = pending/held, danger = error/reject).
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#EFF6FF', 600: '#1D4ED8', 700: '#1E40AF' },
        success: { 600: '#15803D' },
        warning: { 600: '#B45309' },
        danger: { 600: '#B91C1C' },
        neutral: {
          50: '#F9FAFB',
          200: '#E5E7EB',
          600: '#4B5563',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
      },
    },
  },
  plugins: [],
};

export default config;
