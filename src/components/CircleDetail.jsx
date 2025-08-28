import React, { useState } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { useCirclesStore } from '../stores/circlesStore'
import { 
  ArrowLeft, 
  Users, 
  Settings, 
  MessageCircle, 
  BarChart3,
  Calendar,
  Edit,
  Save,
  X,
  Lock,
  Unlock
} from 'lucide-react'
import { format } from 'date-fns'
import { CircleChat } from './CircleChat'
import { CircleProgress } from './CircleProgress'
import { PrivacyToggle } from './PrivacyToggle'

export function CircleDetail({ circleId, onBack }) {
  const { 
    getCircleById, 
    getCircleMembers, 
    getUserMembership,
    updateCirclePrompt,
    leaveCircle,
    deleteCircle
  } = useCirclesStore()
  
  const [activeTab, setActiveTab] = useState('chat')
  const [editingPrompt, setEditingPrompt] = useState(false)
  const [promptText, setPromptText] = useState('')
  const [showPrivacySettings, setShowPrivacySettings] = useState(false)
  
  const circle = getCircleById(circleId)
  const members = getCircleMembers(circleId)
  const userMembership = getUserMembership(circleId)
  const isAdmin = userMembership?.role === 'admin'
  
  if (!circle) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-text-primary mb-2">
          Circle not found
        </h3>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    )
  }
  
  const handleEditPrompt = () => {
    setPromptText(circle.promptOfTheDay)
    setEditingPrompt(true)
  }
  
  const handleSavePrompt = () => {
    updateCirclePrompt(circleId, promptText)
    setEditingPrompt(false)
  }
  
  const handleLeaveCircle = () => {
    leaveCircle(circleId)
    onBack()
  }

  const handleDeleteCircle = () => {
    if (window.confirm('Are you sure you want to delete this circle? This action cannot be undone.')) {
      deleteCircle(circleId)
      onBack()
    }
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-text-primary flex items-center">
            {circle.name}
            {circle.isPrivate ? (
              <Lock className="w-5 h-5 ml-2 text-text-secondary" />
            ) : (
              <Unlock className="w-5 h-5 ml-2 text-text-secondary" />
            )}
          </h1>
          <p className="text-text-secondary">{circle.description}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowPrivacySettings(!showPrivacySettings)}
            className="p-2"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Privacy Settings Panel */}
      {showPrivacySettings && (
        <Card className="p-6 border-2 border-accent/20 bg-accent/5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-text-primary">Privacy Settings</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowPrivacySettings(false)}
              className="p-1"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <PrivacyToggle circleId={circleId} />
            
            <div className="pt-4 border-t border-border dark:border-dark-border space-y-3">
              {isAdmin && (
                <Button 
                  variant="secondary" 
                  onClick={handleDeleteCircle}
                  className="text-error w-full"
                >
                  Delete Circle
                </Button>
              )}
              <Button 
                variant="secondary" 
                onClick={handleLeaveCircle}
                className="text-error w-full"
              >
                Leave Circle
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {/* Circle Info */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">Members</h3>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.userId} className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  {member.avatarUrl ? (
                    <img 
                      src={member.avatarUrl} 
                      alt={member.username} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-medium">
                      {member.username.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-text-primary">{member.username}</div>
                  <div className="text-xs text-text-secondary flex items-center">
                    <span className="capitalize">{member.role}</span>
                    <span className="mx-1">•</span>
                    <span>Joined {format(new Date(member.joinedAt), 'MMM d')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="p-6 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-text-primary">Prompt of the Day</h3>
            {isAdmin && !editingPrompt && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleEditPrompt}
                className="p-1"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {editingPrompt ? (
            <div className="space-y-4">
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="w-full p-3 border border-border dark:border-dark-border rounded-md bg-surface dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={3}
                placeholder="Enter a prompt or question for the group..."
              />
              <div className="flex space-x-3">
                <Button 
                  variant="secondary" 
                  onClick={() => setEditingPrompt(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSavePrompt}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Prompt
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-primary/5 rounded-lg text-text-primary">
              {circle.promptOfTheDay}
            </div>
          )}
        </Card>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-border dark:border-dark-border">
        <button
          className={`px-4 py-2 font-medium text-sm flex items-center ${
            activeTab === 'chat'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm flex items-center ${
            activeTab === 'progress'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('progress')}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Progress
        </button>
      </div>
      
      {/* Tab Content */}
      <div>
        {activeTab === 'chat' ? (
          <CircleChat circleId={circleId} />
        ) : (
          <CircleProgress circleId={circleId} />
        )}
      </div>
    </div>
  )
}

