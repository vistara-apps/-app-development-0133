/**
 * Enhanced Pulse Check Component
 * 
 * A multi-dimensional daily check-in component that captures
 * richer emotional data for AI analysis.
 */

import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';
import { useDataStore } from '../stores/dataStore';
import { useSettingsStore } from '../stores/settingsStore';
import { format } from 'date-fns';
import { 
  EmotionCategories, 
  EmotionGroups, 
  IntensityLevels, 
  ContextTags 
} from '../models/EmotionalDataTypes';
import { 
  Smile, 
  Meh, 
  Frown,
  Battery, 
  Activity,
  Tag,
  CheckCircle, 
  Circle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export function PulseCheck({ onComplete }) {
  const { getTodayEntry, addDailyEntry } = useDataStore();
  const { features } = useSettingsStore();
  
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    primaryEmotion: '',
    primaryIntensity: 3,
    secondaryEmotions: [],
    energyLevel: 3,
    stressLevel: 1,
    contextTags: [],
    notes: ''
  });
  
  const todayEntry = getTodayEntry();
  const isEnhancedMode = features.enhancedPulseCheck;
  
  // Reset form when modal is opened
  useEffect(() => {
    if (showCheckIn) {
      setCurrentStep(1);
      setFormData({
        primaryEmotion: '',
        primaryIntensity: 3,
        secondaryEmotions: [],
        energyLevel: 3,
        stressLevel: 1,
        contextTags: [],
        notes: ''
      });
    }
  }, [showCheckIn]);
  
  // Handle check-in submission
  const handleCheckIn = () => {
    if (!formData.primaryEmotion) return;
    
    // Create entry data based on mode
    const entryData = isEnhancedMode ? {
      userId: 'demo-user-1',
      date: format(new Date(), 'yyyy-MM-dd'),
      timestamp: new Date().toISOString(),
      primaryEmotion: formData.primaryEmotion,
      primaryIntensity: formData.primaryIntensity,
      secondaryEmotions: formData.secondaryEmotions,
      energyLevel: formData.energyLevel,
      stressLevel: formData.stressLevel,
      contextTags: formData.contextTags,
      notes: formData.notes
    } : {
      userId: 'demo-user-1',
      date: format(new Date(), 'yyyy-MM-dd'),
      emotionalState: mapToBasicEmotionalState(formData.primaryEmotion),
      notes: formData.notes
    };
    
    // Add the entry
    addDailyEntry(entryData);
    
    // Close modal and notify parent
    setShowCheckIn(false);
    if (onComplete) {
      onComplete(entryData);
    }
  };
  
  // Map enhanced emotion to basic emotional state
  const mapToBasicEmotionalState = (emotion) => {
    if (EmotionGroups.POSITIVE.includes(emotion)) return 'positive';
    if (EmotionGroups.NEUTRAL.includes(emotion)) return 'neutral';
    if (EmotionGroups.CHALLENGING.includes(emotion)) return 'negative';
    return 'neutral';
  };
  
  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Handle secondary emotion toggle
  const toggleSecondaryEmotion = (emotion) => {
    setFormData(prev => {
      const exists = prev.secondaryEmotions.some(e => e.emotion === emotion);
      
      if (exists) {
        return {
          ...prev,
          secondaryEmotions: prev.secondaryEmotions.filter(e => e.emotion !== emotion)
        };
      } else {
        return {
          ...prev,
          secondaryEmotions: [
            ...prev.secondaryEmotions,
            { emotion, intensity: 3 }
          ]
        };
      }
    });
  };
  
  // Handle context tag toggle
  const toggleContextTag = (tag) => {
    setFormData(prev => {
      const exists = prev.contextTags.includes(tag);
      
      if (exists) {
        return {
          ...prev,
          contextTags: prev.contextTags.filter(t => t !== tag)
        };
      } else {
        return {
          ...prev,
          contextTags: [...prev.contextTags, tag]
        };
      }
    });
  };
  
  // Navigate to next step
  const nextStep = () => {
    if (currentStep < getTotalSteps()) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleCheckIn();
    }
  };
  
  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      setShowCheckIn(false);
    }
  };
  
  // Get total number of steps based on mode
  const getTotalSteps = () => {
    return isEnhancedMode ? 4 : 2;
  };
  
  // Check if current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!formData.primaryEmotion;
      case 2:
        return isEnhancedMode ? true : true; // Notes are optional
      case 3:
        return true; // Secondary emotions are optional
      case 4:
        return true; // Context tags are optional
      default:
        return false;
    }
  };
  
  // Render emotion selection step
  const renderEmotionStep = () => {
    // Group emotions by category
    const emotionsByGroup = {
      positive: EmotionGroups.POSITIVE,
      neutral: EmotionGroups.NEUTRAL,
      challenging: EmotionGroups.CHALLENGING
    };
    
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            How are you feeling today?
          </label>
          
          {Object.entries(emotionsByGroup).map(([groupName, emotions]) => (
            <div key={groupName} className="mb-4">
              <h4 className="text-sm text-text-secondary capitalize mb-2">{groupName}</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {emotions.map(emotion => (
                  <button
                    key={emotion}
                    onClick={() => handleChange('primaryEmotion', emotion)}
                    className={`
                      p-2 rounded-lg border-2 transition-all text-center
                      ${formData.primaryEmotion === emotion
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="text-sm font-medium capitalize">{emotion}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {formData.primaryEmotion && isEnhancedMode && (
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              How intense is this feeling? ({formData.primaryIntensity}/5)
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.primaryIntensity}
              onChange={(e) => handleChange('primaryIntensity', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>Mild</span>
              <span>Moderate</span>
              <span>Strong</span>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render energy and stress levels step
  const renderLevelsStep = () => {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Energy Level ({formData.energyLevel}/5)
          </label>
          <div className="flex items-center space-x-3">
            <Battery className="w-5 h-5 text-text-secondary" />
            <input
              type="range"
              min="1"
              max="5"
              value={formData.energyLevel}
              onChange={(e) => handleChange('energyLevel', parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <Battery className="w-5 h-5 text-primary" />
          </div>
          <div className="flex justify-between text-xs text-text-secondary mt-1">
            <span>Depleted</span>
            <span>Moderate</span>
            <span>Energized</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Stress Level ({formData.stressLevel}/5)
          </label>
          <div className="flex items-center space-x-3">
            <Activity className="w-5 h-5 text-text-secondary" />
            <input
              type="range"
              min="1"
              max="5"
              value={formData.stressLevel}
              onChange={(e) => handleChange('stressLevel', parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <Activity className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex justify-between text-xs text-text-secondary mt-1">
            <span>Calm</span>
            <span>Moderate</span>
            <span>Stressed</span>
          </div>
        </div>
        
        <Input
          label="Any notes about your day? (optional)"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
        />
      </div>
    );
  };
  
  // Render secondary emotions step
  const renderSecondaryEmotionsStep = () => {
    // Filter out the primary emotion
    const availableEmotions = Object.values(EmotionCategories)
      .filter(emotion => emotion !== formData.primaryEmotion);
    
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            Any other emotions you're experiencing? (optional)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {availableEmotions.map(emotion => (
              <button
                key={emotion}
                onClick={() => toggleSecondaryEmotion(emotion)}
                className={`
                  p-2 rounded-lg border-2 transition-all text-center
                  ${formData.secondaryEmotions.some(e => e.emotion === emotion)
                    ? 'border-accent bg-accent/10'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="text-sm font-medium capitalize">{emotion}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Render context tags step
  const renderContextTagsStep = () => {
    const availableTags = Object.values(ContextTags);
    
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            What areas of life are affecting you today? (optional)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleContextTag(tag)}
                className={`
                  p-2 rounded-lg border-2 transition-all text-center
                  ${formData.contextTags.includes(tag)
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="text-sm font-medium capitalize">{tag}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderEmotionStep();
      case 2:
        return isEnhancedMode ? renderLevelsStep() : (
          <Input
            label="Any notes about your day? (optional)"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
          />
        );
      case 3:
        return renderSecondaryEmotionsStep();
      case 4:
        return renderContextTagsStep();
      default:
        return null;
    }
  };
  
  // Render step indicator
  const renderStepIndicator = () => {
    const totalSteps = getTotalSteps();
    
    return (
      <div className="flex justify-center space-x-2 mb-4">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              currentStep === index + 1 ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };
  
  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-text-primary">Daily Check-in</h2>
          <div className="text-sm text-text-secondary">
            {format(new Date(), 'EEEE, MMMM d')}
          </div>
        </div>

        {todayEntry ? (
          <div className="flex items-center space-x-4 p-4 bg-accent/10 rounded-lg">
            <CheckCircle className="w-6 h-6 text-accent" />
            <div>
              <div className="font-medium text-text-primary">Check-in completed!</div>
              <div className="text-sm text-text-secondary">
                {isEnhancedMode && todayEntry.primaryEmotion ? (
                  <>
                    Feeling <span className="capitalize">{todayEntry.primaryEmotion}</span> today
                    {todayEntry.stressLevel > 3 && " with elevated stress"}
                    {todayEntry.notes && ` - ${todayEntry.notes}`}
                  </>
                ) : (
                  <>
                    Feeling {todayEntry.emotionalState} today
                    {todayEntry.notes && ` - ${todayEntry.notes}`}
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <Circle className="w-6 h-6 text-text-secondary" />
              <div>
                <div className="font-medium text-text-primary">Ready for your daily check-in?</div>
                <div className="text-sm text-text-secondary">
                  Take a moment to reflect on your emotional state
                </div>
              </div>
            </div>
            <Button onClick={() => setShowCheckIn(true)}>
              Start Check-in
            </Button>
          </div>
        )}
      </Card>

      {/* Check-in Modal */}
      <Modal
        isOpen={showCheckIn}
        onClose={() => setShowCheckIn(false)}
        title={`Daily Emotional Check-in ${isEnhancedMode ? `(Step ${currentStep}/${getTotalSteps()})` : ''}`}
        className="max-w-lg"
      >
        {isEnhancedMode && renderStepIndicator()}
        
        <div className="space-y-6">
          {renderStepContent()}
          
          <div className="flex space-x-3">
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={prevStep}
            >
              {currentStep === 1 ? 'Cancel' : (
                <div className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </div>
              )}
            </Button>
            <Button 
              className="flex-1"
              onClick={nextStep}
              disabled={!isCurrentStepValid()}
            >
              {currentStep === getTotalSteps() ? 'Complete Check-in' : (
                <div className="flex items-center">
                  Next
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default PulseCheck;

