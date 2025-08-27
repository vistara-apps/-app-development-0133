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
  
  const root = document.documentElement
  const actualTheme = theme === 'system' ? getSystemTheme() : theme
  
  if (actualTheme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light', // 'light', 'dark', or 'system'
      
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },
      
      // Initialize theme on app load
      initTheme: () => {
        // Force light mode for now
        document.documentElement.classList.remove('dark')
        const { theme } = get()
        applyTheme(theme)
        
        // Listen for system preference changes
        if (typeof window !== 'undefined' && window.matchMedia) {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
          
          const handleChange = () => {
            if (get().theme === 'system') {
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

