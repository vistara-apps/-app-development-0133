import React, { useState } from 'react'
import { 
  Settings, 
  Users, 
  Bell, 
  Bot, 
  Save, 
  Trash2,
  UserPlus,
  UserMinus,
  Lock,
  Unlock
} from 'lucide-react'
import { useCircleStore } from '../../stores/circleStore'
import { useAuthStore } from '../../stores/authStore'
import { Button } from '../Button'
import { Input } from '../Input'

export function CircleSettings({ circleId, onClose }) {
  const { user } = useAuthStore()
  const { 
    circles, 
    memberships, 
    getCircleMembers,
    leaveCircle,
    updateCircle
  } = useCircleStore()
  
  // Get circle data
  const circle = circles.find(c => c.circleId === circleId)
  if (!circle) return null
  
  // Check if user is admin
  const userMembership = memberships.find(
    m => m.circleId === circleId && m.userId === user.userId && m.isActive
  )
  const isAdmin = userMembership?.role === 'admin'
  
  // Get circle members
  const circleMembers = getCircleMembers(circleId)
  
  // Local state for settings
  const [settings, setSettings] = useState({
    name: circle.name,
    description: circle.description,
    isPublic: circle.isPublic,
    maxMembers: circle.maxMembers,
    aiEnabled: circle.aiEnabled,
    tags: [...circle.tags]
  })
  
  const [newTag, setNewTag] = useState('')
  const [notificationSettings, setNotificationSettings] = useState({
    newMessages: true,
    dailyPrompts: true,
    memberJoins: false,
    goalUpdates: true
  })
  
  // Handle setting change
  const handleSettingChange = (key, value) => {
    setSettings({
      ...settings,
      [key]: value
    })
  }
  
  // Handle notification setting change
  const handleNotificationChange = (key, value) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: value
    })
  }
  
  // Handle adding a tag
  const handleAddTag = () => {
    if (!newTag || settings.tags.includes(newTag)) return
    
    setSettings({
      ...settings,
      tags: [...settings.tags, newTag]
    })
    setNewTag('')
  }
  
  // Handle removing a tag
  const handleRemoveTag = (tag) => {
    setSettings({
      ...settings,
      tags: settings.tags.filter(t => t !== tag)
    })
  }
  
  // Handle save settings
  const handleSaveSettings = () => {
    // In a real implementation, this would update the circle settings
    // For demo, we'll just close the modal
    onClose()
  }
  
  // Handle leave circle
  const handleLeaveCircle = () => {
    leaveCircle(circleId)
    onClose()
  }
  
  return (
    <div className="space-y-6">
      {/* General Settings */}
      <div>
        <h3 className="text-base font-medium text-text-primary dark:text-dark-text-primary flex items-center mb-2">
          <Settings className="h-4 w-4 mr-2" />
          General Settings
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
              Circle Name
            </label>
            <Input
              type="text"
              value={settings.name}
              onChange={(e) => handleSettingChange('name', e.target.value)}
              disabled={!isAdmin}
              placeholder="Circle name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
              Description
            </label>
            <textarea
              value={settings.description}
              onChange={(e) => handleSettingChange('description', e.target.value)}
              disabled={!isAdmin}
              placeholder="Circle description"
              className="w-full px-3 py-2 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary dark:text-dark-text-primary disabled:opacity-70 disabled:cursor-not-allowed"
              rows={3}
            />
          </div>
          
          {isAdmin && (
            <>
              <div>
                <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
                  Tags
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    className="flex-grow"
                  />
                  <Button
                    variant="secondary"
                    onClick={handleAddTag}
                    disabled={!newTag}
                  >
                    Add
                  </Button>
                </div>
                
                {settings.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {settings.tags.map(tag => (
                      <span 
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary dark:bg-primary/20 dark:text-primary/90"
                      >
                        {tag}
                        <button
                          type="button"
                          className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-primary hover:bg-primary/20 focus:outline-none"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
                    Maximum Members
                  </label>
                  <select
                    value={settings.maxMembers}
                    onChange={(e) => handleSettingChange('maxMembers', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary dark:text-dark-text-primary"
                  >
                    <option value={5}>5 members</option>
                    <option value={8}>8 members</option>
                    <option value={12}>12 members</option>
                    <option value={20}>20 members</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
                    Visibility
                  </label>
                  <div className="flex items-center space-x-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={settings.isPublic}
                        onChange={() => handleSettingChange('isPublic', true)}
                        className="h-4 w-4 text-primary focus:ring-primary/50 border-border dark:border-dark-border"
                      />
                      <span className="ml-2 text-text-primary dark:text-dark-text-primary flex items-center">
                        <Unlock className="h-4 w-4 mr-1" />
                        Public
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!settings.isPublic}
                        onChange={() => handleSettingChange('isPublic', false)}
                        className="h-4 w-4 text-primary focus:ring-primary/50 border-border dark:border-dark-border"
                      />
                      <span className="ml-2 text-text-primary dark:text-dark-text-primary flex items-center">
                        <Lock className="h-4 w-4 mr-1" />
                        Private
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="aiEnabled"
                    type="checkbox"
                    checked={settings.aiEnabled}
                    onChange={(e) => handleSettingChange('aiEnabled', e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary/50 border-border dark:border-dark-border rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="aiEnabled" className="font-medium text-text-primary dark:text-dark-text-primary">
                    Enable AI Facilitator
                  </label>
                  <p className="text-text-secondary dark:text-dark-text-secondary">
                    Allow AI to provide daily prompts and facilitate discussions
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Notification Settings */}
      <div>
        <h3 className="text-base font-medium text-text-primary dark:text-dark-text-primary flex items-center mb-2">
          <Bell className="h-4 w-4 mr-2" />
          Notification Settings
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="newMessages"
                type="checkbox"
                checked={notificationSettings.newMessages}
                onChange={(e) => handleNotificationChange('newMessages', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary/50 border-border dark:border-dark-border rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="newMessages" className="font-medium text-text-primary dark:text-dark-text-primary">
                New messages
              </label>
              <p className="text-text-secondary dark:text-dark-text-secondary">
                Get notified when new messages are posted in this circle
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="dailyPrompts"
                type="checkbox"
                checked={notificationSettings.dailyPrompts}
                onChange={(e) => handleNotificationChange('dailyPrompts', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary/50 border-border dark:border-dark-border rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="dailyPrompts" className="font-medium text-text-primary dark:text-dark-text-primary">
                Daily prompts
              </label>
              <p className="text-text-secondary dark:text-dark-text-secondary">
                Get notified when new daily prompts are available
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="memberJoins"
                type="checkbox"
                checked={notificationSettings.memberJoins}
                onChange={(e) => handleNotificationChange('memberJoins', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary/50 border-border dark:border-dark-border rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="memberJoins" className="font-medium text-text-primary dark:text-dark-text-primary">
                Member activity
              </label>
              <p className="text-text-secondary dark:text-dark-text-secondary">
                Get notified when members join or leave the circle
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="goalUpdates"
                type="checkbox"
                checked={notificationSettings.goalUpdates}
                onChange={(e) => handleNotificationChange('goalUpdates', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary/50 border-border dark:border-dark-border rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="goalUpdates" className="font-medium text-text-primary dark:text-dark-text-primary">
                Goal updates
              </label>
              <p className="text-text-secondary dark:text-dark-text-secondary">
                Get notified about goal progress and milestones in this circle
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Members */}
      {isAdmin && (
        <div>
          <h3 className="text-base font-medium text-text-primary dark:text-dark-text-primary flex items-center mb-2">
            <Users className="h-4 w-4 mr-2" />
            Members ({circleMembers.length}/{circle.maxMembers})
          </h3>
          
          <div className="max-h-40 overflow-y-auto border border-border dark:border-dark-border rounded-md">
            {circleMembers.map((member, index) => (
              <div 
                key={member.userId}
                className={`flex items-center justify-between p-2 ${
                  index !== circleMembers.length - 1 ? 'border-b border-border dark:border-dark-border' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-dark-border flex items-center justify-center mr-3">
                    <Users className="h-4 w-4 text-text-tertiary dark:text-dark-text-tertiary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                      {member.userId === user.userId ? 'You' : `User ${member.userId.substring(0, 4)}`}
                    </p>
                    <p className="text-xs text-text-tertiary dark:text-dark-text-tertiary">
                      {member.role === 'admin' ? 'Admin' : 'Member'}
                    </p>
                  </div>
                </div>
                
                {member.userId !== user.userId && (
                  <Button
                    variant="ghost"
                    size="sm"
                  >
                    <UserMinus className="h-4 w-4 text-error" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex justify-between pt-4">
        <Button
          variant="secondary"
          onClick={handleLeaveCircle}
          className="text-error hover:text-error"
        >
          <UserMinus className="h-4 w-4 mr-2" />
          Leave Circle
        </Button>
        
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          
          <Button
            variant="primary"
            onClick={handleSaveSettings}
            disabled={!isAdmin && !Object.keys(notificationSettings).some(key => 
              notificationSettings[key] !== (key === 'newMessages' || key === 'dailyPrompts' || key === 'goalUpdates')
            )}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}

