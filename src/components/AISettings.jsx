/**
 * AI Settings Component
 * 
 * Allows users to configure AI Copilot behavior and preferences.
 */

import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { useSettingsStore } from '../stores/settingsStore';
import { 
  Brain, 
  Sliders, 
  Bell, 
  MessageSquare,
  Activity,
  TrendingUp,
  Calendar,
  Clock,
  Save,
  RotateCcw
} from 'lucide-react';
import { NudgeTypes } from '../models/EmotionalDataTypes';

export function AISettings() {
  const { 
    features, 
    preferences, 
    updateFeatures, 
    updatePreferences,
    resetCategory
  } = useSettingsStore();
  
  const [localFeatures, setLocalFeatures] = useState({ ...features });
  const [localPreferences, setLocalPreferences] = useState({ ...preferences });
  const [isSaving, setIsSaving] = useState(false);
  
  // Toggle a feature
  const toggleFeature = (feature) => {
    setLocalFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };
  
  // Update a preference
  const updatePreference = (preference, value) => {
    setLocalPreferences(prev => ({
      ...prev,
      [preference]: value
    }));
  };
  
  // Toggle a nudge type
  const toggleNudgeType = (type) => {
    setLocalPreferences(prev => {
      const currentTypes = prev.nudgeTypes || [];
      const exists = currentTypes.includes(type);
      
      if (exists) {
        return {
          ...prev,
          nudgeTypes: currentTypes.filter(t => t !== type)
        };
      } else {
        return {
          ...prev,
          nudgeTypes: [...currentTypes, type]
        };
      }
    });
  };
  
  // Save settings
  const saveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      updateFeatures(localFeatures);
      updatePreferences(localPreferences);
      setIsSaving(false);
    }, 500);
  };
  
  // Reset settings
  const resetSettings = () => {
    resetCategory('features');
    resetCategory('preferences');
    setLocalFeatures({ ...features });
    setLocalPreferences({ ...preferences });
  };
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI Copilot Settings
          </h2>
          <p className="text-text-secondary">
            Customize how the AI Copilot works for you
          </p>
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Features Section */}
        <div>
          <h3 className="text-md font-medium text-text-primary mb-4 flex items-center">
            <Sliders className="w-4 h-4 mr-2" />
            Features
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-text-primary">Enhanced Pulse Check</div>
                <div className="text-sm text-text-secondary">
                  Multi-dimensional emotional assessment
                </div>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-pulse-check"
                  checked={localFeatures.enhancedPulseCheck}
                  onChange={() => toggleFeature('enhancedPulseCheck')}
                  className="sr-only"
                />
                <label
                  htmlFor="toggle-pulse-check"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    localFeatures.enhancedPulseCheck ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                      localFeatures.enhancedPulseCheck ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-text-primary">Stress Classification</div>
                <div className="text-sm text-text-secondary">
                  Real-time stress detection and analysis
                </div>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-stress"
                  checked={localFeatures.stressClassification}
                  onChange={() => toggleFeature('stressClassification')}
                  className="sr-only"
                />
                <label
                  htmlFor="toggle-stress"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    localFeatures.stressClassification ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                      localFeatures.stressClassification ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-text-primary">Contextual Nudges</div>
                <div className="text-sm text-text-secondary">
                  Timely suggestions based on your state
                </div>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-nudges"
                  checked={localFeatures.contextualNudges}
                  onChange={() => toggleFeature('contextualNudges')}
                  className="sr-only"
                />
                <label
                  htmlFor="toggle-nudges"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    localFeatures.contextualNudges ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                      localFeatures.contextualNudges ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-text-primary">Weekly Reports</div>
                <div className="text-sm text-text-secondary">
                  Comprehensive weekly analysis and insights
                </div>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-reports"
                  checked={localFeatures.weeklyReports}
                  onChange={() => toggleFeature('weeklyReports')}
                  className="sr-only"
                />
                <label
                  htmlFor="toggle-reports"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    localFeatures.weeklyReports ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                      localFeatures.weeklyReports ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Nudge Preferences */}
        {localFeatures.contextualNudges && (
          <div>
            <h3 className="text-md font-medium text-text-primary mb-4 flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Nudge Preferences
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  Nudge Frequency
                </label>
                <select
                  value={localPreferences.nudgeFrequency}
                  onChange={(e) => updatePreference('nudgeFrequency', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="low">Low (1-2 per day)</option>
                  <option value="medium">Medium (3-5 per day)</option>
                  <option value="high">High (5-8 per day)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  Nudge Types
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(NudgeTypes).map(type => (
                    <div 
                      key={type}
                      className="flex items-center"
                    >
                      <input
                        type="checkbox"
                        id={`nudge-type-${type}`}
                        checked={localPreferences.nudgeTypes?.includes(type) || false}
                        onChange={() => toggleNudgeType(type)}
                        className="mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label 
                        htmlFor={`nudge-type-${type}`}
                        className="text-text-primary capitalize"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* AI Personality */}
        <div>
          <h3 className="text-md font-medium text-text-primary mb-4 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            AI Personality
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">
                AI Personality Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['supportive', 'motivational', 'analytical'].map(style => (
                  <button
                    key={style}
                    onClick={() => updatePreference('aiPersonality', style)}
                    className={`p-2 rounded-lg border-2 transition-all text-center capitalize ${
                      localPreferences.aiPersonality === style
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-text-secondary mb-2">
                Communication Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['formal', 'casual', 'direct'].map(style => (
                  <button
                    key={style}
                    onClick={() => updatePreference('communicationStyle', style)}
                    className={`p-2 rounded-lg border-2 transition-all text-center capitalize ${
                      localPreferences.communicationStyle === style
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Timing Preferences */}
        <div>
          <h3 className="text-md font-medium text-text-primary mb-4 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Timing Preferences
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-2">
                Daily Reminder Time
              </label>
              <Input
                type="time"
                value={localPreferences.reminderTime}
                onChange={(e) => updatePreference('reminderTime', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm text-text-secondary mb-2">
                Weekly Report Day
              </label>
              <select
                value={localPreferences.weeklyReportDay}
                onChange={(e) => updatePreference('weeklyReportDay', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value={0}>Sunday</option>
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
                <option value={6}>Saturday</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t border-gray-100">
          <Button 
            variant="secondary" 
            className="flex-1"
            onClick={resetSettings}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset to Defaults
          </Button>
          <Button 
            className="flex-1"
            onClick={saveSettings}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-1" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default AISettings;

