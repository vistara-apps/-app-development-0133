/**
 * Lightweight Hook for stress detection and classification
 * Optimized for production use with minimal resource consumption
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
    autoDetect = false, // Default to false to prevent excessive runs
    detectionThreshold = 3,
    recentEntriesCount = 3 // Reduced from 5 to minimize processing
  } = options;
  
  const { dailyEntries, getTodayEntry } = useDataStore();
  
  // Cache to prevent re-analysis of the same data
  const analysisCache = useRef(new Map());
  const lastAnalyzedEntry = useRef(null);
  
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

  // Memoize today's entry to prevent unnecessary re-renders
  const todayEntry = useMemo(() => getTodayEntry(), [getTodayEntry]);
  
  // Create cache key for current analysis
  const cacheKey = useMemo(() => {
    if (!todayEntry) return null;
    return `${todayEntry.entryId}-${todayEntry.date}-${todayEntry.emotionalState}-${todayEntry.notes || ''}`;
  }, [todayEntry]);
  
  /**
   * Analyzes the current entry for stress indicators with caching
   */
  const analyzeCurrentEntry = useCallback(async () => {
    if (!todayEntry || !cacheKey) {
      return;
    }

    // Check cache first
    if (analysisCache.current.has(cacheKey)) {
      const cachedResult = analysisCache.current.get(cacheKey);
      setStressAnalysis(cachedResult);
      return;
    }

    // Prevent duplicate analysis of the same entry
    if (lastAnalyzedEntry.current === cacheKey) {
      return;
    }

    lastAnalyzedEntry.current = cacheKey;
    setIsAnalyzing(true);
    
    try {
      // Get recent entries for context (limited and memoized)
      const recentEntries = dailyEntries
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, recentEntriesCount);
      
      // Classify stress
      const analysis = await classifyStressFromEntry(todayEntry, recentEntries);
      
      const result = {
        analyzed: true,
        stressDetected: analysis.stressLevel >= detectionThreshold,
        stressLevel: analysis.stressLevel,
        stressType: analysis.stressType,
        confidence: analysis.confidence,
        triggers: analysis.triggers || [],
        patterns: analysis.patterns || [],
        suggestions: analysis.suggestions || [],
        source: analysis.source,
        analyzedAt: Date.now()
      };

      // Cache the result with size limit
      if (analysisCache.current.size >= 10) {
        // Remove oldest entries when cache gets too large
        const oldestKey = analysisCache.current.keys().next().value;
        analysisCache.current.delete(oldestKey);
      }
      analysisCache.current.set(cacheKey, result);
      
      setStressAnalysis(result);
    } catch (error) {
      console.error('Error analyzing stress:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [todayEntry, cacheKey, dailyEntries, detectionThreshold, recentEntriesCount]);
  
  // Only analyze when explicitly requested or when entry actually changes
  useEffect(() => {
    if (autoDetect && todayEntry && cacheKey) {
      // Debounce analysis to prevent excessive calls
      const timeoutId = setTimeout(() => {
        if (!analysisCache.current.has(cacheKey) && !stressAnalysis.analyzed) {
          analyzeCurrentEntry();
        }
      }, 1000); // 1 second debounce

      return () => clearTimeout(timeoutId);
    }
  }, [autoDetect, todayEntry, cacheKey, analyzeCurrentEntry, stressAnalysis.analyzed]);
  
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

