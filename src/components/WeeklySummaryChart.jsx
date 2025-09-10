import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Activity, Heart, Brain } from 'lucide-react'

const WeeklySummaryChart = ({ 
  data = [], 
  type = 'line',
  title = 'Weekly Progress',
  className = '' 
}) => {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  // Mock data for demonstration
  const mockData = data.length > 0 ? data : [
    { day: 'Mon', value: 85, activities: 3, mood: 'positive' },
    { day: 'Tue', value: 92, activities: 4, mood: 'positive' },
    { day: 'Wed', value: 78, activities: 2, mood: 'neutral' },
    { day: 'Thu', value: 88, activities: 3, mood: 'positive' },
    { day: 'Fri', value: 95, activities: 5, mood: 'positive' },
    { day: 'Sat', value: 82, activities: 2, mood: 'neutral' },
    { day: 'Sun', value: 90, activities: 4, mood: 'positive' }
  ]

  useEffect(() => {
    // Simple chart implementation without external dependencies
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Chart dimensions
    const padding = 40
    const chartWidth = rect.width - (padding * 2)
    const chartHeight = rect.height - (padding * 2)
    const maxValue = Math.max(...mockData.map(d => d.value))

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()
    }

    // Draw data points and lines
    ctx.strokeStyle = '#3b82f6'
    ctx.fillStyle = '#3b82f6'
    ctx.lineWidth = 3

    mockData.forEach((point, index) => {
      const x = padding + (chartWidth / (mockData.length - 1)) * index
      const y = padding + chartHeight - (point.value / maxValue) * chartHeight

      // Draw line
      if (index > 0) {
        const prevPoint = mockData[index - 1]
        const prevX = padding + (chartWidth / (mockData.length - 1)) * (index - 1)
        const prevY = padding + chartHeight - (prevPoint.value / maxValue) * chartHeight

        ctx.beginPath()
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(x, y)
        ctx.stroke()
      }

      // Draw data point
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()

      // Draw day labels
      ctx.fillStyle = '#6b7280'
      ctx.font = '12px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(point.day, x, rect.height - 10)
    })

    // Draw value labels
    ctx.fillStyle = '#374151'
    ctx.font = '14px Inter, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('0', 5, rect.height - padding)
    ctx.fillText(maxValue.toString(), 5, padding + 5)

  }, [mockData])

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'positive': return '😊'
      case 'neutral': return '😐'
      case 'negative': return '😔'
      default: return '😊'
    }
  }

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'positive': return 'text-green-500'
      case 'neutral': return 'text-yellow-500'
      case 'negative': return 'text-red-500'
      default: return 'text-green-500'
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`wellness-card p-6 ${className}`}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">
            {title}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <TrendingUp className="w-4 h-4" />
            <span>+12% this week</span>
          </div>
        </div>

        {/* Chart */}
        <div className="relative">
          <canvas 
            ref={canvasRef}
            className="w-full h-48 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20 rounded-lg"
            aria-label="Weekly progress chart showing daily wellness scores"
          />
        </div>

        {/* Data Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 mx-auto mb-2">
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-lg font-semibold text-text-primary">
              {mockData.reduce((sum, day) => sum + day.activities, 0)}
            </div>
            <div className="text-xs text-text-secondary">Activities</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-2">
              <Heart className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-lg font-semibold text-text-primary">
              {Math.round(mockData.reduce((sum, day) => sum + day.value, 0) / mockData.length)}
            </div>
            <div className="text-xs text-text-secondary">Avg Score</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 mx-auto mb-2">
              <Brain className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-lg font-semibold text-text-primary">
              {mockData.filter(day => day.mood === 'positive').length}
            </div>
            <div className="text-xs text-text-secondary">Good Days</div>
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-text-primary">Daily Breakdown</h4>
          <div className="grid grid-cols-7 gap-2">
            {mockData.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="text-xs font-medium text-text-primary">{day.day}</div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{day.value}</div>
                <div className="text-xs text-text-secondary">{day.activities} activities</div>
                <div className={`text-sm ${getMoodColor(day.mood)}`}>
                  {getMoodIcon(day.mood)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Encouraging Message */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg"
        >
          <p className="text-sm text-text-secondary">
            {mockData.filter(day => day.mood === 'positive').length >= 5 
              ? "Amazing week! You're building great habits! 🌟"
              : mockData.filter(day => day.mood === 'positive').length >= 3
              ? "Good progress! Keep up the momentum! 💪"
              : "Every day is a new opportunity to grow! 🌱"
            }
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default WeeklySummaryChart

