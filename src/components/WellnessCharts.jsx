import React from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Calendar, Target, Award } from 'lucide-react'

const WellnessCharts = ({ 
  weeklyData = [],
  monthlyData = [],
  activityData = [],
  stressData = [],
  className = '' 
}) => {
  // Sample data if none provided
  const defaultWeeklyData = [
    { day: 'Mon', score: 120, activities: 2 },
    { day: 'Tue', score: 135, activities: 3 },
    { day: 'Wed', score: 110, activities: 1 },
    { day: 'Thu', score: 145, activities: 4 },
    { day: 'Fri', score: 160, activities: 3 },
    { day: 'Sat', score: 175, activities: 5 },
    { day: 'Sun', score: 150, activities: 2 }
  ]

  const defaultActivityData = [
    { name: 'Meditation', value: 35, color: '#3b82f6' },
    { name: 'Journaling', value: 25, color: '#10b981' },
    { name: 'Breathing', value: 20, color: '#8b5cf6' },
    { name: 'Movement', value: 15, color: '#f59e0b' },
    { name: 'Social', value: 5, color: '#ef4444' }
  ]

  const defaultStressData = [
    { level: 'Low', count: 12, color: '#10b981' },
    { level: 'Moderate', count: 8, color: '#f59e0b' },
    { level: 'High', count: 3, color: '#ef4444' }
  ]

  const data = {
    weekly: weeklyData.length > 0 ? weeklyData : defaultWeeklyData,
    activity: activityData.length > 0 ? activityData : defaultActivityData,
    stress: stressData.length > 0 ? stressData : defaultStressData
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`space-y-8 ${className}`}
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-text-primary">
          Your Wellness Insights
        </h2>
        <p className="text-text-secondary">
          Track your progress and discover patterns in your emotional resilience journey
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Weekly Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="wellness-card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Weekly Trend</h3>
              <p className="text-sm text-text-secondary">Your resilience score over time</p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data.weekly}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="day" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                domain={[100, 200]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [value, 'Resilience Score']}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#scoreGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Activity Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="wellness-card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <Target className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Activity Distribution</h3>
              <p className="text-sm text-text-secondary">Your preferred wellness practices</p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.activity}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.activity.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [`${value}%`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-2 mt-4">
            {data.activity.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-text-secondary">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stress Level Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="wellness-card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Stress Levels</h3>
              <p className="text-sm text-text-secondary">Your stress patterns this month</p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.stress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="level" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [value, 'Days']}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.stress.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Achievements Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="wellness-card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <Award className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">This Month</h3>
              <p className="text-sm text-text-secondary">Your wellness achievements</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium text-text-primary">Activities Completed</span>
              </div>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">47</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm font-medium text-text-primary">Current Streak</span>
              </div>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">12 days</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span className="text-sm font-medium text-text-primary">Average Score</span>
              </div>
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">142</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-sm font-medium text-text-primary">Badges Earned</span>
              </div>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">3</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Insights Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="wellness-card p-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20"
      >
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">
            🌟 You're Making Great Progress!
          </h3>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Your consistency with meditation and journaling is building strong emotional resilience. 
            Keep up the wonderful work - every small step counts toward your wellness journey.
          </p>
          <div className="flex justify-center space-x-4 text-sm text-text-secondary">
            <span>• Meditation: Your strongest practice</span>
            <span>• Stress levels: Improving steadily</span>
            <span>• Streak: Keep it going!</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default WellnessCharts