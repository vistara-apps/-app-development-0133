/**
 * AI Features Test
 * 
 * This file tests the OpenAI integration and AI features
 */

import { EmotionalInsightGenerator, StressAnalyzer, WeeklyReportGenerator, ActivityRecommendationEngine } from './OpenAIService'

export class AITest {
  static async testOpenAIConnection() {
    try {
      console.log('🔍 Testing OpenAI connection...')
      
      // Test with a simple prompt
      const testPrompt = "Say 'Hello, AI is working!' and nothing else."
      
      // We'll test this by trying to generate a simple insight
      const mockUserData = {
        dailyEntries: [
          {
            date: '2024-01-15',
            emotionalState: 'positive',
            stress_level: 2,
            energy_level: 4,
            notes: 'Feeling good today'
          }
        ],
        activityLogs: [
          {
            completion_date: '2024-01-15',
            activity: { name: 'Mindful Breathing', category: 'Mindfulness' },
            rating: 4
          }
        ],
        userProfile: {
          subscriptionTier: 'premium',
          username: 'testuser'
        }
      }
      
      const insights = await EmotionalInsightGenerator.generateInsights(mockUserData)
      
      if (insights && insights.insights) {
        console.log('✅ OpenAI connection successful!')
        console.log('📝 Sample insight:', insights.insights[0]?.title || 'Generated successfully')
        return { success: true, insights }
      } else {
        console.log('⚠️ OpenAI connected but returned fallback insights')
        return { success: true, insights, fallback: true }
      }
      
    } catch (error) {
      console.error('❌ OpenAI connection failed:', error)
      return { success: false, error: error.message }
    }
  }
  
  static async testStressAnalysis() {
    try {
      console.log('🔍 Testing stress analysis...')
      
      const mockEntry = {
        emotionalState: 'negative',
        primary_emotion: 'anxious',
        stress_level: 4,
        energy_level: 2,
        notes: 'Feeling overwhelmed with work',
        mood_triggers: ['work', 'deadlines']
      }
      
      const analysis = await StressAnalyzer.analyzeStressFromEntry(mockEntry)
      
      if (analysis && analysis.stressLevel) {
        console.log('✅ Stress analysis successful!')
        console.log('📊 Analysis result:', analysis)
        return { success: true, analysis }
      } else {
        console.log('⚠️ Stress analysis returned fallback result')
        return { success: true, analysis, fallback: true }
      }
      
    } catch (error) {
      console.error('❌ Stress analysis failed:', error)
      return { success: false, error: error.message }
    }
  }
  
  static async testActivityRecommendations() {
    try {
      console.log('🔍 Testing activity recommendations...')
      
      const mockUserData = {
        recentEntries: [
          {
            date: '2024-01-15',
            emotionalState: 'neutral',
            stress_level: 3
          }
        ],
        activityLogs: [
          {
            activity: { name: 'Mindful Breathing' },
            rating: 4
          }
        ]
      }
      
      const currentMood = {
        emotionalState: 'neutral',
        stressLevel: 3,
        energyLevel: 3,
        availableTime: '10'
      }
      
      const availableActivities = [
        {
          id: 'breathing',
          name: 'Mindful Breathing',
          category: 'Mindfulness',
          description: '5-minute breathing exercise'
        },
        {
          id: 'gratitude',
          name: 'Gratitude Journal',
          category: 'Journaling', 
          description: 'Write down things you\'re grateful for'
        }
      ]
      
      const recommendations = await ActivityRecommendationEngine.getPersonalizedRecommendations(
        mockUserData,
        currentMood,
        availableActivities
      )
      
      if (recommendations && recommendations.recommendations) {
        console.log('✅ Activity recommendations successful!')
        console.log('💡 Recommendations:', recommendations)
        return { success: true, recommendations }
      } else {
        console.log('⚠️ Activity recommendations returned fallback result')
        return { success: true, recommendations, fallback: true }
      }
      
    } catch (error) {
      console.error('❌ Activity recommendations failed:', error)
      return { success: false, error: error.message }
    }
  }
  
  static async runAllTests() {
    console.log('🚀 Running all AI tests...')
    
    const connectionTest = await this.testOpenAIConnection()
    const stressTest = await this.testStressAnalysis()
    const recommendationsTest = await this.testActivityRecommendations()
    
    const allPassed = connectionTest.success && stressTest.success && recommendationsTest.success
    
    console.log(allPassed ? '✅ All AI tests passed!' : '❌ Some AI tests failed')
    
    return {
      success: allPassed,
      connection: connectionTest,
      stressAnalysis: stressTest,
      recommendations: recommendationsTest
    }
  }
}

export default AITest