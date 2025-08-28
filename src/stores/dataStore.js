import { create } from 'zustand'
import { format, subDays, startOfDay } from 'date-fns'

// Mock data generator
const generateMockEntries = () => {
  const entries = []
  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
    const emotionalStates = ['positive', 'neutral', 'negative']
    const state = emotionalStates[Math.floor(Math.random() * 3)]
    
    entries.push({
      entryId: `entry-${i}`,
      userId: 'demo-user-1',
      date,
      emotionalState: state,
      notes: i < 5 ? `Feeling ${state} today` : '',
      createdAt: new Date(date).toISOString()
    })
  }
  return entries
}

const generateMockActivities = () => [
  // Mindfulness Category
  {
    activityId: 'activity-1',
    name: 'Mindful Breathing',
    description: 'A 5-minute guided breathing exercise to center yourself',
    type: 'mindfulness',
    category: 'Mindfulness',
    guideContent: 'Find a comfortable position. Close your eyes and focus on your breath...',
    targetEmotion: 'calm',
    score: 15,
    resilientCategory: 'mindfulness'
  },
  {
    activityId: 'activity-6',
    name: 'Me Time',
    description: 'Dedicated time for personal reflection and self-care',
    type: 'mindfulness',
    category: 'Mindfulness',
    guideContent: 'Take 30 minutes for yourself. Read, take a bath, meditate, or do something you enjoy...',
    targetEmotion: 'refreshed',
    score: 25,
    resilientCategory: 'mindfulness'
  },
  {
    activityId: 'activity-8',
    name: 'Learning',
    description: 'Engage in learning something new or developing a skill',
    type: 'mindfulness',
    category: 'Mindfulness',
    guideContent: 'Choose a topic that interests you. Read, watch educational content, or practice a new skill for 20-30 minutes...',
    targetEmotion: 'accomplished',
    score: 15,
    resilientCategory: 'mindfulness'
  },
  {
    activityId: 'activity-9',
    name: 'Cooking',
    description: 'Prepare a healthy, mindful meal with intention',
    type: 'mindfulness',
    category: 'Mindfulness',
    guideContent: 'Choose a recipe you enjoy. Focus on the process, the ingredients, and the joy of creating something nourishing...',
    targetEmotion: 'satisfied',
    score: 15,
    resilientCategory: 'mindfulness'
  },
  {
    activityId: 'activity-4',
    name: 'Progressive Muscle Relaxation',
    description: 'Release physical tension through systematic muscle relaxation',
    type: 'mindfulness',
    category: 'Mindfulness',
    guideContent: 'Starting with your toes, tense each muscle group for 5 seconds, then release...',
    targetEmotion: 'relaxed',
    score: 15,
    resilientCategory: 'mindfulness'
  },

  // Social Category
  {
    activityId: 'activity-11',
    name: 'Social Meetup',
    description: 'Connect with friends or community members in person',
    type: 'social',
    category: 'Social',
    guideContent: 'Meet with friends, join a community group, or attend a social event. Focus on genuine connection...',
    targetEmotion: 'connected',
    score: 30,
    resilientCategory: 'social'
  },
  {
    activityId: 'activity-5',
    name: 'Family Time',
    description: 'Spend quality time connecting with family members',
    type: 'social',
    category: 'Social',
    guideContent: 'Engage in meaningful conversation, play games, or share a meal together without distractions...',
    targetEmotion: 'connected',
    score: 30,
    resilientCategory: 'social'
  },
  {
    activityId: 'activity-10',
    name: 'Work Out',
    description: 'Physical exercise to boost mood and energy levels',
    type: 'social',
    category: 'Social',
    guideContent: 'Choose any form of exercise you enjoy - yoga, running, strength training, or dancing. Aim for 20-30 minutes...',
    targetEmotion: 'energetic',
    score: 20,
    resilientCategory: 'social'
  },
  {
    activityId: 'activity-7',
    name: 'Nature Walk',
    description: 'Take a peaceful walk in nature to reconnect and recharge',
    type: 'social',
    category: 'Social',
    guideContent: 'Find a nearby park, trail, or green space. Walk mindfully, observing the sights and sounds around you...',
    targetEmotion: 'energized',
    score: 20,
    resilientCategory: 'social'
  },

  // Journaling Category
  {
    activityId: 'activity-2',
    name: 'Gratitude Journal',
    description: 'Write down three things you are grateful for today',
    type: 'journaling',
    category: 'Journaling',
    guideContent: 'Think about your day and identify three things, big or small, that you are grateful for...',
    targetEmotion: 'positive',
    score: 25,
    resilientCategory: 'journaling'
  },
  {
    activityId: 'activity-3',
    name: 'Cognitive Reframing',
    description: 'Challenge negative thoughts with a more balanced perspective',
    type: 'journaling',
    category: 'Journaling',
    guideContent: 'Identify a negative thought. Ask yourself: Is this thought helpful? What evidence supports or contradicts it?',
    targetEmotion: 'balanced',
    score: 20,
    resilientCategory: 'journaling'
  }
]

