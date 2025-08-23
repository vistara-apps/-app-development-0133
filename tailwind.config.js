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
        // Light mode colors with improved contrast
        primary: {
          DEFAULT: 'hsl(210, 80%, 45%)', // Slightly darker for better contrast
          hover: 'hsl(210, 80%, 40%)',
          light: 'hsl(210, 80%, 90%)',
          dark: 'hsl(210, 80%, 35%)',
        },
        accent: {
          DEFAULT: 'hsl(130, 70%, 40%)', // Darker for better contrast
          hover: 'hsl(130, 70%, 35%)',
          light: 'hsl(130, 70%, 90%)',
          dark: 'hsl(130, 70%, 30%)',
        },
        bg: {
          DEFAULT: 'hsl(220, 15%, 95%)',
          dark: 'hsl(220, 15%, 90%)',
        },
        surface: {
          DEFAULT: 'hsl(220, 15%, 100%)',
          dark: 'hsl(220, 15%, 98%)',
        },
        text: {
          primary: 'hsl(220, 15%, 10%)',
          secondary: 'hsl(220, 15%, 30%)', // Darker for better contrast
          tertiary: 'hsl(220, 15%, 50%)',
        },
        border: {
          DEFAULT: 'hsl(220, 15%, 85%)',
          dark: 'hsl(220, 15%, 75%)',
        },
        error: {
          DEFAULT: 'hsl(0, 80%, 50%)',
          light: 'hsl(0, 80%, 95%)',
        },
        success: {
          DEFAULT: 'hsl(145, 80%, 40%)',
          light: 'hsl(145, 80%, 95%)',
        },
        warning: {
          DEFAULT: 'hsl(40, 90%, 50%)',
          light: 'hsl(40, 90%, 95%)',
        },
        info: {
          DEFAULT: 'hsl(200, 80%, 50%)',
          light: 'hsl(200, 80%, 95%)',
        },
        // Dark mode colors
        dark: {
          bg: 'hsl(220, 15%, 10%)',
          surface: 'hsl(220, 15%, 15%)',
          border: 'hsl(220, 15%, 25%)',
          text: {
            primary: 'hsl(220, 15%, 95%)',
            secondary: 'hsl(220, 15%, 75%)',
            tertiary: 'hsl(220, 15%, 60%)',
          },
        },
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
        '2xl': '48px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 15%, 10%, 0.08)',
        'modal': '0 16px 48px hsla(220, 15%, 10%, 0.12)',
        'focus': '0 0 0 3px hsla(210, 80%, 45%, 0.3)',
      },
      animation: {
        'fast': '150ms cubic-bezier(0.22, 0.61, 0.36, 1)',
        'base': '250ms cubic-bezier(0.22, 0.61, 0.36, 1)',
        'slow': '400ms cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke',
      },
    },
  },
  plugins: [],
}
