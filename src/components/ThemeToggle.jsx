import React from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useThemeStore } from '../stores/themeStore'

export function ThemeToggle({ className = '' }) {
  const { theme, setTheme } = useThemeStore()
  
  const handleToggle = () => {
    console.log('Theme toggle clicked. Current theme:', theme)
    // Cycle through themes: light -> dark -> system
    if (theme === 'light') {
      console.log('Setting theme to dark')
      setTheme('dark')
    } else if (theme === 'dark') {
      console.log('Setting theme to system')
      setTheme('system')
    } else {
      console.log('Setting theme to light')
      setTheme('light')
    }
  }
  
  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-md text-text-primary dark:text-dark-text-primary hover:bg-gray-100 dark:hover:bg-dark-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${className}`}
      aria-label={`Current theme: ${theme}. Click to change theme.`}
    >
      {theme === 'light' && <Sun className="w-5 h-5" />}
      {theme === 'dark' && <Moon className="w-5 h-5" />}
      {theme === 'system' && <Monitor className="w-5 h-5" />}
    </button>
  )
}

