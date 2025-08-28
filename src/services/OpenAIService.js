/**
 * OpenAI Integration Service for ResilientFlow
 * 
 * This service handles AI-powered insights, stress analysis, and personalized recommendations
 * using OpenAI's GPT models for emotional wellness coaching.
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, this should be done server-side
});

/**
 * Generates personalized emotional insights based on user data
 */
export class EmotionalInsightGenerator {
  static async generateInsights(userData) {
    const { dailyEntries, activityLogs, userProfile } = userData;
    
    try {
      const prompt = this.buildInsightPrompt(dailyEntries, activityLogs, userProfile);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert emotional wellness coach and data analyst. Your role is to provide compassionate, evidence-based insights about emotional patterns and mental health trends. Always maintain a supportive, non-judgmental tone and focus on actionable recommendations.

            Response format should be JSON with this structure:
            {
              "insights": [
                {
                  "title": "Clear, engaging title",
                  "type": "pattern|recommendation|observation",
                  "confidence": "low|medium|high", 
                  "content": "Detailed insight explanation",
                  "suggestions": ["specific actionable suggestions"],
                  "dataPoints": ["which data informed this insight"]
                }
              ],
              "overallTrend": "improving|stable|concerning",
              "keyRecommendation": "Most important next step"
            }`
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result;
      
    } catch (error) {
      console.error('OpenAI Insight Generation Error:', error);
      return this.getFallbackInsights();
    }
  }
  
  static buildInsightPrompt(dailyEntries, activityLogs, userProfile) {
    const recentEntries = dailyEntries.slice(-7);
    const recentActivities = activityLogs.slice(-14);
    
    return `
    Analyze this user's emotional wellness data and provide personalized insights:
    
    USER CONTEXT:
    - Subscription: ${userProfile.subscriptionTier}
    - Days tracking: ${dailyEntries.length}
    - Total activities completed: ${activityLogs.length}
    
    RECENT EMOTIONAL ENTRIES (Last 7 days):
    ${recentEntries.map(entry => 
      `- ${entry.date}: ${entry.emotionalState} mood, stress: ${entry.stress_level}/5, energy: ${entry.energy_level}/5, notes: "${entry.notes}"`
    ).join('\n')}
    
    RECENT ACTIVITIES (Last 14 days):
    ${recentActivities.map(log => 
      `- ${log.completion_date}: ${log.activity.name} (${log.activity.category}), rated ${log.rating}/5`
    ).join('\n')}
    
    Please identify:
    1. Emotional patterns and trends
    2. Activity effectiveness correlations  
    3. Stress triggers and management
    4. Personalized recommendations for improvement
    5. Recognition of positive progress
    
    Focus on being encouraging while providing actionable insights.`;
  }
  
  static getFallbackInsights() {
    return {
      insights: [
        {
          title: "Keep Building Your Resilience Practice",
          type: "observation",
          confidence: "medium",
          content: "You're actively engaging with emotional wellness tracking, which is a positive step toward building resilience.",
          suggestions: [
            "Continue your daily check-ins to build more complete emotional awareness",
            "Try different activity types to find what works best for you"
          ],
          dataPoints: ["consistent tracking behavior"]
        }
      ],
      overallTrend: "stable",
      keyRecommendation: "Focus on consistency in your daily emotional check-ins"
    };
  }
}

/**
 * AI-powered stress analysis and classification
 */
export class StressAnalyzer {
  static async analyzeStressFromEntry(entry, recentEntries = []) {
    try {
      const prompt = this.buildStressAnalysisPrompt(entry, recentEntries);
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a clinical stress assessment expert. Analyze emotional data to identify stress patterns and classify stress types.

            Response format should be JSON:
            {
              "stressLevel": 1-5,
              "stressType": "ACUTE|CHRONIC|ANTICIPATORY|REACTIVE|EUSTRESS|NONE",
              "confidence": "low|medium|high",
              "triggers": ["identified stress triggers"],
              "patterns": ["observed patterns"],
              "suggestions": ["immediate coping strategies"],
              "riskLevel": "low|moderate|high"
            }`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent analysis
        max_tokens: 800
      });

