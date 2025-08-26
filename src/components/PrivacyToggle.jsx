import React, { useState, useEffect } from 'react'
import { useCirclesStore } from '../stores/circlesStore'
import { Eye, EyeOff, Activity, FileText } from 'lucide-react'

export function PrivacyToggle({ circleId }) {
  const { getUserMembership, updatePrivacySettings } = useCirclesStore()
  
  const membership = getUserMembership(circleId)
  const [settings, setSettings] = useState({
    shareEmotionalState: true,
    shareActivityCompletion: true,
    shareNotes: false
  })
  
  useEffect(() => {
    if (membership) {
      setSettings(membership.privacySettings)
    }
  }, [membership])
  
  const handleToggle = (setting) => {
    const newSettings = {
      ...settings,
      [setting]: !settings[setting]
    }
    
    setSettings(newSettings)
    updatePrivacySettings(circleId, newSettings)
  }
  
  if (!membership) return null
  
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-text-primary">What you share with this circle:</h4>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-md ${settings.shareEmotionalState ? 'bg-primary/10' : 'bg-gray-100'}`}>
              {settings.shareEmotionalState ? (
                <Eye className={`w-5 h-5 ${settings.shareEmotionalState ? 'text-primary' : 'text-text-secondary'}`} />
              ) : (
                <EyeOff className={`w-5 h-5 ${settings.shareEmotionalState ? 'text-primary' : 'text-text-secondary'}`} />
              )}
            </div>
            <div>
              <div className="font-medium text-text-primary">Emotional State</div>
              <div className="text-xs text-text-secondary">
                Share your daily emotional check-ins
              </div>
            </div>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={settings.shareEmotionalState}
              onChange={() => handleToggle('shareEmotionalState')}
            />
            <div className={`w-10 h-6 rounded-full transition ${
              settings.shareEmotionalState ? 'bg-primary' : 'bg-gray-300'
            }`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
              settings.shareEmotionalState ? 'translate-x-4' : 'translate-x-0'
            }`}></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-md ${settings.shareActivityCompletion ? 'bg-primary/10' : 'bg-gray-100'}`}>
              <Activity className={`w-5 h-5 ${settings.shareActivityCompletion ? 'text-primary' : 'text-text-secondary'}`} />
            </div>
            <div>
              <div className="font-medium text-text-primary">Activity Completion</div>
              <div className="text-xs text-text-secondary">
                Share when you complete resilience activities
              </div>
            </div>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={settings.shareActivityCompletion}
              onChange={() => handleToggle('shareActivityCompletion')}
            />
            <div className={`w-10 h-6 rounded-full transition ${
              settings.shareActivityCompletion ? 'bg-primary' : 'bg-gray-300'
            }`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
              settings.shareActivityCompletion ? 'translate-x-4' : 'translate-x-0'
            }`}></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-md ${settings.shareNotes ? 'bg-primary/10' : 'bg-gray-100'}`}>
              <FileText className={`w-5 h-5 ${settings.shareNotes ? 'text-primary' : 'text-text-secondary'}`} />
            </div>
            <div>
              <div className="font-medium text-text-primary">Personal Notes</div>
              <div className="text-xs text-text-secondary">
                Share notes from your daily check-ins
              </div>
            </div>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={settings.shareNotes}
              onChange={() => handleToggle('shareNotes')}
            />
            <div className={`w-10 h-6 rounded-full transition ${
              settings.shareNotes ? 'bg-primary' : 'bg-gray-300'
            }`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
              settings.shareNotes ? 'translate-x-4' : 'translate-x-0'
            }`}></div>
          </label>
        </div>
      </div>
      
      <div className="text-xs text-text-secondary bg-gray-50 dark:bg-dark-border/20 p-3 rounded-md">
        <p>Privacy settings only apply to this circle. You can have different settings for each circle you join.</p>
      </div>
    </div>
  )
}

