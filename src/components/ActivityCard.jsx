import React from 'react'
import { motion } from 'framer-motion'
import { Play, Clock, Users, Heart, Brain, Leaf, Sparkles } from 'lucide-react'

const ActivityCard = ({ 
  activity, 
  onClick, 
  className = '',
  variant = 'default' 
}) => {
  // Activity type configurations with nature-inspired icons and colors
  const activityConfig = {
    'me-time': {
      icon: Heart,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-950/20',
      borderColor: 'border-pink-200 dark:border-pink-800',
      gradient: 'from-pink-100 to-rose-100 dark:from-pink-950/30 dark:to-rose-950/30'
    },
    'family-time': {
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      borderColor: 'border-green-200 dark:border-green-800',
      gradient: 'from-green-100 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30'
    },
    'meditation': {
      icon: Brain,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      gradient: 'from-blue-100 to-sky-100 dark:from-blue-950/30 dark:to-sky-950/30'
    },
    'mindfulness': {
      icon: Leaf,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      gradient: 'from-emerald-100 to-teal-100 dark:from-emerald-950/30 dark:to-teal-950/30'
    },
    'social': {
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      gradient: 'from-purple-100 to-violet-100 dark:from-purple-950/30 dark:to-violet-950/30'
    },
    'journaling': {
      icon: Heart,
      color: 'text-rose-500',
      bgColor: 'bg-rose-50 dark:bg-rose-950/20',
      borderColor: 'border-rose-200 dark:border-rose-800',
      gradient: 'from-rose-100 to-pink-100 dark:from-rose-950/30 dark:to-pink-950/30'
    }
  }

  const config = activityConfig[activity.type] || activityConfig['mindfulness']
  const IconComponent = config.icon

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className={`wellness-card p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${className}`}
      onClick={onClick}
    >
      <div className="space-y-4">
        {/* Header with icon and type */}
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-xl ${config.bgColor}`}>
            <IconComponent className={`w-6 h-6 ${config.color}`} />
          </div>
          <div className="text-xs font-medium text-text-secondary uppercase tracking-wide">
            {activity.type.replace('-', ' ')}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-text-primary leading-tight">
            {activity.name}
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {activity.description}
          </p>
        </div>

        {/* Footer with duration and action */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-1 text-xs text-text-secondary">
            <Clock className="w-3 h-3" />
            <span>{activity.duration || '5-10 min'}</span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${config.bgColor} ${config.color} hover:shadow-md`}
          >
            <Play className="w-4 h-4 mr-1" />
            Start
          </motion.button>
        </div>

        {/* Subtle gradient overlay for visual appeal */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none`} />
      </div>
    </motion.div>
  )
}

export default ActivityCard