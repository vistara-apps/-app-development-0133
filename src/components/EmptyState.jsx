import React from 'react'
import { Button } from './Button'

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  actionText,
  secondaryAction,
  secondaryActionText,
  className = '',
  size = 'default',
  illustration,
}) {
  const sizes = {
    small: {
      container: 'py-6',
      icon: 'w-10 h-10',
      title: 'text-lg',
    },
    default: {
      container: 'py-12',
      icon: 'w-16 h-16',
      title: 'text-xl',
    },
    large: {
      container: 'py-16',
      icon: 'w-20 h-20',
      title: 'text-2xl',
    },
  }

  return (
    <div className={`
      flex flex-col items-center justify-center text-center px-4
      ${sizes[size].container}
      ${className}
    `}>
      {illustration && (
        <div className="mb-6">{illustration}</div>
      )}
      
      {Icon && (
        <div className={`
          text-text-tertiary dark:text-text-tertiary mb-4
          ${sizes[size].icon}
        `}>
          <Icon className="w-full h-full" aria-hidden="true" />
        </div>
      )}
      
      {title && (
        <h3 className={`
          font-medium text-text-primary dark:text-text-primary
          ${sizes[size].title}
        `}>
          {title}
        </h3>
      )}
      
      {description && (
        <p className="mt-2 text-text-secondary dark:text-text-secondary max-w-md mx-auto">
          {description}
        </p>
      )}
      
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {action && (
            <Button onClick={action}>
              {actionText || 'Get Started'}
            </Button>
          )}
          
          {secondaryAction && (
            <Button 
              variant="secondary" 
              onClick={secondaryAction}
            >
              {secondaryActionText || 'Learn More'}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

