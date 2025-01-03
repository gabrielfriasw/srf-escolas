/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Modo escuro usando classes
  theme: {
    extend: {
      colors: {
        // Cores personalizadas para o modo escuro
        dark: {
          DEFAULT: '#1a1d24',
          50: '#1e2128',
          100: '#23262f',
          200: '#2a2d36',
          300: '#2f3341',
          400: '#363a47',
          500: '#3d4251',
          600: '#454a5a',
          700: '#4d5263',
          800: '#555a6c',
          900: '#5d6275',
        },
        // Cores de destaque para elementos importantes
        accent: {
          red: '#ff3b3b',
          blue: '#3b82f6',
          green: '#22c55e'
        }
      },
      backgroundColor: {
        // Cores de fundo para o modo escuro
        'dark-primary': '#1a1d24',
        'dark-secondary': '#23262f',
        'dark-tertiary': '#2a2d36'
      }
    },
  },
  plugins: [],
};