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
        // Light mode colors
        'bg': '#f8fafc',
        'surface': '#ffffff',
        'text-primary': '#0f172a',
        'text-secondary': '#64748b',
        'border': '#e2e8f0',
        'primary': '#3b82f6',
        'primary-light': '#dbeafe',
        'accent': '#10b981',
        'error': '#ef4444',
        
        // Dark mode colors
        'dark-bg': '#0f172a',
        'dark-surface': '#1e293b',
        'dark-text-primary': '#f1f5f9',
        'dark-text-secondary': '#94a3b8',
        'dark-border': '#334155',
      }
    },
  },
  plugins: [],
}