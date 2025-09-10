import React from 'react'
import { motion } from 'framer-motion'
import { Flame, Trophy, Star, Target, Award, Zap } from 'lucide-react'

const GamificationPanel = ({ 
  totalScore = 1250,
  currentStreak = 7,
  badges = [],
  quests = [],
  className = ''
}) => {
  // Badge configurations
  const badgeConfig = {
    'first-week': { icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-50 dark:bg-yellow-950/20' },
    'streak-master': { icon: Flame, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-950/20' },
    'mindfulness-ninja': { icon: Zap, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-950/20' },
    'community-hero': { icon: Trophy, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-950/20' }
  }

  // Quest configurations
  const questConfig = {
    'daily-checkin': { icon: Target, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-950/20' },
    'weekly-goal': { icon: Award, color: 'text-indigo-500', bgColor: 'bg-indigo-50 dark:bg-indigo-950/20' },
    'streak-challenge': { icon: Flame, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-950/20' }
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
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold text-text-primary">
            Your Resilience Journey
          </h2>
          <p className="text-sm text-text-secondary">
            Celebrate your progress and unlock achievements
          </p>
        </div>

        {/* Total Score */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-950/30 dark:to-green-950/30 mb-3">
            <Trophy className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {totalScore.toLocaleString()}
          </div>
          <div className="text-sm text-text-secondary">
            Total Resilience Points
          </div>
        </div>

        {/* Resilience Flame Streak */}
        <div className="text-center">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-950/30 dark:to-red-950/30 mb-2"
          >
            <Flame className="w-6 h-6 text-orange-500" />
          </motion.div>
          <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
            {currentStreak} Day Streak
          </div>
          <div className="text-xs text-text-secondary">
            Keep the flame burning! 🔥
          </div>
        </div>

        {/* Active Quests */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">
            Active Quests
          </h3>
          <div className="space-y-2">
            {quests.map((quest, index) => {
              const config = questConfig[quest.type] || questConfig['daily-checkin']
              const IconComponent = config.icon
              
              return (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className={`p-2 rounded-lg ${config.bgColor}`}>
                    <IconComponent className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-text-primary">
                      {quest.title}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {quest.description}
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-text-secondary">
                    {quest.progress}/{quest.target}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Recent Badges */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">
            Recent Badges
          </h3>
          <div className="flex space-x-3">
            {badges.slice(0, 4).map((badge, index) => {
              const config = badgeConfig[badge.type] || badgeConfig['first-week']
              const IconComponent = config.icon
              
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center space-y-1"
                >
                  <div className={`p-3 rounded-full ${config.bgColor}`}>
                    <IconComponent className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div className="text-xs text-center text-text-secondary">
                    {badge.name}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Encouraging Message */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center pt-2"
        >
          <p className="text-sm text-text-secondary italic">
            {currentStreak >= 30 ? "You're a resilience champion! 🏆" :
             currentStreak >= 14 ? "Amazing consistency! Keep going! 🌟" :
             currentStreak >= 7 ? "Great momentum! You're building strong habits! 💪" :
             "Every day counts! You're doing great! 🌱"}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default GamificationPanel