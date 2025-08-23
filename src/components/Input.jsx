import React, { forwardRef } from 'react'

export const Input = forwardRef(({ 
  label, 
  error, 
  className = '',
  id,
  helperText,
  required = false,
  startIcon = null,
  endIcon = null,
  type = 'text',
  ...props 
}, ref) => {
  // Generate a unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`
  
  return (
    <div className={className}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2"
        >
          {label}
          {required && <span className="text-error ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      
      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-text-tertiary dark:text-dark-text-tertiary">{startIcon}</span>
          </div>
        )}
        
        <input
          id={inputId}
          ref={ref}
          type={type}
          className={`
            w-full border rounded-md shadow-sm 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary
            disabled:bg-bg disabled:text-text-tertiary dark:disabled:bg-dark-bg dark:disabled:text-dark-text-tertiary
            ${error ? 'border-error text-error focus-visible:ring-error/50 focus-visible:border-error' : 'border-border dark:border-dark-border'}
            ${startIcon ? 'pl-10' : 'pl-3'} 
            ${endIcon ? 'pr-10' : 'pr-3'} 
            py-2
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          required={required}
          {...props}
        />
        
        {endIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-text-tertiary dark:text-dark-text-tertiary">{endIcon}</span>
          </div>
        )}
      </div>
      
      {error && (
        <p 
          id={`${inputId}-error`} 
          className="mt-1 text-sm text-error"
          role="alert"
        >
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p 
          id={`${inputId}-helper`} 
          className="mt-1 text-sm text-text-secondary dark:text-dark-text-secondary"
        >
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
