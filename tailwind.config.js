/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        racing: {
          50: '#eef5ff',
          100: '#d9e7ff',
          200: '#bcd5ff',
          300: '#8ebaff',
          400: '#5a93ff',
          500: '#356dff',
          600: '#1c4ef5',
          700: '#1539d8',
          800: '#1730ae',
          900: '#192e89',
          950: '#141d52',
        },
        redline: {
          50: '#fff1f1',
          100: '#ffdfe0',
          200: '#ffc5c7',
          300: '#ff9da0',
          400: '#ff6b6f',
          500: '#f83a3f',
          600: '#e10600',
          700: '#bb0500',
          800: '#960a02',
          900: '#7a0d03',
          950: '#420200',
        },
        carbon: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5dae2',
          300: '#b0bac9',
          400: '#8593aa',
          500: '#66748f',
          600: '#515d75',
          700: '#434c60',
          800: '#3a4251',
          900: '#343a47',
          950: '#0c0f17',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Saira', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(12,15,23,0.04), 0 4px 16px rgba(12,15,23,0.06)',
        'card-hover': '0 2px 6px rgba(12,15,23,0.08), 0 10px 28px rgba(12,15,23,0.1)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
