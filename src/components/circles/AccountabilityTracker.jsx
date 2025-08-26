import React, { useState } from 'react'
import { 
  CheckCircle, 
  PlusCircle, 
  Calendar, 
  Clock, 
  Edit, 
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  User,
  Filter
} from 'lucide-react'
import { format, formatDistanceToNow, isToday, addDays } from 'date-fns'
import { useCircleStore } from '../../stores/circleStore'
import { useAuthStore } from '../../stores/authStore'
import { Button } from '../Button'
import { Input } from '../Input'
import { Modal } from '../Modal'
import { EmptyState } from '../EmptyState'

export function AccountabilityTracker({ circleId }) {
  const [showCreateGoalModal, setShowCreateGoalModal] = useState(false)
  const [showCheckInModal, setShowCheckInModal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [expandedGoals, setExpandedGoals] = useState({})
  const [filter, setFilter] = useState('all') // 'all', 'mine', 'others'
  const [newGoalData, setNewGoalData] = useState({
    title: '',
    description: '',
    targetDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    isPrivate: false
  })
  const [checkInData, setCheckInData] = useState({
    isCompleted: false,
    notes: ''
  })
  
  const { user } = useAuthStore()
  const { 
    goals, 
    getCircleGoals, 
    getGoalCheckIns,
    createGoal,
    updateGoal,
    addCheckIn
  } = useCircleStore()
  
  // Get goals for this circle
  const circleGoals = getCircleGoals(circleId)
  
  // Filter goals based on selected filter
  const filteredGoals = circleGoals.filter(goal => {
    if (filter === 'all') return true
    if (filter === 'mine') return goal.userId === user.userId
    if (filter === 'others') return goal.userId !== user.userId
    return true
  })
  
  // Handle goal creation
  const handleCreateGoal = () => {
    if (!newGoalData.title) return
    
    createGoal({
      ...newGoalData,
      circleId
    })
    
    setShowCreateGoalModal(false)
    setNewGoalData({
      title: '',
      description: '',
      targetDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
      isPrivate: false
    })
  }
  
  // Handle check-in
  const handleCheckIn = () => {
    if (!selectedGoal) return
    
    addCheckIn(
      selectedGoal.goalId,
      checkInData.isCompleted,
      checkInData.notes
    )
    
    setShowCheckInModal(false)
    setCheckInData({
      isCompleted: false,
      notes: ''
    })
  }
  
  // Toggle goal expanded state
  const toggleGoalExpanded = (goalId) => {
    setExpandedGoals(prev => ({
      ...prev,
      [goalId]: !prev[goalId]
    }))
  }
  
  // Open check-in modal
  const openCheckInModal = (goal) => {
    setSelectedGoal(goal)
    setCheckInData({
      isCompleted: false,
      notes: ''
    })
    setShowCheckInModal(true)
  }
  
  // Render goal progress bar
  const renderProgressBar = (progress) => {
    return (
      <div className="w-full bg-gray-100 dark:bg-dark-border rounded-full h-2.5 mt-1">
        <div 
          className="bg-primary h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    )
  }
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Accountability Goals
        </h2>
        
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md py-1 pl-2 pr-8 text-sm text-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Goals</option>
            <option value="mine">My Goals</option>
            <option value="others">Others' Goals</option>
          </select>
          
          <Button
            variant="primary"
            onClick={() => setShowCreateGoalModal(true)}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        </div>
      </div>
      
      {/* Goals list */}
      {filteredGoals.length > 0 ? (
        <div className="space-y-4">
          {filteredGoals.map(goal => {
            const isExpanded = expandedGoals[goal.goalId]
            const checkIns = getGoalCheckIns(goal.goalId)
            const isUserGoal = goal.userId === user.userId
            const latestCheckIn = checkIns.length > 0 ? checkIns[0] : null
            const hasCheckedInToday = latestCheckIn && isToday(new Date(latestCheckIn.date)) && latestCheckIn.isCompleted
            
            return (
              <div 
                key={goal.goalId}
                className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-lg overflow-hidden"
              >
                {/* Goal header */}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        goal.status === 'completed'
                          ? 'bg-success/10 dark:bg-success/5'
                          : goal.progress >= 50
                            ? 'bg-primary/10 dark:bg-primary/5'
                            : 'bg-gray-100 dark:bg-dark-border/50'
                      }`}>
                        <CheckCircle className={`h-5 w-5 ${
                          goal.status === 'completed'
                            ? 'text-success dark:text-success/90'
                            : goal.progress >= 50
                              ? 'text-primary dark:text-primary/90'
                              : 'text-text-tertiary dark:text-dark-text-tertiary'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-base font-medium text-text-primary dark:text-dark-text-primary">
                            {goal.title}
                          </h3>
                          {isUserGoal && (
                            <span className="ml-2 text-xs px-1.5 py-0.5 bg-gray-100 text-text-secondary dark:bg-dark-border dark:text-dark-text-secondary rounded">
                              Your Goal
                            </span>
                          )}
                          {goal.isPrivate && (
                            <span className="ml-2 text-xs px-1.5 py-0.5 bg-gray-100 text-text-secondary dark:bg-dark-border dark:text-dark-text-secondary rounded">
                              Private
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-1 text-sm text-text-secondary dark:text-dark-text-secondary">
                          {goal.description}
                        </div>
                        
                        <div className="mt-2 flex items-center text-xs text-text-tertiary dark:text-dark-text-tertiary">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>Target: {format(new Date(goal.targetDate), 'MMM d, yyyy')}</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>Created {formatDistanceToNow(new Date(goal.createdAt), { addSuffix: true })}</span>
                        </div>
                        
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex-1 mr-4">
                            {renderProgressBar(goal.progress)}
                            <div className="flex justify-between mt-1 text-xs">
                              <span className="text-text-secondary dark:text-dark-text-secondary">
                                Progress: {goal.progress}%
                              </span>
                              {latestCheckIn && (
                                <span className="text-text-tertiary dark:text-dark-text-tertiary">
                                  Last check-in: {formatDistanceToNow(new Date(latestCheckIn.date), { addSuffix: true })}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {isUserGoal && !hasCheckedInToday && goal.status !== 'completed' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => openCheckInModal(goal)}
                            >
                              Check In
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleGoalExpanded(goal.goalId)}
                      className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-dark-border/50 text-text-tertiary dark:text-dark-text-tertiary"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-border dark:border-dark-border p-4 bg-gray-50 dark:bg-dark-border/20">
                    <h4 className="text-sm font-medium text-text-primary dark:text-dark-text-primary mb-2">
                      Check-in History
                    </h4>
                    
                    {checkIns.length > 0 ? (
                      <div className="space-y-3">
                        {checkIns.slice(0, 5).map(checkIn => (
                          <div 
                            key={checkIn.checkInId}
                            className="flex items-start p-2 rounded-md bg-white dark:bg-dark-surface border border-border dark:border-dark-border"
                          >
                            <div className="flex-shrink-0 mr-3">
                              {checkIn.isCompleted ? (
                                <CheckSquare className="h-5 w-5 text-success dark:text-success/90" />
                              ) : (
                                <Square className="h-5 w-5 text-error dark:text-error/90" />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                                  {format(new Date(checkIn.date), 'MMM d, yyyy')}
                                </span>
                                <span className="text-xs text-text-tertiary dark:text-dark-text-tertiary">
                                  {format(new Date(checkIn.createdAt), 'h:mm a')}
                                </span>
                              </div>
                              
                              {checkIn.notes && (
                                <p className="mt-1 text-sm text-text-secondary dark:text-dark-text-secondary">
                                  {checkIn.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {checkIns.length > 5 && (
                          <div className="text-center">
                            <button className="text-sm text-primary dark:text-primary/90 hover:underline">
                              View all {checkIns.length} check-ins
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-text-tertiary dark:text-dark-text-tertiary">
                        No check-ins recorded yet.
                      </p>
                    )}
                    
                    {isUserGoal && (
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        
                        {goal.status !== 'completed' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => updateGoal(goal.goalId, { status: 'completed' })}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState
          title="No goals found"
          description={
            filter !== 'all'
              ? "Try adjusting your filter"
              : "Create a goal to start tracking your progress"
          }
          icon={<CheckCircle className="w-12 h-12" />}
        />
      )}
      
      {/* Create goal modal */}
      <Modal
        isOpen={showCreateGoalModal}
        onClose={() => setShowCreateGoalModal(false)}
        title="Create New Goal"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
              Goal Title
            </label>
            <Input
              type="text"
              value={newGoalData.title}
              onChange={(e) => setNewGoalData({...newGoalData, title: e.target.value})}
              placeholder="What do you want to achieve?"
              maxLength={50}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
              Description
            </label>
            <textarea
              value={newGoalData.description}
              onChange={(e) => setNewGoalData({...newGoalData, description: e.target.value})}
              placeholder="Describe your goal in more detail"
              className="w-full px-3 py-2 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary dark:text-dark-text-primary"
              rows={3}
              maxLength={200}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
              Target Date
            </label>
            <Input
              type="date"
              value={newGoalData.targetDate}
              onChange={(e) => setNewGoalData({...newGoalData, targetDate: e.target.value})}
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPrivate"
              checked={newGoalData.isPrivate}
              onChange={(e) => setNewGoalData({...newGoalData, isPrivate: e.target.checked})}
              className="h-4 w-4 text-primary focus:ring-primary/50 border-border dark:border-dark-border rounded"
            />
            <label htmlFor="isPrivate" className="ml-2 block text-sm text-text-primary dark:text-dark-text-primary">
              Make this goal private
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowCreateGoalModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateGoal}
              disabled={!newGoalData.title}
            >
              Create Goal
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Check-in modal */}
      <Modal
        isOpen={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
        title="Daily Check-in"
      >
        {selectedGoal && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-dark-border/20 p-3 rounded-md">
              <h3 className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
                {selectedGoal.title}
              </h3>
              <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">
                {selectedGoal.description}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-2">
                Did you complete today's goal?
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={checkInData.isCompleted}
                    onChange={() => setCheckInData({...checkInData, isCompleted: true})}
                    className="h-4 w-4 text-primary focus:ring-primary/50 border-border dark:border-dark-border"
                  />
                  <span className="ml-2 text-text-primary dark:text-dark-text-primary">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!checkInData.isCompleted}
                    onChange={() => setCheckInData({...checkInData, isCompleted: false})}
                    className="h-4 w-4 text-primary focus:ring-primary/50 border-border dark:border-dark-border"
                  />
                  <span className="ml-2 text-text-primary dark:text-dark-text-primary">No</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
                Notes (optional)
              </label>
              <textarea
                value={checkInData.notes}
                onChange={(e) => setCheckInData({...checkInData, notes: e.target.value})}
                placeholder="Add any thoughts or reflections about your progress today"
                className="w-full px-3 py-2 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary dark:text-dark-text-primary"
                rows={3}
                maxLength={200}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setShowCheckInModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleCheckIn}
              >
                Submit Check-in
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

