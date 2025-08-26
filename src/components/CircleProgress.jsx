import React from 'react'
import { Card } from './Card'
import { Chart } from './Chart'
import { useCirclesStore } from '../stores/circlesStore'
import { 
  TrendingUp, 
  Calendar, 
  Activity, 
  Target,
  Users,
  Smile,
  Meh,
  Frown
} from 'lucide-react'

export function CircleProgress({ circleId }) {
  const { getCircleProgressData, getCircleMembers } = useCirclesStore()
  
  const progressData = getCircleProgressData(circleId)
  const members = getCircleMembers(circleId)
  
  // Format activity data for chart
  const activityChartData = progressData.activityData.map(data => ({
    date: data.date,
    value: Math.round(data.value * 100)
  }))
  
  // Format emotional data for chart
  const emotionalChartData = [
    { name: 'Positive', value: progressData.emotionalData.positive },
    { name: 'Neutral', value: progressData.emotionalData.neutral },
    { name: 'Negative', value: progressData.emotionalData.negative }
  ]
  
  // Calculate overall stats
  const totalEntries = Object.values(progressData.emotionalData).reduce((sum, val) => sum + val, 0)
  const positivePercentage = totalEntries > 0 
    ? Math.round((progressData.emotionalData.positive / totalEntries) * 100) 
    : 0
  
  const averageCompletion = progressData.activityData.reduce((sum, data) => sum + data.value, 0) / progressData.activityData.length
  const completionPercentage = Math.round(averageCompletion * 100)
  
  const stats = [
    {
      title: 'Group Members',
      value: members.length,
      icon: Users,
      change: '+2 this week',
      trend: 'up'
    },
    {
      title: 'Activity Completion',
      value: `${completionPercentage}%`,
      icon: Activity,
      change: '+5% from last week',
      trend: 'up'
    },
    {
      title: 'Positive Emotions',
      value: `${positivePercentage}%`,
      icon: Smile,
      change: 'of all entries',
      trend: 'neutral'
    },
    {
      title: 'Group Streak',
      value: '4 days',
      icon: Target,
      change: 'Current streak',
      trend: 'up'
    }
  ]
  
  return (
    <div className="space-y-8">
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
            Group Activity Completion (7 days)
          </h3>
          <Chart variant="bar" data={activityChartData} />
          <div className="mt-4 text-sm text-text-secondary text-center">
            Percentage of members completing activities each day
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">
            Emotional State Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            {totalEntries > 0 ? (
              <div className="grid grid-cols-3 gap-4 w-full">
                {emotionalChartData.map((item) => {
                  const percentage = Math.round((item.value / totalEntries) * 100) || 0
                  const Icon = item.name === 'Positive' ? Smile : 
                               item.name === 'Neutral' ? Meh : Frown
                  const color = item.name === 'Positive' ? 'text-green-500' : 
                                item.name === 'Neutral' ? 'text-blue-500' : 'text-red-500'
                  
                  return (
                    <div key={item.name} className="text-center">
                      <Icon className={`w-12 h-12 mx-auto mb-2 ${color}`} />
                      <div className="text-2xl font-bold">{percentage}%</div>
                      <div className="text-sm text-text-secondary">{item.name}</div>
                      <div className="text-xs text-text-secondary">({item.value} entries)</div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-text-secondary">No emotional data available</div>
            )}
          </div>
        </Card>
      </div>
      
      {/* Daily Streak */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">
          Daily Check-in Completion
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {progressData.streakData.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-sm text-text-secondary">{day.label}</div>
              <div 
                className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-lg font-medium ${
                  day.completedPercentage >= 75 
                    ? 'bg-green-500 text-white' 
                    : day.completedPercentage >= 50
                      ? 'bg-green-200 text-green-800'
                      : day.completedPercentage > 0
                        ? 'bg-gray-200 text-text-primary'
                        : 'bg-gray-100 text-text-secondary'
                }`}
              >
                {day.value}
              </div>
              <div className="text-xs text-text-secondary mt-1">
                {Math.round(day.completedPercentage)}%
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-text-secondary text-center">
          Percentage of members completing daily check-ins
        </div>
      </Card>
      
      {/* Tips */}
      <Card className="p-6 border-l-4 border-primary">
        <div className="flex items-start space-x-4">
          <TrendingUp className="w-6 h-6 text-primary mt-1" />
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Group Insights
            </h3>
            <ul className="text-text-secondary space-y-2">
              <li>• Your group has higher activity completion on weekends</li>
              <li>• Members report more positive emotions after group activities</li>
              <li>• Try scheduling group check-ins to increase consistency</li>
              <li>• Consider setting a group challenge for next week</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

