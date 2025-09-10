/**
 * Simplified Hook for stress detection
 * Returns mock stress data for demo purposes
 */

import { useState, useEffect } from 'react';
import { useDataStore } from '../stores/dataStore';

/**
 * Hook for detecting and classifying stress from user data
 * @param {Object} options - Configuration options
 * @returns {Object} - Stress detection state and functions
 */
export function useStressDetection(options = {}) {
  const { getTodayEntry } = useDataStore();
  
  const [stressLevel, setStressLevel] = useState('moderate');
  
  useEffect(() => {
    // Simple stress level based on today's entry
    const todayEntry = getTodayEntry();
    if (todayEntry) {
      if (todayEntry.emotionalState === 'negative') {
        setStressLevel('high');
      } else if (todayEntry.emotionalState === 'positive') {
        setStressLevel('low');
      } else {
        setStressLevel('moderate');
      }
    }
  }, [getTodayEntry]);
  
  return {
    stressLevel,
    stressDetected: stressLevel === 'high',
    isAnalyzing: false,
    analyzeCurrentEntry: () => {},
    getStressTypeDescription: () => 'General stress assessment',
    getStressSeverityDescription: () => stressLevel
  };
}

export default useStressDetection;

