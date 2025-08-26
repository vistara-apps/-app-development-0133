/**
 * Hook for real-time stress detection and classification
 */

import { useState, useEffect, useCallback } from 'react';
import { useDataStore } from '../stores/dataStore';
import { classifyStressFromEntry } from '../services/StressClassifier';
import { StressTypes } from '../models/EmotionalDataTypes';

/**
 * Hook for detecting and classifying stress from user data
 * @param {Object} options - Configuration options
 * @returns {Object} - Stress detection state and functions
 */
export function useStressDetection(options = {}) {
  const { 
    autoDetect = true,
    detectionThreshold = 3,
    recentEntriesCount = 5
  } = options;
  
  const { dailyEntries, getTodayEntry } = useDataStore();
  
  const [stressAnalysis, setStressAnalysis] = useState({
    analyzed: false,
    stressDetected: false,
    stressLevel: 0,
    stressType: null,
    confidence: 'low',
    triggers: [],
    patterns: [],
    suggestions: []
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  /**
   * Analyzes the current entry for stress indicators
   */
  const analyzeCurrentEntry = useCallback(async () => {
    const todayEntry = getTodayEntry();
    
    if (!todayEntry) {
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Get recent entries for context
      const recentEntries = dailyEntries
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, recentEntriesCount);
      
      // Classify stress
      const analysis = await classifyStressFromEntry(todayEntry, recentEntries);
      
      setStressAnalysis({
        analyzed: true,
        stressDetected: analysis.stressLevel >= detectionThreshold,
        stressLevel: analysis.stressLevel,
        stressType: analysis.stressType,
        confidence: analysis.confidence,
        triggers: analysis.triggers || [],
        patterns: analysis.patterns || [],
        suggestions: analysis.suggestions || [],
        source: analysis.source
      });
    } catch (error) {
      console.error('Error analyzing stress:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [dailyEntries, getTodayEntry, detectionThreshold, recentEntriesCount]);
  
  // Auto-detect stress when today's entry changes
  useEffect(() => {
    if (autoDetect) {
      const todayEntry = getTodayEntry();
      
      if (todayEntry && !stressAnalysis.analyzed) {
        analyzeCurrentEntry();
      }
    }
  }, [autoDetect, getTodayEntry, stressAnalysis.analyzed, analyzeCurrentEntry]);
  
  /**
   * Gets a description of the stress type
   * @returns {string} - Description of the stress type
   */
  const getStressTypeDescription = useCallback(() => {
    if (!stressAnalysis.stressType) {
      return '';
    }
    
    switch (stressAnalysis.stressType) {
      case StressTypes.ACUTE:
        return 'Short-term stress in response to a specific situation';
        
      case StressTypes.CHRONIC:
        return 'Long-term, persistent stress that has been ongoing';
        
      case StressTypes.ANTICIPATORY:
        return 'Stress about future events or situations';
        
      case StressTypes.REACTIVE:
        return 'Stress in reaction to a past event or situation';
        
      case StressTypes.EUSTRESS:
        return 'Positive stress that can motivate and energize';
        
      default:
        return '';
    }
  }, [stressAnalysis.stressType]);
  
  /**
   * Gets the severity level description
   * @returns {string} - Description of the stress severity
   */
  const getStressSeverityDescription = useCallback(() => {
    const level = stressAnalysis.stressLevel;
    
    if (level <= 1) return 'Minimal';
    if (level === 2) return 'Mild';
    if (level === 3) return 'Moderate';
    if (level === 4) return 'High';
    if (level >= 5) return 'Severe';
    
    return 'Unknown';
  }, [stressAnalysis.stressLevel]);
  
  return {
    ...stressAnalysis,
    isAnalyzing,
    analyzeCurrentEntry,
    getStressTypeDescription,
    getStressSeverityDescription
  };
}

export default useStressDetection;

