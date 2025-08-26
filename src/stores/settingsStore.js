/**
 * Settings Store for Resilify
 * 
 * This store manages user settings and preferences for the application,
 * including AI Copilot settings, privacy preferences, and integration settings.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Default settings
const DEFAULT_SETTINGS = {
  // AI Copilot features
  features: {
    enhancedPulseCheck: true,
    stressClassification: true,
    contextualNudges: true,
    weeklyReports: true,
    calendarIntegration: false,
    slackIntegration: false
  },
  
  // AI Copilot preferences
  preferences: {
    nudgeFrequency: 'medium', // 'low', 'medium', 'high'
    nudgeTypes: ['breathing', 'mindfulness', 'perspective', 'activity', 'break'],
    aiPersonality: 'supportive', // 'supportive', 'motivational', 'analytical'
    communicationStyle: 'casual', // 'formal', 'casual', 'direct'
    reminderTime: '09:00', // Daily reminder time
    weeklyReportDay: 1, // Monday
    dataRetentionDays: 365 // 1 year
  },
  
  // Privacy settings
  privacy: {
    shareAnonymizedData: false,
    allowEmotionAnalysis: true,
    allowStressDetection: true,
    allowPatternRecognition: true,
    allowExternalIntegrations: false
  },
  
  // Google Calendar integration settings
  googleCalendar: {
    enabled: false,
    calendarIds: ['primary'],
    analyzeEvents: true,
    suggestPreparation: true,
    suggestRecovery: true,
    scheduleActivities: false
  },
  
  // Slack integration settings
  slack: {
    enabled: false,
    allowDirectMessages: true,
    allowSlashCommands: true,
    workHoursOnly: true,
    workHoursStart: '09:00',
    workHoursEnd: '17:00',
    workDays: [1, 2, 3, 4, 5] // Monday to Friday
  },
  
  // Notification settings
  notifications: {
    browser: true,
    email: false,
    inApp: true,
    dailyDigest: false
  },
  
  // Theme settings
  theme: {
    darkMode: false,
    colorScheme: 'default' // 'default', 'calm', 'energetic'
  }
};

// Create the store with persistence
export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // Initialize with default settings
      ...DEFAULT_SETTINGS,
      
      // Update all settings
      updateSettings: (newSettings) => set({ ...newSettings }),
      
      // Update specific settings category
      updateFeatures: (features) => set({ features: { ...get().features, ...features } }),
      updatePreferences: (preferences) => set({ preferences: { ...get().preferences, ...preferences } }),
      updatePrivacy: (privacy) => set({ privacy: { ...get().privacy, ...privacy } }),
      updateGoogleCalendar: (googleCalendar) => set({ googleCalendar: { ...get().googleCalendar, ...googleCalendar } }),
      updateSlack: (slack) => set({ slack: { ...get().slack, ...slack } }),
      updateNotifications: (notifications) => set({ notifications: { ...get().notifications, ...notifications } }),
      updateTheme: (theme) => set({ theme: { ...get().theme, ...theme } }),
      
      // Toggle feature on/off
      toggleFeature: (featureName) => set({
        features: {
          ...get().features,
          [featureName]: !get().features[featureName]
        }
      }),
      
      // Reset settings to defaults
      resetSettings: () => set(DEFAULT_SETTINGS),
      
      // Reset specific category to defaults
      resetCategory: (category) => set({
        [category]: DEFAULT_SETTINGS[category]
      })
    }),
    {
      name: 'resilify-settings', // Storage key
      getStorage: () => localStorage // Use localStorage for persistence
    }
  )
);

export default useSettingsStore;

