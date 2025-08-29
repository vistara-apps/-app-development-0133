import React from 'react'

export function LoadingIndicator({ 
  size = 'md', 
  color = 'primary',
  className = '',
  fullPage = false,
  text = 'Loading...'
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  const colorClasses = {
    primary: 'text-primary',
    white: 'text-white',
    gray: 'text-text-secondary dark:text-text-secondary',
    accent: 'text-accent'
  }

  const spinner = (
    <svg 
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm z-50">
        {spinner}
        {text && (
          <p className="mt-4 text-text-primary dark:text-text-primary font-medium">
            {text}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {spinner}
      {text && (
        <p className="mt-2 text-sm text-text-secondary dark:text-text-secondary">
          {text}
        </p>
      )}
    </div>
  )
}

