/**
 * Database Setup Script
 * 
 * This script helps set up the Supabase database with the required schema
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://enlsvqrfgktlndrnbojk.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVubHN2cXJmZ2t0bG5kcm5ib2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjAyMzIsImV4cCI6MjA1OTI5NjIzMn0.m-5RQwMmu5_aJyYDNKVMFF5ugWEtmpcZT4jjBMm3Pos'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Supabase database...')
    
    // Read the SQL schema file
    const schemaPath = path.join(process.cwd(), 'supabase-schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    console.log('📄 Schema file loaded, size:', schema.length, 'characters')
    
    // Note: We can't execute SQL directly from the client
    // This would need to be done in the Supabase dashboard
    console.log('⚠️  Please run the following SQL in your Supabase SQL Editor:')
    console.log('')
    console.log('=' * 50)
    console.log(schema)
    console.log('=' * 50)
    console.log('')
    
    // Test connection
    console.log('🔍 Testing database connection...')
    const { data, error } = await supabase
      .from('activities')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('❌ Database not set up yet. Please run the SQL schema first.')
      console.log('Error:', error.message)
    } else {
      console.log('✅ Database connection successful!')
    }
    
  } catch (error) {
    console.error('❌ Setup error:', error)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase()
}

export { setupDatabase }