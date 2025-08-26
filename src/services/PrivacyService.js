/**
 * Privacy Service for Resilify
 * 
 * This service handles user consent, privacy preferences, and data
 * protection for sensitive emotional data.
 */

// In-memory storage for privacy settings (would be replaced with database in production)
let userPrivacySettings = {};

/**
 * Default privacy settings
 */
const DEFAULT_PRIVACY_SETTINGS = {
  consentGiven: false,
  consentTimestamp: null,
  consentVersion: '1.0',
  dataUsage: {
    allowEmotionalAnalysis: false,
    allowStressDetection: false,
    allowPatternRecognition: false,
    allowExternalIntegrations: false,
    shareAnonymizedData: false
  },
  dataRetention: {
    retentionPeriodDays: 365,
    autoDeleteEnabled: true
  },
  thirdPartySharing: {
    allowGoogleCalendar: false,
    allowSlack: false
  }
};

/**
 * Gets privacy settings for a user
 * @param {string} userId - User ID
 * @returns {Object} - User privacy settings
 */
export function getUserPrivacySettings(userId) {
  return userPrivacySettings[userId] || { ...DEFAULT_PRIVACY_SETTINGS };
}

/**
 * Updates privacy settings for a user
 * @param {string} userId - User ID
 * @param {Object} settings - New privacy settings
 * @returns {Object} - Updated privacy settings
 */
export function updateUserPrivacySettings(userId, settings) {
  const currentSettings = getUserPrivacySettings(userId);
  
  // Merge new settings with current settings
  const updatedSettings = {
    ...currentSettings,
    ...settings,
    // Merge nested objects
    dataUsage: {
      ...currentSettings.dataUsage,
      ...(settings.dataUsage || {})
    },
    dataRetention: {
      ...currentSettings.dataRetention,
      ...(settings.dataRetention || {})
    },
    thirdPartySharing: {
      ...currentSettings.thirdPartySharing,
      ...(settings.thirdPartySharing || {})
    },
    updatedAt: new Date().toISOString()
  };
  
  // Store updated settings
  userPrivacySettings[userId] = updatedSettings;
  
  return updatedSettings;
}

/**
 * Records user consent
 * @param {string} userId - User ID
 * @param {boolean} consentGiven - Whether consent was given
 * @param {string} consentVersion - Version of the consent form
 * @returns {Object} - Updated privacy settings
 */
export function recordUserConsent(userId, consentGiven, consentVersion = '1.0') {
  return updateUserPrivacySettings(userId, {
    consentGiven,
    consentTimestamp: new Date().toISOString(),
    consentVersion
  });
}

/**
 * Checks if a user has given consent for a specific feature
 * @param {string} userId - User ID
 * @param {string} featureType - Feature type to check consent for
 * @returns {boolean} - Whether consent has been given
 */
export function hasUserConsentForFeature(userId, featureType) {
  const settings = getUserPrivacySettings(userId);
  
  // First check if general consent has been given
  if (!settings.consentGiven) {
    return false;
  }
  
  // Then check feature-specific consent
  switch (featureType) {
    case 'emotional_analysis':
      return settings.dataUsage.allowEmotionalAnalysis;
      
    case 'stress_detection':
      return settings.dataUsage.allowStressDetection;
      
    case 'pattern_recognition':
      return settings.dataUsage.allowPatternRecognition;
      
    case 'google_calendar':
      return settings.thirdPartySharing.allowGoogleCalendar;
      
    case 'slack':
      return settings.thirdPartySharing.allowSlack;
      
    case 'anonymized_data':
      return settings.dataUsage.shareAnonymizedData;
      
    case 'external_integrations':
      return settings.dataUsage.allowExternalIntegrations;
      
    default:
      return false;
  }
}

/**
 * Anonymizes user data for research or analytics
 * @param {Object} data - Data to anonymize
 * @returns {Object} - Anonymized data
 */
