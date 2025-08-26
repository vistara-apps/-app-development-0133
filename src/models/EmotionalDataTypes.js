/**
 * Emotional Data Types for Resilify
 * 
 * This file defines the data types and constants used for emotional data
 * throughout the application.
 */

// Emotion Categories
export const EmotionCategories = {
  // Positive emotions
  JOYFUL: 'joyful',
  GRATEFUL: 'grateful',
  INSPIRED: 'inspired',
  CALM: 'calm',
  FOCUSED: 'focused',
  ENERGETIC: 'energetic',
  CONFIDENT: 'confident',
  
  // Neutral emotions
  CONTENT: 'content',
  NEUTRAL: 'neutral',
  CONTEMPLATIVE: 'contemplative',
  CURIOUS: 'curious',
  
  // Challenging emotions
  ANXIOUS: 'anxious',
  STRESSED: 'stressed',
  OVERWHELMED: 'overwhelmed',
  FRUSTRATED: 'frustrated',
  SAD: 'sad',
  TIRED: 'tired',
  ANGRY: 'angry',
  DISAPPOINTED: 'disappointed'
};

// Emotion Groups
export const EmotionGroups = {
  POSITIVE: [
    EmotionCategories.JOYFUL,
    EmotionCategories.GRATEFUL,
    EmotionCategories.INSPIRED,
    EmotionCategories.CALM,
    EmotionCategories.FOCUSED,
    EmotionCategories.ENERGETIC,
    EmotionCategories.CONFIDENT
  ],
  NEUTRAL: [
    EmotionCategories.CONTENT,
    EmotionCategories.NEUTRAL,
    EmotionCategories.CONTEMPLATIVE,
    EmotionCategories.CURIOUS
  ],
  CHALLENGING: [
    EmotionCategories.ANXIOUS,
    EmotionCategories.STRESSED,
    EmotionCategories.OVERWHELMED,
    EmotionCategories.FRUSTRATED,
    EmotionCategories.SAD,
    EmotionCategories.TIRED,
    EmotionCategories.ANGRY,
    EmotionCategories.DISAPPOINTED
  ]
};

// Intensity Levels
export const IntensityLevels = {
  VERY_LOW: 1,
  LOW: 2,
  MODERATE: 3,
  HIGH: 4,
  VERY_HIGH: 5
};

// Context Tags
export const ContextTags = {
  WORK: 'work',
  PERSONAL: 'personal',
  RELATIONSHIPS: 'relationships',
  HEALTH: 'health',
  FINANCES: 'finances',
  FAMILY: 'family',
  SOCIAL: 'social',
  EDUCATION: 'education',
  CREATIVE: 'creative',
  SPIRITUAL: 'spiritual'
};

// Stress Types
export const StressTypes = {
  ACUTE: 'acute',
  CHRONIC: 'chronic',
  ANTICIPATORY: 'anticipatory',
  REACTIVE: 'reactive',
  EUSTRESS: 'eustress'
};

// Nudge Types
export const NudgeTypes = {
  BREATHING: 'breathing',
  MINDFULNESS: 'mindfulness',
  PERSPECTIVE: 'perspective',
  ACTIVITY: 'activity',
  BREAK: 'break',
  SOCIAL: 'social',
  GRATITUDE: 'gratitude',
  RECOVERY: 'recovery'
};

// Integration Types
export const IntegrationTypes = {
  GOOGLE_CALENDAR: 'google_calendar',
  SLACK: 'slack'
};

// Integration Preferences Schema
export const IntegrationPreferencesSchema = {
  GOOGLE_CALENDAR: {
    enabled: false,
    calendarIds: ['primary'],
    analyzeEvents: true,
    suggestPreparation: true,
    suggestRecovery: true,
    scheduleActivities: false
  },
  SLACK: {
    enabled: false,
    allowDirectMessages: true,
    allowSlashCommands: true,
    workHoursOnly: true,
    workHoursStart: '09:00',
    workHoursEnd: '17:00',
    workDays: [1, 2, 3, 4, 5], // Monday to Friday
    channelId: null,
    nudgeFrequency: 'medium',
    sendWeeklyReports: true,
    allowReminders: true
  }
};

export default {
  EmotionCategories,
  EmotionGroups,
  IntensityLevels,
  ContextTags,
  StressTypes,
  NudgeTypes,
  IntegrationTypes,
  IntegrationPreferencesSchema
};

