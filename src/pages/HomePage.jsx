import React, { useState, useEffect } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { PulseCheck } from '../components/PulseCheck'
import { useDataStore } from '../stores/dataStore'
import { useStressDetection } from '../hooks/useStressDetection'
import { format } from 'date-fns'
import { 
  Target,
  Award,
  Calendar,
  Activity,
  AlertCircle,
  Check,
  Info,
  Zap
} from 'lucide-react'

export function HomePage() {
  const { 
    getTodayEntry, 
    getActivityCompletionStreak,
    activityLogs,
    calculateEmotionalScore,
    emotionalScore
  } = useDataStore()
  
  const [showStressInfo, setShowStressInfo] = useState(false)
  
  const todayEntry = getTodayEntry()
  const streak = getActivityCompletionStreak()
  const todayActivities = activityLogs.filter(
    log => log.completionDate === format(new Date(), 'yyyy-MM-dd')
  )
  
  // Initialize stress detection
  const { 
    stressDetected, 
    stressLevel, 
    stressType, 
    confidence,
    getStressTypeDescription,
    getStressSeverityDescription,
    isAnalyzing,
    analyzeCurrentEntry
  } = useStressDetection({
    autoDetect: true,
    detectionThreshold: 3
  });
  
  // Analyze stress when today's entry changes
  useEffect(() => {
    if (todayEntry && !isAnalyzing) {
      analyzeCurrentEntry();
    }
  }, [todayEntry, isAnalyzing, analyzeCurrentEntry]);
  
  // Calculate emotional score on component load
  useEffect(() => {
    calculateEmotionalScore();
  }, [calculateEmotionalScore]);

  // Handle check-in completion
  const handleCheckInComplete = (entryData) => {
    // In a real implementation, this would trigger stress analysis
    // and potentially generate contextual nudges
    calculateEmotionalScore(); // Recalculate score after check-in
    console.log('Check-in completed:', entryData);
  };

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
      <div className="grid md:grid-cols-5 gap-6">
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
        
        <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-700">{emotionalScore}</div>
          <div className="text-sm text-blue-600">Emotional Score</div>
        </Card>
        
        {stressDetected && (
          <Card className="p-6 text-center">
            <Activity className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-text-primary">
              {getStressSeverityDescription()}
            </div>
            <div className="text-sm text-text-secondary flex items-center justify-center">
              Stress Level
              <button 
                onClick={() => setShowStressInfo(!showStressInfo)}
                className="ml-1 text-primary"
              >
                <Info className="w-3 h-3" />
              </button>
            </div>
          </Card>
        )}
      </div>
      
      {/* Stress Info */}
      {showStressInfo && stressDetected && (
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-text-primary">Stress Detected</h3>
              <p className="text-sm text-text-secondary mt-1">
                Our AI has detected {getStressSeverityDescription().toLowerCase()} levels of {stressType} stress in your recent entries.
                {stressType && (
                  <span className="block mt-1">{getStressTypeDescription()}</span>
                )}
              </p>
              <div className="mt-2">
                <Button size="sm" variant="secondary">
                  View Stress Management Activities
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Daily Check-in */}
      <PulseCheck onComplete={handleCheckInComplete} />

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">
            Recommended Activities
          </h3>
          <div className="space-y-3">
            {stressDetected ? (
              <>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-medium text-text-primary">Progressive Relaxation</div>
                    <div className="text-sm text-text-secondary">7 min - Good for stress</div>
                  </div>
                  <Button size="sm" variant="ghost">Try Now</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-medium text-text-primary">Breathing Exercise</div>
                    <div className="text-sm text-text-secondary">3 min - Good for stress</div>
                  </div>
                  <Button size="sm" variant="ghost">Try Now</Button>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
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
      
      {/* Calendar Events */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-text-primary">Upcoming Events</h3>
          <Button size="sm" variant="ghost">
            Connect Calendar
          </Button>
        </div>
        
        <div className="text-center py-6">
          <Calendar className="w-12 h-12 text-text-secondary mx-auto mb-2" />
          <p className="text-text-secondary">
            Connect your Google Calendar to see upcoming events and get preparation suggestions.
          </p>
        </div>
      </Card>
    </div>
  )
}
