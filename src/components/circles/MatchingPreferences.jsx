import React, { useState } from 'react'
import { Users, Tag, Filter, Save } from 'lucide-react'
import { useCircleStore } from '../../stores/circleStore'
import { Button } from '../Button'
import { Input } from '../Input'

export function MatchingPreferences({ onClose }) {
  const { matchingPreferences, updateMatchingPreferences, getRecommendedCircles } = useCircleStore()
  
  const [preferences, setPreferences] = useState({
    ...matchingPreferences
  })
  const [newInterest, setNewInterest] = useState('')
  
  // Handle preference change
  const handlePreferenceChange = (key, value) => {
    setPreferences({
      ...preferences,
      [key]: value
    })
  }
  
  // Handle adding a new interest
  const handleAddInterest = () => {
    if (!newInterest || preferences.interests.includes(newInterest)) return
    
    setPreferences({
      ...preferences,
      interests: [...preferences.interests, newInterest]
    })
    setNewInterest('')
  }
  
  // Handle removing an interest
  const handleRemoveInterest = (interest) => {
    setPreferences({
      ...preferences,
      interests: preferences.interests.filter(i => i !== interest)
    })
  }
  
  // Handle save preferences
  const handleSavePreferences = () => {
    updateMatchingPreferences(preferences)
    onClose()
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-medium text-text-primary dark:text-dark-text-primary mb-2">
          Interests & Topics
        </h3>
        <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-3">
          Select topics you're interested in to find circles that match your goals.
        </p>
        
        <div className="flex items-center space-x-2 mb-2">
          <Input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="Add an interest (e.g., mindfulness, anxiety)"
            className="flex-grow"
          />
          <Button
            variant="secondary"
            onClick={handleAddInterest}
            disabled={!newInterest}
          >
            Add
          </Button>
        </div>
        
        {preferences.interests.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {preferences.interests.map(interest => (
              <span 
                key={interest}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary dark:bg-primary/20 dark:text-primary/90"
              >
                {interest}
                <button
                  type="button"
                  className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-primary hover:bg-primary/20 focus:outline-none"
                  onClick={() => handleRemoveInterest(interest)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-tertiary dark:text-dark-text-tertiary italic">
            Add at least one interest to improve matching
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2">
            Goal Alignment
          </label>
          <select
            value={preferences.goalAlignment}
            onChange={(e) => handlePreferenceChange('goalAlignment', e.target.value)}
            className="w-full px-3 py-2 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary dark:text-dark-text-primary"
          >
            <option value="similar">Similar Goals (recommended)</option>
            <option value="diverse">Diverse Goals</option>
            <option value="any">No Preference</option>
          </select>
          <p className="mt-1 text-xs text-text-tertiary dark:text-dark-text-tertiary">
            {preferences.goalAlignment === 'similar' 
              ? 'Find circles with members working on similar goals to yours'
              : preferences.goalAlignment === 'diverse'
                ? 'Find circles with a variety of different goals and approaches'
                : 'No specific preference for goal alignment'
            }
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2">
            Activity Level
          </label>
          <select
            value={preferences.activityLevel}
            onChange={(e) => handlePreferenceChange('activityLevel', e.target.value)}
            className="w-full px-3 py-2 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary dark:text-dark-text-primary"
          >
            <option value="light">Light (occasional check-ins)</option>
            <option value="moderate">Moderate (regular engagement)</option>
            <option value="active">Active (daily participation)</option>
          </select>
          <p className="mt-1 text-xs text-text-tertiary dark:text-dark-text-tertiary">
            {preferences.activityLevel === 'light' 
              ? 'Circles with less frequent activity, good for busy schedules'
              : preferences.activityLevel === 'moderate'
                ? 'Balanced activity level with regular but not overwhelming engagement'
                : 'Highly active circles with frequent messages and check-ins'
            }
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2">
            Privacy Level
          </label>
          <select
            value={preferences.privacyLevel}
            onChange={(e) => handlePreferenceChange('privacyLevel', e.target.value)}
            className="w-full px-3 py-2 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary dark:text-dark-text-primary"
          >
            <option value="open">Open (public circles)</option>
            <option value="balanced">Balanced (mix of public/private)</option>
            <option value="private">Private (invitation-only circles)</option>
          </select>
          <p className="mt-1 text-xs text-text-tertiary dark:text-dark-text-tertiary">
            {preferences.privacyLevel === 'open' 
              ? 'Prefer public circles that anyone can join'
              : preferences.privacyLevel === 'balanced'
                ? 'No strong preference between public and private circles'
                : 'Prefer private circles with controlled membership'
            }
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2">
            Circle Size
          </label>
          <select
            value={preferences.circleSize}
            onChange={(e) => handlePreferenceChange('circleSize', e.target.value)}
            className="w-full px-3 py-2 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary dark:text-dark-text-primary"
          >
            <option value="small">Small (2-5 members)</option>
            <option value="medium">Medium (6-10 members)</option>
            <option value="large">Large (11+ members)</option>
          </select>
          <p className="mt-1 text-xs text-text-tertiary dark:text-dark-text-tertiary">
            {preferences.circleSize === 'small' 
              ? 'Intimate circles with closer connections and more personal support'
              : preferences.circleSize === 'medium'
                ? 'Balanced size with good engagement but not overwhelming'
                : 'Larger circles with more diverse perspectives and experiences'
            }
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
          onClick={handleSavePreferences}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Preferences
        </Button>
      </div>
    </div>
  )
}

