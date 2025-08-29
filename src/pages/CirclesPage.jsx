import React, { useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { useCirclesStore } from '../stores/circlesStore'
import { useAuthStore } from '../stores/authStore'
import { 
  Users, 
  Plus, 
  Search, 
  Lock, 
  Unlock, 
  ArrowRight,
  MessageCircle,
  Calendar,
  Target
} from 'lucide-react'
import { format } from 'date-fns'
import { CircleDetail } from '../components/CircleDetail'
import { CreateCircleModal } from '../components/CreateCircleModal'

export function CirclesPage() {
  const { 
    getAllCircles, 
    getUserCircles, 
    getCircleMembers,
    joinCircle,
    leaveCircle
  } = useCirclesStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCircle, setSelectedCircle] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeTab, setActiveTab] = useState('my-circles')
  
  const allCircles = getAllCircles()
  const userCircles = getUserCircles()
  
  // Filter circles based on search query
  const filteredCircles = activeTab === 'my-circles' 
    ? userCircles.filter(circle => 
        circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        circle.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        circle.focusArea.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allCircles.filter(circle => 
        !circle.isPrivate && (
          circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          circle.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          circle.focusArea.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
  
  const handleJoinCircle = (circleId) => {
    joinCircle(circleId)
    // Switch to my circles tab and select the joined circle
    setActiveTab('my-circles')
    setSelectedCircle(circleId)
  }
  
  const handleLeaveCircle = (circleId) => {
    if (confirm('Are you sure you want to leave this circle?')) {
      leaveCircle(circleId)
    }
  }

  const handleCreateCircle = () => {
    setShowCreateModal(true)
  }
  
  const handleCircleCreated = (circleId) => {
    setShowCreateModal(false)
    setActiveTab('my-circles')
    setSelectedCircle(circleId)
  }
  
  // If a circle is selected, show its detail view
  if (selectedCircle) {
    return (
      <CircleDetail 
        circleId={selectedCircle} 
        onBack={() => setSelectedCircle(null)} 
      />
    )
  }
  
  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-text-primary">Support Circles</h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Connect, share, and grow with others on similar journeys
          </p>
        </div>
        
        <Button 
          onClick={handleCreateCircle}
          size="lg"
          className="px-8 py-3 text-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Circle
        </Button>
      </div>
      
      {/* Tabs with better styling */}
      <div className="flex justify-center">
        <div className="flex bg-white dark:bg-neutral-900 rounded-xl p-1 border border-neutral-200 dark:border-neutral-700 dark:border-dark-border">
          <button
            className={`px-6 py-3 font-medium text-sm rounded-lg transition-all duration-200 ${
              activeTab === 'my-circles'
                ? 'text-primary bg-primary/10 shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => setActiveTab('my-circles')}
          >
            My Circles
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm rounded-lg transition-all duration-200 ${
              activeTab === 'discover'
                ? 'text-primary bg-primary/10 shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => setActiveTab('discover')}
          >
            Discover
          </button>
        </div>
      </div>
      
      {/* Search with improved styling */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
          <input
            type="text"
            placeholder="Search circles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-neutral-200 dark:border-neutral-700 dark:border-dark-border rounded-xl bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
          />
        </div>
      </div>
      
      {/* Circles Grid with improved layout */}
      {filteredCircles.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCircles.map((circle) => {
            const members = getCircleMembers(circle.circleId)
            const isUserCircle = userCircles.some(c => c.circleId === circle.circleId)
            
            return (
              <Card key={circle.circleId} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-dark-surface dark:to-gray-900/50">
                <div className="p-8 space-y-6">
                  {/* Header with privacy indicator */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-text-secondary">
                        {members.length} {members.length === 1 ? 'member' : 'members'}
                      </span>
                    </div>
                    {circle.isPrivate ? (
                      <div className="flex items-center space-x-2 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-full">
                        <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span className="text-xs text-amber-700 dark:text-amber-300">Private</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
                        <Unlock className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-xs text-green-700 dark:text-green-300">Public</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Circle content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-text-primary group-hover:text-primary transition-colors duration-200">
                      {circle.name}
                    </h3>
                    <p className="text-text-secondary text-base leading-relaxed">
                      {circle.description}
                    </p>
                    <div className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-lg border border-primary/20">
                      {circle.focusArea}
                    </div>
                  </div>
                  
                  {/* Creation date */}
                  <div className="flex items-center text-sm text-text-secondary">
                    <Calendar className="w-4 h-4 mr-2" />
                    Created {format(new Date(circle.createdAt), 'MMM d, yyyy')}
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex space-x-3 pt-2">
                    {isUserCircle ? (
                      <>
                        <Button 
                          className="flex-1 bg-primary hover:bg-primary-dark transition-colors duration-200"
                          onClick={() => setSelectedCircle(circle.circleId)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Open Circle
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleLeaveCircle(circle.circleId)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 transition-all duration-200"
                        >
                          Leave
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this circle? This action cannot be undone.')) {
                              // Add delete functionality here
                              console.log('Delete circle:', circle.circleId)
                            }
                          }}
                          className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300 transition-all duration-200"
                        >
                          Delete
                        </Button>
                      </>
                    ) : (
                      <Button 
                        className="w-full bg-primary hover:bg-primary-dark transition-colors duration-200"
                        onClick={() => handleJoinCircle(circle.circleId)}
                        disabled={circle.isPrivate}
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Join Circle
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-text-secondary" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-3">
            {activeTab === 'my-circles' 
              ? "You haven't joined any circles yet" 
              : "No circles found"}
          </h3>
          <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto">
            {activeTab === 'my-circles'
              ? "Join existing circles or create your own to connect with others on your resilience journey"
              : "Try adjusting your search or create your own circle to get started"}
          </p>
          {activeTab === 'my-circles' ? (
            <Button 
              onClick={() => setActiveTab('discover')}
              size="lg"
              className="px-8 py-3"
            >
              Discover Circles
            </Button>
          ) : (
            <Button 
              onClick={handleCreateCircle}
              size="lg"
              className="px-8 py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Circle
            </Button>
          )}
        </div>
      )}
      
      {/* Circle Stats with improved design */}
      {activeTab === 'my-circles' && userCircles.length > 0 && (
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <h3 className="text-2xl font-semibold text-text-primary mb-6 text-center">Your Circle Activity</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-text-primary mb-2">{userCircles.length}</div>
              <div className="text-text-secondary">Circles Joined</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-3xl font-bold text-text-primary mb-2">24</div>
              <div className="text-text-secondary">Messages Sent</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-text-primary mb-2">85%</div>
              <div className="text-text-secondary">Group Goal Progress</div>
            </div>
          </div>
        </Card>
      )}
      
      {/* Create Circle Modal */}
      <CreateCircleModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCircleCreated={handleCircleCreated}
      />
    </div>
  )
}

