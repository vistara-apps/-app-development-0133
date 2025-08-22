import React from 'react'

export function Card({ children, variant = 'default', className = '', ...props }) {
  const variants = {
    default: 'bg-surface rounded-lg shadow-card border border-gray-100',
    elevated: 'bg-surface rounded-lg shadow-modal border border-gray-100'
  }

  return (
    <div 
      className={`${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </div>
  )
}