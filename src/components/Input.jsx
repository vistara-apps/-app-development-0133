import React from 'react'
import { cn } from '../utils/cn'

const Input = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "input-modern",
    wellness: "wellness-input",
    outline: "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 placeholder-neutral-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-400 transition-all duration-200",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 py-2 text-sm",
    lg: "h-11 px-6 py-3 text-base",
    xl: "h-12 px-8 py-4 text-lg",
  }

  return (
    <input
      className={cn(
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }
