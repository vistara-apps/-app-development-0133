import React from 'react'
import { cn } from '../utils/cn'

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default",
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "badge-primary",
    secondary: "badge-neutral",
    accent: "badge-accent",
    success: "badge-modern bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300",
    warning: "badge-modern bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300",
    error: "badge-modern bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300",
    outline: "badge-modern bg-transparent border border-neutral-200 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300",
  }

  const sizes = {
    default: "px-3 py-1 text-sm",
    sm: "px-2 py-0.5 text-xs",
    lg: "px-4 py-2 text-base",
  }

  return (
    <span
      ref={ref}
      className={cn(
        "badge-modern",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = "Badge"

export { Badge }
