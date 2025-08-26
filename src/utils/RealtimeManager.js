// RealtimeManager.js - Utility for managing real-time interactions
// This would normally use Supabase's real-time subscriptions
// For this implementation, we'll simulate real-time behavior

import { aiFacilitator } from './AIFacilitator'
import { useCircleStore } from '../stores/circleStore'

class RealtimeManager {
  constructor() {
    this.listeners = {
      message: [],
      presence: [],
      typing: [],
      reaction: [],
      checkIn: [],
      goalUpdate: []
    }
    
    this.typingUsers = {} // Format: { circleId: { userId: timestamp } }
    this.onlineUsers = {} // Format: { circleId: { userId: timestamp } }
    
    // Set up interval to clean up stale typing indicators
    setInterval(() => this.cleanupTypingIndicators(), 5000)
    
    // Set up interval to simulate AI responses
    setInterval(() => this.simulateAIResponses(), 30000)
  }
  
  // Subscribe to real-time events
  subscribe(eventType, callback) {
    if (!this.listeners[eventType]) {
      console.error(`Unknown event type: ${eventType}`)
      return () => {}
    }
    
    this.listeners[eventType].push(callback)
    
    // Return unsubscribe function
    return () => {
      this.listeners[eventType] = this.listeners[eventType].filter(cb => cb !== callback)
    }
  }
  
