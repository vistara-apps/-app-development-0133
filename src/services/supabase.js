/**
 * Supabase Client Configuration
 * 
 * This service handles all database operations for ResilientFlow
 * including user data, activities, emotional entries, and support circles.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://enlsvqrfgktlndrnbojk.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVubHN2cXJmZ2t0bG5kcm5ib2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjAyMzIsImV4cCI6MjA1OTI5NjIzMn0.m-5RQwMmu5_aJyYDNKVMFF5ugWEtmpcZT4jjBMm3Pos'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database table schemas and utilities

/**
 * User Profiles Table
 */
export const UserProfiles = {
  tableName: 'user_profiles',
  
  async create(userData) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([userData])
      .select()
    
    if (error) throw error
    return data[0]
  },
  
  async getById(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },
  
  async update(userId, updates) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
    
    if (error) throw error
    return data[0]
  }
}

/**
 * Daily Entries Table
 */
export const DailyEntries = {
  tableName: 'daily_entries',
  
  async create(entry) {
    const { data, error } = await supabase
      .from('daily_entries')
      .insert([entry])
      .select()
    
    if (error) throw error
    return data[0]
  },
  
  async getByUserId(userId, limit = 30) {
    const { data, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
  },
  
  async getTodayEntry(userId) {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },
  
  async update(entryId, updates) {
    const { data, error } = await supabase
      .from('daily_entries')
      .update(updates)
      .eq('id', entryId)
      .select()
    
    if (error) throw error
    return data[0]
  }
}

/**
 * Activity Logs Table
 */
export const ActivityLogs = {
  tableName: 'activity_logs',
  
  async create(log) {
    const { data, error } = await supabase
      .from('activity_logs')
      .insert([log])
      .select(`
        *,
        activities (*)
      `)
    
    if (error) throw error
    return data[0]
  },
  
  async getByUserId(userId, limit = 50) {
    const { data, error } = await supabase
      .from('activity_logs')
      .select(`
        *,
        activities (*)
      `)
      .eq('user_id', userId)
      .order('completion_date', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
  },
  
  async getStreak(userId) {
    // Get recent activity logs to calculate streak
    const { data, error } = await supabase
      .from('activity_logs')
      .select('completion_date')
      .eq('user_id', userId)
      .order('completion_date', { ascending: false })
      .limit(30)
    
    if (error) throw error
    
    // Calculate streak logic
    let streak = 0
    const today = new Date()
    const dates = data.map(log => log.completion_date)
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateStr = checkDate.toISOString().split('T')[0]
      
      if (dates.includes(dateStr)) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }
}

/**
 * Activities Table (Master List)
 */
export const Activities = {
  tableName: 'activities',
  
  async getAll() {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('category', { ascending: true })
    
    if (error) throw error
    return data || []
  },
  
  async getById(activityId) {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('id', activityId)
      .single()
    
    if (error) throw error
    return data
  },
  
  async create(activity) {
    const { data, error } = await supabase
      .from('activities')
      .insert([activity])
      .select()
    
    if (error) throw error
    return data[0]
  }
}

/**
 * Support Circles Table
 */
export const SupportCircles = {
  tableName: 'support_circles',
  
  async create(circle) {
    const { data, error } = await supabase
      .from('support_circles')
      .insert([circle])
      .select()
    
    if (error) throw error
    return data[0]
  },
  
  async getAll() {
    const { data, error } = await supabase
      .from('support_circles')
      .select(`
        *,
        circle_members (
          user_id,
          role,
          joined_at
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },
  
  async getByUserId(userId) {
    const { data, error } = await supabase
      .from('circle_members')
      .select(`
        *,
        support_circles (*)
      `)
      .eq('user_id', userId)
    
    if (error) throw error
    return data?.map(item => item.support_circles) || []
  },
  
  async joinCircle(userId, circleId, role = 'member') {
    const { data, error } = await supabase
      .from('circle_members')
      .insert([{
        user_id: userId,
        circle_id: circleId,
        role,
        joined_at: new Date().toISOString()
      }])
      .select()
    
    if (error) throw error
    return data[0]
  },
  
  async leaveCircle(userId, circleId) {
    const { error } = await supabase
      .from('circle_members')
      .delete()
      .eq('user_id', userId)
      .eq('circle_id', circleId)
    
    if (error) throw error
    return true
  }
}

/**
 * Circle Messages Table
 */
export const CircleMessages = {
  tableName: 'circle_messages',
  
  async create(message) {
    const { data, error } = await supabase
      .from('circle_messages')
      .insert([message])
      .select(`
        *,
        user_profiles (username, avatar_url)
      `)
    
    if (error) throw error
    return data[0]
  },
  
  async getByCircleId(circleId, limit = 100) {
    const { data, error } = await supabase
      .from('circle_messages')
      .select(`
        *,
        user_profiles (username, avatar_url)
      `)
      .eq('circle_id', circleId)
      .order('created_at', { ascending: true })
      .limit(limit)
    
    if (error) throw error
    return data || []
  }
}

/**
 * Subscriptions Table
 */
export const Subscriptions = {
  tableName: 'subscriptions',
  
  async create(subscription) {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([subscription])
      .select()
    
    if (error) throw error
    return data[0]
  },
  
  async getByUserId(userId) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (error) throw error
    return data?.[0]
  },
  
  async update(subscriptionId, updates) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', subscriptionId)
      .select()
    
    if (error) throw error
    return data[0]
  }
}

// Auth helpers
export const Auth = {
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) throw error
    return data
  },
  
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },
  
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },
  
  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  },
  
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}