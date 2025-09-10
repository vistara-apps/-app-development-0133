import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { Input } from '../components/Input'
import WellnessSnapshot from '../components/WellnessSnapshot'
import ActivityCard from '../components/ActivityCard'
import GamificationPanel from '../components/GamificationPanel'
import OneTapIntegrations from '../components/OneTapIntegrations'
import { useDataStore } from '../stores/dataStore'
import { useSettingsStore } from '../stores/settingsStore'
import { useStressDetection } from '../hooks/useStressDetection'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Play, 
  Clock, 
  Star, 
  Filter,
  Heart,
  Brain,
  Smile,
  Zap,
  Users,
  ArrowRight,
  Sparkles,
  Target,
  CheckCircle,
  Shield,
  BookOpen,
  Activity,
  Calendar,
  MessageSquare,
  Share2,
  Leaf,
  Sun,
  Moon
} from 'lucide-react'

export function HomePage() {
  const { activities, addActivityLog, dailyEntries, getActivityCompletionStreak, getCheckInStreak, getTodayEntry } = useDataStore()
  const { privacy } = useSettingsStore()
  const { stressLevel } = useStressDetection()
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [showActivity, setShowActivity] = useState(false)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [filter, setFilter] = useState('all')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Set initial filter and auto-start from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const filterParam = urlParams.get('filter')
    const startParam = urlParams.get('start')
    
    if (filterParam && ['mindfulness', 'social', 'journaling', 'relaxation', 'gratitude'].includes(filterParam)) {
      // Map alternative filter names to standard ones
      const filterMap = {
        'relaxation': 'mindfulness',
        'gratitude': 'journaling'
      }
      setFilter(filterMap[filterParam] || filterParam)
    }
    
    if (startParam) {
      const activity = activities.find(a => a.activityId === startParam)
      if (activity) {
        startActivity(activity)
      }
    }
  }, [location.search, activities])

  const todayEntry = getTodayEntry()
  const checkInStreak = getCheckInStreak()
  const activityStreak = getActivityCompletionStreak()

  // Enhanced activity types with nature-inspired categories
  const activityTypes = {
    'me-time': { icon: Heart, color: 'text-pink-500', label: 'Me Time', description: 'Personal wellness moments' },
    'family-time': { icon: Users, color: 'text-green-500', label: 'Family Time', description: 'Connection and bonding' },
    'meditation': { icon: Brain, color: 'text-blue-500', label: 'Meditation', description: 'Mindful awareness' },
    'mindfulness': { icon: Leaf, color: 'text-emerald-500', label: 'Mindfulness', description: 'Present moment awareness' },
    'social': { icon: Users, color: 'text-purple-500', label: 'Social', description: 'Community connection' },
    'journaling': { icon: Heart, color: 'text-rose-500', label: 'Journaling', description: 'Reflection and growth' }
  }

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter)

  const startActivity = (activity) => {
    setSelectedActivity(activity)
    setShowActivity(true)
  }

  const completeActivity = () => {
    if (!selectedActivity || rating === 0) return

    addActivityLog({
      userId: 'demo-user-1',
      activityId: selectedActivity.activityId,
      completionDate: new Date().toISOString().split('T')[0],
      rating,
      feedback,
      activity: selectedActivity
    })

    setShowActivity(false)
    setSelectedActivity(null)
    setRating(0)
    setFeedback('')
  }

  // Sample data for gamification
  const gamificationData = {
    totalScore: 1250,
    currentStreak: activityStreak,
    badges: [
      { id: 1, type: 'first-week', name: 'First Week', earned: true },
      { id: 2, type: 'streak-master', name: 'Streak Master', earned: true },
      { id: 3, type: 'mindfulness-ninja', name: 'Mindfulness Ninja', earned: false },
      { id: 4, type: 'community-hero', name: 'Community Hero', earned: false }
    ],
    quests: [
      { id: 1, type: 'daily-checkin', title: 'Daily Check-in', description: 'Complete your daily wellness check', progress: 5, target: 7 },
      { id: 2, type: 'weekly-goal', title: 'Weekly Goal', description: 'Complete 5 activities this week', progress: 3, target: 5 },
      { id: 3, type: 'streak-challenge', title: 'Streak Challenge', description: 'Maintain a 7-day streak', progress: activityStreak, target: 7 }
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wellness-serenity via-wellness-tranquility to-wellness-peace dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-700">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-wellness-calm/30 text-wellness-harmony font-medium shadow-soft">
            <Sparkles className="h-5 w-5" />
            Welcome to ResilientFlow
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
            Build Your
            <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Emotional Resilience
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Gentle practices for daily emotional wellness. Start with activities that nurture your mind, body, and spirit.
          </p>
        </motion.div>

        {/* Wellness Snapshot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <WellnessSnapshot 
            score={todayEntry?.emotionalScore || 150}
            streak={activityStreak}
            stressLevel={stressLevel?.toLowerCase() || 'moderate'}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Activities */}
          <div className="lg:col-span-2 space-y-8">
            {/* Activity Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-text-primary">
                  Choose Your Wellness Journey
                </h2>
                <p className="text-text-secondary">
                  Select activities that resonate with your needs today
                </p>
              </div>

              {/* Activity Type Filter */}
              <div className="flex flex-wrap justify-center gap-3">
                {Object.entries(activityTypes).map(([key, type]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter(filter === key ? 'all' : key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      filter === key 
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-800' 
                        : 'bg-white/80 dark:bg-gray-800/80 text-text-secondary border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <type.icon className={`w-4 h-4 inline mr-2 ${type.color}`} />
                    {type.label}
                  </motion.button>
                ))}
              </div>

              {/* Activities Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {filteredActivities.slice(0, 6).map((activity, index) => (
                  <motion.div
                    key={activity.activityId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <ActivityCard 
                      activity={activity}
                      onClick={() => startActivity(activity)}
                    />
                  </motion.div>
                ))}
              </div>

              {/* View All Activities */}
              {filteredActivities.length > 6 && (
                <div className="text-center">
                  <Button 
                    variant="secondary"
                    onClick={() => navigate('/activities')}
                    className="inline-flex items-center space-x-2"
                  >
                    <span>View All Activities</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Gamification & Integrations */}
          <div className="space-y-8">
            {/* Gamification Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <GamificationPanel {...gamificationData} />
            </motion.div>

            {/* One-Tap Integrations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <OneTapIntegrations />
            </motion.div>
          </div>
        </div>

        {/* Support Circles CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="p-8 text-center bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 border-2 border-blue-200 dark:border-blue-800">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/50 dark:to-green-900/50">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold text-text-primary">
                Practice Together
              </h3>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Join supportive communities and share your wellness journey with others who understand.
              </p>
              <Button 
                onClick={() => navigate('/circles')}
                className="inline-flex items-center space-x-2 px-8 py-3"
              >
                <Users className="w-5 h-5" />
                <span>Explore Circles</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Activity Modal */}
        <Modal
          isOpen={showActivity}
          onClose={() => setShowActivity(false)}
          title={selectedActivity?.name}
          className="max-w-2xl"
        >
          {selectedActivity && (
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-xl">
                <h4 className="font-semibold text-text-primary mb-3">Instructions</h4>
                <p className="text-text-secondary whitespace-pre-line leading-relaxed">
                  {selectedActivity.guideContent}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-3">
                    How helpful was this activity? *
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setRating(star)}
                        className={`w-10 h-10 transition-colors ${
                          star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
                        }`}
                      >
                        <Star className="w-full h-full fill-current" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Any thoughts or feedback? (optional)"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="How did this activity make you feel?"
                  rows={4}
                />
              </div>

              <div className="flex space-x-4">
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => setShowActivity(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={completeActivity}
                  disabled={rating === 0}
                >
                  Complete Activity
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}
