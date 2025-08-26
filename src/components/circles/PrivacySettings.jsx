import React, { useState } from 'react'
import { Shield, Eye, EyeOff, Save, Info } from 'lucide-react'
import { usePrivacyStore } from '../../stores/privacyStore'
import { Button } from '../Button'

export function PrivacySettings({ circleId, onClose }) {
  const { 
    getCircleSettings, 
    updateCircleOverrides, 
    updateContentSettings 
  } = usePrivacyStore()
  
  // Get current settings
  const currentSettings = getCircleSettings(circleId)
  const { contentSettings } = usePrivacyStore()
  
  // Local state for settings
  const [settings, setSettings] = useState({
    shareEmotionalData: currentSettings.shareEmotionalData,
    shareActivities: currentSettings.shareActivities,
    shareInsights: currentSettings.shareInsights,
    visibility: currentSettings.visibility || 'members-only',
    anonymousMode: currentSettings.anonymousMode || false
  })
  
  const [content, setContent] = useState({
    goals: contentSettings.goals,
    dailyEntries: contentSettings.dailyEntries,
    insights: contentSettings.insights,
    activities: contentSettings.activities
  })
  
  // Handle setting change
  const handleSettingChange = (key, value) => {
    setSettings({
      ...settings,
      [key]: value
    })
  }
  
  // Handle content setting change
  const handleContentChange = (key, value) => {
    setContent({
      ...content,
      [key]: value
    })
  }
  
  // Handle save settings
  const handleSaveSettings = () => {
    // Update circle-specific overrides
    updateCircleOverrides(circleId, settings)
    
    // Update content settings
    updateContentSettings(content)
    
    onClose()
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-medium text-text-primary dark:text-dark-text-primary flex items-center mb-2">
          <Shield className="h-4 w-4 mr-2" />
          Privacy Settings
        </h3>
        <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">
          Control what information is shared with other members of this circle.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="shareEmotionalData"
                type="checkbox"
                checked={settings.shareEmotionalData}
                onChange={(e) => handleSettingChange('shareEmotionalData', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary/50 border-border dark:border-dark-border rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="shareEmotionalData" className="font-medium text-text-primary dark:text-dark-text-primary">
                Share emotional data
              </label>
              <p className="text-text-secondary dark:text-dark-text-secondary">
                Allow circle members to see your daily emotional check-ins and trends
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="shareActivities"
                type="checkbox"
                checked={settings.shareActivities}
                onChange={(e) => handleSettingChange('shareActivities', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary/50 border-border dark:border-dark-border rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="shareActivities" className="font-medium text-text-primary dark:text-dark-text-primary">
                Share activities and goals
              </label>
              <p className="text-text-secondary dark:text-dark-text-secondary">
                Allow circle members to see your activities, goals, and progress
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="shareInsights"
                type="checkbox"
                checked={settings.shareInsights}
                onChange={(e) => handleSettingChange('shareInsights', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary/50 border-border dark:border-dark-border rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="shareInsights" className="font-medium text-text-primary dark:text-dark-text-primary">
                Share AI insights
              </label>
              <p className="text-text-secondary dark:text-dark-text-secondary">
                Allow circle members to see personalized insights generated for you
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="anonymousMode"
                type="checkbox"
                checked={settings.anonymousMode}
                onChange={(e) => handleSettingChange('anonymousMode', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary/50 border-border dark:border-dark-border rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="anonymousMode" className="font-medium text-text-primary dark:text-dark-text-primary">
                Anonymous mode
              </label>
              <p className="text-text-secondary dark:text-dark-text-secondary">
                Hide your real name and use a pseudonym in this circle
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-base font-medium text-text-primary dark:text-dark-text-primary flex items-center mb-2">
          <Eye className="h-4 w-4 mr-2" />
          Content Visibility
        </h3>
        <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-4">
          Control who can see different types of your content.
        </p>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1">
              Goals & Check-ins
            </label>
            <select
              value={content.goals}
              onChange={(e) => handleContentChange('goals', e.target.value)}
              className="w-full px-3 py-2 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary dark:text-dark-text-primary"
            >
              <option value="public">Public (all app users)</option>
              <option value="circle-members">Circle Members Only</option>
              <option value="private">Private (only you)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1">
              Daily Emotional Entries
            </label>
            <select
              value={content.dailyEntries}
              onChange={(e) => handleContentChange('dailyEntries', e.target.value)}
              className="w-full px-3 py-2 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary dark:text-dark-text-primary"
            >
              <option value="public">Public (all app users)</option>
              <option value="circle-members">Circle Members Only</option>
              <option value="private">Private (only you)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1">
              AI Insights
            </label>
            <select
              value={content.insights}
              onChange={(e) => handleContentChange('insights', e.target.value)}
              className="w-full px-3 py-2 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary dark:text-dark-text-primary"
            >
              <option value="public">Public (all app users)</option>
              <option value="circle-members">Circle Members Only</option>
              <option value="private">Private (only you)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-1">
              Activities & Exercises
            </label>
            <select
              value={content.activities}
              onChange={(e) => handleContentChange('activities', e.target.value)}
              className="w-full px-3 py-2 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary dark:text-dark-text-primary"
            >
              <option value="public">Public (all app users)</option>
              <option value="circle-members">Circle Members Only</option>
              <option value="private">Private (only you)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-info/10 dark:bg-info/5 rounded-md p-3 flex items-start">
        <Info className="h-5 w-5 text-info dark:text-info/90 mt-0.5 mr-3 flex-shrink-0" />
        <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
          <p className="font-medium text-text-primary dark:text-dark-text-primary mb-1">
            Privacy Note
          </p>
          <p>
            These settings only apply to this circle. You can set different privacy preferences for each circle you join. 
            Global privacy settings can be adjusted in your account settings.
          </p>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSaveSettings}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}

