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
  {
    activityId: 'activity-1',
    name: 'Mindful Breathing',
    description: 'A 5-minute guided breathing exercise to center yourself',
    type: 'mindfulness',
    guideContent: 'Find a comfortable position. Close your eyes and focus on your breath...',
    targetEmotion: 'calm'
  },
  {
    activityId: 'activity-2',
    name: 'Gratitude Journal',
    description: 'Write down three things you\'re grateful for today',
    type: 'gratitude',
    guideContent: 'Think about your day and identify three things, big or small, that you\'re grateful for...',
    targetEmotion: 'positive'
  },
  {
    activityId: 'activity-3',
    name: 'Cognitive Reframing',
    description: 'Challenge negative thoughts with a more balanced perspective',
    type: 'cognitive',
    guideContent: 'Identify a negative thought. Ask yourself: Is this thought helpful? What evidence supports or contradicts it?',
    targetEmotion: 'balanced'
  },
  {
    activityId: 'activity-4',
    name: 'Progressive Muscle Relaxation',
    description: 'Release physical tension through systematic muscle relaxation',
    type: 'relaxation',
    guideContent: 'Starting with your toes, tense each muscle group for 5 seconds, then release...',
    targetEmotion: 'relaxed'
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
  }
}))