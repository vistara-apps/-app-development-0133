import React, { useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { Input } from '../components/Input'
import { useDataStore } from '../stores/dataStore'
import { format } from 'date-fns'
import { 
  CheckCircle, 
  Circle, 
  Smile, 
  Meh, 
  Frown,
  Target,
  Award,
  Calendar
} from 'lucide-react'

export function HomePage() {
  const { 
    getTodayEntry, 
    addDailyEntry, 
    getActivityCompletionStreak,
    activityLogs 
  } = useDataStore()
  
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [emotionalState, setEmotionalState] = useState('')
  const [notes, setNotes] = useState('')

  const todayEntry = getTodayEntry()
  const streak = getActivityCompletionStreak()
  const todayActivities = activityLogs.filter(
    log => log.completionDate === format(new Date(), 'yyyy-MM-dd')
  )

  const handleCheckIn = () => {
    if (!emotionalState) return

    addDailyEntry({
      userId: 'demo-user-1',
      date: format(new Date(), 'yyyy-MM-dd'),
      emotionalState,
      notes
    })

    setShowCheckIn(false)
    setEmotionalState('')
    setNotes('')
  }

  const emotionOptions = [
    { value: 'positive', icon: Smile, label: 'Positive', color: 'text-green-500' },
    { value: 'neutral', icon: Meh, label: 'Neutral', color: 'text-yellow-500' },
    { value: 'negative', icon: Frown, label: 'Negative', color: 'text-red-500' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold text-text-primary">
          Welcome back to ResilientFlow
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Build daily emotional resilience through mindful check-ins and guided activities
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <Award className="w-8 h-8 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold text-text-primary">{streak}</div>
          <div className="text-sm text-text-secondary">Day Streak</div>
        </Card>
        
        <Card className="p-6 text-center">
          <Target className="w-8 h-8 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-text-primary">{todayActivities.length}</div>
          <div className="text-sm text-text-secondary">Activities Today</div>
        </Card>
        
        <Card className="p-6 text-center">
          <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-text-primary">
            {todayEntry ? '✓' : '○'}
          </div>
          <div className="text-sm text-text-secondary">Daily Check-in</div>
        </Card>
      </div>

      {/* Daily Check-in */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-text-primary">Daily Check-in</h2>
          <div className="text-sm text-text-secondary">
            {format(new Date(), 'EEEE, MMMM d')}
          </div>
        </div>

        {todayEntry ? (
          <div className="flex items-center space-x-4 p-4 bg-accent/10 rounded-lg">
            <CheckCircle className="w-6 h-6 text-accent" />
            <div>
              <div className="font-medium text-text-primary">Check-in completed!</div>
              <div className="text-sm text-text-secondary">
                Feeling {todayEntry.emotionalState} today
                {todayEntry.notes && ` - ${todayEntry.notes}`}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <Circle className="w-6 h-6 text-text-secondary" />
              <div>
                <div className="font-medium text-text-primary">Ready for your daily check-in?</div>
                <div className="text-sm text-text-secondary">
                  Take a moment to reflect on your emotional state
                </div>
              </div>
            </div>
            <Button onClick={() => setShowCheckIn(true)}>
              Start Check-in
            </Button>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">
            Recommended Activities
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-text-primary">Mindful Breathing</div>
                <div className="text-sm text-text-secondary">5 min</div>
              </div>
              <Button size="sm" variant="ghost">Try Now</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-text-primary">Gratitude Journal</div>
                <div className="text-sm text-text-secondary">3 min</div>
              </div>
              <Button size="sm" variant="ghost">Try Now</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">
            Recent Progress
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">This Week</span>
              <span className="font-medium text-text-primary">5/7 days</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full w-[71%]" />
            </div>
            <div className="text-sm text-text-secondary">
              Great consistency! Keep up the momentum.
            </div>
          </div>
        </Card>
      </div>

      {/* Check-in Modal */}
      <Modal
        isOpen={showCheckIn}
        onClose={() => setShowCheckIn(false)}
        title="Daily Emotional Check-in"
        className="max-w-lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              How are you feeling today?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {emotionOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setEmotionalState(option.value)}
                  className={`
                    p-4 rounded-lg border-2 transition-all text-center
                    ${emotionalState === option.value
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <option.icon className={`w-8 h-8 mx-auto mb-2 ${option.color}`} />
                  <div className="text-sm font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Any notes about your day? (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
          />

          <div className="flex space-x-3">
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={() => setShowCheckIn(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1"
              onClick={handleCheckIn}
              disabled={!emotionalState}
            >
              Complete Check-in
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}