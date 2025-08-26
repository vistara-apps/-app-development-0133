/**
 * Hook for contextual nudges
 */

import { useState, useEffect, useCallback } from 'react';
import { useDataStore } from '../stores/dataStore';
import { useAuthStore } from '../stores/authStore';
import { generateNudge, deliverNudge, trackNudgeInteraction, getActiveNudges } from '../services/NudgeService';

/**
 * Hook for managing contextual nudges
 * @param {Object} options - Configuration options
 * @returns {Object} - Nudge state and functions
 */
export function useContextualNudges(options = {}) {
  const { 
    autoGenerate = true,
    deliveryChannel = 'app',
    checkInterval = 60000 // 1 minute
  } = options;
  
  const { user } = useAuthStore();
  const { getTodayEntry, getRecentEntries } = useDataStore();
  
  const [activeNudges, setActiveNudges] = useState([]);
  const [currentNudge, setCurrentNudge] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  /**
   * Generates a new nudge based on current user state
   */
  const generateNewNudge = useCallback(async () => {
    if (!user || isGenerating) {
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const todayEntry = getTodayEntry();
      
      if (!todayEntry) {
        return;
      }
      
      // Prepare user state for nudge generation
      const userState = {
        userId: user.userId,
        primaryEmotion: todayEntry.primaryEmotion || todayEntry.emotionalState,
        primaryIntensity: todayEntry.primaryIntensity || 3,
        stressLevel: todayEntry.stressLevel || 
          (todayEntry.emotionalState === 'negative' ? 4 : 
           todayEntry.emotionalState === 'neutral' ? 2 : 1),
        energyLevel: todayEntry.energyLevel || 3,
        contextTags: todayEntry.contextTags || [],
        recentEntries: getRecentEntries(7)
      };
      
      // Mock user preferences (would come from settings store in production)
      const userPreferences = {
        userId: user.userId,
        features: {
          contextualNudges: true
        },
        preferences: {
          nudgeFrequency: 'medium',
          nudgeTypes: ['breathing', 'mindfulness', 'perspective', 'activity'],
          aiPersonality: 'supportive'
        }
      };
      
      // Generate nudge
      const nudge = await generateNudge(userState, userPreferences);
      
      if (nudge) {
        // Deliver the nudge
        const delivered = deliverNudge(nudge, deliveryChannel);
        
        if (delivered) {
          // Update active nudges
          setActiveNudges(prev => [nudge, ...prev]);
          
          // Set as current nudge if none is active
          if (!currentNudge) {
            setCurrentNudge(nudge);
          }
        }
      }
    } catch (error) {
      console.error('Error generating nudge:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [user, isGenerating, getTodayEntry, getRecentEntries, deliveryChannel, currentNudge]);
  
  /**
   * Handles user interaction with a nudge
   * @param {string} nudgeId - ID of the nudge
   * @param {string} interaction - Type of interaction
   * @param {Object} details - Additional details
   */
  const handleNudgeInteraction = useCallback((nudgeId, interaction, details = {}) => {
    // Track the interaction
    trackNudgeInteraction(nudgeId, interaction, details);
    
    // Update local state
    setActiveNudges(prev => {
      const updated = prev.map(nudge => {
        if (nudge.nudgeId === nudgeId) {
          return {
            ...nudge,
            [interaction]: true,
            [`${interaction}At`]: new Date().toISOString(),
            ...(details || {})
          };
        }
        return nudge;
      });
      
      // Filter out dismissed nudges
      if (interaction === 'dismissed') {
        return updated.filter(nudge => nudge.nudgeId !== nudgeId);
      }
      
      return updated;
    });
    
    // Update current nudge if it's the one being interacted with
    if (currentNudge && currentNudge.nudgeId === nudgeId) {
      if (interaction === 'dismissed') {
        // Set next active nudge as current
        const nextNudge = activeNudges.find(n => n.nudgeId !== nudgeId);
        setCurrentNudge(nextNudge || null);
      } else {
        setCurrentNudge(prev => ({
          ...prev,
          [interaction]: true,
          [`${interaction}At`]: new Date().toISOString(),
          ...(details || {})
        }));
      }
    }
  }, [activeNudges, currentNudge]);
  
  /**
   * Marks a nudge as viewed
   * @param {string} nudgeId - ID of the nudge
   */
  const markNudgeAsViewed = useCallback((nudgeId) => {
    handleNudgeInteraction(nudgeId, 'viewed');
  }, [handleNudgeInteraction]);
  
  /**
   * Marks a nudge as actioned
   * @param {string} nudgeId - ID of the nudge
   * @param {Object} details - Action details
   */
  const markNudgeAsActioned = useCallback((nudgeId, details = {}) => {
    handleNudgeInteraction(nudgeId, 'actioned', details);
  }, [handleNudgeInteraction]);
  
  /**
   * Dismisses a nudge
   * @param {string} nudgeId - ID of the nudge
   * @param {Object} details - Dismissal details
   */
  const dismissNudge = useCallback((nudgeId, details = {}) => {
    handleNudgeInteraction(nudgeId, 'dismissed', details);
  }, [handleNudgeInteraction]);
  
  /**
   * Provides feedback on a nudge
   * @param {string} nudgeId - ID of the nudge
   * @param {string} feedback - Feedback text
   * @param {number} helpfulRating - Helpfulness rating (1-5)
   */
  const provideFeedback = useCallback((nudgeId, feedback, helpfulRating) => {
    handleNudgeInteraction(nudgeId, 'feedback', { feedback, helpfulRating });
  }, [handleNudgeInteraction]);
  
  // Auto-generate nudges at intervals if enabled
  useEffect(() => {
    if (!autoGenerate || !user) {
      return;
    }
    
    // Initial check for active nudges
    const checkActiveNudges = () => {
      if (user) {
        const active = getActiveNudges(user.userId);
        setActiveNudges(active);
        
        if (active.length > 0 && !currentNudge) {
          setCurrentNudge(active[0]);
        }
      }
    };
    
    checkActiveNudges();
    
    // Set up interval for nudge generation
    const intervalId = setInterval(() => {
      // Only generate if no active nudges or if it's been a while
      if (activeNudges.length === 0) {
        generateNewNudge();
      }
    }, checkInterval);
    
    return () => clearInterval(intervalId);
  }, [autoGenerate, user, checkInterval, activeNudges.length, currentNudge, generateNewNudge]);
  
  return {
    activeNudges,
    currentNudge,
    isGenerating,
    generateNewNudge,
    markNudgeAsViewed,
    markNudgeAsActioned,
    dismissNudge,
    provideFeedback
  };
}

export default useContextualNudges;

