import React from 'react'
import { cn } from '../utils/cn'

const buttonVariants = {
  variant: {
    default: "btn-primary",
    destructive: "btn-modern bg-error-500 text-white hover:bg-error-600 active:bg-error-700 shadow-soft hover:shadow-medium",
    outline: "btn-secondary",
    secondary: "btn-modern bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 dark:active:bg-neutral-600",
    ghost: "btn-modern text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800",
    link: "btn-modern text-primary-600 underline-offset-4 hover:underline p-0 h-auto",
    wellness: "wellness-button",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-xl px-3 text-sm",
    lg: "h-11 rounded-xl px-8 text-base",
    xl: "h-12 rounded-xl px-10 text-lg",
    icon: "h-10 w-10",
  }
}

const Button = React.forwardRef(({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}, ref) => {
  return (
    <button
      className={cn(
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export { Button }
