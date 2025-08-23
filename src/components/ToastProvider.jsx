import React, { createContext, useContext, useState, useCallback } from 'react'
import { Toast } from './Toast'

const ToastContext = createContext(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children, position = 'bottom-right' }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
    const id = Date.now().toString()
    setToasts((prevToasts) => [...prevToasts, { id, type, title, message, duration }])
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  const value = {
    toast: {
      success: (props) => addToast({ type: 'success', ...props }),
      error: (props) => addToast({ type: 'error', ...props }),
      warning: (props) => addToast({ type: 'warning', ...props }),
      info: (props) => addToast({ type: 'info', ...props }),
    },
    removeToast,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            position={position}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

