/**
 * Real AI-Powered Insight Generator for ResilientFlow
 * 
 * This service integrates with OpenAI to generate personalized insights
 * and replaces the mock implementation with real AI analysis.
 */

import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { EmotionalInsightGenerator, WeeklyReportGenerator } from './OpenAIService';
import { DailyEntries, ActivityLogs, UserProfiles } from './supabase';
import { getMockInsights, getMockWeeklyReport } from './InsightGenerator'; // Fallback

/**
 * Generates real AI insights using OpenAI
 */
export async function generateRealInsights(userId) {
  try {
    // Get user data from Supabase
    const userProfile = await UserProfiles.getById(userId);
    const dailyEntries = await DailyEntries.getByUserId(userId, 30);
    const activityLogs = await ActivityLogs.getByUserId(userId, 50);
    
    if (!userProfile) {
      throw new Error('User profile not found');
    }
    
    // Prepare data for OpenAI
    const userData = {
      userProfile,
      dailyEntries,
      activityLogs
    };
    
    // Generate insights with OpenAI
    const aiResult = await EmotionalInsightGenerator.generateInsights(userData);
    
    // Transform OpenAI response to app format
    const insights = aiResult.insights.map((insight, index) => ({
      insightId: `ai-insight-${Date.now()}-${index}`,
      title: insight.title,
      content: insight.content,
      confidence: insight.confidence.charAt(0).toUpperCase() + insight.confidence.slice(1),
      category: insight.type,
      suggestions: insight.suggestions || [],
      generatedAt: new Date().toISOString(),
      viewed: false,
      source: 'openai-gpt4',
      dataPoints: insight.dataPoints || [],
      overallTrend: aiResult.overallTrend,
      keyRecommendation: aiResult.keyRecommendation
    }));
    
    return insights;
    
  } catch (error) {
    console.error('Real insight generation failed:', error);
    console.log('Falling back to mock insights');
    return getMockInsights(); // Fallback to mock data
  }
}

/**
 * Generates real weekly report using OpenAI
 */
export async function generateRealWeeklyReport(userId) {
  try {
    // Get this week's data
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    
    const userProfile = await UserProfiles.getById(userId);
    const weeklyEntries = await DailyEntries.getByUserId(userId, 7);
    const weeklyActivities = await ActivityLogs.getByUserId(userId, 14);
    
    // Filter to this week only
    const thisWeekEntries = weeklyEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });
    
    const thisWeekActivities = weeklyActivities.filter(log => {
      const logDate = new Date(log.completion_date);
      return logDate >= weekStart && logDate <= weekEnd;
    });
    
    const userData = {
      userProfile,
      weeklyEntries: thisWeekEntries,
      weeklyActivities: thisWeekActivities
    };
    
    // Generate report with OpenAI
    const aiReport = await WeeklyReportGenerator.generateWeeklyReport(userData);
    
    // Transform to app format
    const report = {
      reportId: `ai-report-${Date.now()}`,
      userId,
      weekStartDate: format(weekStart, 'yyyy-MM-dd'),
      weekEndDate: format(weekEnd, 'yyyy-MM-dd'),
      
      // Summary section
      summary: {
        totalCheckIns: thisWeekEntries.length,
        totalActivities: thisWeekActivities.length,
        averageMood: calculateAverageMood(thisWeekEntries),
        weeklyStreak: calculateWeeklyStreak(thisWeekActivities),
        highlights: aiReport.summary.weekHighlights,
        challenges: aiReport.summary.challengesIdentified,
        overallProgress: aiReport.summary.overallProgress
      },
      
      // Emotional insights
      emotionalInsights: {
        primaryTrend: aiReport.emotionalTrends.primaryPattern,
        positiveShifts: aiReport.emotionalTrends.positiveShifts,
        areasOfFocus: aiReport.emotionalTrends.areasForFocus,
        moodDistribution: calculateMoodDistribution(thisWeekEntries)
      },
      
      // Activity analysis
      activityAnalysis: {
        mostEffective: aiReport.activityInsights.mostEffective,
        consistencyScore: aiReport.activityInsights.consistency,
        recommendations: aiReport.activityInsights.recommendations,
        completionRate: calculateCompletionRate(thisWeekActivities)
      },
      
      // Goals and next steps
      recommendations: aiReport.goalSuggestions.map(goal => ({
        goal: goal.goal,
        rationale: goal.rationale,
        timeframe: goal.timeframe,
        priority: 'medium'
      })),
      
      // Encouraging message
      encouragementMessage: aiReport.encouragement,
      
      // Metadata
      generatedAt: new Date().toISOString(),
      source: 'openai-gpt4',
      viewed: false
    };
    
    return report;
    
  } catch (error) {
    console.error('Real weekly report generation failed:', error);
    console.log('Falling back to mock report');
    return getMockWeeklyReport(); // Fallback to mock data
  }
}

/**
 * Helper function to calculate average mood
 */
function calculateAverageMood(entries) {
  if (!entries.length) return 'neutral';
  
  const moodValues = {
    'negative': 1,
    'neutral': 2, 
    'positive': 3
  };
  
  const average = entries.reduce((sum, entry) => {
    return sum + (moodValues[entry.emotional_state] || 2);
  }, 0) / entries.length;
  
  if (average >= 2.5) return 'positive';
  if (average >= 1.5) return 'neutral';
  return 'negative';
}

/**
 * Helper function to calculate weekly streak
 */
function calculateWeeklyStreak(activities) {
  const dates = [...new Set(activities.map(log => log.completion_date))];
  return dates.length;
}

/**
 * Helper function to calculate mood distribution
 */
function calculateMoodDistribution(entries) {
  const distribution = {
    positive: 0,
    neutral: 0,
    negative: 0
  };
  
  entries.forEach(entry => {
    distribution[entry.emotional_state] = (distribution[entry.emotional_state] || 0) + 1;
  });
  
  return distribution;
}

/**
 * Helper function to calculate completion rate
 */
function calculateCompletionRate(activities) {
  // This is a simplified calculation
  // In a real app, you'd compare against planned activities
  return Math.min(activities.length / 7 * 100, 100); // Assume 1 activity per day is 100%
}

/**
 * Check if OpenAI is available and configured
 */
export function isOpenAIConfigured() {
  return !!import.meta.env.VITE_OPENAI_API_KEY && 
         import.meta.env.VITE_OPENAI_API_KEY !== 'sk-your-openai-api-key-here';
}

/**
 * Get insights - will use OpenAI if configured, otherwise falls back to mock
 */
export async function getInsights(userId) {
  if (isOpenAIConfigured()) {
    return await generateRealInsights(userId);
  } else {
    console.log('OpenAI not configured, using mock insights');
    return getMockInsights();
  }
}

/**
 * Get weekly report - will use OpenAI if configured, otherwise falls back to mock
 */
export async function getWeeklyReport(userId) {
  if (isOpenAIConfigured()) {
    return await generateRealWeeklyReport(userId);
  } else {
    console.log('OpenAI not configured, using mock report');
    return getMockWeeklyReport();
  }
}