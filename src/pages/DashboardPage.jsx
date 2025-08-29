import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'
import { Chart } from '../components/Chart'
import { ProgressTracker } from '../components/ProgressTracker'
import { useDataStore } from '../stores/dataStore'
import { useCirclesStore } from '../stores/circlesStore'
import { format, subDays } from 'date-fns'
import { 
  TrendingUp, 
  Calendar, 
  Activity, 
  Target, 
  Users, 
  ArrowRight,
  Heart,
  Brain,
  Shield,
  CheckCircle,
  Clock,
  Award,
  BarChart3,
  Users2,
  Sparkles,
  Zap,
  Star,
  BookOpen,
  ActivitySquare
} from 'lucide-react'
import { Link } from 'react-router-dom'

export function DashboardPage() {
  const { dailyEntries, activityLogs, activities, getRecentEntries, getActivityCompletionStreak, getCheckInStreak, getTodayEntry } = useDataStore()
  const { circles, getAllCircles } = useCirclesStore()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    // No need to call getAllCircles() since circles are already loaded
  }, [])

  const todayEntry = getTodayEntry()
  const recentEntries = getRecentEntries(7)
  const activityStreak = getActivityCompletionStreak()
  const checkInStreak = getCheckInStreak()

  // Calculate last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i)
    return format(date, 'yyyy-MM-dd')
  }).reverse()

  // Calculate completion rates
  const totalCheckIns = dailyEntries.filter(entry => 
    last7Days.includes(entry.date)
  ).length

  const totalActivities = activityLogs.filter(log => 
    last7Days.includes(log.completionDate)
  ).length

  // Properly look up activity information from the activities array
  const mindfulnessActivities = activityLogs.filter(log => {
    if (!last7Days.includes(log.completionDate)) return false
    const activity = activities.find(a => a.activityId === log.activityId)
    return activity && activity.type === 'mindfulness'
  }).length

  const journalingActivities = activityLogs.filter(log => {
    if (!last7Days.includes(log.completionDate)) return false
    const activity = activities.find(a => a.activityId === log.activityId)
    return activity && activity.type === 'mindfulness'
  }).length

  const socialActivities = activityLogs.filter(log => {
    if (!last7Days.includes(log.completionDate)) return false
    const activity = activities.find(a => a.activityId === log.activityId)
    return activity && activity.type === 'social'
  }).length

  // Calculate emotional trends
  const emotionalTrends = last7Days.map(date => {
    const entry = dailyEntries.find(e => e.date === date)
    return {
      date: format(new Date(date), 'MMM dd'),
      score: entry?.emotionalScore || 0
    }
  })

  // Calculate activity completion trends
  const activityTrends = last7Days.map(date => {
    const dayActivities = activityLogs.filter(log => log.completionDate === date)
    return {
      date: format(new Date(date), 'MMM dd'),
      completed: dayActivities.length
    }
  })

  const stats = [
    {
      label: 'Total Check-ins',
      value: totalCheckIns,
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      change: '+12%',
      changeColor: 'text-emerald-600'
    },
    {
      label: 'Activities Completed',
      value: totalActivities,
      icon: <ActivitySquare className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      change: '+8%',
      changeColor: 'text-blue-600'
    },
    {
      label: 'Current Streak',
      value: `${activityStreak} days`,
                       icon: <Target className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      change: '+2 days',
      changeColor: 'text-purple-600'
    },
    {
      label: 'Check-in Streak',
      value: `${checkInStreak} days`,
      icon: <Clock className="h-5 w-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      change: '+1 day',
      changeColor: 'text-orange-600'
    }
  ]

  const recentActivities = activityLogs
    .filter(log => last7Days.includes(log.completionDate))
    .slice(0, 5)
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

  const weeklyProgress = [
    { day: 'Mon', completed: 3, total: 5 },
    { day: 'Tue', completed: 4, total: 5 },
    { day: 'Wed', completed: 2, total: 5 },
    { day: 'Thu', completed: 5, total: 5 },
    { day: 'Fri', completed: 3, total: 5 },
    { day: 'Sat', completed: 4, total: 5 },
    { day: 'Sun', completed: 2, total: 5 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
      {/* Header Section */}
      <section className="container-padding pt-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className={`fade-in-up ${isVisible ? 'visible' : ''} text-center mb-12`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-wellness-peace border border-wellness-calm/30 text-wellness-harmony font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Your Wellness Dashboard
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance mb-4">
              Welcome back,
              <span className="text-gradient-wellness block">Champion</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Track your progress, celebrate your wins, and continue building your mental resilience.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className={`fade-in-up ${isVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`wellness-card h-full border ${stat.borderColor}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                      <div className={stat.color}>
                        {stat.icon}
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${stat.changeColor}`}>
                      {stat.change}
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="container-padding pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Emotional Trends Chart */}
            <div className={`fade-in-up ${isVisible ? 'visible' : ''}`}>
              <Card variant="wellness" className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-pink-50 dark:bg-pink-950/20">
                      <Heart className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <CardTitle>Emotional Trends</CardTitle>
                      <p className="text-sm text-text-secondary">Your emotional score over the past week</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Chart 
                    data={emotionalTrends}
                    xKey="date"
                    yKey="score"
                    color="pink"
                    height={200}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Activity Completion Chart */}
            <div className={`fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '100ms' }}>
              <Card variant="wellness" className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/20">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Activity Completion</CardTitle>
                      <p className="text-sm text-text-secondary">Daily activity completion rates</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Chart 
                    data={activityTrends}
                    xKey="date"
                    yKey="completed"
                    color="blue"
                    height={200}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Progress & Activities Section */}
      <section className="container-padding pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weekly Progress */}
            <div className={`fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '200ms' }}>
              <Card variant="wellness" className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-green-50 dark:bg-green-950/20">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>Weekly Progress</CardTitle>
                      <p className="text-sm text-text-secondary">Your daily activity goals</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ProgressTracker 
                    data={weeklyProgress}
                    height={200}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <div className={`fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '300ms' }}>
              <Card variant="wellness" className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/20">
                        <Activity className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle>Recent Activities</CardTitle>
                        <p className="text-sm text-text-secondary">Your latest completed activities</p>
                      </div>
                    </div>
                    <Link 
                      to="/activities" 
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                    >
                      View All
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.length > 0 ? (
                      recentActivities.map((activity, index) => (
                        <div 
                          key={activity.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              activity.type === 'mindfulness' ? 'bg-blue-100 dark:bg-blue-900/30' :
                              activity.type === 'social' ? 'bg-green-100 dark:bg-green-900/30' :
                              'bg-purple-100 dark:bg-purple-900/30'
                            }`}>
                              {activity.type === 'mindfulness' ? <Brain className="h-4 w-4 text-blue-600" /> :
                               activity.type === 'social' ? <Users className="h-4 w-4 text-green-600" /> :
                               <BookOpen className="h-4 w-4 text-purple-600" />}
                            </div>
                            <div>
                              <div className="font-medium text-text-primary">{activity.name}</div>
                              <div className="text-sm text-text-secondary">{activity.date} • {activity.duration}</div>
                            </div>
                          </div>
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Activity className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                        <p className="text-text-secondary">No activities completed yet this week</p>
                        <Link 
                          to="/activities" 
                          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mt-2"
                        >
                          Start your first activity
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Community & Circles Section */}
      <section className="container-padding pb-16">
        <div className="max-w-7xl mx-auto">
          <div className={`fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '400ms' }}>
            <Card variant="wellness">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/20">
                      <Users2 className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle>Your Support Circles</CardTitle>
                      <p className="text-sm text-text-secondary">Connect with your wellness community</p>
                    </div>
                  </div>
                  <Link 
                    to="/circles" 
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                  >
                    Manage Circles
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {circles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {circles.slice(0, 3).map((circle) => (
                      <div 
                        key={circle.circleId}
                        className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                            <Users className="h-4 w-4 text-white" />
                          </div>
                          <div className="font-medium text-text-primary">{circle.name}</div>
                        </div>
                        <p className="text-sm text-text-secondary mb-3">{circle.description}</p>
                        <div className="flex items-center justify-between text-xs text-text-tertiary">
                          <span>{circle.memberCount || 0} members</span>
                          <span className={`px-2 py-1 rounded-full ${
                            circle.privacy === 'public' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                          }`}>
                            {circle.privacy}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users2 className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                    <p className="text-text-secondary mb-4">You haven't joined any support circles yet</p>
                    <Link 
                      to="/circles" 
                      className="inline-flex items-center gap-2 wellness-button"
                    >
                      <Zap className="h-4 w-4" />
                      Discover Circles
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="container-padding pb-16">
        <div className="max-w-4xl mx-auto">
          <div className={`fade-in-up ${isVisible ? 'visible' : ''}`} style={{ transitionDelay: '500ms' }}>
            <Card variant="wellness" className="text-center p-8 md:p-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-wellness-calm to-wellness-peace mb-6">
                <Star className="h-8 w-8 text-white" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">
                Ready for Your Next Activity?
              </h2>
              
              <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                Continue building your resilience with personalized activities and guided sessions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/activities"
                  className="wellness-button group"
                >
                  <Activity className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Start Activity
                </Link>
                
                <Link 
                  to="/dashboard"
                  className="btn-secondary px-6 py-3 text-base font-semibold"
                >
                  View Progress
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
