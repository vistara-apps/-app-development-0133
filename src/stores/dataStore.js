import { create } from 'zustand'
import { format, subDays, startOfDay } from 'date-fns'
import { 
  DailyEntries, 
  ActivityLogs, 
  Activities, 
  UserProfiles,
  Auth 
} from '../services/supabase'

// Mock data generator for demo purposes
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
    guideContent: 'Find a comfortable position. Close your eyes and focus on your breath. Breathe in slowly for 4 counts, hold for 4 counts, then exhale for 6 counts. Continue this pattern for 5 minutes, bringing your attention back to your breath whenever your mind wanders.',
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
    guideContent: 'Take 30 minutes for yourself. Read a book, take a warm bath, meditate, listen to music, or do something that brings you joy. The key is to be fully present and focus on yourself without distractions.',
    targetEmotion: 'refreshed',
    score: 25,
    resilientCategory: 'mindfulness'
  },
  {
    activityId: 'activity-4',
    name: 'Learning',
    description: 'Engage in learning something new or developing a skill',
    type: 'mindfulness',
    category: 'Mindfulness',
    guideContent: 'Choose a topic that interests you. Read an article, watch an educational video, practice a new skill, or take an online course for 20-30 minutes. Focus on the process of learning rather than the outcome.',
    targetEmotion: 'accomplished',
    score: 15,
    resilientCategory: 'mindfulness'
  },
  {
    activityId: 'activity-8',
    name: 'Cooking',
    description: 'Prepare a healthy, mindful meal with intention',
    type: 'mindfulness',
    category: 'Mindfulness',
    guideContent: 'Choose a recipe you enjoy. Focus on each step - the textures, smells, colors of ingredients. Cook slowly and mindfully, appreciating the process of creating something nourishing for yourself.',
    targetEmotion: 'satisfied',
    score: 15,
    resilientCategory: 'mindfulness'
  },
  {
    activityId: 'activity-9',
    name: 'Progressive Muscle Relaxation',
    description: 'Release physical tension through systematic muscle relaxation',
    type: 'mindfulness',
    category: 'Mindfulness',
    guideContent: 'Starting with your toes, tense each muscle group for 5 seconds, then release. Work your way up through your legs, torso, arms, and face. Notice the contrast between tension and relaxation.',
    targetEmotion: 'relaxed',
    score: 15,
    resilientCategory: 'mindfulness'
  },

  // Social Category
  {
    activityId: 'activity-5',
    name: 'Family Time',
    description: 'Spend quality time connecting with family members',
    type: 'social',
    category: 'Social',
    guideContent: 'Engage in meaningful conversation, play games, share a meal, or do an activity together without distractions. Focus on being present and creating positive memories together.',
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
    guideContent: 'Choose any form of exercise you enjoy - yoga, running, strength training, dancing, or sports. Can be done alone or with others. Aim for 20-30 minutes and focus on how movement makes you feel.',
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
    guideContent: 'Find a nearby park, trail, or green space. Walk mindfully, observing the sights, sounds, and smells around you. Leave devices behind or use them minimally. Appreciate the natural world.',
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
    guideContent: 'Think about your day and identify three things, big or small, that you are grateful for. Write them down with detail about why each one matters to you. Reflect on the positive aspects of your life.',
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
    guideContent: 'Identify a negative thought or worry. Write it down, then ask yourself: Is this thought helpful? What evidence supports or contradicts it? What would you tell a friend in this situation? Write a more balanced perspective.',
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
    
    logs.push({
      logId: `log-${i}`,
      userId: 'demo-user-1',
      activityId: activity.activityId,
      completionDate: date,
      rating: Math.floor(Math.random() * 3) + 3, // 3-5 rating
      feedback: i < 3 ? `This ${activity.name.toLowerCase()} was helpful` : '',
      activity: activity,
      createdAt: new Date(date).toISOString()
    })
  }
  return logs
}

