import React from 'react';
import { cn } from '../../utils/cn';

const Switch = React.forwardRef(({ 
  className, 
  checked, 
  onCheckedChange, 
  disabled = false,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        checked ? "bg-primary" : "bg-input",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      data-state={checked ? "checked" : "unchecked"}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white dark:bg-neutral-900 shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
          checked ? "translate-x-5" : "translate-x-0"
        )}
        data-state={checked ? "checked" : "unchecked"}
      />
    </button>
  );
});

Switch.displayName = "Switch";

export { Switch };
