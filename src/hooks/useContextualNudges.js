/**
 * Simplified Hook for contextual nudges
 * Returns mock nudge data for demo purposes
 */

import { useState, useCallback } from 'react';

/**
 * Hook for managing contextual nudges
 * @param {Object} options - Configuration options
 * @returns {Object} - Nudge state and functions
 */
export function useContextualNudges(options = {}) {
  const [currentNudge, setCurrentNudge] = useState(null);
  
  /**
   * Marks a nudge as viewed
   * @param {string} nudgeId - ID of the nudge
   */
  const markNudgeAsViewed = useCallback((nudgeId) => {
    console.log('Nudge viewed:', nudgeId);
  }, []);
  
  /**
   * Marks a nudge as actioned
   * @param {string} nudgeId - ID of the nudge
   * @param {Object} details - Action details
   */
  const markNudgeAsActioned = useCallback((nudgeId, details = {}) => {
    console.log('Nudge actioned:', nudgeId, details);
  }, []);
  
  /**
   * Dismisses a nudge
   * @param {string} nudgeId - ID of the nudge
   * @param {Object} details - Dismissal details
   */
  const dismissNudge = useCallback((nudgeId, details = {}) => {
    console.log('Nudge dismissed:', nudgeId, details);
    setCurrentNudge(null);
  }, []);
  
  return {
    activeNudges: [],
    currentNudge,
    isGenerating: false,
    generateNewNudge: () => {},
    markNudgeAsViewed,
    markNudgeAsActioned,
    dismissNudge,
    provideFeedback: () => {}
  };
}

export default useContextualNudges;

