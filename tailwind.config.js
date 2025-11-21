/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Habilitar el modo oscuro basado en clase
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: 'var(--primary)',
        'primary-dark': 'var(--primary-dark)',
        'primary-light': 'var(--primary-light)',
        background: 'var(--background)',
        surface: 'var(--surface)',
        'active-surface': 'var(--active-surface)',
        'on-surface': 'var(--on-surface)',
        'on-surface-secondary': 'var(--on-surface-secondary)',
        'danger': 'var(--danger)',
        'accent': 'var(--accent)',
        'accent-dark': 'var(--accent-dark)',
        'warning': 'var(--warning)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 8px 24px -8px rgba(0,0,0,0.08), 0 1px 4px -1px rgba(0,0,0,0.05)',
      },
      animation: {
        'value-flash': 'value-flash 0.5s ease-in-out',
        'logo-pulse': 'logo-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'grow-and-fade-in': 'grow-and-fade-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'staggered-fade-in-slide-up': 'staggered-fade-in-slide-up 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
      },
      keyframes: {
        'value-flash': {
          '0%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(1.1)', filter: 'brightness(1.3)' },
          '100%': { transform: 'scale(1)', filter: 'brightness(1)' },
        },
        'logo-pulse': {
          '0%, 100%': {
            opacity: 1,
            transform: 'scale(1)'
          },
          '50%': {
            opacity: 0.8,
            transform: 'scale(0.95)'
          }
        },
        'grow-and-fade-in': {
          '0%': { transform: 'scale(0.9) translateY(10px)', opacity: '0' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'staggered-fade-in-slide-up': {
          '0%': {
            opacity: 0,
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        }
      }
    }
  },
  plugins: [],
}