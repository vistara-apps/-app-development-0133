import React, { useState, useEffect } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { Input } from '../components/Input'
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
  Activity
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

  const activityTypes = {
    mindfulness: { icon: Brain, color: 'text-blue-500', label: 'Mindfulness' },
    social: { icon: Users, color: 'text-green-500', label: 'Social' },
    journaling: { icon: Heart, color: 'text-pink-500', label: 'Journaling' }
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

  const handleConnectCalendar = () => {
    // Ensure external integrations are enabled in privacy settings
    const { privacy, updatePrivacy } = useSettingsStore.getState()
    
    if (!privacy.allowExternalIntegrations) {
      updatePrivacy({ allowExternalIntegrations: true })
    }

    // Navigate to integrations page
    navigate('/integrations')
  }

  const quickStats = [
    {
      label: 'Today\'s Score',
      value: todayEntry?.emotionalScore || 0,
      icon: <Heart className="h-4 w-4" />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-950/20'
    },
    {
      label: 'Stress Level',
      value: stressLevel || 'Low',
      icon: <Shield className="h-4 w-4" />,
      color: stressLevel === 'High' ? 'text-red-600' : stressLevel === 'Moderate' ? 'text-yellow-600' : 'text-green-600',
      bgColor: stressLevel === 'High' ? 'bg-red-50 dark:bg-red-950/20' : stressLevel === 'Moderate' ? 'bg-yellow-50 dark:bg-yellow-950/20' : 'bg-green-50 dark:bg-green-950/20'
    },
    {
      label: 'Streak',
      value: `${activityStreak} days`,
      icon: <Target className="h-4 w-4" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Simple Welcome Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-wellness-peace border border-wellness-calm/30 text-wellness-harmony font-medium">
          <Sparkles className="h-4 w-4" />
          Welcome to Emogence
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-balance">
          Build Your
          <span className="text-gradient-wellness block">Emotional Strength</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Simple practices for daily emotional wellness. Start with activities that fit your life.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {quickStats.map((stat, index) => (
          <div key={stat.label} className="wellness-card text-center p-4">
            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${stat.bgColor} mb-2`}>
              <div className={stat.color}>
                {stat.icon}
              </div>
            </div>
            <div className={`text-lg font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Activity Filter */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Choose Your Activity</h2>
          <p className="text-text-secondary">Simple practices for emotional wellness</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-text-secondary" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Types</option>
            {Object.entries(activityTypes).map(([key, type]) => (
              <option key={key} value={key}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Activity Categories */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(activityTypes).map(([key, type]) => (
          <Card 
            key={key} 
            className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
              filter === key ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setFilter(filter === key ? 'all' : key)}
          >
            <div className="text-center">
              <type.icon className={`w-6 h-6 mx-auto mb-2 ${type.color}`} />
              <div className="font-medium text-text-primary text-sm">{type.label}</div>
              <div className="text-xs text-text-secondary">
                {activities.filter(a => a.type === key).length} activities
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Support Circles Promotion */}
      <Card className="p-4 border-l-4 border-primary">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-text-primary">
                Practice Together
              </h3>
              <p className="text-sm text-text-secondary">
                Join support circles for shared wellness
              </p>
            </div>
          </div>
          <Link 
            to="/circles"
            className="inline-flex items-center px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm"
          >
            Explore
            <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>
      </Card>
      
      {/* Activities Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActivities.map((activity) => {
          const TypeIcon = activityTypes[activity.type]?.icon || Brain
          const typeColor = activityTypes[activity.type]?.color || 'text-gray-500'
          
          return (
            <Card key={activity.activityId} className="p-4 hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <TypeIcon className={`w-5 h-5 ${typeColor}`} />
                  <div className="text-xs text-text-secondary capitalize">
                    {activity.type}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-text-primary mb-1">
                    {activity.name}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {activity.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-text-secondary">
                    <Clock className="w-3 h-3" />
                    <span>5-10 min</span>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => startActivity(activity)}
                    className="text-xs px-3 py-1"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Start
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Calendar Integration CTA */}
      <Card className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-wellness-calm to-wellness-peace mb-4">
          <Zap className="h-6 w-6 text-white" />
        </div>
        
        <h3 className="text-lg font-semibold mb-2">
          Connect Your Calendar
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Get timely reminders and integrate wellness into your daily routine.
        </p>
        
        <Button 
          onClick={handleConnectCalendar}
          className="wellness-button"
          disabled={!privacy.allowExternalIntegrations}
        >
          <Zap className="mr-2 h-4 w-4" />
          Connect Calendar
        </Button>
        
        {!privacy.allowExternalIntegrations && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Enable external integrations in privacy settings first
          </p>
        )}
      </Card>

      {/* Activity Modal */}
      <Modal
        isOpen={showActivity}
        onClose={() => setShowActivity(false)}
        title={selectedActivity?.name}
        className="max-w-2xl"
      >
        {selectedActivity && (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-text-primary mb-2">Instructions</h4>
              <p className="text-text-secondary whitespace-pre-line">
                {selectedActivity.guideContent}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  How helpful was this activity? *
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`w-8 h-8 ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Any thoughts or feedback? (optional)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="How did this activity make you feel?"
                rows={3}
              />
            </div>

            <div className="flex space-x-3">
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
  )
}
