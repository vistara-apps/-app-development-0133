import { create } from 'zustand'
import { format, subDays, startOfDay } from 'date-fns'
import { isSupabaseConfigured } from '../lib/supabase'
import { useAuthStore } from './authStore'
import * as entriesService from '../services/entriesService'
import * as activitiesService from '../services/activitiesService'
import * as logsService from '../services/logsService'
import { generateMockEntries, generateMockActivities, generateMockActivityLogs } from '../utils/mockData'

export const useDataStore = create((set, get) => ({
  dailyEntries: [],
  activities: [],
  activityLogs: [],
  insights: [],
  isLoading: {
    entries: false,
    activities: false,
    logs: false
  },
  error: null,
  
  // Initialize data
  initializeData: async () => {
    const { user } = useAuthStore.getState()
    const userId = user?.id
    
    if (!userId) {
      console.warn('No user ID available for data initialization')
      return
    }
    
    // Initialize with mock data if Supabase is not configured
    if (!isSupabaseConfigured()) {
      set({
        dailyEntries: generateMockEntries(),
        activities: generateMockActivities(),
        activityLogs: generateMockActivityLogs(),
        isLoading: { entries: false, activities: false, logs: false }
      })
      return
    }
    
    // Load activities
    await get().fetchActivities()
    
    // Load daily entries
    await get().fetchDailyEntries()
    
    // Load activity logs
    await get().fetchActivityLogs()
  },
  
  // Fetch activities from Supabase
  fetchActivities: async (options = {}) => {
    set((state) => ({ 
      isLoading: { ...state.isLoading, activities: true },
      error: null 
    }))
    
    try {
      const { activities, error } = await activitiesService.getActivities(options)
      
      if (error) {
        throw error
      }
      
      // Transform data to match the expected format in the app
      const formattedActivities = activities?.map(activity => ({
        id: activity.id,
        activityId: activity.id, // For backward compatibility
        name: activity.name,
        description: activity.description,
        type: activity.type,
        guideContent: activity.guide_content,
        targetEmotion: activity.target_emotion,
        premiumOnly: activity.premium_only,
        createdAt: activity.created_at
      })) || []
      
      set((state) => ({ 
        activities: formattedActivities,
        isLoading: { ...state.isLoading, activities: false }
      }))
      
      return formattedActivities
    } catch (error) {
      console.error('Error fetching activities:', error)
      set((state) => ({ 
        error: error.message,
        isLoading: { ...state.isLoading, activities: false }
      }))
      return []
    }
  },
  
  // Fetch daily entries from Supabase
  fetchDailyEntries: async (options = {}) => {
    const { user } = useAuthStore.getState()
    const userId = user?.id
    
    if (!userId) {
      console.warn('No user ID available for fetching daily entries')
      return []
    }
    
    set((state) => ({ 
      isLoading: { ...state.isLoading, entries: true },
      error: null 
    }))
    
    try {
      const { entries, error } = await entriesService.getDailyEntries(userId, options)
      
      if (error) {
        throw error
      }
      
      // Transform data to match the expected format in the app
      const formattedEntries = entries?.map(entry => ({
        id: entry.id,
        entryId: entry.id, // For backward compatibility
        userId: entry.user_id,
        date: entry.date,
        emotionalState: entry.emotional_state,
        notes: entry.notes,
        createdAt: entry.created_at
      })) || []
      
      set((state) => ({ 
        dailyEntries: formattedEntries,
        isLoading: { ...state.isLoading, entries: false }
      }))
      
      return formattedEntries
    } catch (error) {
      console.error('Error fetching daily entries:', error)
      set((state) => ({ 
        error: error.message,
        isLoading: { ...state.isLoading, entries: false }
      }))
      return []
    }
  },
  
  // Fetch activity logs from Supabase
  fetchActivityLogs: async (options = {}) => {
    const { user } = useAuthStore.getState()
    const userId = user?.id
    
    if (!userId) {
      console.warn('No user ID available for fetching activity logs')
      return []
    }
    
    set((state) => ({ 
      isLoading: { ...state.isLoading, logs: true },
      error: null 
    }))
    
    try {
      const { logs, error } = await logsService.getActivityLogs(userId, options)
      
      if (error) {
        throw error
      }
      
      // Transform data to match the expected format in the app
      const formattedLogs = logs?.map(log => {
        const activity = log.activities || {}
        return {
          id: log.id,
          logId: log.id, // For backward compatibility
          userId: log.user_id,
          activityId: log.activity_id,
          completionDate: log.completion_date,
          rating: log.rating,
          feedback: log.feedback,
          createdAt: log.created_at,
          activity: {
            id: activity.id,
            activityId: activity.id, // For backward compatibility
            name: activity.name,
            description: activity.description,
            type: activity.type,
            guideContent: activity.guide_content,
            targetEmotion: activity.target_emotion
          }
        }
      }) || []
      
      set((state) => ({ 
        activityLogs: formattedLogs,
        isLoading: { ...state.isLoading, logs: false }
      }))
      
      return formattedLogs
    } catch (error) {
      console.error('Error fetching activity logs:', error)
      set((state) => ({ 
        error: error.message,
        isLoading: { ...state.isLoading, logs: false }
      }))
      return []
    }
  },
  
  // Add a daily entry
  addDailyEntry: async (entry) => {
    const { user } = useAuthStore.getState()
    const userId = user?.id
    
    if (!userId) {
      console.warn('No user ID available for adding daily entry')
      return null
    }
    
    set((state) => ({ 
      isLoading: { ...state.isLoading, entries: true },
      error: null 
    }))
    
    try {
      const { entry: newEntry, error } = await entriesService.upsertDailyEntry(userId, {
        date: entry.date,
        emotional_state: entry.emotionalState,
        notes: entry.notes
      })
      
      if (error) {
        throw error
      }
      
      // Transform data to match the expected format in the app
      const formattedEntry = {
        id: newEntry.id,
        entryId: newEntry.id, // For backward compatibility
        userId: newEntry.user_id,
        date: newEntry.date,
        emotionalState: newEntry.emotional_state,
        notes: newEntry.notes,
        createdAt: newEntry.created_at
      }
      
      set((state) => {
        // Check if entry for this date already exists
        const existingIndex = state.dailyEntries.findIndex(e => e.date === entry.date)
        
        if (existingIndex >= 0) {
          // Update existing entry
          const updatedEntries = [...state.dailyEntries]
          updatedEntries[existingIndex] = formattedEntry
          return { 
            dailyEntries: updatedEntries,
            isLoading: { ...state.isLoading, entries: false }
          }
        } else {
          // Add new entry
          return { 
            dailyEntries: [...state.dailyEntries, formattedEntry],
            isLoading: { ...state.isLoading, entries: false }
          }
        }
      })
      
      return formattedEntry
    } catch (error) {
      console.error('Error adding daily entry:', error)
      set((state) => ({ 
        error: error.message,
        isLoading: { ...state.isLoading, entries: false }
      }))
      return null
    }
  },
  
  // Add an activity log
  addActivityLog: async (log) => {
    const { user } = useAuthStore.getState()
    const userId = user?.id
    
    if (!userId) {
      console.warn('No user ID available for adding activity log')
      return null
    }
    
    set((state) => ({ 
      isLoading: { ...state.isLoading, logs: true },
      error: null 
    }))
    
    try {
      const { log: newLog, error } = await logsService.createActivityLog(userId, {
        activity_id: log.activityId,
        completion_date: log.completionDate,
        rating: log.rating,
        feedback: log.feedback
      })
      
      if (error) {
        throw error
      }
      
      // Get the activity details
      const activity = get().activities.find(a => a.id === newLog.activity_id || a.activityId === newLog.activity_id)
      
      // Transform data to match the expected format in the app
      const formattedLog = {
        id: newLog.id,
        logId: newLog.id, // For backward compatibility
        userId: newLog.user_id,
        activityId: newLog.activity_id,
        completionDate: newLog.completion_date,
        rating: newLog.rating,
        feedback: newLog.feedback,
        createdAt: newLog.created_at,
        activity
      }
      
      set((state) => ({ 
        activityLogs: [...state.activityLogs, formattedLog],
        isLoading: { ...state.isLoading, logs: false }
      }))
      
      return formattedLog
    } catch (error) {
      console.error('Error adding activity log:', error)
      set((state) => ({ 
        error: error.message,
        isLoading: { ...state.isLoading, logs: false }
      }))
      return null
    }
  },
  
  // Get today's entry
  getTodayEntry: () => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return get().dailyEntries.find(entry => entry.date === today)
  },
  
  // Get recent entries
  getRecentEntries: (days = 7) => {
    const cutoff = format(subDays(new Date(), days), 'yyyy-MM-dd')
    return get().dailyEntries.filter(entry => entry.date >= cutoff)
  },
  
  // Get activity completion streak
  getActivityCompletionStreak: async () => {
    const { user } = useAuthStore.getState()
    const userId = user?.id
    
    if (!userId) {
      console.warn('No user ID available for getting activity streak')
      return 0
    }
    
    if (!isSupabaseConfigured()) {
      // Use local calculation if Supabase is not configured
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
    
    try {
      const { streak, error } = await logsService.getActivityCompletionStreak(userId)
      
      if (error) {
        throw error
      }
      
      return streak
    } catch (error) {
      console.error('Error getting activity streak:', error)
      return 0
    }
  }
}))
