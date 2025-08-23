import React, { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export function Toast({
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  position = 'bottom-right',
  showProgress = true,
}) {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (duration === Infinity) return

    const timer = setTimeout(() => {
      setVisible(false)
      if (onClose) setTimeout(onClose, 300) // Allow animation to complete
    }, duration)

    // Progress bar animation
    if (showProgress) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (duration / 100))
          return newProgress < 0 ? 0 : newProgress
        })
      }, 100)

      return () => {
        clearTimeout(timer)
        clearInterval(interval)
      }
    }

    return () => clearTimeout(timer)
  }, [duration, onClose, showProgress])

  const handleClose = () => {
    setVisible(false)
    if (onClose) setTimeout(onClose, 300) // Allow animation to complete
  }

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success" />,
    error: <AlertCircle className="w-5 h-5 text-error" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning" />,
    info: <Info className="w-5 h-5 text-info" />,
  }

  const backgrounds = {
    success: 'bg-success-light border-l-4 border-success',
    error: 'bg-error-light border-l-4 border-error',
    warning: 'bg-warning-light border-l-4 border-warning',
    info: 'bg-info-light border-l-4 border-info',
  }

  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  }

  return (
    <div
      className={`
        fixed ${positions[position]} z-50 max-w-md w-full transform transition-all duration-300 ease-in-out
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 pointer-events-none'}
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className={`${backgrounds[type]} rounded-md shadow-lg overflow-hidden`}>
        <div className="p-4 pr-10">
          <div className="flex items-start">
            <div className="flex-shrink-0">{icons[type]}</div>
            <div className="ml-3 w-0 flex-1">
              {title && (
                <p className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                  {title}
                </p>
              )}
              {message && (
                <p className="mt-1 text-sm text-text-secondary dark:text-dark-text-secondary">
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <button
          className="absolute top-2 right-2 text-text-tertiary hover:text-text-primary dark:text-dark-text-tertiary dark:hover:text-dark-text-primary p-1 rounded-full"
          onClick={handleClose}
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
        
        {showProgress && (
          <div className="h-1 bg-gray-200 dark:bg-dark-border">
            <div
              className={`h-full transition-all ease-linear duration-100 ${
                type === 'success' ? 'bg-success' :
                type === 'error' ? 'bg-error' :
                type === 'warning' ? 'bg-warning' : 'bg-info'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

