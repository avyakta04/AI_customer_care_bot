/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#FFFFFF',
          light: '#F8FAFC',
        },
        primary: {
          DEFAULT: '#7C3AED', // Violet
          neon: '#8B5CF6',
        },
        secondary: {
          DEFAULT: '#06B6D4', // Cyan
          neon: '#22D3EE',
        },
        accent: {
          DEFAULT: '#10b981', // Emerald
          neon: '#34d399',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.7)',
          border: 'rgba(226, 232, 240, 0.8)',
        }
      },
      backgroundImage: {
        'glow-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-premium': 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #06B6D4 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
