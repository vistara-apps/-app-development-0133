import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { generateMockActivityLogs } from '../utils/mockData'

/**
 * Get activity logs for a user
 * @param {string} userId - User ID
 * @param {object} options - Query options
 * @returns {Promise<{logs, error}>} - Activity logs data
 */
export const getActivityLogs = async (userId, options = {}) => {
  if (!isSupabaseConfigured() || !userId) {
    console.warn('Supabase not configured or no userId. Using mock activity logs.')
    return {
      logs: generateMockActivityLogs(),
      error: null
    }
  }

  let query = supabase
    .from('activity_logs')
    .select(`
      *,
      activities (*)
    `)
    .eq('user_id', userId)

  // Apply date range filter if provided
  if (options.fromDate) {
    query = query.gte('completion_date', options.fromDate)
  }

  if (options.toDate) {
    query = query.lte('completion_date', options.toDate)
  }

  // Apply activity filter if provided
  if (options.activityId) {
    query = query.eq('activity_id', options.activityId)
  }

  // Apply sorting
  if (options.orderBy) {
    query = query.order(options.orderBy, { ascending: options.ascending !== false })
  } else {
    query = query.order('completion_date', { ascending: false })
  }

  // Apply pagination
  if (options.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  return { logs: data, error }
}

/**
 * Get a single activity log by ID
 * @param {string} userId - User ID
 * @param {string} logId - Log ID
 * @returns {Promise<{log, error}>} - Activity log data
 */
export const getActivityLogById = async (userId, logId) => {
  if (!isSupabaseConfigured() || !userId || !logId) {
    console.warn('Supabase not configured, no userId, or no logId. Using mock activity log.')
    const mockLogs = generateMockActivityLogs()
    return {
      log: mockLogs.find(l => l.logId === logId) || mockLogs[0],
      error: null
    }
  }

  const { data, error } = await supabase
    .from('activity_logs')
    .select(`
      *,
      activities (*)
    `)
    .eq('user_id', userId)
    .eq('id', logId)
    .single()

  return { log: data, error }
}

/**
 * Create a new activity log
 * @param {string} userId - User ID
 * @param {object} logData - Log data
 * @returns {Promise<{log, error}>} - Created log data
 */
export const createActivityLog = async (userId, logData) => {
  if (!isSupabaseConfigured() || !userId) {
    console.warn('Supabase not configured or no userId. Using mock activity log creation.')
    return {
      log: {
        id: `log-${Date.now()}`,
        user_id: userId,
        ...logData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      error: null
    }
  }

  const { data, error } = await supabase
    .from('activity_logs')
    .insert([{
      user_id: userId,
      activity_id: logData.activity_id,
      completion_date: logData.completion_date || new Date().toISOString().split('T')[0],
      rating: logData.rating,
      feedback: logData.feedback
    }])
    .select()
    .single()

  return { log: data, error }
}

/**
 * Update an activity log
 * @param {string} userId - User ID
 * @param {string} logId - Log ID
 * @param {object} updates - Log updates
 * @returns {Promise<{log, error}>} - Updated log data
 */
export const updateActivityLog = async (userId, logId, updates) => {
  if (!isSupabaseConfigured() || !userId || !logId) {
    console.warn('Supabase not configured, no userId, or no logId. Using mock activity log update.')
    return {
      log: {
        id: logId,
        user_id: userId,
        ...updates,
        updated_at: new Date().toISOString()
      },
      error: null
    }
  }

  const { data, error } = await supabase
    .from('activity_logs')
    .update(updates)
    .eq('id', logId)
    .eq('user_id', userId)
    .select()
    .single()

  return { log: data, error }
}

/**
 * Delete an activity log
 * @param {string} userId - User ID
 * @param {string} logId - Log ID
 * @returns {Promise<{success, error}>} - Delete result
 */
export const deleteActivityLog = async (userId, logId) => {
  if (!isSupabaseConfigured() || !userId || !logId) {
    console.warn('Supabase not configured, no userId, or no logId. Using mock activity log deletion.')
    return {
      success: true,
      error: null
    }
  }

  const { error } = await supabase
    .from('activity_logs')
    .delete()
    .eq('id', logId)
    .eq('user_id', userId)

  return { success: !error, error }
}

/**
 * Get activity completion streak for a user
 * @param {string} userId - User ID
 * @returns {Promise<{streak, error}>} - Streak count
 */
export const getActivityCompletionStreak = async (userId) => {
  if (!isSupabaseConfigured() || !userId) {
    console.warn('Supabase not configured or no userId. Using mock streak.')
    return {
      streak: Math.floor(Math.random() * 10) + 1,
      error: null
    }
  }

  const { logs, error } = await getActivityLogs(userId, {
    orderBy: 'completion_date',
    ascending: false
  })

  if (error) {
    return { streak: 0, error }
  }

  let streak = 0
  let currentDate = new Date()
  
  while (streak < 30) {
    const dateStr = currentDate.toISOString().split('T')[0]
    const hasActivity = logs.some(log => log.completion_date === dateStr)
    
    if (!hasActivity) break
    
    streak++
    currentDate.setDate(currentDate.getDate() - 1)
  }
  
  return { streak, error: null }
}

