/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#071326',
          800: '#0A192F',
          700: '#112240',
          600: '#1E3A8A'
        },
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A'
        },
        saffron: {
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C'
        },
        emerald: {
          50: '#ECFDF5',
          500: '#10B981',
          600: '#059669',
          700: '#047857'
        },
        amber: {
          50: '#FFFBEB',
          500: '#F59E0B',
          600: '#D97706'
        },
        jago: {
          500: '#7C3AED',
          600: '#6D28D9',
          700: '#5B21B6'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'glow-blue': '0 0 20px -5px rgba(37, 99, 235, 0.3)',
        'glow-saffron': '0 0 20px -5px rgba(249, 115, 22, 0.3)',
        'glow-jago': '0 0 25px -5px rgba(124, 58, 237, 0.35)',
      }
    },
  },
  plugins: [],
}