const generateMockActivityLogs = () => {
  const logs = []
  const activities = generateMockActivities()
  
  for (let i = 14; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
    const activity = activities[Math.floor(Math.random() * activities.length)]
    
    if (Math.random() > 0.3) { // 70% chance of activity completion
      logs.push({
        logId: `log-${i}`,
        userId: 'demo-user-1',
        activityId: activity.activityId,
        completionDate: date,
        rating: Math.floor(Math.random() * 5) + 1,
        feedback: Math.random() > 0.7 ? 'This helped me feel more centered' : '',
        createdAt: new Date(date).toISOString(),
        activity
      })
    }
  }
  return logs
}

export const useDataStore = create((set, get) => ({
  dailyEntries: generateMockEntries(),
  activities: generateMockActivities(),
  activityLogs: generateMockActivityLogs(),
  insights: [],
  emotionalScore: 0,
  
  addDailyEntry: (entry) => set((state) => ({
    dailyEntries: [...state.dailyEntries, {
      ...entry,
      entryId: `entry-${Date.now()}`,
      createdAt: new Date().toISOString()
    }]
  })),
  
  addActivityLog: (log) => set((state) => ({
    activityLogs: [...state.activityLogs, {
      ...log,
      logId: `log-${Date.now()}`,
      createdAt: new Date().toISOString()
    }]
  })),
  
  getTodayEntry: () => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return get().dailyEntries.find(entry => entry.date === today)
  },
  
  getRecentEntries: (days = 7) => {
    const cutoff = format(subDays(new Date(), days), 'yyyy-MM-dd')
    return get().dailyEntries.filter(entry => entry.date >= cutoff)
  },
  
  getActivityCompletionStreak: () => {
    const logs = get().activityLogs
    let streak = 0
    let currentDate = new Date()
    
    while (streak < 30) {
      const dateStr = format(currentDate, 'yyyy-MM-dd')
      const hasActivity = logs.some(log => log.completionDate === dateStr)
      
      if (!hasActivity) break
      
      streak++
      currentDate = subDays(currentDate, 1)
    }
    
    return streak
  },

  // Calculate emotional score based on activities and check-ins
  calculateEmotionalScore: () => {
    const state = get()
    const recentLogs = state.activityLogs.filter(log => {
      const logDate = new Date(log.completionDate)
      const weekAgo = subDays(new Date(), 7)
      return logDate >= weekAgo
    })
    
    // Base score from completed activities
    const activityScore = recentLogs.reduce((total, log) => {
      const activity = state.activities.find(a => a.activityId === log.activityId)
      return total + (activity?.score || 0)
    }, 0)
    
    // Bonus for consistency (streak multiplier)
    const streak = state.getActivityCompletionStreak()
    const consistencyBonus = Math.min(streak * 2, 50) // Max 50 bonus points
    
    // Recent emotional state bonus
    const recentEntries = state.getRecentEntries(7)
    const positiveEntries = recentEntries.filter(entry => 
      entry.emotionalState === 'positive' || 
      (entry.primaryEmotion && ['joyful', 'grateful', 'inspired', 'calm', 'confident'].includes(entry.primaryEmotion))
    )
    const emotionalBonus = positiveEntries.length * 5
    
    const totalScore = activityScore + consistencyBonus + emotionalBonus
    
    set({ emotionalScore: totalScore })
    return totalScore
  },

  // Get missed activities penalty
  getMissedActivitiesPenalty: () => {
    // Calculate days without activities in the last week
    const logs = get().activityLogs
    let missedDays = 0
    
    for (let i = 0; i < 7; i++) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
      const hasActivity = logs.some(log => log.completionDate === date)
      if (!hasActivity) missedDays++
    }
    
    return missedDays * 10 // 10 points penalty per missed day
  }
}))