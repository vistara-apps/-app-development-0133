import React, { useState, useEffect } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { PulseCheck } from '../components/PulseCheck'
import { useDataStore } from '../stores/dataStore'
import { useStressDetection } from '../hooks/useStressDetection'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { 
  Target,
  Award,
  Calendar,
  Activity,
  AlertCircle,
  Check,
  Info,
  Zap,
  Heart,
  TrendingUp,
  Clock
} from 'lucide-react'
import { useSettingsStore } from '../stores/settingsStore'

export function HomePage() {
  const { 
    getTodayEntry, 
    getActivityCompletionStreak,
    getCheckInStreak,
    activityLogs,
    calculateEmotionalScore,
    emotionalScore,
    activities
  } = useDataStore()
  
  const navigate = useNavigate()
  const [showStressInfo, setShowStressInfo] = useState(false)
  
  const todayEntry = getTodayEntry()
  const checkInStreak = getCheckInStreak()
  const todayActivities = activityLogs.filter(
    log => log.completionDate === format(new Date(), 'yyyy-MM-dd')
  )
  
  // Initialize stress detection with manual trigger only
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
    autoDetect: false, // Disable auto-detection to prevent excessive runs
    detectionThreshold: 3
  });
  
  // Analyze stress only when today's entry first loads or manually triggered
  useEffect(() => {
    if (todayEntry && !stressDetected && !isAnalyzing) {
      // Only run once per session to avoid repeated analysis
      const hasRunToday = sessionStorage.getItem(`stress-analyzed-${format(new Date(), 'yyyy-MM-dd')}`);
      if (!hasRunToday) {
        analyzeCurrentEntry();
        sessionStorage.setItem(`stress-analyzed-${format(new Date(), 'yyyy-MM-dd')}`, 'true');
      }
    }
  }, [todayEntry]); // Removed dependencies to prevent re-runs
  
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

  // Handle activity navigation
  const navigateToActivity = (activityName) => {
    // First try to find exact match
    let activity = activities.find(a => a.name === activityName)
    
    // If no exact match, try partial match
    if (!activity) {
      activity = activities.find(a => a.name.toLowerCase().includes(activityName.toLowerCase()))
    }
    
    if (activity) {
      // Navigate to activities page and trigger activity start
      navigate(`/activities?start=${activity.activityId}`)
    } else {
      // Fallback to activities page with relevant filter
      const filterMap = {
        'progressive': 'mindfulness',
        'breathing': 'mindfulness',
        'mindful': 'mindfulness',
        'gratitude': 'journaling'
      }
      const filter = Object.keys(filterMap).find(key => activityName.toLowerCase().includes(key))
      navigate(`/activities${filter ? `?filter=${filterMap[filter]}` : ''}`)
    }
  };

  const handleConnectCalendar = () => {
    // Enable external integrations in privacy settings first
    const { updatePrivacy } = useSettingsStore.getState()
    updatePrivacy({ allowExternalIntegrations: true })
    
    // Navigate to integrations page
    navigate('/integrations')
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-extrabold text-text-primary">
          Welcome back
        </h2>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Build daily emotional resilience through mindful check-ins and guided activities
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 text-center hover:shadow-lg transition-shadow duration-200">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Award className="w-6 h-6 md:w-8 md:h-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-text-primary dark:text-dark-text-primary">
              {getActivityCompletionStreak()}
            </div>
            <div className="text-xs md:text-sm text-text-secondary dark:text-dark-text-secondary">
              Activity Streak
            </div>
          </div>
        </Card>
        
        <Card className="p-4 md:p-6 text-center hover:shadow-lg transition-shadow duration-200">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-text-primary dark:text-dark-text-primary">
              {checkInStreak}
            </div>
            <div className="text-xs md:text-sm text-text-secondary dark:text-dark-text-secondary">
              Check-in Streak
            </div>
          </div>
        </Card>
        
        <Card className="p-4 md:p-6 text-center hover:shadow-lg transition-shadow duration-200">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Target className="w-6 h-6 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-text-primary dark:text-dark-text-primary">
              {todayActivities.length}
            </div>
            <div className="text-xs md:text-sm text-text-secondary dark:text-dark-text-secondary">
              Activities Today
            </div>
          </div>
        </Card>
        
        <Card className="p-4 md:p-6 text-center hover:shadow-lg transition-shadow duration-200">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-text-primary dark:text-dark-text-primary">
              {todayEntry ? '✓' : '○'}
            </div>
            <div className="text-xs md:text-sm text-text-secondary dark:text-dark-text-secondary">
              Daily Check-in
            </div>
          </div>
        </Card>
        
        <Card className="p-4 md:p-6 text-center hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-2 bg-blue-200 dark:bg-blue-800/50 rounded-full">
              <Zap className="w-6 h-6 md:w-8 md:h-8 text-blue-700 dark:text-blue-300" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-300">
              {emotionalScore}
            </div>
            <div className="text-xs md:text-sm text-blue-600 dark:text-blue-400">
              Emotional Score
            </div>
          </div>
        </Card>
        
        {stressDetected && (
          <Card className="p-4 md:p-6 text-center hover:shadow-lg transition-shadow duration-200">
            <div className="flex flex-col items-center space-y-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                <Activity className="w-6 h-6 md:w-8 md:h-8 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-text-primary dark:text-dark-text-primary">
                {getStressSeverityDescription()}
              </div>
              <div className="text-xs md:text-sm text-text-secondary dark:text-dark-text-secondary flex items-center justify-center">
                Stress Level
                <button 
                  onClick={() => setShowStressInfo(!showStressInfo)}
                  className="ml-1 text-primary hover:text-primary-dark"
                >
                  <Info className="w-3 h-3" />
                </button>
              </div>
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
          <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-primary" />
            Recommended Activities
          </h3>
          <div className="space-y-3">
            {stressDetected ? (
              <>
                <div className="group flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border border-red-100 dark:border-red-800 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 dark:bg-red-800/30 rounded-full">
                      <Activity className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <div className="font-medium text-text-primary dark:text-dark-text-primary">Progressive Muscle Relaxation</div>
                      <div className="text-sm text-text-secondary dark:text-dark-text-secondary">7 min - Good for stress</div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
                    onClick={() => navigateToActivity('Progressive Muscle Relaxation')}
                  >
                    Try Now
                  </Button>
                </div>
                <div className="group flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border border-red-100 dark:border-red-800 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 dark:bg-red-800/30 rounded-full">
                      <Target className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <div className="font-medium text-text-primary dark:text-dark-text-primary">Breathing Exercise</div>
                      <div className="text-sm text-text-secondary dark:text-dark-text-secondary">3 min - Good for stress</div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
                    onClick={() => navigateToActivity('Mindful Breathing')}
                  >
                    Try Now
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="group flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-full">
                      <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium text-text-primary dark:text-dark-text-primary">Mindful Breathing</div>
                      <div className="text-sm text-text-secondary dark:text-dark-text-secondary">5 min</div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    onClick={() => navigateToActivity('Mindful Breathing')}
                  >
                    Try Now
                  </Button>
                </div>
                <div className="group flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 dark:bg-green-800/30 rounded-full">
                      <Heart className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium text-text-primary dark:text-dark-text-primary">Gratitude Journal</div>
                      <div className="text-sm text-text-secondary dark:text-dark-text-secondary">3 min</div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                    onClick={() => navigateToActivity('Gratitude Journal')}
                  >
                    Try Now
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            Recent Progress
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary dark:text-dark-text-secondary font-medium">This Week</span>
              <span className="font-bold text-text-primary dark:text-dark-text-primary text-lg">5/7 days</span>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full w-[71%] transition-all duration-500 ease-out" />
              </div>
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
            </div>
            <div className="text-sm text-text-secondary dark:text-dark-text-secondary bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
              🎉 Great consistency! Keep up the momentum.
            </div>
          </div>
        </Card>
      </div>
      
      {/* Calendar Events */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-text-primary">Upcoming Events</h3>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={handleConnectCalendar}
          >
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
