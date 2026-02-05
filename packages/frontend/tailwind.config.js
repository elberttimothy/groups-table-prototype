/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f1ff',
          100: '#e4e6ff',
          200: '#cdcfff',
          300: '#a9abff',
          400: '#7e7eff',
          500: '#667eea',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        secondary: {
          500: '#764ba2',
        },
        dark: {
          DEFAULT: '#1a1a2e',
          lighter: '#252542',
        },
      },
    },
  },
  plugins: [],
}