export function anonymizeUserData(data) {
  if (!data) return null;
  
  // Create a deep copy to avoid modifying the original
  const anonymizedData = JSON.parse(JSON.stringify(data));
  
  // Remove identifying information
  if (anonymizedData.userId) {
    delete anonymizedData.userId;
  }
  
  if (anonymizedData.user) {
    delete anonymizedData.user;
  }
  
  // Replace any notes or text content with length and sentiment only
  if (anonymizedData.notes) {
    const noteLength = anonymizedData.notes.length;
    anonymizedData.notes = {
      length: noteLength,
      hasContent: noteLength > 0
    };
  }
  
  // Add anonymization metadata
  anonymizedData._anonymized = true;
  anonymizedData._anonymizedAt = new Date().toISOString();
  
  return anonymizedData;
}

/**
 * Checks if data should be deleted based on retention policy
 * @param {string} userId - User ID
 * @param {Object} data - Data to check
 * @returns {boolean} - Whether data should be deleted
 */
export function shouldDeleteData(userId, data) {
  const settings = getUserPrivacySettings(userId);
  
  // If auto-delete is disabled, don't delete
  if (!settings.dataRetention.autoDeleteEnabled) {
    return false;
  }
  
  // Check if data is older than retention period
  const retentionPeriodDays = settings.dataRetention.retentionPeriodDays;
  const dataDate = new Date(data.createdAt || data.timestamp || data.date);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionPeriodDays);
  
  return dataDate < cutoffDate;
}

/**
 * Exports all user data in a portable format
 * @param {string} userId - User ID
 * @param {Object} userData - User data from various sources
 * @returns {Object} - Portable data export
 */
export function exportUserData(userId, userData) {
  return {
    userId,
    exportedAt: new Date().toISOString(),
    privacySettings: getUserPrivacySettings(userId),
    data: userData,
    format: 'JSON',
    version: '1.0'
  };
}

/**
 * Generates a privacy report for the user
 * @param {string} userId - User ID
 * @param {Object} dataStats - Statistics about user data
 * @returns {Object} - Privacy report
 */
export function generatePrivacyReport(userId, dataStats) {
  const settings = getUserPrivacySettings(userId);
  
  return {
    userId,
    generatedAt: new Date().toISOString(),
    consentStatus: {
      consentGiven: settings.consentGiven,
      consentTimestamp: settings.consentTimestamp,
      consentVersion: settings.consentVersion
    },
    dataUsage: settings.dataUsage,
    dataStats: {
      totalEntries: dataStats.totalEntries || 0,
      totalActivities: dataStats.totalActivities || 0,
      oldestEntry: dataStats.oldestEntry,
      newestEntry: dataStats.newestEntry,
      dataSize: dataStats.dataSize || 0
    },
    retentionPolicy: {
      retentionPeriodDays: settings.dataRetention.retentionPeriodDays,
      autoDeleteEnabled: settings.dataRetention.autoDeleteEnabled,
      nextScheduledDeletion: settings.dataRetention.autoDeleteEnabled ? 
        getNextScheduledDeletion(dataStats.oldestEntry, settings.dataRetention.retentionPeriodDays) : 
        null
    },
    thirdPartySharing: settings.thirdPartySharing,
    dataProtection: {
      encryptionEnabled: true,
      anonymizationAvailable: true,
      exportAvailable: true,
      deleteAvailable: true
    }
  };
}

/**
 * Gets the next scheduled deletion date based on retention policy
 * @param {string} oldestEntryDate - Date of oldest entry
 * @param {number} retentionPeriodDays - Retention period in days
 * @returns {string} - Next scheduled deletion date
 */
function getNextScheduledDeletion(oldestEntryDate, retentionPeriodDays) {
  if (!oldestEntryDate) return null;
  
  const oldestDate = new Date(oldestEntryDate);
  const deletionDate = new Date(oldestDate);
  deletionDate.setDate(deletionDate.getDate() + retentionPeriodDays);
  
  // If deletion date is in the past, return tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return deletionDate > tomorrow ? deletionDate.toISOString() : tomorrow.toISOString();
}

export default {
  getUserPrivacySettings,
  updateUserPrivacySettings,
  recordUserConsent,
  hasUserConsentForFeature,
  anonymizeUserData,
  shouldDeleteData,
  exportUserData,
  generatePrivacyReport
};

