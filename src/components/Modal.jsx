import React from 'react'
import { X } from 'lucide-react'

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = '' 
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={onClose}
        />
        <div className={`
          relative bg-surface rounded-lg shadow-modal max-w-md w-full p-6
          ${className}
        `}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-text-primary">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}