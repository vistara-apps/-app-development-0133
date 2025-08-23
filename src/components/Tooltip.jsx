import React, { useState, useRef, useEffect } from 'react'

export function Tooltip({ 
  children, 
  content, 
  position = 'top',
  delay = 300,
  className = '',
  maxWidth = '200px'
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)
  const tooltipRef = useRef(null)
  const timerRef = useRef(null)

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return
    
    const triggerRect = triggerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const scrollY = window.scrollY
    const scrollX = window.scrollX
    
    let top = 0
    let left = 0
    
    switch (position) {
      case 'top':
        top = triggerRect.top + scrollY - tooltipRect.height - 8
        left = triggerRect.left + scrollX + (triggerRect.width / 2) - (tooltipRect.width / 2)
        break
      case 'bottom':
        top = triggerRect.bottom + scrollY + 8
        left = triggerRect.left + scrollX + (triggerRect.width / 2) - (tooltipRect.width / 2)
        break
      case 'left':
        top = triggerRect.top + scrollY + (triggerRect.height / 2) - (tooltipRect.height / 2)
        left = triggerRect.left + scrollX - tooltipRect.width - 8
        break
      case 'right':
        top = triggerRect.top + scrollY + (triggerRect.height / 2) - (tooltipRect.height / 2)
        left = triggerRect.right + scrollX + 8
        break
      default:
        top = triggerRect.top + scrollY - tooltipRect.height - 8
        left = triggerRect.left + scrollX + (triggerRect.width / 2) - (tooltipRect.width / 2)
    }
    
    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    if (left < 10) left = 10
    if (left + tooltipRect.width > viewportWidth - 10) {
      left = viewportWidth - tooltipRect.width - 10
    }
    
    if (top < 10) {
      // If tooltip would go off the top, flip to bottom
      if (position === 'top') {
        top = triggerRect.bottom + scrollY + 8
      } else {
        top = 10
      }
    }
    
    if (top + tooltipRect.height > viewportHeight + scrollY - 10) {
      // If tooltip would go off the bottom, flip to top
      if (position === 'bottom') {
        top = triggerRect.top + scrollY - tooltipRect.height - 8
      } else {
        top = viewportHeight + scrollY - tooltipRect.height - 10
      }
    }
    
    setTooltipPosition({ top, left })
  }

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setIsVisible(true)
      // Calculate position after tooltip is visible
      setTimeout(calculatePosition, 0)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setIsVisible(false)
  }

  // Recalculate position on window resize
  useEffect(() => {
    if (isVisible) {
      window.addEventListener('resize', calculatePosition)
      window.addEventListener('scroll', calculatePosition)
      
      return () => {
        window.removeEventListener('resize', calculatePosition)
        window.removeEventListener('scroll', calculatePosition)
      }
    }
  }, [isVisible])

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return (
    <div 
      className="inline-block relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      ref={triggerRef}
    >
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 px-3 py-2 text-sm font-medium text-white bg-text-primary dark:bg-dark-text-primary
            rounded-md shadow-lg pointer-events-none transition-opacity duration-200
            ${isVisible ? 'opacity-100' : 'opacity-0'}
            ${className}
          `}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            maxWidth
          }}
          role="tooltip"
        >
          {content}
          <div 
            className={`
              absolute w-2 h-2 bg-text-primary dark:bg-dark-text-primary transform rotate-45
              ${position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' : ''}
              ${position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' : ''}
              ${position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' : ''}
              ${position === 'right' ? 'left-[-4px] top-1/2 -translate-y-1/2' : ''}
            `}
          />
        </div>
      )}
    </div>
  )
}

