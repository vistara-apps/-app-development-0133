import React from 'react'

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '', 
  disabled = false,
  icon = null,
  iconPosition = 'left',
  loading = false,
  type = 'button',
  ariaLabel,
  ...props 
}) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-dark disabled:bg-primary/50 dark:disabled:bg-primary/30',
    secondary: 'bg-gray-200 text-text-primary hover:bg-gray-300 active:bg-gray-400 disabled:bg-gray-100 dark:bg-dark-surface dark:text-dark-text-primary dark:hover:bg-dark-border dark:disabled:bg-dark-bg/50',
    ghost: 'bg-transparent text-text-primary hover:bg-gray-100 active:bg-gray-200 disabled:text-text-tertiary dark:text-dark-text-primary dark:hover:bg-dark-border/50 dark:active:bg-dark-border dark:disabled:text-dark-text-tertiary',
    danger: 'bg-error text-white hover:bg-error/90 active:bg-error/80 disabled:bg-error/50',
    success: 'bg-success text-white hover:bg-success/90 active:bg-success/80 disabled:bg-success/50',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/10 active:bg-primary/20 disabled:border-primary/50 disabled:text-primary/50 dark:border-primary/80 dark:text-primary/80'
  }

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg 
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
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

  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-md font-medium 
        transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
        disabled:cursor-not-allowed
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
      `}
      disabled={disabled || loading}
      type={type}
      aria-label={ariaLabel || undefined}
      aria-busy={loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  )
}
