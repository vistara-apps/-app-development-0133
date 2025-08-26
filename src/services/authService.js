import { supabase, isSupabaseConfigured } from '../lib/supabase'

/**
 * Sign up a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {object} metadata - Additional user metadata
 * @returns {Promise<{user, error}>} - Supabase auth response
 */
export const signUp = async (email, password, metadata = {}) => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Using mock signup.')
    return {
      user: {
        id: 'mock-user-id',
        email,
        user_metadata: metadata
      },
      error: null
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: metadata.username || email.split('@')[0],
        ...metadata
      }
    }
  })

  if (!error && data?.user) {
    // Create a record in the users table
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user.id,
          username: metadata.username || email.split('@')[0],
          onboarding_completed: false,
          subscription_tier: 'free'
        }
      ])
      .single()

    if (profileError) {
      console.error('Error creating user profile:', profileError)
    }
  }

  return { user: data?.user, error }
}

/**
 * Sign in a user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<{user, error}>} - Supabase auth response
 */
export const signIn = async (email, password) => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Using mock signin.')
    return {
      user: {
        id: 'mock-user-id',
        email
      },
      error: null
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  return { user: data?.user, error }
}

/**
 * Sign out the current user
 * @returns {Promise<{error}>} - Supabase auth response
 */
export const signOut = async () => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Using mock signout.')
    return { error: null }
  }

  return await supabase.auth.signOut()
}

/**
 * Get the current user session
 * @returns {Promise<{session, error}>} - Supabase auth response
 */
export const getCurrentSession = async () => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Using mock session.')
    return {
      session: null,
      error: null
    }
  }

  const { data, error } = await supabase.auth.getSession()
  return { session: data?.session, error }
}

/**
 * Get the current user
 * @returns {Promise<{user, error}>} - Supabase auth response
 */
export const getCurrentUser = async () => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Using mock user.')
    return {
      user: null,
      error: null
    }
  }

  const { data, error } = await supabase.auth.getUser()
  return { user: data?.user, error }
}

/**
 * Get the user profile from the users table
 * @param {string} userId - User ID
 * @returns {Promise<{profile, error}>} - User profile data
 */
export const getUserProfile = async (userId) => {
  if (!isSupabaseConfigured() || !userId) {
    console.warn('Supabase not configured or no userId. Using mock profile.')
    return {
      profile: {
        id: userId || 'mock-user-id',
        username: 'Demo User',
        onboarding_completed: true,
        subscription_tier: 'free',
        created_at: new Date().toISOString()
      },
      error: null
    }
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  return { profile: data, error }
}

/**
 * Update the user profile
 * @param {string} userId - User ID
 * @param {object} updates - Profile updates
 * @returns {Promise<{profile, error}>} - Updated profile data
 */
export const updateUserProfile = async (userId, updates) => {
  if (!isSupabaseConfigured() || !userId) {
    console.warn('Supabase not configured or no userId. Using mock update.')
    return {
      profile: {
        id: userId || 'mock-user-id',
        ...updates
      },
      error: null
    }
  }

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  return { profile: data, error }
}

