import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, UserPlus, Settings, Search, Filter, PlusCircle } from 'lucide-react'
import { useCircleStore } from '../stores/circleStore'
import { useAuthStore } from '../stores/authStore'
import { CircleCard } from '../components/circles/CircleCard'
import { CircleDetail } from '../components/circles/CircleDetail'
import { MatchingPreferences } from '../components/circles/MatchingPreferences'
import { CircleRecommendations } from '../components/circles/CircleRecommendations'
import { EmptyState } from '../components/EmptyState'
import { Modal } from '../components/Modal'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

export function SupportCirclesPage() {
  const navigate = navigate
  const { user } = useAuthStore()
  const { 
    circles, 
    memberships, 
    getUserCircles, 
    getRecommendedCircles,
    activeCircleId,
    setActiveCircle,
    createCircle
  } = useCircleStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [showMatchingPrefs, setShowMatchingPrefs] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCircleData, setNewCircleData] = useState({
    name: '',
    description: '',
    maxMembers: 8,
    isPublic: true,
    tags: [],
    aiEnabled: true
  })
  const [newCircleTag, setNewCircleTag] = useState('')
  
  // Get user's circles and recommended circles
  const userCircles = getUserCircles()
  const recommendedCircles = getRecommendedCircles()
  
  // Filter circles based on search query and tag filter
  const filteredUserCircles = userCircles.filter(circle => {
    const matchesSearch = !searchQuery || 
      circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      circle.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTag = !filterTag || 
      (circle.tags && circle.tags.includes(filterTag))
    
    return matchesSearch && matchesTag
  })
  
  // Handle circle selection
  const handleCircleSelect = (circleId) => {
    setActiveCircle(circleId)
  }
  
  // Handle create circle
  const handleCreateCircle = () => {
    if (!newCircleData.name) return
    
    createCircle(newCircleData)
    setShowCreateModal(false)
    setNewCircleData({
      name: '',
      description: '',
      maxMembers: 8,
      isPublic: true,
      tags: [],
      aiEnabled: true
    })
  }
  
  // Handle adding a tag to new circle
  const handleAddTag = () => {
    if (!newCircleTag || newCircleData.tags.includes(newCircleTag)) return
    
    setNewCircleData({
      ...newCircleData,
      tags: [...newCircleData.tags, newCircleTag]
    })
    setNewCircleTag('')
  }
  
  // Handle removing a tag from new circle
  const handleRemoveTag = (tag) => {
    setNewCircleData({
      ...newCircleData,
      tags: newCircleData.tags.filter(t => t !== tag)
    })
  }
  
  // Get all unique tags from user circles for filter options
  const allTags = [...new Set(userCircles.flatMap(circle => circle.tags || []))]
  
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">Support Circles</h1>
          <p className="text-text-secondary dark:text-dark-text-secondary mt-1">
            Connect with others on your emotional resilience journey
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="primary"
            onClick={() => setShowCreateModal(true)}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Circle
          </Button>
          
          <Button 
            variant="secondary"
            onClick={() => setShowMatchingPrefs(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Find Circles
          </Button>
        </div>
      </div>
      
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary dark:text-dark-text-tertiary" size={18} />
          <Input
            type="text"
            placeholder="Search circles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="relative">
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="appearance-none bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md py-2 pl-3 pr-10 text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary dark:text-dark-text-tertiary pointer-events-none" size={18} />
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left sidebar - Circle list */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Your Circles
          </h2>
          
          {filteredUserCircles.length > 0 ? (
            <div className="space-y-3">
              {filteredUserCircles.map(circle => (
                <CircleCard
                  key={circle.circleId}
                  circle={circle}
                  isActive={circle.circleId === activeCircleId}
                  onClick={() => handleCircleSelect(circle.circleId)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No circles found"
              description={
                searchQuery || filterTag
                  ? "Try adjusting your search or filter"
                  : "Join or create a circle to get started"
              }
              icon={<Users className="w-12 h-12" />}
            />
          )}
          
          {/* Recommended circles section */}
          {recommendedCircles.length > 0 && !searchQuery && !filterTag && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-3">
                Recommended For You
              </h2>
              <CircleRecommendations 
                recommendations={recommendedCircles}
                onSelect={handleCircleSelect}
              />
            </div>
          )}
        </div>
        
        {/* Right content - Circle detail */}
        <div className="lg:col-span-2 bg-surface dark:bg-dark-surface rounded-lg border border-border dark:border-dark-border overflow-hidden">
          {activeCircleId ? (
            <CircleDetail circleId={activeCircleId} />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 h-96">
              <Users className="w-16 h-16 text-text-tertiary dark:text-dark-text-tertiary mb-4" />
              <h3 className="text-xl font-semibold text-text-primary dark:text-dark-text-primary mb-2">
                Select a circle
              </h3>
              <p className="text-text-secondary dark:text-dark-text-secondary text-center max-w-md">
                Choose a circle from the list or join a recommended circle to view its details and interact with members.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Matching preferences modal */}
      <Modal
        isOpen={showMatchingPrefs}
        onClose={() => setShowMatchingPrefs(false)}
        title="Find Your Circle"
      >
        <MatchingPreferences onClose={() => setShowMatchingPrefs(false)} />
      </Modal>
      
      {/* Create circle modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create a New Circle"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
              Circle Name
            </label>
            <Input
              type="text"
              value={newCircleData.name}
              onChange={(e) => setNewCircleData({...newCircleData, name: e.target.value})}
              placeholder="Give your circle a name"
              maxLength={50}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
              Description
            </label>
            <textarea
              value={newCircleData.description}
              onChange={(e) => setNewCircleData({...newCircleData, description: e.target.value})}
              placeholder="What is this circle about?"
              className="w-full px-3 py-2 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary dark:text-dark-text-primary"
              rows={3}
              maxLength={200}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
              Tags
            </label>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                value={newCircleTag}
                onChange={(e) => setNewCircleTag(e.target.value)}
                placeholder="Add a tag"
                className="flex-grow"
              />
              <Button
                variant="secondary"
                onClick={handleAddTag}
                disabled={!newCircleTag}
              >
                Add
              </Button>
            </div>
            
            {newCircleData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {newCircleData.tags.map(tag => (
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
                value={newCircleData.maxMembers}
                onChange={(e) => setNewCircleData({...newCircleData, maxMembers: Number(e.target.value)})}
                className="w-full px-3 py-2 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary dark:text-dark-text-primary"
              >
                <option value={5}>Small (5)</option>
                <option value={8}>Medium (8)</option>
                <option value={12}>Large (12)</option>
                <option value={20}>Extra Large (20)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
                Visibility
              </label>
              <select
                value={newCircleData.isPublic.toString()}
                onChange={(e) => setNewCircleData({...newCircleData, isPublic: e.target.value === 'true'})}
                className="w-full px-3 py-2 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary dark:text-dark-text-primary"
              >
                <option value="true">Public</option>
                <option value="false">Private</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="aiEnabled"
              checked={newCircleData.aiEnabled}
              onChange={(e) => setNewCircleData({...newCircleData, aiEnabled: e.target.checked})}
              className="h-4 w-4 text-primary focus:ring-primary/50 border-border dark:border-dark-border rounded"
            />
            <label htmlFor="aiEnabled" className="ml-2 block text-sm text-text-primary dark:text-dark-text-primary">
              Enable AI Facilitator
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateCircle}
              disabled={!newCircleData.name}
            >
              Create Circle
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

