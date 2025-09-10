#!/usr/bin/env node

/**
 * Test script for ResilientFlow services
 * This script tests various services to ensure they're working correctly
 */

import { createClient } from '@supabase/supabase-js'
import axios from 'axios'

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'your-supabase-url'
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Test Supabase connection
async function testSupabase() {
  console.log('🔍 Testing Supabase...')
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('❌ Supabase connection failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection successful')
    return true
  } catch (err) {
    console.log('❌ Supabase test failed:', err.message)
    return false
  }
}

// Test OpenAI (simplified)
async function testOpenAI() {
  console.log('🔍 Testing OpenAI...')
  
  const apiKey = process.env.OPENAI_API_KEY || 'your-api-key-here'
  
  if (!apiKey) {
    console.log('❌ OpenAI API key not found')
    return false
  }
  
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 10
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.data.choices && response.data.choices.length > 0) {
      console.log('✅ OpenAI API working')
      return true
    } else {
      console.log('❌ OpenAI API response invalid')
      return false
    }
  } catch (err) {
    console.log('❌ OpenAI test failed:', err.message)
    return false
  }
}

// Test Stripe (simplified)
async function testStripe() {
  console.log('🔍 Testing Stripe...')
  
  const stripeKey = process.env.STRIPE_SECRET_KEY || 'your-stripe-key-here'
  
  if (!stripeKey) {
    console.log('❌ Stripe secret key not found')
    return false
  }
  
  try {
    const response = await axios.get('https://api.stripe.com/v1/balance', {
      headers: {
        'Authorization': `Bearer ${stripeKey}`
      }
    })
    
    if (response.data) {
      console.log('✅ Stripe API working')
      return true
    } else {
      console.log('❌ Stripe API response invalid')
      return false
    }
  } catch (err) {
    console.log('❌ Stripe test failed:', err.message)
    return false
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting ResilientFlow service tests...\n')
  
  const results = {
    supabase: await testSupabase(),
    openai: await testOpenAI(),
    stripe: await testStripe()
  }
  
  console.log('\n📊 Test Results:')
  console.log('================')
  console.log(`Supabase: ${results.supabase ? '✅' : '❌'}`)
  console.log(`OpenAI: ${results.openai ? '✅' : '❌'}`)
  console.log(`Stripe: ${results.stripe ? '✅' : '❌'}`)
  
  const allPassed = Object.values(results).every(result => result)
  
  if (allPassed) {
    console.log('\n🎉 All tests passed!')
    process.exit(0)
  } else {
    console.log('\n⚠️  Some tests failed. Check your configuration.')
    process.exit(1)
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error)
}

export { testSupabase, testOpenAI, testStripe, runTests }
runTests()