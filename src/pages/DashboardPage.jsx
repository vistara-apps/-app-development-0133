import React from 'react'
import { Card } from '../components/Card'
import { Chart } from '../components/Chart'
import { ProgressTracker } from '../components/ProgressTracker'
import { useDataStore } from '../stores/dataStore'
import { useCirclesStore } from '../stores/circlesStore'
import { format, subDays } from 'date-fns'
import { TrendingUp, Calendar, Activity, Target, Users, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function DashboardPage() {
  const { dailyEntries, activityLogs, getRecentEntries } = useDataStore()
  const { getUserCircles, getCircleMembers } = useCirclesStore()

  // Prepare chart data
  const chartData = getRecentEntries(30).map(entry => ({
    date: format(new Date(entry.date), 'MM/dd'),
    value: entry.emotionalState === 'positive' ? 3 : 
           entry.emotionalState === 'neutral' ? 2 : 1
  }))

  // Activity completion data
  const activityData = []
  for (let i = 6; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
    const hasActivity = activityLogs.some(log => log.completionDate === date)
    activityData.push({
      date: format(new Date(date), 'MM/dd'),
      value: hasActivity ? 1 : 0
    })
  }

  // Weekly progress data
  const weeklyData = [
    { label: 'Check-ins', progress: 85, value: '6/7' },
    { label: 'Activities', progress: 71, value: '5/7' },
    { label: 'Mindfulness', progress: 60, value: '3/5' },
    { label: 'Gratitude', progress: 80, value: '4/5' }
  ]

  // Daily streak data
  const dailyStreakData = []
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const dateStr = format(date, 'yyyy-MM-dd')
    const hasEntry = dailyEntries.some(entry => entry.date === dateStr)
    
    dailyStreakData.push({
      label: format(date, 'EEE'),
      value: format(date, 'd'),
      completed: hasEntry
    })
  }

  const stats = [
    {
      title: 'Total Check-ins',
      value: dailyEntries.length,
      icon: Calendar,
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Activities Completed',
      value: activityLogs.length,
      icon: Activity,
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Current Streak',
      value: '5 days',
      icon: Target,
      change: 'Personal best!',
      trend: 'up'
    },
    {
      title: 'Weekly Goal',
      value: '85%',
      icon: TrendingUp,
      change: '6/7 days',
      trend: 'up'
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Your Progress Dashboard</h1>
        <p className="text-text-secondary">Track your emotional resilience journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">{stat.title}</p>
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-sm text-accent">{stat.change}</p>
              </div>
              <stat.icon className="w-8 h-8 text-primary" />
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">
            Emotional Trends (30 days)
          </h3>
          <Chart variant="line" data={chartData} />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">
            Activity Completion (7 days)
          </h3>
          <Chart variant="bar" data={activityData} />
        </Card>
      </div>

      {/* Progress Trackers */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ProgressTracker
          variant="daily"
          title="Daily Check-in Streak"
          data={dailyStreakData}
        />

        <ProgressTracker
          variant="weekly"
          title="Weekly Progress"
          data={weeklyData}
        />
      </div>

      {/* Support Circles */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {activityLogs.slice(-5).reverse().map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-text-primary">{log.activity.name}</div>
                  <div className="text-sm text-text-secondary">
                    {format(new Date(log.completionDate), 'MMM d, yyyy')}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-text-secondary">Rating:</div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          i < log.rating ? 'bg-accent' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Support Circles */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-text-primary">Your Support Circles</h3>
            <Link 
              to="/circles" 
              className="text-sm text-primary flex items-center hover:underline"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          {getUserCircles().length > 0 ? (
            <div className="space-y-3">
              {getUserCircles().slice(0, 3).map((circle) => {
                const members = getCircleMembers(circle.circleId)
                
                return (
                  <Link 
                    key={circle.circleId} 
                    to={`/circles`}
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-2 bg-primary/10 rounded-md mr-3">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">{circle.name}</div>
                      <div className="text-xs text-text-secondary flex items-center">
                        <span>{members.length} members</span>
                        <span className="mx-1">•</span>
                        <span>{circle.focusArea}</span>
                      </div>
                    </div>
                    <div className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      Active
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <Users className="w-10 h-10 mx-auto text-text-secondary mb-2" />
              <p className="text-text-secondary mb-3">Join support circles to connect with others</p>
              <Link 
                to="/circles" 
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Explore Circles
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
