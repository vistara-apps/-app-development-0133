import React from 'react'
import { Card } from './Card'

export function ProgressTracker({ variant = 'daily', data, title }) {
  if (variant === 'daily') {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">{title}</h3>
        <div className="grid grid-cols-7 gap-2">
          {data?.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-text-secondary mb-1">
                {day.label}
              </div>
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                ${day.completed 
                  ? 'bg-accent text-white' 
                  : 'bg-gray-200 text-text-secondary'
                }
              `}>
                {day.value}
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-text-primary mb-4">{title}</h3>
      <div className="space-y-3">
        {data?.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">{item.label}</span>
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-medium text-text-primary">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}