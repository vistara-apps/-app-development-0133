import React from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useThemeStore } from '../stores/themeStore'

export function ThemeToggle({ className = '' }) {
  const { theme, setTheme } = useThemeStore()
  
  const handleToggle = () => {
    // Cycle through themes: light -> dark -> system
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />
      case 'dark':
        return <Moon className="w-4 h-4" />
      case 'system':
        return <Monitor className="w-4 h-4" />
      default:
        return <Sun className="w-4 h-4" />
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light'
      case 'dark':
        return 'Dark'
      case 'system':
        return 'Auto'
      default:
        return 'Light'
    }
  }
  
  return (
    <button
      onClick={handleToggle}
      className={`
        inline-flex items-center gap-2 px-3 py-2 
        rounded-lg text-sm font-medium
        bg-white dark:bg-gray-800 
        text-gray-700 dark:text-gray-200
        border border-gray-300 dark:border-gray-600
        hover:bg-gray-50 dark:hover:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
        transition-all duration-200 ease-in-out
        shadow-sm hover:shadow-md
        ${className}
      `}
      aria-label={`Current theme: ${theme}. Click to change theme.`}
      title={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light'} mode`}
    >
      {getIcon()}
      <span className="hidden sm:inline">{getThemeLabel()}</span>
    </button>
  )
}

