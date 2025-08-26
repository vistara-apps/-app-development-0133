/**
 * Nudge Service
 * 
 * This service manages contextual nudges, including generation,
 * delivery, and tracking.
 */

import { generateContextualNudge } from './AIService';

// In-memory storage for active nudges (would be replaced with database in production)
const activeNudges = {};

/**
 * Generates a new nudge based on user state
 * @param {Object} userState - Current user state
 * @param {Object} userPreferences - User preferences
 * @returns {Object} - Generated nudge
 */
export async function generateNudge(userState, userPreferences) {
  try {
    // Generate nudge using AI service
    const nudge = await generateContextualNudge(userState, userPreferences);
    
    // Store in active nudges
    if (!activeNudges[userState.userId]) {
      activeNudges[userState.userId] = [];
    }
    
    activeNudges[userState.userId].push(nudge);
    
    return nudge;
  } catch (error) {
    console.error('Error generating nudge:', error);
    return null;
  }
}

/**
 * Delivers a nudge through the specified channel
 * @param {Object} nudge - The nudge to deliver
 * @param {string} channel - Delivery channel ('app', 'browser', 'slack', 'email')
 * @returns {boolean} - Whether delivery was successful
 */
export function deliverNudge(nudge, channel = 'app') {
  // In a real implementation, this would handle different delivery channels
  console.log(`Delivering nudge via ${channel}:`, nudge);
  
  switch (channel) {
    case 'app':
      // In-app notification is handled by the UI
      return true;
      
    case 'browser':
      // Browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification('Resilify Nudge', {
            body: nudge.content,
            icon: '/logo.png'
          });
          return true;
        } catch (error) {
          console.error('Error sending browser notification:', error);
          return false;
        }
      }
      return false;
      
    case 'slack':
      // In a real implementation, this would call a Slack API
      console.log('Sending Slack message:', nudge);
      return true;
      
    case 'email':
      // In a real implementation, this would send an email
      console.log('Sending email:', nudge);
      return true;
      
    default:
      return false;
  }
}

/**
 * Tracks user interaction with a nudge
 * @param {string} nudgeId - ID of the nudge
 * @param {string} interaction - Type of interaction ('viewed', 'actioned', 'dismissed', 'feedback')
 * @param {Object} details - Additional interaction details
 * @returns {boolean} - Whether tracking was successful
 */
export function trackNudgeInteraction(nudgeId, interaction, details = {}) {
  // In a real implementation, this would store the interaction in a database
  console.log(`Tracking nudge interaction (${interaction}):`, nudgeId, details);
  
  // Update nudge in memory
  Object.values(activeNudges).forEach(userNudges => {
    const nudgeIndex = userNudges.findIndex(n => n.nudgeId === nudgeId);
    
    if (nudgeIndex !== -1) {
      userNudges[nudgeIndex] = {
        ...userNudges[nudgeIndex],
        [interaction]: true,
        [`${interaction}At`]: new Date().toISOString(),
        ...(details || {})
      };
      
      // Remove from active nudges if dismissed
      if (interaction === 'dismissed') {
        userNudges.splice(nudgeIndex, 1);
      }
    }
  });
  
  return true;
}

/**
 * Gets active nudges for a user
 * @param {string} userId - User ID
 * @returns {Array} - Active nudges for the user
 */
export function getActiveNudges(userId) {
  return activeNudges[userId] || [];
}

/**
 * Gets nudge effectiveness statistics
 * @param {string} userId - User ID
 * @returns {Object} - Nudge effectiveness statistics
 */
export function getNudgeEffectiveness(userId) {
  // In a real implementation, this would calculate effectiveness from a database
  return {
    totalNudges: 42,
    viewRate: 85, // percentage
    actionRate: 62, // percentage
    mostEffectiveType: 'breathing',
    leastEffectiveType: 'social',
    averageFeedbackRating: 4.2
  };
}

export default {
  generateNudge,
  deliverNudge,
  trackNudgeInteraction,
  getActiveNudges,
  getNudgeEffectiveness
};

