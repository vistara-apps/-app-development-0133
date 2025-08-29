import React, { useState, useEffect } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { Input } from '../components/Input'
import { useDataStore } from '../stores/dataStore'
import { Link, useLocation } from 'react-router-dom'
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
  ArrowRight
} from 'lucide-react'

export function ActivitiesPage() {
  const { activities, addActivityLog } = useDataStore()
  const location = useLocation()
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [showActivity, setShowActivity] = useState(false)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [filter, setFilter] = useState('all')

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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Resilience Activities</h1>
          <p className="text-text-secondary">Choose activities to build emotional strength</p>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(activityTypes).map(([key, type]) => (
          <Card 
            key={key} 
            className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
              filter === key ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setFilter(filter === key ? 'all' : key)}
          >
            <div className="text-center">
              <type.icon className={`w-8 h-8 mx-auto mb-2 ${type.color}`} />
              <div className="font-medium text-text-primary">{type.label}</div>
              <div className="text-sm text-text-secondary">
                {activities.filter(a => a.type === key).length} activities
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Support Circles Promotion */}
      <Card className="p-6 border-l-4 border-primary">
        <div className="flex items-start md:items-center md:justify-between">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-1">
                Practice Together in Support Circles
              </h3>
              <p className="text-text-secondary">
                Join a group to practice activities together and share your progress
              </p>
            </div>
          </div>
          <Link 
            to="/circles"
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Explore Circles
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </Card>
      
      {/* Activities Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => {
          const TypeIcon = activityTypes[activity.type]?.icon || Brain
          const typeColor = activityTypes[activity.type]?.color || 'text-gray-500'
          
          return (
            <Card key={activity.activityId} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <TypeIcon className={`w-6 h-6 ${typeColor}`} />
                  <div className="text-sm text-text-secondary capitalize">
                    {activity.type}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    {activity.name}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {activity.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <Clock className="w-4 h-4" />
                    <span>5-10 min</span>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => startActivity(activity)}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Start
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

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
