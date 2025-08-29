import React from 'react'
import { cn } from '../utils/cn'

const Switch = React.forwardRef(({
  className,
  checked,
  onCheckedChange,
  disabled = false,
  size = "default",
  ...props
}, ref) => {
  const sizes = {
    default: "h-6 w-11",
    sm: "h-5 w-9",
    lg: "h-7 w-14",
  }

  const thumbSizes = {
    default: "h-5 w-5",
    sm: "h-4 w-4",
    lg: "h-6 w-6",
  }

  const translateSizes = {
    default: "translate-x-5",
    sm: "translate-x-4",
    lg: "translate-x-7",
  }

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        sizes[size],
        checked 
          ? "bg-primary-600 border-primary-600" 
          : "bg-neutral-200 border-neutral-200 dark:bg-neutral-700 dark:border-neutral-700",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      data-state={checked ? "checked" : "unchecked"}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200",
          thumbSizes[size],
          checked ? translateSizes[size] : "translate-x-0",
        )}
        data-state={checked ? "checked" : "unchecked"}
      />
    </button>
  )
})

Switch.displayName = "Switch"

export { Switch }
