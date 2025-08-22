/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(210, 70%, 50%)',
        accent: 'hsl(130, 70%, 50%)',
        bg: 'hsl(220, 15%, 95%)',
        surface: 'hsl(220, 15%, 100%)',
        'text-primary': 'hsl(220, 15%, 10%)',
        'text-secondary': 'hsl(220, 15%, 40%)',
        border: 'hsl(220, 15%, 85%)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '32px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 15%, 10%, 0.08)',
        'modal': '0 16px 48px hsla(220, 15%, 10%, 0.12)',
      },
      animation: {
        'fast': '150ms cubic-bezier(0.22, 0.61, 0.36, 1)',
        'base': '250ms cubic-bezier(0.22, 0.61, 0.36, 1)',
        'slow': '400ms cubic-bezier(0.22, 0.61, 0.36, 1)',
      }
    },
  },
  plugins: [],
}