import React from 'react'

export function Input({ 
  label, 
  error, 
  className = '', 
  ...props 
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
          disabled:bg-gray-50 disabled:text-text-secondary
          ${error ? 'border-red-300' : 'border-gray-300'}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}