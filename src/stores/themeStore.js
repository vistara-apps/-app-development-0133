import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Helper to get system preference
const getSystemTheme = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light' // Default to light if matchMedia is not available
}

// Helper to apply theme to document
const applyTheme = (theme) => {
  if (typeof document === 'undefined') return
  
  console.log('Applying theme:', theme)
  const root = document.documentElement
  const actualTheme = theme === 'system' ? getSystemTheme() : theme
  
  console.log('Actual theme to apply:', actualTheme)
  
  if (actualTheme === 'dark') {
    root.classList.add('dark')
    console.log('Added dark class to html')
  } else {
    root.classList.remove('dark')
    console.log('Removed dark class from html')
  }
  
  console.log('Current html classes:', root.className)
}

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light', // 'light', 'dark', or 'system'
      
      setTheme: (theme) => {
        console.log('setTheme called with:', theme)
        set({ theme })
        applyTheme(theme)
        
        // Log the current state after setting
        console.log('Theme state after setTheme:', get().theme)
        console.log('Current HTML classes:', document.documentElement.className)
      },
      
      // Initialize theme on app load
      initTheme: () => {
        const { theme } = get()
        console.log('Initializing theme with:', theme)
        applyTheme(theme)
        
        // Listen for system preference changes
        if (typeof window !== 'undefined' && window.matchMedia) {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
          
          const handleChange = () => {
            if (get().theme === 'system') {
              console.log('System theme preference changed, applying system theme')
              applyTheme('system')
            }
          }
          
          mediaQuery.addEventListener('change', handleChange)
          return () => mediaQuery.removeEventListener('change', handleChange)
        }
      }
    }),
    {
      name: 'resilient-flow-theme', // Storage key
    }
  )
)

