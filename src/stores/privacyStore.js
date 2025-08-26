import { create } from 'zustand'
import { useAuthStore } from './authStore'

export const usePrivacyStore = create((set, get) => ({
  // Global privacy settings
  globalSettings: {
    shareEmotionalData: true,
    shareActivities: true,
    shareInsights: false,
    defaultVisibility: 'members-only', // 'public', 'members-only', 'private'
    allowAnonymousMode: false,
    dataRetentionPeriod: 90, // days
  },
  
  // Circle-specific privacy overrides
  circleOverrides: {
    // Format: circleId: { setting: value }
    'circle-1': {
      shareEmotionalData: true,
      shareActivities: true,
      shareInsights: true,
      visibility: 'members-only',
      anonymousMode: false,
    },
    'circle-3': {
      shareEmotionalData: false,
      shareActivities: true,
      shareInsights: false,
      visibility: 'private',
      anonymousMode: true,
    }
  },
  
  // Content visibility settings
  contentSettings: {
    goals: 'circle-members', // 'public', 'circle-members', 'private'
    dailyEntries: 'private',
    insights: 'private',
    activities: 'circle-members',
  },
  
  // Actions
  updateGlobalSettings: (settings) => set(state => ({
    globalSettings: { ...state.globalSettings, ...settings }
  })),
  
  updateCircleOverrides: (circleId, settings) => set(state => ({
    circleOverrides: { 
      ...state.circleOverrides, 
      [circleId]: { 
        ...(state.circleOverrides[circleId] || {}), 
        ...settings 
      } 
    }
  })),
  
  updateContentSettings: (settings) => set(state => ({
    contentSettings: { ...state.contentSettings, ...settings }
  })),
  
  // Helper functions
  getCircleSettings: (circleId) => {
    const { globalSettings, circleOverrides } = get()
    const overrides = circleOverrides[circleId] || {}
    
    return {
      ...globalSettings,
      ...overrides
    }
  },
  
  canShareContent: (contentType, circleId) => {
    const { contentSettings } = get()
    const circleSetting = get().getCircleSettings(circleId)
    
    // Check content-specific settings
    const visibilitySetting = contentSettings[contentType]
    
    if (visibilitySetting === 'private') {
      return false
    }
    
    if (visibilitySetting === 'public') {
      return true
    }
    
    // For circle-members setting, check if sharing is enabled for this content type
    switch (contentType) {
      case 'goals':
        return circleSetting.shareActivities
      case 'dailyEntries':
        return circleSetting.shareEmotionalData
      case 'insights':
        return circleSetting.shareInsights
      case 'activities':
        return circleSetting.shareActivities
      default:
        return false
    }
  },
  
  isAnonymousModeEnabled: (circleId) => {
    const settings = get().getCircleSettings(circleId)
    return settings.anonymousMode || false
  },
  
  getDisplayName: (circleId) => {
    const { user } = useAuthStore.getState()
    const isAnonymous = get().isAnonymousModeEnabled(circleId)
    
    if (isAnonymous) {
      // Generate consistent anonymous name based on userId and circleId
      const hash = [...user.userId, ...circleId]
        .map(c => c.charCodeAt(0))
        .reduce((a, b) => a + b, 0)
      
      const adjectives = ['Thoughtful', 'Mindful', 'Peaceful', 'Serene', 'Calm', 'Resilient', 'Brave', 'Hopeful']
      const nouns = ['Explorer', 'Journeyer', 'Seeker', 'Thinker', 'Listener', 'Observer', 'Supporter']
      
      const adjIndex = hash % adjectives.length
      const nounIndex = (hash * 13) % nouns.length
      
      return `${adjectives[adjIndex]} ${nouns[nounIndex]}`
    }
    
    return user.username
  }
}))

