/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Poppins',
          'Segoe UI',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        brand: {
          DEFAULT: '#e50914',
          dark: '#b20710',
          light: '#ff4d4f',
        },
        surface: {
          DEFAULT: '#0b0b0f',
          muted: '#10101a',
          card: '#181822',
        },
      },
      backgroundImage: {
        'app-gradient':
          'radial-gradient(circle at top left, rgba(255,0,92,0.08), transparent 40%), radial-gradient(circle at bottom right, rgba(64,17,255,0.08), transparent 45%), #050505',
        'hero-overlay':
          'linear-gradient(180deg, rgba(8,9,14,0.1), rgba(8,9,14,0.9)), linear-gradient(90deg, rgba(8,9,14,1) 0%, rgba(8,9,14,0.2) 55%, rgba(8,9,14,0.9) 100%)',
      },
      boxShadow: {
        'brand-xl': '0 18px 32px rgba(229, 9, 20, 0.4)',
        'brand-lg': '0 12px 24px rgba(229, 9, 20, 0.3)',
      },
    },
  },
  plugins: [],
};
