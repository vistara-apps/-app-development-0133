import React from 'react'

export function SkeletonLoader({ 
  variant = 'text', 
  width, 
  height, 
  className = '',
  count = 1,
  animate = true,
  rounded = 'md'
}) {
  const baseClasses = `bg-gray-200 dark:bg-neutral-700 ${
    animate ? 'animate-pulse' : ''
  }`
  
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  }
  
  const variants = {
    text: `h-4 ${roundedClasses[rounded]}`,
    avatar: `h-10 w-10 ${roundedClasses.full}`,
    button: `h-10 ${roundedClasses[rounded]}`,
    card: `h-32 ${roundedClasses[rounded]}`,
    image: `${roundedClasses[rounded]}`,
    custom: ''
  }

  const renderSkeleton = (index) => (
    <div
      key={index}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      style={{
        width: width || (variant === 'text' ? '100%' : undefined),
        height: height || undefined
      }}
      aria-hidden="true"
    />
  )

  // For multiple skeletons
  if (count > 1) {
    return (
      <div className="space-y-2">
        {[...Array(count)].map((_, index) => renderSkeleton(index))}
      </div>
    )
  }

  return renderSkeleton(0)
}

// Specialized skeleton components
export function TextSkeleton({ lines = 1, className = '', width = '100%' }) {
  return (
    <div className="space-y-2">
      {[...Array(lines)].map((_, index) => (
        <SkeletonLoader 
          key={index} 
          variant="text" 
          className={className}
          width={typeof width === 'function' ? width(index) : width}
        />
      ))}
    </div>
  )
}

export function CardSkeleton({ className = '' }) {
  return (
    <div className={`p-6 space-y-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 dark:border-dark-border ${className}`}>
      <SkeletonLoader variant="text" width="60%" />
      <TextSkeleton lines={3} />
      <div className="flex justify-between items-center pt-2">
        <SkeletonLoader variant="text" width="30%" />
        <SkeletonLoader variant="button" width="80px" />
      </div>
    </div>
  )
}

export function AvatarWithTextSkeleton({ className = '' }) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <SkeletonLoader variant="avatar" />
      <div className="space-y-2 flex-1">
        <SkeletonLoader variant="text" width="40%" />
        <SkeletonLoader variant="text" width="70%" />
      </div>
    </div>
  )
}

