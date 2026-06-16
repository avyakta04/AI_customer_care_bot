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
          DEFAULT: '#1E3A8A', // Primary Royal Blue
          neon: '#2563EB', // Secondary Blue
        },
        secondary: {
          DEFAULT: '#D4AF37', // Luxury Gold
          neon: '#FBBF24', // Accent Gold
        },
        accent: {
          DEFAULT: '#FBBF24', // Accent Gold
          neon: '#F59E0B',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.7)',
          border: 'rgba(212, 175, 55, 0.15)',
        }
      },
      backgroundImage: {
        'glow-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-premium': 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #D4AF37 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
