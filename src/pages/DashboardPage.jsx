import React from 'react'
import { Card } from '../components/Card'
import { Chart } from '../components/Chart'
import { ProgressTracker } from '../components/ProgressTracker'
import { useDataStore } from '../stores/dataStore'
import { format, subDays } from 'date-fns'
import { TrendingUp, Calendar, Activity, Target } from 'lucide-react'

export function DashboardPage() {
  const { dailyEntries, activityLogs, getRecentEntries } = useDataStore()

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
    </div>
  )
}