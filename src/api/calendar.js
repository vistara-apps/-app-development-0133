/**
 * Calendar API Service
 * 
 * This file provides functions for interacting with the calendar API.
 * It handles privacy settings updates and external integration enablement.
 */

// Base API URL
const API_BASE_URL = '/api/calendar';

/**
 * Update privacy settings for calendar integration
 * @param {Object} settings - The privacy settings to update
 * @returns {Promise<Object>} - The response from the API
 */
export const updatePrivacySettings = async (settings) => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updatePrivacySettings',
        settings
      }),
    });

    if (!response.ok) {
      throw new Error(`Error updating privacy settings: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to update privacy settings:', error);
    throw error;
  }
};

/**
 * Enable external integration for calendar
 * @param {Object} options - Options for enabling external integration
 * @returns {Promise<Object>} - The response from the API
 */
export const enableExternalIntegration = async (options) => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'enableExternalIntegration',
        options
      }),
    });

    if (!response.ok) {
      throw new Error(`Error enabling external integration: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to enable external integration:', error);
    throw error;
  }
};

/**
 * Get calendar integration status
 * @returns {Promise<Object>} - The response from the API
 */
export const getCalendarIntegrationStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error getting calendar integration status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get calendar integration status:', error);
    throw error;
  }
};

export default {
  updatePrivacySettings,
  enableExternalIntegration,
  getCalendarIntegrationStatus
};

