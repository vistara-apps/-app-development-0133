import React from 'react'
import { motion } from 'framer-motion'
import { Flame, Heart, Shield, TrendingUp } from 'lucide-react'

const WellnessSnapshot = ({ 
  score = 150, 
  streak = 7, 
  stressLevel = 'moderate',
  className = '' 
}) => {
  // Calculate score ring progress (100-200 range)
  const scoreProgress = Math.min(Math.max((score - 100) / 100, 0), 1)
  const scorePercentage = Math.round(scoreProgress * 100)
  
  // Stress level configuration
  const stressConfig = {
    low: { emoji: '😌', color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-950/20' },
    moderate: { emoji: '😐', color: 'text-yellow-500', bgColor: 'bg-yellow-50 dark:bg-yellow-950/20' },
    high: { emoji: '😰', color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-950/20' }
  }
  
  const currentStress = stressConfig[stressLevel] || stressConfig.moderate

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`wellness-card p-6 ${className}`}
    >
      <div className="text-center space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-text-primary">
            Wellness Snapshot
          </h2>
          <p className="text-sm text-text-secondary">
            Your resilience journey today
          </p>
        </div>

        {/* Score Ring */}
        <div className="relative flex justify-center">
          <div className="relative w-32 h-32">
            {/* Background circle */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className="text-blue-500"
                strokeDasharray={`${2 * Math.PI * 40}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - scoreProgress) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            
            {/* Score text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {score}
              </div>
              <div className="text-xs text-text-secondary">
                points
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Streak */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-950/20 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-lg font-semibold text-orange-600 dark:text-orange-400">
              {streak}
            </div>
            <div className="text-xs text-text-secondary">
              day streak
            </div>
          </motion.div>

          {/* Stress Level */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center"
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${currentStress.bgColor} mb-2`}>
              <span className="text-lg">{currentStress.emoji}</span>
            </div>
            <div className={`text-lg font-semibold ${currentStress.color}`}>
              {stressLevel}
            </div>
            <div className="text-xs text-text-secondary">
              stress level
            </div>
          </motion.div>

          {/* Trend */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-50 dark:bg-green-950/20 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
              +12%
            </div>
            <div className="text-xs text-text-secondary">
              this week
            </div>
          </motion.div>
        </div>

        {/* Encouraging Message */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="pt-2"
        >
          <p className="text-sm text-text-secondary italic">
            {score >= 180 ? "You're thriving! 🌟" : 
             score >= 150 ? "Great progress today! 💪" : 
             score >= 120 ? "Building resilience step by step 🌱" : 
             "Every small step counts 🌸"}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default WellnessSnapshot