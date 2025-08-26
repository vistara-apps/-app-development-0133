import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { generateMockActivities } from '../utils/mockData'

/**
 * Get all activities
 * @param {object} options - Query options
 * @returns {Promise<{activities, error}>} - Activities data
 */
export const getActivities = async (options = {}) => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Using mock activities.')
    return {
      activities: generateMockActivities(),
      error: null
    }
  }

  let query = supabase.from('activities').select('*')

  // Apply filters if provided
  if (options.type) {
    query = query.eq('type', options.type)
  }

  if (options.premium !== undefined) {
    query = query.eq('premium_only', options.premium)
  }

  // Apply sorting
  if (options.orderBy) {
    query = query.order(options.orderBy, { ascending: options.ascending !== false })
  } else {
    query = query.order('name', { ascending: true })
  }

  const { data, error } = await query

  return { activities: data, error }
}

/**
 * Get a single activity by ID
 * @param {string} activityId - Activity ID
 * @returns {Promise<{activity, error}>} - Activity data
 */
export const getActivityById = async (activityId) => {
  if (!isSupabaseConfigured() || !activityId) {
    console.warn('Supabase not configured or no activityId. Using mock activity.')
    const mockActivities = generateMockActivities()
    return {
      activity: mockActivities.find(a => a.activityId === activityId) || mockActivities[0],
      error: null
    }
  }

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', activityId)
    .single()

  return { activity: data, error }
}

/**
 * Create a new activity (admin only)
 * @param {object} activityData - Activity data
 * @returns {Promise<{activity, error}>} - Created activity data
 */
export const createActivity = async (activityData) => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Using mock activity creation.')
    return {
      activity: {
        id: `activity-${Date.now()}`,
        ...activityData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      error: null
    }
  }

  const { data, error } = await supabase
    .from('activities')
    .insert([activityData])
    .select()
    .single()

  return { activity: data, error }
}

/**
 * Update an activity (admin only)
 * @param {string} activityId - Activity ID
 * @param {object} updates - Activity updates
 * @returns {Promise<{activity, error}>} - Updated activity data
 */
export const updateActivity = async (activityId, updates) => {
  if (!isSupabaseConfigured() || !activityId) {
    console.warn('Supabase not configured or no activityId. Using mock activity update.')
    return {
      activity: {
        id: activityId,
        ...updates,
        updated_at: new Date().toISOString()
      },
      error: null
    }
  }

  const { data, error } = await supabase
    .from('activities')
    .update(updates)
    .eq('id', activityId)
    .select()
    .single()

  return { activity: data, error }
}

/**
 * Delete an activity (admin only)
 * @param {string} activityId - Activity ID
 * @returns {Promise<{success, error}>} - Delete result
 */
export const deleteActivity = async (activityId) => {
  if (!isSupabaseConfigured() || !activityId) {
    console.warn('Supabase not configured or no activityId. Using mock activity deletion.')
    return {
      success: true,
      error: null
    }
  }

  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', activityId)

  return { success: !error, error }
}

