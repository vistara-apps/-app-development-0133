import React, { useState } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { Input } from './Input'
import { useCirclesStore } from '../stores/circlesStore'
import { Lock, Unlock, Users, Target, MessageCircle } from 'lucide-react'

export function CreateCircleModal({ isOpen, onClose, onCircleCreated }) {
  const { createCircle } = useCirclesStore()
  
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [focusArea, setFocusArea] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [memberLimit, setMemberLimit] = useState(10)
  const [promptOfTheDay, setPromptOfTheDay] = useState('')
  
  const [errors, setErrors] = useState({})
  
  const focusAreas = [
    'Stress Management',
    'Anxiety Relief',
    'Positive Thinking',
    'Work-Life Balance',
    'Personal Growth',
    'Mindfulness Practice',
    'Emotional Regulation',
    'Gratitude Practice',
    'Other'
  ]
  
  const handleSubmit = () => {
    // Validate form
    const newErrors = {}
    
    if (!name.trim()) newErrors.name = 'Name is required'
    if (!description.trim()) newErrors.description = 'Description is required'
    if (!focusArea) newErrors.focusArea = 'Focus area is required'
    if (!promptOfTheDay.trim()) newErrors.promptOfTheDay = 'Prompt is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Create circle
    const newCircle = {
      name,
      description,
      focusArea,
      isPrivate,
      memberLimit: parseInt(memberLimit),
      promptOfTheDay
    }
    
    const createdCircle = createCircle(newCircle)
    
    // Reset form
    setName('')
    setDescription('')
    setFocusArea('')
    setIsPrivate(false)
    setMemberLimit(10)
    setPromptOfTheDay('')
    setErrors({})
    
    // Notify parent
    onCircleCreated(createdCircle.circleId)
  }
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Support Circle"
      className="max-w-2xl"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <Input
              label="Circle Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Give your circle a meaningful name"
              error={errors.name}
            />
          </div>
          
          <div className="md:col-span-3">
            <Input
              label="Description *"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose and goals of your circle"
              rows={3}
              error={errors.description}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Focus Area *
            </label>
            <select
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              className={`w-full px-3 py-2 border ${
                errors.focusArea ? 'border-error' : 'border-border dark:border-dark-border'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface dark:bg-dark-surface`}
            >
              <option value="">Select a focus area</option>
              {focusAreas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            {errors.focusArea && (
              <p className="mt-1 text-sm text-error">{errors.focusArea}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Member Limit
            </label>
            <input
              type="number"
              min="2"
              max="50"
              value={memberLimit}
              onChange={(e) => setMemberLimit(e.target.value)}
              className="w-full px-3 py-2 border border-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface dark:bg-dark-surface"
            />
          </div>
          
          <div className="md:col-span-3">
            <Input
              label="Prompt of the Day *"
              value={promptOfTheDay}
              onChange={(e) => setPromptOfTheDay(e.target.value)}
              placeholder="A question or prompt to spark conversation in your circle"
              rows={2}
              error={errors.promptOfTheDay}
            />
          </div>
          
          <div className="md:col-span-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-10 h-6 rounded-full transition ${
                  isPrivate ? 'bg-primary' : 'bg-gray-300'
                }`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
                  isPrivate ? 'translate-x-4' : 'translate-x-0'
                }`}></div>
              </div>
              <div className="flex items-center">
                {isPrivate ? (
                  <>
                    <Lock className="w-4 h-4 mr-2 text-primary" />
                    <span className="text-sm font-medium">Private Circle</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 mr-2 text-text-secondary" />
                    <span className="text-sm font-medium">Public Circle</span>
                  </>
                )}
              </div>
            </label>
            <p className="mt-1 text-xs text-text-secondary ml-13">
              {isPrivate 
                ? 'Private circles are only visible to members and require an invitation to join.'
                : 'Public circles are visible to everyone and anyone can join.'}
            </p>
          </div>
        </div>
        
        {/* Circle Preview */}
        <div className="border border-border dark:border-dark-border rounded-lg p-4 bg-gray-50 dark:bg-dark-border/20">
          <h4 className="text-sm font-medium text-text-secondary mb-2">Preview</h4>
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium text-text-primary">
                  {name || 'Circle Name'}
                </h3>
                {isPrivate ? (
                  <Lock className="w-4 h-4 text-text-secondary" />
                ) : (
                  <Unlock className="w-4 h-4 text-text-secondary" />
                )}
              </div>
              <p className="text-sm text-text-secondary mb-2">
                {description || 'Circle description will appear here'}
              </p>
              {focusArea && (
                <div className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-sm mb-2">
                  {focusArea}
                </div>
              )}
              <div className="flex items-center space-x-4 text-xs text-text-secondary">
                <div className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  <span>0/{memberLimit} members</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  <span>0 messages</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="secondary" 
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1"
            onClick={handleSubmit}
          >
            Create Circle
          </Button>
        </div>
      </div>
    </Modal>
  )
}