      return JSON.parse(response.choices[0].message.content);
      
    } catch (error) {
      console.error('OpenAI Stress Analysis Error:', error);
      return this.getFallbackStressAnalysis(entry);
    }
  }
  
  static buildStressAnalysisPrompt(entry, recentEntries) {
    return `
    Analyze this emotional data for stress indicators:
    
    TODAY'S ENTRY:
    - Emotional State: ${entry.emotionalState}
    - Primary Emotion: ${entry.primary_emotion || 'not specified'}
    - Stress Level (self-reported): ${entry.stress_level}/5
    - Energy Level: ${entry.energy_level}/5
    - Notes: "${entry.notes || 'no notes'}"
    - Sleep Hours: ${entry.sleep_hours || 'not tracked'}
    - Mood Triggers: ${entry.mood_triggers?.join(', ') || 'none identified'}
    
    RECENT CONTEXT (Past entries):
    ${recentEntries.map(e => 
      `- ${e.date}: ${e.emotionalState}, stress: ${e.stress_level}/5, notes: "${e.notes}"`
    ).join('\n')}
    
    Provide a clinical assessment focusing on:
    1. Stress severity (1=minimal, 5=severe)
    2. Type of stress based on patterns
    3. Immediate triggers and patterns
    4. Recommended coping strategies
    `;
  }
  
  static getFallbackStressAnalysis(entry) {
    const stressLevel = entry.stress_level || 2;
    return {
      stressLevel,
      stressType: stressLevel >= 4 ? 'ACUTE' : stressLevel >= 3 ? 'REACTIVE' : 'NONE',
      confidence: 'medium',
      triggers: entry.mood_triggers || [],
      patterns: ['Self-reported stress tracking'],
      suggestions: [
        'Practice deep breathing exercises',
        'Consider mindfulness or meditation',
        'Reach out to your support network if needed'
      ],
      riskLevel: stressLevel >= 4 ? 'moderate' : 'low'
    };
  }
}

/**
 * Generates personalized weekly reports
 */
export class WeeklyReportGenerator {
  static async generateWeeklyReport(userData) {
    const { weeklyEntries, weeklyActivities, userProfile } = userData;
    
    try {
      const prompt = this.buildWeeklyReportPrompt(weeklyEntries, weeklyActivities, userProfile);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system", 
            content: `You are a compassionate wellness coach creating personalized weekly progress reports. Focus on celebrating progress, identifying patterns, and providing encouraging next steps.

            Response format should be JSON:
            {
              "summary": {
                "weekHighlights": ["positive achievements"],
                "challengesIdentified": ["areas that needed attention"], 
                "overallProgress": "excellent|good|steady|needs_attention"
              },
              "emotionalTrends": {
                "primaryPattern": "description of main emotional pattern",
                "positiveShifts": ["improvements noticed"],
                "areasForFocus": ["emotions/situations to work on"]
              },
              "activityInsights": {
                "mostEffective": "activity that worked best",
                "consistency": "assessment of regular practice",
                "recommendations": ["suggested activities for next week"]
              },
              "goalSuggestions": [
                {"goal": "specific goal", "rationale": "why this goal", "timeframe": "suggested timeframe"}
              ],
              "encouragement": "personalized encouraging message"
            }`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      });

      return JSON.parse(response.choices[0].message.content);
      
    } catch (error) {
      console.error('OpenAI Weekly Report Error:', error);
      return this.getFallbackWeeklyReport();
    }
  }
  
  static buildWeeklyReportPrompt(weeklyEntries, weeklyActivities, userProfile) {
    return `
    Create a personalized weekly wellness report for this user:
    
    USER PROFILE:
    - Subscription: ${userProfile.subscriptionTier}
    - Total tracking days: ${weeklyEntries.length}
    
    THIS WEEK'S EMOTIONAL ENTRIES:
    ${weeklyEntries.map(entry => 
      `- ${entry.date}: ${entry.emotionalState}, stress: ${entry.stress_level}/5, energy: ${entry.energy_level}/5, notes: "${entry.notes}"`
    ).join('\n')}
    
    THIS WEEK'S ACTIVITIES:
    ${weeklyActivities.map(log => 
      `- ${log.completion_date}: ${log.activity.name} (${log.activity.category}), satisfaction: ${log.rating}/5, feedback: "${log.feedback}"`
    ).join('\n')}
    
    Create an encouraging, personalized report that:
    1. Celebrates their progress and consistency
    2. Identifies helpful patterns and insights  
    3. Suggests specific improvements for next week
    4. Maintains a supportive, coaching tone
    5. Provides actionable next steps
    `;
  }
  
  static getFallbackWeeklyReport() {
    return {
      summary: {
        weekHighlights: ["Consistent tracking and engagement with wellness activities"],
        challengesIdentified: ["Continue building daily habits"],
        overallProgress: "steady"
      },
      emotionalTrends: {
        primaryPattern: "Building awareness through consistent tracking",
        positiveShifts: ["Increased mindfulness about emotional states"],
        areasForFocus: ["Continue exploring what activities work best for you"]
      },
      activityInsights: {
        mostEffective: "Regular check-ins and mindfulness practices",
        consistency: "Showing good engagement with wellness activities",
        recommendations: ["Try different activity types to find your favorites"]
      },
      goalSuggestions: [
        {
          goal: "Complete daily emotional check-ins for the next week",
          rationale: "Consistency builds self-awareness and helps track progress",
          timeframe: "1 week"
        }
      ],
      encouragement: "You're making great progress on your wellness journey. Every check-in and activity is building your emotional resilience!"
    };
  }
}

