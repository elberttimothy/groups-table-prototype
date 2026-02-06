import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Omit<Config, 'content'> = {
  // use dark mode selector for nav bar
  // to switch out tokens
  darkMode: 'selector',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}', // Add the ui package
    '../../packages/ui-next/src/**/*.{js,ts,jsx,tsx}', // Add the ui-next package
  ],
  // needed for tailwind to bundle these colors for storybook
  safelist: [{ pattern: /^bg-/ }, { pattern: /^text-/ }],
  theme: {
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        ellipse: {
          '0%': { backgroundPosition: '0% 50%', clipPath: 'inset(0 100% 0 0)' },
          '100%': { backgroundPosition: '100% 50%', clipPath: 'inset(0 -34% 0 0)' },
        },
        text: {
          '0%': { backgroundSize: '200% 200%', backgroundPosition: '0% 50%' },
          '50%': { backgroundSize: '200% 200%', backgroundPosition: '100% 50%' },
          '100%': { backgroundSize: '200% 200%', backgroundPosition: '0% 50%' },
        },
        'collapsible-down': {
          from: { height: '0', opacity: 0 },
          to: { height: 'var(--radix-collapsible-content-height)', opacity: 1 },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)', opacity: 1 },
          to: { height: '0', opacity: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        ellipse: 'ellipse 1.8s steps(4) infinite',
        text: 'text 2s ease infinite',
        'collapsible-up': 'collapsible-up 0.8s ease-out',
        'collapsible-down': 'collapsible-down 0.8s ease-out',
      },
      boxShadow: {
        'left-col': '8px 0 12px -2px rgba(0, 0, 0, 0.04)',
        'right-col': '-8px 0 12px -2px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
        xs: 'var(--radius-xs)',
      },
      fontSize: {
        xxs: '0.65rem',
      },
    },
    // Updated to use oklch colors
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: 'oklch(var(--white) / <alpha-value>)',
      black: 'oklch(var(--black) / <alpha-value>)',
      // Shadcn semantic colors
      background: 'oklch(var(--background) / <alpha-value>)',
      foreground: 'oklch(var(--foreground) / <alpha-value>)',
      card: {
        DEFAULT: 'oklch(var(--card))',
        foreground: 'oklch(var(--card-foreground))',
      },
      popover: {
        DEFAULT: 'oklch(var(--popover))',
        foreground: 'oklch(var(--popover-foreground))',
      },
      primary: {
        DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
        foreground: 'oklch(var(--primary-foreground))',
        accent: 'oklch(var(--primary-accent))',
      },
      secondary: {
        DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
        foreground: 'oklch(var(--secondary-foreground))',
        accent: 'oklch(var(--secondary-accent))',
      },
      tertiary: {
        DEFAULT: 'oklch(var(--tertiary) / <alpha-value>)',
      },
      muted: {
        DEFAULT: 'oklch(var(--muted))',
        foreground: 'oklch(var(--muted-foreground) / <alpha-value>)',
      },
      accent: {
        DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
        foreground: 'oklch(var(--accent-foreground) / <alpha-value>)',
      },
      destructive: {
        DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
        foreground: 'oklch(var(--destructive-foreground))',
        accent: 'oklch(var(--destructive-accent))',
      },
      ring: 'oklch(var(--ring) / <alpha-value>)',
      // Shadcn's border and input colors should be the same color
      // only keeping both here, for compatibility with shadcn components
      // we paste in, to avoid their classes not picking up the color
      input: 'oklch(var(--border) / <alpha-value>)',
      border: 'oklch(var(--border) / <alpha-value>)',
      success: {
        DEFAULT: 'oklch(var(--success) / <alpha-value>)',
        accent: 'oklch(var(--success-accent) / <alpha-value>)',
      },
      warning: {
        DEFAULT: 'oklch(var(--warning) / <alpha-value>)',
        accent: 'oklch(var(--warning-accent) / <alpha-value>)',
      },
      // Sidebar specific colors
      sidebar: {
        DEFAULT: 'oklch(var(--sidebar) / <alpha-value>)',
        foreground: 'oklch(var(--sidebar-foreground) / <alpha-value>)',
        primary: 'oklch(var(--sidebar-primary) / <alpha-value>)',
        'primary-foreground': 'oklch(var(--sidebar-primary-foreground) / <alpha-value>)',
        accent: 'oklch(var(--sidebar-accent) / <alpha-value>)',
        'accent-foreground': 'oklch(var(--sidebar-accent-foreground) / <alpha-value>)',
        border: 'oklch(var(--sidebar-border) / <alpha-value>)',
        ring: 'oklch(var(--sidebar-ring) / <alpha-value>)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
