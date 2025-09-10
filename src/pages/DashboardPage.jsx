import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'
import { useDataStore } from '../stores/dataStore'
import { useCirclesStore } from '../stores/circlesStore'
import { format, subDays } from 'date-fns'
import { 
  Heart,
  Brain,
  Shield,
  CheckCircle,
  Target,
  Users,
  ArrowRight,
  Sparkles,
  Zap,
  Star,
  Activity,
  TrendingUp,
  Lightbulb
} from 'lucide-react'
import { Link } from 'react-router-dom'

export function DashboardPage() {
  const { dailyEntries, activityLogs, activities, getActivityCompletionStreak, getCheckInStreak, getTodayEntry } = useDataStore()
  const { circles } = useCirclesStore()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const todayEntry = getTodayEntry()
  const activityStreak = getActivityCompletionStreak()
  const checkInStreak = getCheckInStreak()

  // Calculate last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i)
    return format(date, 'yyyy-MM-dd')
  }).reverse()

  // Calculate completion rates
  const totalActivities = activityLogs.filter(log => 
    last7Days.includes(log.completionDate)
  ).length

  // Calculate emotional trends for AI insights
  const emotionalTrends = last7Days.map(date => {
    const entry = dailyEntries.find(e => e.date === date)
    return {
      date: format(new Date(date), 'MMM dd'),
      score: entry?.emotionalScore || 0
    }
  })

  // Generate AI insights based on data
  const generateAIInsights = () => {
    const insights = []
    
    // Emotional trend insight
    const recentScores = emotionalTrends.slice(-3).map(t => t.score).filter(s => s > 0)
    if (recentScores.length >= 2) {
      const avgScore = recentScores.reduce((a, b) => a + b, 0) / recentScores.length
      if (avgScore >= 7) {
        insights.push({
          type: 'positive',
          icon: <Heart className="h-5 w-5" />,
          title: 'Great Emotional Balance',
          message: 'Your emotional scores have been consistently high. Keep up the excellent work with your wellness practices!',
          color: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-950/20'
        })
      } else if (avgScore <= 4) {
        insights.push({
          type: 'support',
          icon: <Shield className="h-5 w-5" />,
          title: 'Time for Self-Care',
          message: 'Your emotional scores suggest you might benefit from some extra mindfulness activities. Consider trying a breathing exercise.',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 dark:bg-blue-950/20'
        })
      }
    }

    // Activity streak insight
    if (activityStreak >= 7) {
      insights.push({
        type: 'achievement',
        icon: <Target className="h-5 w-5" />,
        title: 'Amazing Consistency',
        message: `${activityStreak} days in a row! Your commitment to wellness is building real momentum.`,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 dark:bg-purple-950/20'
      })
    } else if (activityStreak === 0) {
      insights.push({
        type: 'motivation',
        icon: <Zap className="h-5 w-5" />,
        title: 'Ready to Start?',
        message: 'Begin your wellness journey today with a simple 5-minute activity. Every step counts!',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 dark:bg-orange-950/20'
      })
    }

    // Activity type insight
    const recentActivityTypes = activityLogs
      .filter(log => last7Days.includes(log.completionDate))
      .map(log => {
        const activity = activities.find(a => a.activityId === log.activityId)
        return activity?.type
      })
      .filter(Boolean)

    const typeCounts = recentActivityTypes.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    const mostUsedType = Object.keys(typeCounts).reduce((a, b) => typeCounts[a] > typeCounts[b] ? a : b, null)
    
    if (mostUsedType && typeCounts[mostUsedType] >= 3) {
      const typeLabels = {
        mindfulness: 'mindfulness',
        social: 'social connection',
        journaling: 'reflection'
      }
      
      insights.push({
        type: 'pattern',
        icon: <Brain className="h-5 w-5" />,
        title: 'Your Preferred Practice',
        message: `You've been gravitating toward ${typeLabels[mostUsedType]} activities. This shows great self-awareness!`,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/20'
      })
    }

    return insights.slice(0, 2) // Limit to 2 most relevant insights
  }

  const aiInsights = generateAIInsights()

  const recentActivities = activityLogs
    .filter(log => last7Days.includes(log.completionDate))
    .slice(0, 3)
    .map(log => {
      const activity = activities.find(a => a.activityId === log.activityId)
      return {
        id: log.activityId,
        name: activity?.name || 'Unknown Activity',
        type: activity?.type || 'general',
        date: format(new Date(log.completionDate), 'MMM dd'),
        duration: activity?.duration || '5 min'
      }
    })

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Simple Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-wellness-peace border border-wellness-calm/30 text-wellness-harmony font-medium">
          <Sparkles className="h-4 w-4" />
          Your Progress
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-balance">
          How You're Doing
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Simple insights about your emotional wellness journey.
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="wellness-card text-center p-4">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-950/20 mb-2">
            <Heart className="h-4 w-4 text-pink-600" />
          </div>
          <div className="text-lg font-bold text-pink-600">
            {todayEntry?.emotionalScore || 0}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Today's Score
          </div>
        </div>
        
        <div className="wellness-card text-center p-4">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/20 mb-2">
            <Target className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-lg font-bold text-blue-600">
            {activityStreak}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Day Streak
          </div>
        </div>
        
        <div className="wellness-card text-center p-4">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-50 dark:bg-green-950/20 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-lg font-bold text-green-600">
            {totalActivities}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            This Week
          </div>
        </div>
      </div>

      {/* AI Insights */}
      {aiInsights.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <h2 className="text-xl font-semibold text-text-primary">AI Insights</h2>
          </div>
          
          <div className="grid gap-4">
            {aiInsights.map((insight, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${insight.bgColor}`}>
                    <div className={insight.color}>
                      {insight.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-text-primary mb-1">
                      {insight.title}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {insight.message}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">Recent Activities</h2>
          <Link 
            to="/" 
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            Start New
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        {recentActivities.length > 0 ? (
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <Card key={activity.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'mindfulness' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      activity.type === 'social' ? 'bg-green-100 dark:bg-green-900/30' :
                      'bg-purple-100 dark:bg-purple-900/30'
                    }`}>
                      {activity.type === 'mindfulness' ? <Brain className="h-4 w-4 text-blue-600" /> :
                       activity.type === 'social' ? <Users className="h-4 w-4 text-green-600" /> :
                       <Heart className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{activity.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{activity.date}</div>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Activity className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">No activities completed yet this week</p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 wellness-button"
            >
              <Zap className="h-4 w-4" />
              Start Your First Activity
            </Link>
          </Card>
        )}
      </div>

      {/* Support Circles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">Support Circles</h2>
          <Link 
            to="/circles" 
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            Manage
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        {circles.length > 0 ? (
          <div className="grid gap-3">
            {circles.slice(0, 2).map((circle) => (
              <Card key={circle.circleId} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{circle.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{circle.memberCount || 0} members</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    circle.privacy === 'public' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                  }`}>
                    {circle.privacy}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <Users className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">Join a support circle to practice together</p>
            <Link 
              to="/circles" 
              className="inline-flex items-center gap-2 wellness-button"
            >
              <Zap className="h-4 w-4" />
              Discover Circles
            </Link>
          </Card>
        )}
      </div>

      {/* Quick Action */}
      <Card className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-wellness-calm to-wellness-peace mb-4">
          <Star className="h-6 w-6 text-white" />
        </div>
        
        <h3 className="text-lg font-semibold mb-2">
          Ready for Your Next Activity?
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Continue building your emotional strength with simple, effective practices.
        </p>
        
        <Link 
          to="/"
          className="wellness-button"
        >
          <Activity className="mr-2 h-4 w-4" />
          Start Activity
        </Link>
      </Card>
    </div>
  )
}