/**
 * Activity recommendation engine
 */
export class ActivityRecommendationEngine {
  static async getPersonalizedRecommendations(userData, currentMood, availableActivities) {
    try {
      const prompt = this.buildRecommendationPrompt(userData, currentMood, availableActivities);
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an expert wellness coach specializing in activity recommendations. Suggest the most appropriate activities based on the user's current state and history.

            Response format should be JSON:
            {
              "recommendations": [
                {
                  "activityId": "activity identifier",
                  "priority": "high|medium|low",
                  "rationale": "why this activity fits the user's current state",
                  "expectedBenefit": "what the user can expect"
                }
              ],
              "urgency": "immediate|soon|when_ready",
              "focusArea": "primary area this recommendation addresses"
            }`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 1000
      });

      return JSON.parse(response.choices[0].message.content);
      
    } catch (error) {
      console.error('OpenAI Recommendations Error:', error);
      return this.getFallbackRecommendations(currentMood, availableActivities);
    }
  }
  
  static buildRecommendationPrompt(userData, currentMood, availableActivities) {
    const { recentEntries, activityLogs } = userData;
    
    return `
    Recommend the best activities for this user's current state:
    
    CURRENT STATE:
    - Emotional State: ${currentMood.emotionalState}
    - Stress Level: ${currentMood.stressLevel}/5  
    - Energy Level: ${currentMood.energyLevel}/5
    - Available Time: ${currentMood.availableTime || '5-10'} minutes
    
    RECENT PATTERNS:
    ${recentEntries.slice(-3).map(entry => 
      `- ${entry.date}: ${entry.emotionalState}, stress: ${entry.stress_level}/5`
    ).join('\n')}
    
    ACTIVITY HISTORY (what worked well):
    ${activityLogs.slice(-5).map(log => 
      `- ${log.activity.name}: rated ${log.rating}/5 ${log.rating >= 4 ? '(worked well)' : '(less effective)'}`
    ).join('\n')}
    
    AVAILABLE ACTIVITIES:
    ${availableActivities.map(activity => 
      `- ${activity.id}: ${activity.name} (${activity.category}) - ${activity.description}`
    ).join('\n')}
    
    Recommend 2-3 activities that best match their current needs and have shown effectiveness.
    `;
  }
  
  static getFallbackRecommendations(currentMood, availableActivities) {
    const stressLevel = currentMood.stressLevel || 3;
    const energyLevel = currentMood.energyLevel || 3;
    
    // Simple rule-based fallback
    let recommendedActivities = [];
    
    if (stressLevel >= 4) {
      recommendedActivities = availableActivities.filter(a => 
        a.category === 'Mindfulness' && a.name.includes('Breathing')
      );
    } else if (energyLevel <= 2) {
      recommendedActivities = availableActivities.filter(a => 
        a.category === 'Mindfulness'
      );
    } else {
      recommendedActivities = availableActivities.filter(a => 
        a.category === 'Social' || a.category === 'Journaling'
      );
    }
    
    return {
      recommendations: recommendedActivities.slice(0, 2).map(activity => ({
        activityId: activity.id,
        priority: 'medium',
        rationale: `Based on your current ${stressLevel >= 4 ? 'stress level' : energyLevel <= 2 ? 'energy level' : 'mood'}, this activity could be helpful`,
        expectedBenefit: activity.target_emotion || 'improved wellbeing'
      })),
      urgency: stressLevel >= 4 ? 'immediate' : 'when_ready',
      focusArea: stressLevel >= 4 ? 'stress management' : 'general wellness'
    };
  }
}

// Export all services
export default {
  EmotionalInsightGenerator,
  StressAnalyzer, 
  WeeklyReportGenerator,
  ActivityRecommendationEngine
};