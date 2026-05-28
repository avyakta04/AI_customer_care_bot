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
          DEFAULT: '#020617',
          light: '#0f172a',
        },
        primary: {
          DEFAULT: '#8b5cf6', // Purple
          neon: '#a78bfa',
        },
        secondary: {
          DEFAULT: '#06b6d4', // Cyan
          neon: '#22d3ee',
        },
        accent: {
          DEFAULT: '#10b981', // Emerald
          neon: '#34d399',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.03)',
          border: 'rgba(255, 255, 255, 0.1)',
        }
      },
      backgroundImage: {
        'glow-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
