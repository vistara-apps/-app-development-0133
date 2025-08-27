import React, { forwardRef } from 'react'

export const Card = forwardRef(({ 
  children, 
  variant = 'default', 
  className = '',
  interactive = false,
  onClick,
  title,
  titleElement = 'h3',
  subtitle,
  headerAction,
  footer,
  ...props 
}, ref) => {
  const variants = {
    default: 'bg-white rounded-lg shadow-sm border border-gray-200',
    elevated: 'bg-white rounded-lg shadow-lg border border-gray-200',
    flat: 'bg-white rounded-lg border border-gray-200',
    outline: 'bg-transparent rounded-lg border border-gray-300'
  }

  const interactiveClasses = interactive 
    ? 'cursor-pointer transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-50' 
    : '';

  const TitleElement = titleElement;

  const hasHeader = title || subtitle || headerAction;
  const hasFooter = footer;

  return (
    <div 
      ref={ref}
      className={`${variants[variant]} ${interactiveClasses} ${className}`}
      onClick={interactive ? onClick : undefined}
      tabIndex={interactive && onClick ? 0 : undefined}
      role={interactive && onClick ? 'button' : undefined}
      onKeyDown={interactive && onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
      } : undefined}
      {...props}
    >
      {/* Card Header */}
      {hasHeader && (
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            {title && (
              <TitleElement className="text-lg font-medium text-gray-900">
                {title}
              </TitleElement>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && (
            <div>{headerAction}</div>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className={`${!hasHeader && !hasFooter ? 'p-6' : ''}`}>
        {children}
      </div>

      {/* Card Footer */}
      {hasFooter && (
        <div className="p-6 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  )
})

Card.displayName = 'Card'