  // Notify all listeners of an event
  notify(eventType, data) {
    if (!this.listeners[eventType]) {
      console.error(`Unknown event type: ${eventType}`)
      return
    }
    
    this.listeners[eventType].forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error(`Error in ${eventType} listener:`, error)
      }
    })
  }
  
  // Send a message to a circle
  sendMessage(circleId, userId, userName, content) {
    const message = {
      messageId: `message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      circleId,
      senderId: userId,
      senderName: userName,
      isAI: false,
      content,
      sentAt: new Date().toISOString(),
      reactions: []
    }
    
    // Add message to store
    useCircleStore.getState().sendMessage(circleId, content)
    
    // Notify listeners
    this.notify('message', message)
    
    // Clear typing indicator for this user
    this.setTypingStatus(circleId, userId, false)
    
    // Simulate AI response with a delay
    this.scheduleAIResponse(message)
    
    return message
  }
  
  // Schedule an AI response to a user message
  scheduleAIResponse(userMessage) {
    // Only respond to non-AI messages
    if (userMessage.isAI) return
    
    // Get recent messages for context
    const recentMessages = useCircleStore.getState()
      .getCircleMessages(userMessage.circleId)
      .slice(-5)
    
    // Determine if AI should respond
    // Respond to every 3rd message or if directly addressed
    const shouldRespond = 
      recentMessages.filter(m => !m.isAI).length % 3 === 0 ||
      userMessage.content.toLowerCase().includes('ai') ||
      userMessage.content.includes('@facilitator')
    
    if (shouldRespond) {
      // Random delay between 5-15 seconds
      const delay = 5000 + Math.random() * 10000
      
      setTimeout(() => {
        // Generate AI response
        const aiResponse = aiFacilitator.generateResponse(
          userMessage.content,
          userMessage.circleId,
          recentMessages
        )
        
        // Add to store
        useCircleStore.getState().sendMessage(
          userMessage.circleId, 
          aiResponse.content
        )
        
        // Notify listeners
        this.notify('message', aiResponse)
      }, delay)
    }
  }
  
  // Set user typing status
  setTypingStatus(circleId, userId, isTyping) {
    if (!this.typingUsers[circleId]) {
      this.typingUsers[circleId] = {}
    }
    
    if (isTyping) {
      this.typingUsers[circleId][userId] = Date.now()
    } else {
      delete this.typingUsers[circleId][userId]
    }
    
    // Notify listeners
    this.notify('typing', {
      circleId,
      typingUsers: Object.keys(this.typingUsers[circleId] || {})
    })
  }
  
  // Set user online status
  setOnlineStatus(circleId, userId, isOnline) {
    if (!this.onlineUsers[circleId]) {
      this.onlineUsers[circleId] = {}
    }
    
    if (isOnline) {
      this.onlineUsers[circleId][userId] = Date.now()
    } else {
      delete this.onlineUsers[circleId][userId]
    }
    
    // Notify listeners
    this.notify('presence', {
      circleId,
      onlineUsers: Object.keys(this.onlineUsers[circleId] || {})
    })
  }
  
  // Add reaction to a message
  addReaction(messageId, userId, reaction) {
    // Add to store
    useCircleStore.getState().addReaction(messageId, reaction)
    
    // Notify listeners
    this.notify('reaction', {
      messageId,
      userId,
      reaction,
      timestamp: Date.now()
    })
  }
  
  // Record a goal check-in
  recordCheckIn(goalId, userId, isCompleted, notes) {
    // Add to store
    useCircleStore.getState().addCheckIn(goalId, isCompleted, notes)
    
    // Find the goal to get its circle
    const goal = useCircleStore.getState().goals.find(g => g.goalId === goalId)
    
    if (goal) {
      // Notify listeners
      this.notify('checkIn', {
        goalId,
        userId,
        circleId: goal.circleId,
        isCompleted,
        notes,
        timestamp: Date.now()
      })
      
      // If completed, check if it's a milestone
      if (isCompleted) {
        this.checkForMilestone(goalId, userId)
      }
    }
  }
  
  // Check if a goal has reached a milestone
  checkForMilestone(goalId, userId) {
    const goal = useCircleStore.getState().goals.find(g => g.goalId === goalId)
    if (!goal) return
    
    // Calculate new progress based on check-ins
    const checkIns = useCircleStore.getState().getGoalCheckIns(goalId)
    const totalDays = Math.ceil((new Date(goal.targetDate) - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24))
    const completedDays = checkIns.filter(c => c.isCompleted).length
    
    const newProgress = Math.min(100, Math.round((completedDays / totalDays) * 100))
    
    // Check if we've hit a milestone (25%, 50%, 75%, 100%)
    const milestones = [25, 50, 75, 100]
    const oldProgress = goal.progress
    
    // Find if we've crossed any milestone
    const crossedMilestone = milestones.find(m => oldProgress < m && newProgress >= m)
    
    if (crossedMilestone) {
      // Update goal progress
      useCircleStore.getState().updateGoal(goalId, { progress: newProgress })
      
      // Get user name
      const userName = useCircleStore.getState().getCircleMembers(goal.circleId)
        .find(m => m.userId === userId)?.userName || 'Circle Member'
      
      // Generate celebration message
      const celebrationMessage = aiFacilitator.generateMilestoneCelebration(
        goalId,
        crossedMilestone,
        userName,
        goal.circleId
      )
      
      // Add to store and notify
      useCircleStore.getState().sendMessage(
        goal.circleId,
        celebrationMessage.content
      )
      
      this.notify('message', celebrationMessage)
    } else if (newProgress !== oldProgress) {
      // Just update progress without celebration
      useCircleStore.getState().updateGoal(goalId, { progress: newProgress })
    }
  }
  
  // Clean up stale typing indicators (older than 5 seconds)
  cleanupTypingIndicators() {
    const now = Date.now()
    let updated = false
    
    Object.keys(this.typingUsers).forEach(circleId => {
      Object.keys(this.typingUsers[circleId]).forEach(userId => {
        if (now - this.typingUsers[circleId][userId] > 5000) {
          delete this.typingUsers[circleId][userId]
          updated = true
        }
      })
      
      // Notify if changes were made
      if (updated) {
        this.notify('typing', {
          circleId,
          typingUsers: Object.keys(this.typingUsers[circleId] || {})
        })
      }
    })
  }
  
  // Simulate periodic AI responses and prompts
  simulateAIResponses() {
    const circles = useCircleStore.getState().circles
    const now = new Date()
    
    circles.forEach(circle => {
      // Check if it's time for a daily prompt
      const currentPrompt = useCircleStore.getState().getCurrentPrompt(circle.circleId)
      
      if (!currentPrompt && circle.aiEnabled) {
        // Generate a new prompt
        const newPrompt = aiFacilitator.generateDailyPrompt(circle.circleId)
        
        // Create AI message with the prompt
        const promptMessage = {
          messageId: `ai-prompt-${Date.now()}`,
          circleId: circle.circleId,
          senderId: 'ai-facilitator',
          senderName: 'AI Facilitator',
          isAI: true,
          content: newPrompt.content,
          sentAt: new Date().toISOString(),
          reactions: []
        }
        
        // Add to store
        useCircleStore.getState().sendMessage(
          circle.circleId,
          promptMessage.content
        )
        
        // Notify listeners
        this.notify('message', promptMessage)
      }
    })
  }
}

// Export a singleton instance
export const realtimeManager = new RealtimeManager()

