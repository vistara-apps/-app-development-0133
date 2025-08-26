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
    joinCircle
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Support Circles</h1>
          <p className="text-text-secondary">Connect, share, and grow with others on similar journeys</p>
        </div>
        
        <Button onClick={handleCreateCircle}>
          <Plus className="w-4 h-4 mr-2" />
          Create Circle
        </Button>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-border dark:border-dark-border">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'my-circles'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('my-circles')}
        >
          My Circles
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'discover'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => setActiveTab('discover')}
        >
          Discover
        </button>
      </div>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder="Search circles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border dark:border-dark-border rounded-md bg-surface dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>
      
      {/* Circles Grid */}
      {filteredCircles.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCircles.map((circle) => {
            const members = getCircleMembers(circle.circleId)
            const isUserCircle = userCircles.some(c => c.circleId === circle.circleId)
            
            return (
              <Card key={circle.circleId} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="text-sm text-text-secondary">
                        {members.length} {members.length === 1 ? 'member' : 'members'}
                      </span>
                    </div>
                    {circle.isPrivate ? (
                      <Lock className="w-5 h-5 text-text-secondary" />
                    ) : (
                      <Unlock className="w-5 h-5 text-text-secondary" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-text-primary mb-1">
                      {circle.name}
                    </h3>
                    <p className="text-text-secondary text-sm mb-2">
                      {circle.description}
                    </p>
                    <div className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-sm">
                      {circle.focusArea}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-text-secondary">
                    <div>Created {format(new Date(circle.createdAt), 'MMM d, yyyy')}</div>
                  </div>
                  
                  <div className="flex space-x-3">
                    {isUserCircle ? (
                      <Button 
                        className="w-full"
                        onClick={() => setSelectedCircle(circle.circleId)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Open
                      </Button>
                    ) : (
                      <Button 
                        className="w-full"
                        onClick={() => handleJoinCircle(circle.circleId)}
                        disabled={circle.isPrivate}
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Join
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto text-text-secondary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            {activeTab === 'my-circles' 
              ? "You haven't joined any circles yet" 
              : "No circles found"}
          </h3>
          <p className="text-text-secondary mb-6">
            {activeTab === 'my-circles'
              ? "Join existing circles or create your own to connect with others"
              : "Try adjusting your search or create your own circle"}
          </p>
          {activeTab === 'my-circles' ? (
            <Button onClick={() => setActiveTab('discover')}>
              Discover Circles
            </Button>
          ) : (
            <Button onClick={handleCreateCircle}>
              <Plus className="w-4 h-4 mr-2" />
              Create Circle
            </Button>
          )}
        </div>
      )}
      
      {/* Circle Stats */}
      {activeTab === 'my-circles' && userCircles.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">Your Circle Activity</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-text-primary">{userCircles.length}</div>
                <div className="text-sm text-text-secondary">Circles Joined</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <MessageCircle className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-text-primary">24</div>
                <div className="text-sm text-text-secondary">Messages Sent</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Target className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-text-primary">85%</div>
                <div className="text-sm text-text-secondary">Group Goal Progress</div>
              </div>
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

