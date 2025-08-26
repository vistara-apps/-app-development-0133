import React, { useState, useEffect } from 'react'
import { 
  Users, 
  MessageCircle, 
  Settings, 
  Info, 
  BarChart3, 
  CheckCircle,
  UserPlus,
  UserMinus,
  Calendar,
  Clock
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { useCircleStore } from '../../stores/circleStore'
import { useAuthStore } from '../../stores/authStore'
import { usePrivacyStore } from '../../stores/privacyStore'
import { Button } from '../Button'
import { CircleChat } from './CircleChat'
import { CircleProgress } from './CircleProgress'
import { AccountabilityTracker } from './AccountabilityTracker'
import { CircleSettings } from './CircleSettings'
import { PrivacySettings } from './PrivacySettings'
import { Modal } from '../Modal'

export function CircleDetail({ circleId }) {
  const [activeTab, setActiveTab] = useState('chat')
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  
  const { user } = useAuthStore()
  const { 
    circles, 
    memberships, 
    getCircleMembers,
    joinCircle,
    leaveCircle,
    getCircleStats
  } = useCircleStore()
  
  const { getCircleSettings, getDisplayName } = usePrivacyStore()
  
  // Get circle data
  const circle = circles.find(c => c.circleId === circleId)
  if (!circle) return null
  
  // Check if user is a member
  const userMembership = memberships.find(
    m => m.circleId === circleId && m.userId === user.userId && m.isActive
  )
  const isMember = !!userMembership
  
  // Get circle members
  const circleMembers = getCircleMembers(circleId)
  
  // Get circle stats
  const stats = getCircleStats(circleId)
  
  // Get privacy settings
  const privacySettings = getCircleSettings(circleId)
  
  // Get user display name for this circle
  const displayName = getDisplayName(circleId)
  
  // Handle join/leave circle
  const handleJoinCircle = () => {
    joinCircle(circleId)
  }
  
  const handleLeaveCircle = () => {
    leaveCircle(circleId)
  }
  
  // Tabs configuration
  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle, requiresMembership: false },
    { id: 'progress', label: 'Progress', icon: BarChart3, requiresMembership: true },
    { id: 'accountability', label: 'Goals', icon: CheckCircle, requiresMembership: true }
  ]
  
  // If user is not a member and tries to access member-only tabs, redirect to chat
  useEffect(() => {
    const currentTab = tabs.find(tab => tab.id === activeTab)
    if (currentTab?.requiresMembership && !isMember) {
      setActiveTab('chat')
    }
  }, [activeTab, isMember])
  
  return (
    <div className="flex flex-col h-full">
      {/* Circle header */}
      <div className="p-4 border-b border-border dark:border-dark-border">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-md overflow-hidden mr-3">
              {circle.imageUrl ? (
                <img 
                  src={circle.imageUrl} 
                  alt={circle.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-primary/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary flex items-center">
                {circle.name}
                {!circle.isPublic && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-text-secondary dark:bg-dark-border dark:text-dark-text-secondary">
                    Private
                  </span>
                )}
              </h2>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                {circle.currentMembers} {circle.currentMembers === 1 ? 'member' : 'members'}
                {isMember && privacySettings.anonymousMode && (
                  <span className="ml-2 text-xs px-1.5 py-0.5 bg-warning/20 text-warning rounded">
                    Anonymous Mode
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isMember ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPrivacyModal(true)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Privacy
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettingsModal(true)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLeaveCircle}
                >
                  <UserMinus className="h-4 w-4 mr-1" />
                  Leave
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInfoModal(true)}
                >
                  <Info className="h-4 w-4 mr-1" />
                  Info
                </Button>
                
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleJoinCircle}
                  disabled={circle.currentMembers >= circle.maxMembers}
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Join Circle
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Circle tags */}
        {circle.tags && circle.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {circle.tags.map(tag => (
              <span 
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary dark:bg-primary/20 dark:text-primary/90"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Tabs */}
        <div className="flex border-b border-border dark:border-dark-border mt-4">
          {tabs.map(tab => {
            // Skip member-only tabs if user is not a member
            if (tab.requiresMembership && !isMember) return null
            
            return (
              <button
                key={tab.id}
                className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'border-primary text-primary dark:border-primary dark:text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary dark:text-dark-text-secondary dark:hover:text-dark-text-primary'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && (
          <CircleChat 
            circleId={circleId} 
            isMember={isMember} 
            displayName={displayName}
          />
        )}
        
        {activeTab === 'progress' && isMember && (
          <CircleProgress circleId={circleId} />
        )}
        
        {activeTab === 'accountability' && isMember && (
          <AccountabilityTracker circleId={circleId} />
        )}
      </div>
      
      {/* Settings modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Circle Settings"
      >
        <CircleSettings 
          circleId={circleId} 
          onClose={() => setShowSettingsModal(false)} 
        />
      </Modal>
      
      {/* Privacy settings modal */}
      <Modal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="Privacy Settings"
      >
        <PrivacySettings 
          circleId={circleId} 
          onClose={() => setShowPrivacyModal(false)} 
        />
      </Modal>
      
      {/* Circle info modal */}
      <Modal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={circle.name}
      >
        <div className="space-y-4">
          <p className="text-text-primary dark:text-dark-text-primary">
            {circle.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-text-tertiary dark:text-dark-text-tertiary mr-2" />
              <span className="text-text-secondary dark:text-dark-text-secondary">
                {circle.currentMembers}/{circle.maxMembers} members
              </span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-text-tertiary dark:text-dark-text-tertiary mr-2" />
              <span className="text-text-secondary dark:text-dark-text-secondary">
                Created {format(new Date(circle.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
            
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 text-text-tertiary dark:text-dark-text-tertiary mr-2" />
              <span className="text-text-secondary dark:text-dark-text-secondary">
                {stats.totalMessages} messages
              </span>
            </div>
            
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-text-tertiary dark:text-dark-text-tertiary mr-2" />
              <span className="text-text-secondary dark:text-dark-text-secondary">
                {stats.totalGoals} goals ({stats.completedGoals} completed)
              </span>
            </div>
          </div>
          
          {circle.tags && circle.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2">
                Topics
              </h4>
              <div className="flex flex-wrap gap-1">
                {circle.tags.map(tag => (
                  <span 
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary dark:bg-primary/20 dark:text-primary/90"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="pt-4 flex justify-end">
            <Button
              variant="primary"
              onClick={() => {
                handleJoinCircle()
                setShowInfoModal(false)
              }}
              disabled={circle.currentMembers >= circle.maxMembers}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Join Circle
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

