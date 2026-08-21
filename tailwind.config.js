/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.ejs', './public/js/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#7C3AED',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        accent: {
          DEFAULT: '#0891B2',
          50: '#ECFEFF',
          100: '#CFFAFE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
        },
        ink: '#1E1B4B',
        muted: '#475569',
        surface: '#FAF5FF',
        success: '#16A34A',
        danger: '#DC2626',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(30, 27, 75, 0.08), 0 1px 2px -1px rgba(30, 27, 75, 0.08)',
      },
    },
  },
  plugins: [],
};
