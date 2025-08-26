/**
 * Stress Classifier Service
 * 
 * This service analyzes user entries to detect and classify stress patterns.
 */

import { StressTypes } from '../models/EmotionalDataTypes';
import { analyzeEmotionalText } from './AIService';

/**
 * Classifies stress from a daily entry
 * @param {Object} entry - The daily entry to analyze
 * @param {Array} recentEntries - Recent entries for context
 * @returns {Object} - Stress analysis results
 */
export async function classifyStressFromEntry(entry, recentEntries = []) {
  // In a real implementation, this would use a more sophisticated model
  console.log('Classifying stress from entry:', entry);
  
  // Initialize stress level based on emotional state or primary emotion
  let stressLevel = 0;
  let stressType = null;
  let confidence = 'low';
  let triggers = [];
  let patterns = [];
  let suggestions = [];
  
  // Analyze based on enhanced or basic entry
  if (entry.primaryEmotion) {
    // Enhanced entry analysis
    const stressfulEmotions = ['anxious', 'stressed', 'overwhelmed', 'frustrated', 'angry'];
    const moderateStressEmotions = ['sad', 'disappointed', 'tired'];
    
    if (stressfulEmotions.includes(entry.primaryEmotion)) {
      stressLevel = entry.primaryIntensity || 4;
      confidence = 'high';
    } else if (moderateStressEmotions.includes(entry.primaryEmotion)) {
      stressLevel = Math.min(entry.primaryIntensity - 1, 3) || 2;
      confidence = 'medium';
    }
    
    // Check secondary emotions for stress indicators
    if (entry.secondaryEmotions && entry.secondaryEmotions.length > 0) {
      const hasStressfulSecondary = entry.secondaryEmotions.some(e => 
        stressfulEmotions.includes(e.emotion)
      );
      
      if (hasStressfulSecondary && stressLevel < 3) {
        stressLevel += 1;
      }
    }
    
    // Adjust based on energy level
    if (entry.energyLevel <= 2) {
      stressLevel = Math.max(stressLevel, 2);
    }
    
    // Check context tags for potential triggers
    if (entry.contextTags && entry.contextTags.length > 0) {
      triggers = entry.contextTags;
      
      // Work and finances are common stressors
      if (entry.contextTags.includes('work') || entry.contextTags.includes('finances')) {
        stressLevel = Math.max(stressLevel, 3);
      }
    }
  } else {
    // Basic entry analysis
    if (entry.emotionalState === 'negative') {
      stressLevel = 4;
      confidence = 'medium';
    } else if (entry.emotionalState === 'neutral') {
      stressLevel = 2;
      confidence = 'low';
    }
  }
  
  // If notes are available, analyze them for stress indicators
  if (entry.notes) {
    try {
      const textAnalysis = await analyzeEmotionalText(entry.notes);
      
      // Adjust stress level based on text analysis
      if (textAnalysis.sentiment === 'negative') {
        stressLevel = Math.max(stressLevel, 3);
        confidence = 'high';
      }
      
      // Extract potential stress topics
      if (textAnalysis.topics && textAnalysis.topics.length > 0) {
        triggers = [...new Set([...triggers, ...textAnalysis.topics])];
      }
    } catch (error) {
      console.error('Error analyzing notes:', error);
    }
  }
  
  // Determine stress type based on patterns in recent entries
  if (recentEntries && recentEntries.length > 0) {
    // Check for chronic stress (persistent over time)
    const hasConsistentStress = recentEntries.filter(e => 
      e.stressLevel >= 3 || 
      e.emotionalState === 'negative' ||
      (e.primaryEmotion && ['anxious', 'stressed', 'overwhelmed'].includes(e.primaryEmotion))
    ).length >= Math.min(3, recentEntries.length);
    
    if (hasConsistentStress) {
      stressType = StressTypes.CHRONIC;
      patterns.push('Persistent stress over multiple days');
      suggestions.push('Consider longer-term stress management strategies');
    } 
    // Check for acute stress (sudden spike)
    else if (stressLevel >= 4 && recentEntries[0] && 
             (recentEntries[0].stressLevel <= 2 || recentEntries[0].emotionalState === 'positive')) {
      stressType = StressTypes.ACUTE;
      patterns.push('Sudden increase in stress levels');
      suggestions.push('Focus on immediate stress reduction techniques');
    }
    // Check for anticipatory stress (future-focused)
    else if (entry.notes && 
             (entry.notes.includes('worried about') || 
              entry.notes.includes('anxious about') || 
              entry.notes.includes('upcoming') || 
              entry.notes.includes('future'))) {
      stressType = StressTypes.ANTICIPATORY;
      patterns.push('Stress about future events');
      suggestions.push('Try preparation strategies and perspective exercises');
    }
    // Check for reactive stress (past-focused)
    else if (entry.notes && 
             (entry.notes.includes('because of') || 
              entry.notes.includes('reacting to') || 
              entry.notes.includes('happened'))) {
      stressType = StressTypes.REACTIVE;
      patterns.push('Stress in reaction to past events');
      suggestions.push('Practice acceptance and recovery techniques');
    }
    // Default to acute if type couldn't be determined but stress is present
    else if (stressLevel >= 3) {
      stressType = StressTypes.ACUTE;
    }
  } else if (stressLevel >= 3) {
    // Without context, default to acute stress
    stressType = StressTypes.ACUTE;
  }
  
  // Add general suggestions based on stress level
  if (stressLevel >= 4) {
    suggestions.push('Consider taking breaks throughout the day');
    suggestions.push('Try a breathing exercise when feeling overwhelmed');
  } else if (stressLevel >= 3) {
    suggestions.push('Regular mindfulness practice may help manage stress');
  }
  
  return {
    stressLevel,
    stressType,
    confidence,
    triggers,
    patterns,
    suggestions,
    source: entry.primaryEmotion ? 'enhanced' : 'basic',
    analyzedAt: new Date().toISOString()
  };
}

