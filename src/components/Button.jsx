import React from 'react'

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '', 
  disabled = false,
  ...props 
}) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 disabled:bg-primary/50',
    secondary: 'bg-gray-200 text-text-primary hover:bg-gray-300 disabled:bg-gray-100',
    ghost: 'bg-transparent text-text-primary hover:bg-gray-100 disabled:text-text-secondary'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-md font-medium 
        transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50
        disabled:cursor-not-allowed
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}