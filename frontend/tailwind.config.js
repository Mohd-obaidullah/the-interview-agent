/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#07090e',
          800: '#0b0f19',
          700: '#111728',
          600: '#1a2238',
          500: '#25304e'
        },
        brand: {
          purple: '#7c3aed',
          pink: '#ec4899',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          accent: '#6366f1'
        }
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at top, rgba(124, 58, 237, 0.15) 0%, rgba(7, 9, 14, 1) 70%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'glow-purple': 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
