
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B263B',
          600: '#162033',
          700: '#0F172A',
          800: '#0A1120'
        },
        gold: {
          DEFAULT: '#E0A458',
          300: '#F0C078'
        },
        white: '#FFFFFF',
        gray: {
          100: '#F3F4F6',
          200: '#E5E7EB',
          500: '#6B7280',
          600: '#4B5563'
        },
        accent: {
          DEFAULT: '#3B82F6',
          500: '#2563EB'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}