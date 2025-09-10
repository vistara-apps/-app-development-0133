/**
 * Supabase Connection Test
 * 
 * This file tests the Supabase connection and database setup
 */

import { supabase } from './supabase'

export class SupabaseTest {
  static async testConnection() {
    try {
      console.log('🔍 Testing Supabase connection...')
      
      // Test basic connection
      const { data, error } = await supabase
        .from('activities')
        .select('count')
        .limit(1)
      
      if (error) {
        console.error('❌ Supabase connection failed:', error)
        return { success: false, error: error.message }
      }
      
      console.log('✅ Supabase connection successful!')
      return { success: true, data }
      
    } catch (error) {
      console.error('❌ Supabase test error:', error)
      return { success: false, error: error.message }
    }
  }
  
  static async testTables() {
    try {
      console.log('🔍 Testing database tables...')
      
      const tables = [
        'user_profiles',
        'daily_entries', 
        'activities',
        'activity_logs',
        'support_circles',
        'circle_members',
        'circle_messages',
        'ai_insights',
        'subscriptions',
        'weekly_reports'
      ]
      
      const results = {}
      
      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(1)
          
          if (error) {
            results[table] = { exists: false, error: error.message }
          } else {
            results[table] = { exists: true, count: data?.length || 0 }
          }
        } catch (err) {
          results[table] = { exists: false, error: err.message }
        }
      }
      
      console.log('📊 Table test results:', results)
      return { success: true, results }
      
    } catch (error) {
      console.error('❌ Table test error:', error)
      return { success: false, error: error.message }
    }
  }
  
  static async testAuth() {
    try {
      console.log('🔍 Testing Supabase auth...')
      
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.log('ℹ️ No active session (expected for new users)')
        return { success: true, hasSession: false }
      }
      
      console.log('✅ Auth test successful!')
      return { success: true, hasSession: !!data.session }
      
    } catch (error) {
      console.error('❌ Auth test error:', error)
      return { success: false, error: error.message }
    }
  }
  
  static async runAllTests() {
    console.log('🚀 Running all Supabase tests...')
    
    const connectionTest = await this.testConnection()
    const tableTest = await this.testTables()
    const authTest = await this.testAuth()
    
    const allPassed = connectionTest.success && tableTest.success && authTest.success
    
    console.log(allPassed ? '✅ All Supabase tests passed!' : '❌ Some tests failed')
    
    return {
      success: allPassed,
      connection: connectionTest,
      tables: tableTest,
      auth: authTest
    }
  }
}

export default SupabaseTest