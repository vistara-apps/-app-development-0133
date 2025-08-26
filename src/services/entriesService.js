import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { generateMockEntries } from '../utils/mockData'

/**
 * Get daily entries for a user
 * @param {string} userId - User ID
 * @param {object} options - Query options
 * @returns {Promise<{entries, error}>} - Daily entries data
 */
export const getDailyEntries = async (userId, options = {}) => {
  if (!isSupabaseConfigured() || !userId) {
    console.warn('Supabase not configured or no userId. Using mock entries.')
    return {
      entries: generateMockEntries(),
      error: null
    }
  }

  let query = supabase
    .from('daily_entries')
    .select('*')
    .eq('user_id', userId)

  // Apply date range filter if provided
  if (options.fromDate) {
    query = query.gte('date', options.fromDate)
  }

  if (options.toDate) {
    query = query.lte('date', options.toDate)
  }

  // Apply emotional state filter if provided
  if (options.emotionalState) {
    query = query.eq('emotional_state', options.emotionalState)
  }

  // Apply sorting
  if (options.orderBy) {
    query = query.order(options.orderBy, { ascending: options.ascending !== false })
  } else {
    query = query.order('date', { ascending: false })
  }

  // Apply pagination
  if (options.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  return { entries: data, error }
}

/**
 * Get a single daily entry by date
 * @param {string} userId - User ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<{entry, error}>} - Daily entry data
 */
export const getDailyEntryByDate = async (userId, date) => {
  if (!isSupabaseConfigured() || !userId || !date) {
    console.warn('Supabase not configured, no userId, or no date. Using mock entry.')
    const mockEntries = generateMockEntries()
    return {
      entry: mockEntries.find(e => e.date === date) || null,
      error: null
    }
  }

  const { data, error } = await supabase
    .from('daily_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .single()

  return { entry: data, error }
}

/**
 * Create or update a daily entry
 * @param {string} userId - User ID
 * @param {object} entryData - Entry data
 * @returns {Promise<{entry, error}>} - Created/updated entry data
 */
export const upsertDailyEntry = async (userId, entryData) => {
  if (!isSupabaseConfigured() || !userId) {
    console.warn('Supabase not configured or no userId. Using mock entry upsert.')
    return {
      entry: {
        id: `entry-${Date.now()}`,
        user_id: userId,
        ...entryData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      error: null
    }
  }

  // Check if entry already exists for this date
  const { entry: existingEntry } = await getDailyEntryByDate(userId, entryData.date)

  if (existingEntry) {
    // Update existing entry
    const { data, error } = await supabase
      .from('daily_entries')
      .update({
        emotional_state: entryData.emotional_state,
        notes: entryData.notes
      })
      .eq('id', existingEntry.id)
      .select()
      .single()

    return { entry: data, error }
  } else {
    // Create new entry
    const { data, error } = await supabase
      .from('daily_entries')
      .insert([{
        user_id: userId,
        date: entryData.date,
        emotional_state: entryData.emotional_state,
        notes: entryData.notes
      }])
      .select()
      .single()

    return { entry: data, error }
  }
}

/**
 * Delete a daily entry
 * @param {string} userId - User ID
 * @param {string} entryId - Entry ID
 * @returns {Promise<{success, error}>} - Delete result
 */
export const deleteDailyEntry = async (userId, entryId) => {
  if (!isSupabaseConfigured() || !userId || !entryId) {
    console.warn('Supabase not configured, no userId, or no entryId. Using mock entry deletion.')
    return {
      success: true,
      error: null
    }
  }

  const { error } = await supabase
    .from('daily_entries')
    .delete()
    .eq('id', entryId)
    .eq('user_id', userId)

  return { success: !error, error }
}

/**
 * Get emotional state statistics for a user
 * @param {string} userId - User ID
 * @param {object} options - Query options
 * @returns {Promise<{stats, error}>} - Emotional state statistics
 */
export const getEmotionalStateStats = async (userId, options = {}) => {
  if (!isSupabaseConfigured() || !userId) {
    console.warn('Supabase not configured or no userId. Using mock stats.')
    return {
      stats: {
        positive: 10,
        neutral: 15,
        negative: 5
      },
      error: null
    }
  }

  let query = supabase
    .from('daily_entries')
    .select('emotional_state')
    .eq('user_id', userId)

  // Apply date range filter if provided
  if (options.fromDate) {
    query = query.gte('date', options.fromDate)
  }

  if (options.toDate) {
    query = query.lte('date', options.toDate)
  }

  const { data, error } = await query

  if (error) {
    return { stats: null, error }
  }

  // Calculate stats
  const stats = data.reduce((acc, entry) => {
    const state = entry.emotional_state || 'unknown'
    acc[state] = (acc[state] || 0) + 1
    return acc
  }, {})

  return { stats, error: null }
}

