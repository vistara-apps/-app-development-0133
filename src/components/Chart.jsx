import React from 'react'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'

export function Chart({ variant = 'line', data, className = '' }) {
  if (variant === 'line') {
    return (
      <div className={`w-full h-64 ${className}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(210, 70%, 50%)" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (variant === 'bar') {
    return (
      <div className={`w-full h-64 ${className}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="hsl(130, 70%, 50%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return null
}