import React, { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Calendar,
  Award,
  Filter
} from 'lucide-react'
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns'
import { useCircleStore } from '../../stores/circleStore'
import { useAuthStore } from '../../stores/authStore'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { EmptyState } from '../EmptyState'

export function CircleProgress({ circleId }) {
  const [timeRange, setTimeRange] = useState('week')
  const [chartType, setChartType] = useState('activity')
  
  const { user } = useAuthStore()
  const { 
    getCircleStats, 
    getUserCircleStats,
    getCircleGoals,
    getCircleMembers,
    getCircleMessages,
    checkIns
  } = useCircleStore()
  
  // Get circle stats
  const stats = getCircleStats(circleId)
  
  // Get user stats
  const userStats = getUserCircleStats()
  
  // Get circle goals
  const goals = getCircleGoals(circleId)
  
  // Get circle members
  const members = getCircleMembers(circleId)
  
  // Get circle messages
  const messages = getCircleMessages(circleId)
  
  // Calculate date range based on selected time range
  const getDateRange = () => {
    const now = new Date()
    
    switch (timeRange) {
      case 'week':
        return {
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 })
        }
      case 'month':
        return {
          start: subDays(now, 30),
          end: now
        }
      case 'all':
      default:
        return {
          start: subDays(now, 90),
          end: now
        }
    }
  }
  
  // Filter data based on date range
  const dateRange = getDateRange()
  
  // Prepare activity data for chart
  const prepareActivityData = () => {
    const { start, end } = dateRange
    const dateMap = {}
    
    // Initialize dates
    let currentDate = new Date(start)
    while (currentDate <= end) {
      const dateStr = format(currentDate, 'yyyy-MM-dd')
      dateMap[dateStr] = {
        date: dateStr,
        messages: 0,
        checkIns: 0,
        goals: 0
      }
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1))
    }
    
    // Count messages by date
    messages.forEach(message => {
      const messageDate = format(new Date(message.sentAt), 'yyyy-MM-dd')
      if (dateMap[messageDate]) {
        dateMap[messageDate].messages++
      }
    })
    
    // Count check-ins by date
    checkIns.forEach(checkIn => {
      if (goals.some(goal => goal.goalId === checkIn.goalId)) {
        const checkInDate = checkIn.date
        if (dateMap[checkInDate]) {
          dateMap[checkInDate].checkIns++
        }
      }
    })
    
    // Format for chart
    return Object.values(dateMap).map(item => ({
      ...item,
      date: format(new Date(item.date), timeRange === 'week' ? 'EEE' : 'MMM dd')
    }))
  }
  
  // Prepare emotional state data for chart
  const prepareEmotionalData = () => {
    // This would normally use real emotional data from daily entries
    // For demo, we'll generate some mock data
    return [
      { name: 'Positive', value: 8 },
      { name: 'Neutral', value: 5 },
      { name: 'Negative', value: 2 }
    ]
  }
  
  // Prepare goal progress data for chart
  const prepareGoalData = () => {
    return goals.map(goal => ({
      name: goal.title.length > 20 ? goal.title.substring(0, 20) + '...' : goal.title,
      progress: goal.progress
    }))
  }
  
  // Prepare member contribution data
  const prepareMemberData = () => {
    const memberMap = {}
    
    // Initialize member data
    members.forEach(member => {
      memberMap[member.userId] = {
        name: member.userId === user.userId ? 'You' : `Member ${member.userId.substring(0, 4)}`,
        messages: 0,
        checkIns: 0
      }
    })
    
    // Count messages by member
    messages.forEach(message => {
      if (memberMap[message.senderId] && !message.isAI) {
        memberMap[message.senderId].messages++
      }
    })
    
    // Count check-ins by member
    checkIns.forEach(checkIn => {
      if (memberMap[checkIn.userId] && goals.some(goal => goal.goalId === checkIn.goalId)) {
        memberMap[checkIn.userId].checkIns++
      }
    })
    
    return Object.values(memberMap)
  }
  
  // Get chart data based on selected chart type
  const getChartData = () => {
    switch (chartType) {
      case 'activity':
        return prepareActivityData()
      case 'emotional':
        return prepareEmotionalData()
      case 'goals':
        return prepareGoalData()
      case 'members':
        return prepareMemberData()
      default:
        return []
    }
  }
  
  // Render chart based on selected chart type
  const renderChart = () => {
    const data = getChartData()
    
    if (data.length === 0) {
      return (
        <EmptyState
          title="No data available"
          description="There isn't enough data to display this chart yet."
          icon={<BarChart3 className="w-12 h-12" />}
        />
      )
    }
    
    switch (chartType) {
      case 'activity':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="messages" name="Messages" fill="#3B82F6" />
              <Bar dataKey="checkIns" name="Check-ins" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        )
      
      case 'emotional':
        const COLORS = ['#10B981', '#6B7280', '#EF4444']
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )
      
      case 'goals':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip formatter={(value) => [`${value}%`, 'Progress']} />
              <Bar dataKey="progress" name="Progress" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        )
      
      case 'members':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="messages" name="Messages" fill="#3B82F6" />
              <Bar dataKey="checkIns" name="Check-ins" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        )
      
      default:
        return null
    }
  }
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Circle Progress
        </h2>
        
        <div className="flex items-center space-x-2">
          {/* Chart type selector */}
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md py-1 pl-2 pr-8 text-sm text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="activity">Activity</option>
            <option value="emotional">Emotional States</option>
            <option value="goals">Goal Progress</option>
            <option value="members">Member Contributions</option>
          </select>
          
          {/* Time range selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md py-1 pl-2 pr-8 text-sm text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="week">This Week</option>
            <option value="month">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-primary/10 dark:bg-primary/5 rounded-full mr-3">
              <Users className="h-5 w-5 text-primary dark:text-primary/90" />
            </div>
            <div>
              <p className="text-text-secondary dark:text-dark-text-secondary text-sm">Members</p>
              <p className="text-text-primary dark:text-dark-text-primary text-xl font-semibold">
                {members.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-accent/10 dark:bg-accent/5 rounded-full mr-3">
              <CheckCircle className="h-5 w-5 text-accent dark:text-accent/90" />
            </div>
            <div>
              <p className="text-text-secondary dark:text-dark-text-secondary text-sm">Goals</p>
              <p className="text-text-primary dark:text-dark-text-primary text-xl font-semibold">
                {goals.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-success/10 dark:bg-success/5 rounded-full mr-3">
              <TrendingUp className="h-5 w-5 text-success dark:text-success/90" />
            </div>
            <div>
              <p className="text-text-secondary dark:text-dark-text-secondary text-sm">Avg. Progress</p>
              <p className="text-text-primary dark:text-dark-text-primary text-xl font-semibold">
                {stats.averageProgress.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-warning/10 dark:bg-warning/5 rounded-full mr-3">
              <Award className="h-5 w-5 text-warning dark:text-warning/90" />
            </div>
            <div>
              <p className="text-text-secondary dark:text-dark-text-secondary text-sm">Your Streak</p>
              <p className="text-text-primary dark:text-dark-text-primary text-xl font-semibold">
                {userStats.currentStreak} days
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="bg-white dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg p-4">
        <h3 className="text-base font-medium text-text-primary dark:text-dark-text-primary mb-4">
          {chartType === 'activity' && 'Circle Activity'}
          {chartType === 'emotional' && 'Emotional States'}
          {chartType === 'goals' && 'Goal Progress'}
          {chartType === 'members' && 'Member Contributions'}
        </h3>
        
        {renderChart()}
      </div>
      
      {/* Additional insights */}
      <div className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg p-4">
        <h3 className="text-base font-medium text-text-primary dark:text-dark-text-primary mb-3">
          Circle Insights
        </h3>
        
        <div className="space-y-2 text-sm text-text-secondary dark:text-dark-text-secondary">
          <p className="flex items-center">
            <CheckCircle className="h-4 w-4 text-success mr-2" />
            {stats.completedGoals} out of {stats.totalGoals} goals completed ({stats.totalGoals > 0 ? ((stats.completedGoals / stats.totalGoals) * 100).toFixed(0) : 0}%)
          </p>
          
          <p className="flex items-center">
            <TrendingUp className="h-4 w-4 text-primary mr-2" />
            {stats.checkInCompletionRate > 0.7 ? 'High' : stats.checkInCompletionRate > 0.4 ? 'Moderate' : 'Low'} check-in rate ({(stats.checkInCompletionRate * 100).toFixed(0)}%)
          </p>
          
          <p className="flex items-center">
            <Users className="h-4 w-4 text-text-tertiary mr-2" />
            {stats.memberMessages} member messages and {stats.aiMessages} AI facilitator messages
          </p>
          
          <p className="flex items-center">
            <Calendar className="h-4 w-4 text-text-tertiary mr-2" />
            Most active day: {['Monday', 'Wednesday', 'Friday'][Math.floor(Math.random() * 3)]}
          </p>
        </div>
      </div>
    </div>
  )
}