export const useDataStore = create((set, get) => ({
  // State
  dailyEntries: [],
  activityLogs: [],
  activities: [],
  initialized: false,
  currentUser: null,
  emotionalScore: 0,

  // Actions
  initialize: async () => {
    if (get().initialized) return
    
    try {
      console.log('🔄 Initializing data store...')
      
      // Always use mock data for now to ensure app works
      console.log('ℹ️ Using mock data for demo')
      set({ 
        dailyEntries: generateMockEntries(),
        activityLogs: generateMockActivityLogs(),
        activities: generateMockActivities(),
        initialized: true 
      })
      
      console.log('✅ Data store initialized with mock data')
    } catch (error) {
      console.error('❌ Failed to initialize data store:', error)
      // Fallback to mock data
      set({ 
        dailyEntries: generateMockEntries(),
        activityLogs: generateMockActivityLogs(),
        activities: generateMockActivities(),
        initialized: true 
      })
    }
  },

  // Add daily entry
  addDailyEntry: async (entry) => {
    try {
      const { currentUser } = get()
      
      if (currentUser) {
        // Save to Supabase
        const newEntry = await DailyEntries.create({
          user_id: currentUser.id,
          date: entry.date,
          emotional_state: entry.emotionalState,
          primary_emotion: entry.primaryEmotion,
          energy_level: entry.energyLevel,
          stress_level: entry.stressLevel,
          notes: entry.notes,
          mood_triggers: entry.moodTriggers,
          sleep_hours: entry.sleepHours
        })
        
        // Update local state
        set(state => ({
          dailyEntries: [newEntry, ...state.dailyEntries]
        }))
        
        console.log('✅ Daily entry saved to Supabase')
      } else {
        // Demo mode - just add to local state
        const newEntry = {
          entryId: `entry-${Date.now()}`,
          userId: 'demo-user-1',
          ...entry,
          createdAt: new Date().toISOString()
        }
        
        set(state => ({
          dailyEntries: [newEntry, ...state.dailyEntries]
        }))
        
        console.log('✅ Daily entry saved locally (demo mode)')
      }
    } catch (error) {
      console.error('❌ Failed to save daily entry:', error)
    }
  },

  // Add activity log
  addActivityLog: async (log) => {
    try {
      const { currentUser } = get()
      
      if (currentUser) {
        // Save to Supabase
        const newLog = await ActivityLogs.create({
          user_id: currentUser.id,
          activity_id: log.activityId,
          completion_date: log.completionDate,
          rating: log.rating,
          feedback: log.feedback,
          duration_minutes: log.durationMinutes
        })
        
        // Update local state
        set(state => ({
          activityLogs: [newLog, ...state.activityLogs]
        }))
        
        console.log('✅ Activity log saved to Supabase')
      } else {
        // Demo mode - just add to local state
        const newLog = {
          logId: `log-${Date.now()}`,
          userId: 'demo-user-1',
          ...log,
          createdAt: new Date().toISOString()
        }
        
        set(state => ({
          activityLogs: [newLog, ...state.activityLogs]
        }))
        
        console.log('✅ Activity log saved locally (demo mode)')
      }
    } catch (error) {
      console.error('❌ Failed to save activity log:', error)
    }
  },

  // Get today's entry
  getTodayEntry: () => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return get().dailyEntries.find(entry => entry.date === today)
  },

  // Get recent entries
  getRecentEntries: (days = 7) => {
    const entries = get().dailyEntries
    const cutoffDate = subDays(new Date(), days)
    
    return entries.filter(entry => {
      const entryDate = new Date(entry.date)
      return entryDate >= cutoffDate
    }).sort((a, b) => new Date(b.date) - new Date(a.date))
  },

  // Get activity completion streak
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

  getCheckInStreak: () => {
    const entries = get().dailyEntries
    let streak = 0
    let currentDate = new Date()
    
    while (streak < 30) {
      const dateStr = format(currentDate, 'yyyy-MM-dd')
      const hasEntry = entries.some(entry => entry.date === dateStr)
      
      if (!hasEntry) break
      
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