/**
 * Analyzes stress patterns over time
 * @param {Array} entries - Array of daily entries
 * @returns {Object} - Stress pattern analysis
 */
export function analyzeStressPatterns(entries) {
  if (!entries || entries.length === 0) {
    return {
      averageStressLevel: 0,
      stressFrequency: 0,
      commonTriggers: [],
      recommendations: []
    };
  }
  
  // Calculate average stress level
  const stressEntries = entries.filter(e => e.stressLevel);
  const averageStressLevel = stressEntries.length > 0 
    ? stressEntries.reduce((sum, e) => sum + e.stressLevel, 0) / stressEntries.length
    : 0;
  
  // Calculate stress frequency (percentage of days with stress level >= 3)
  const highStressDays = entries.filter(e => e.stressLevel >= 3).length;
  const stressFrequency = entries.length > 0 ? (highStressDays / entries.length) * 100 : 0;
  
  // Identify common triggers
  const triggerCounts = {};
  entries.forEach(entry => {
    if (entry.triggers && entry.triggers.length > 0) {
      entry.triggers.forEach(trigger => {
        triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
      });
    }
  });
  
  const commonTriggers = Object.entries(triggerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([trigger]) => trigger);
  
  // Generate recommendations
  const recommendations = [];
  
  if (averageStressLevel >= 4) {
    recommendations.push('Your stress levels are consistently high. Consider speaking with a healthcare professional.');
  } else if (averageStressLevel >= 3) {
    recommendations.push('Regular stress management practices would be beneficial for your overall well-being.');
  }
  
  if (stressFrequency >= 70) {
    recommendations.push('You\'re experiencing stress on most days. Consider implementing daily stress reduction techniques.');
  } else if (stressFrequency >= 40) {
    recommendations.push('You have stress on many days. Regular mindfulness practice may help reduce overall stress.');
  }
  
  if (commonTriggers.includes('work')) {
    recommendations.push('Work appears to be a common stressor. Consider setting boundaries or discussing workload management.');
  }
  
  if (commonTriggers.includes('relationships')) {
    recommendations.push('Relationship stress is common. Communication strategies or support may be helpful.');
  }
  
  return {
    averageStressLevel,
    stressFrequency,
    commonTriggers,
    recommendations
  };
}

export default {
  classifyStressFromEntry,
  analyzeStressPatterns
};

