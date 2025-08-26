import { create } from 'zustand'
import { format, subDays, addDays } from 'date-fns'
import { useAuthStore } from './authStore'
import { useDataStore } from './dataStore'

// Helper function to generate a unique ID
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// Mock data generators
const generateMockCircles = () => {
  return [
    {
      circleId: 'circle-1',
      name: 'Mindfulness Masters',
      description: 'A supportive circle focused on developing mindfulness practices for daily life.',
      createdAt: subDays(new Date(), 30).toISOString(),
      maxMembers: 8,
      currentMembers: 5,
      isPublic: true,
      tags: ['mindfulness', 'meditation', 'beginners'],
      aiEnabled: true,
      imageUrl: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
      circleId: 'circle-2',
      name: 'Anxiety Support',
      description: 'A safe space to share experiences and strategies for managing anxiety.',
      createdAt: subDays(new Date(), 25).toISOString(),
      maxMembers: 6,
      currentMembers: 6,
      isPublic: false,
      tags: ['anxiety', 'stress-management', 'support'],
      aiEnabled: true,
      imageUrl: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
      circleId: 'circle-3',
      name: 'Gratitude Gang',
      description: 'Daily gratitude practices and reflections to boost positivity and resilience.',
      createdAt: subDays(new Date(), 15).toISOString(),
      maxMembers: 10,
      currentMembers: 7,
      isPublic: true,
      tags: ['gratitude', 'positivity', 'daily-practice'],
      aiEnabled: true,
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=200&h=200'
    }
  ]
}

const generateMockMemberships = () => {
  const { user } = useAuthStore.getState()
  return [
    {
      membershipId: 'membership-1',
      userId: user.userId,
      circleId: 'circle-1',
      joinedAt: subDays(new Date(), 20).toISOString(),
      role: 'member',
      isActive: true,
      lastActive: new Date().toISOString()
    },
    {
      membershipId: 'membership-2',
      userId: user.userId,
      circleId: 'circle-3',
      joinedAt: subDays(new Date(), 10).toISOString(),
      role: 'admin',
      isActive: true,
      lastActive: new Date().toISOString()
    }
  ]
}

const generateMockMessages = () => {
  const { user } = useAuthStore.getState()
  const otherUsers = [
    { userId: 'user-2', username: 'Sarah J.' },
    { userId: 'user-3', username: 'Michael T.' },
    { userId: 'user-4', username: 'Emma W.' },
    { userId: 'user-5', username: 'AI Facilitator', isAI: true }
  ]
  
  const messages = []
  
  // Generate messages for circle 1
  for (let i = 20; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const isAIMessage = i % 5 === 0
    const sender = isAIMessage 
      ? otherUsers[4] 
      : (i % 4 === 0 ? { userId: user.userId, username: user.username } : otherUsers[i % 3])
    
    messages.push({
      messageId: `message-circle1-${i}`,
      circleId: 'circle-1',
      senderId: sender.userId,
      senderName: sender.username,
      isAI: !!sender.isAI,
      content: isAIMessage 
        ? "Today's prompt: Share one small win from yesterday and how it made you feel. Remember that acknowledging progress, no matter how small, builds resilience."
        : `This is a sample message ${i} in the mindfulness circle. Sharing thoughts about daily practice.`,
      sentAt: date.toISOString(),
      reactions: []
    })
  }
  
  // Generate messages for circle 3
  for (let i = 15; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const isAIMessage = i % 5 === 0
    const sender = isAIMessage 
      ? otherUsers[4] 
      : (i % 4 === 0 ? { userId: user.userId, username: user.username } : otherUsers[i % 3])
    
    messages.push({
      messageId: `message-circle3-${i}`,
      circleId: 'circle-3',
      senderId: sender.userId,
      senderName: sender.username,
      isAI: !!sender.isAI,
      content: isAIMessage 
        ? "Today's gratitude prompt: What is something in your environment right now that you're grateful for? How does it enhance your life?"
        : `This is a sample message ${i} in the gratitude circle. Today I'm grateful for...`,
      sentAt: date.toISOString(),
      reactions: []
    })
  }
  
  return messages
}

const generateMockPrompts = () => {
  const prompts = []
  
  // Mindfulness circle prompts
  for (let i = 0; i < 5; i++) {
    prompts.push({
      promptId: `prompt-circle1-${i}`,
      circleId: 'circle-1',
      content: [
        "Take a moment to notice your breath. How does it feel? Share one observation about your current state of mind.",
        "What's one small mindful moment you experienced today? How did it affect your mood?",
        "Describe a simple mindfulness practice you could incorporate into your daily routine. What benefits might it bring?",
        "When you feel overwhelmed, what mindfulness technique helps you return to the present moment?",
        "Share one way you've noticed mindfulness changing your perspective on daily challenges."
      ][i],
      createdAt: addDays(new Date(), i).toISOString(),
      scheduledFor: addDays(new Date(), i).toISOString(),
      isUsed: false
    })
  }
  
  // Gratitude circle prompts
  for (let i = 0; i < 5; i++) {
    prompts.push({
      promptId: `prompt-circle3-${i}`,
      circleId: 'circle-3',
      content: [
        "What's something small that brought you joy today that you might normally overlook?",
        "Think of someone who helped you recently. What specifically are you grateful for about their support?",
        "What's one challenge you're facing that you can find a silver lining or learning opportunity in?",
        "Share something in nature that you're grateful for and how it impacts your wellbeing.",
        "What personal quality or strength are you grateful to have, especially during difficult times?"
      ][i],
      createdAt: addDays(new Date(), i).toISOString(),
      scheduledFor: addDays(new Date(), i).toISOString(),
      isUsed: false
    })
  }
  
  return prompts
}

const generateMockGoals = () => {
  const { user } = useAuthStore.getState()
  return [
    {
      goalId: 'goal-1',
      circleId: 'circle-1',
      userId: user.userId,
      title: 'Daily 5-minute meditation',
      description: 'Practice mindful meditation for at least 5 minutes every day',
      createdAt: subDays(new Date(), 15).toISOString(),
      targetDate: addDays(new Date(), 15).toISOString(),
      status: 'in-progress',
      progress: 50,
      isPrivate: false
    },
    {
      goalId: 'goal-2',
      circleId: 'circle-3',
      userId: user.userId,
      title: 'Gratitude journaling',
      description: 'Write down 3 things I\'m grateful for each day',
      createdAt: subDays(new Date(), 10).toISOString(),
      targetDate: addDays(new Date(), 20).toISOString(),
      status: 'in-progress',
      progress: 30,
      isPrivate: false
    }
  ]
}

const generateMockCheckIns = () => {
  const { user } = useAuthStore.getState()
  const checkIns = []
  
  // Generate check-ins for the meditation goal
  for (let i = 10; i >= 0; i--) {
    if (i % 2 === 0) { // Check-in every other day
      checkIns.push({
        checkInId: `checkin-goal1-${i}`,
        goalId: 'goal-1',
        userId: user.userId,
        date: format(subDays(new Date(), i), 'yyyy-MM-dd'),
        isCompleted: true,
        notes: i % 4 === 0 ? 'Felt more focused today after meditation' : '',
        createdAt: subDays(new Date(), i).toISOString()
      })
    }
  }
  
  // Generate check-ins for the gratitude goal
  for (let i = 10; i >= 0; i--) {
    if (i % 3 !== 0) { // Skip every third day to show imperfect streak
      checkIns.push({
        checkInId: `checkin-goal2-${i}`,
        goalId: 'goal-2',
        userId: user.userId,
        date: format(subDays(new Date(), i), 'yyyy-MM-dd'),
        isCompleted: true,
        notes: i % 5 === 0 ? 'Noticing more positive moments throughout the day' : '',
        createdAt: subDays(new Date(), i).toISOString()
      })
    }
  }
  
  return checkIns
}

export const useCircleStore = create((set, get) => ({
  // State
  circles: generateMockCircles(),
  memberships: generateMockMemberships(),
  messages: generateMockMessages(),
  prompts: generateMockPrompts(),
  goals: generateMockGoals(),
  checkIns: generateMockCheckIns(),
  activeCircleId: null,
  matchingPreferences: {
    interests: ['mindfulness', 'gratitude', 'stress-management'],
    goalAlignment: 'similar', // 'similar', 'diverse', 'any'
    activityLevel: 'moderate', // 'light', 'moderate', 'active'
    privacyLevel: 'balanced', // 'open', 'balanced', 'private'
    circleSize: 'medium', // 'small', 'medium', 'large'
  },
  privacySettings: {
    shareEmotionalData: true,
    shareActivities: true,
    shareInsights: false,
    allowAnonymousMode: false,
    visibilityPreference: 'members-only', // 'public', 'members-only', 'private'
  },
  
  // Actions
  setActiveCircle: (circleId) => set({ activeCircleId: circleId }),
  
  getActiveCircle: () => {
    const { activeCircleId, circles } = get()
    return circles.find(circle => circle.circleId === activeCircleId)
  },
  
  getUserCircles: () => {
    const { memberships, circles } = get()
    const { user } = useAuthStore.getState()
    
    const userMemberships = memberships.filter(
      membership => membership.userId === user.userId && membership.isActive
    )
    
    return userMemberships.map(membership => 
      circles.find(circle => circle.circleId === membership.circleId)
    ).filter(Boolean)
  },
  
  getRecommendedCircles: () => {
    const { circles, memberships, matchingPreferences } = get()
    const { user } = useAuthStore.getState()
    
    // Get circles the user is not already a member of
    const userCircleIds = memberships
      .filter(m => m.userId === user.userId)
      .map(m => m.circleId)
    
    const availableCircles = circles.filter(
      circle => !userCircleIds.includes(circle.circleId) && 
                circle.currentMembers < circle.maxMembers
    )
    
    // Simple matching algorithm based on tags and preferences
    return availableCircles
      .map(circle => {
        let score = 0
        // Match based on interests/tags
        matchingPreferences.interests.forEach(interest => {
          if (circle.tags.includes(interest)) score += 2
        })
        
        // Match based on circle size preference
        if (
          (matchingPreferences.circleSize === 'small' && circle.maxMembers <= 5) ||
          (matchingPreferences.circleSize === 'medium' && circle.maxMembers > 5 && circle.maxMembers <= 10) ||
          (matchingPreferences.circleSize === 'large' && circle.maxMembers > 10)
        ) {
          score += 1
        }
        
        // Match based on privacy preference
        if (
          (matchingPreferences.privacyLevel === 'open' && circle.isPublic) ||
          (matchingPreferences.privacyLevel === 'private' && !circle.isPublic)
        ) {
          score += 1
        }
        
        return { ...circle, matchScore: score }
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3) // Return top 3 matches
  },
  
  getCircleMessages: (circleId) => {
    const { messages } = get()
    return messages
      .filter(message => message.circleId === circleId)
      .sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt))
  },
  
  getCirclePrompts: (circleId) => {
    const { prompts } = get()
    return prompts
      .filter(prompt => prompt.circleId === circleId)
      .sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor))
  },
  
  getUpcomingPrompt: (circleId) => {
    const { prompts } = get()
    const now = new Date()
    
    return prompts
      .filter(prompt => 
        prompt.circleId === circleId && 
        !prompt.isUsed && 
        new Date(prompt.scheduledFor) > now
      )
      .sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor))[0]
  },
  
  getCurrentPrompt: (circleId) => {
    const { prompts } = get()
    const today = format(new Date(), 'yyyy-MM-dd')
    
    return prompts.find(prompt => 
      prompt.circleId === circleId && 
      format(new Date(prompt.scheduledFor), 'yyyy-MM-dd') === today
    )
  },
  
  getCircleGoals: (circleId) => {
    const { goals } = get()
    return goals.filter(goal => goal.circleId === circleId)
  },
  
  getUserGoals: () => {
    const { goals } = get()
    const { user } = useAuthStore.getState()
    return goals.filter(goal => goal.userId === user.userId)
  },
  
  getGoalCheckIns: (goalId) => {
    const { checkIns } = get()
    return checkIns
      .filter(checkIn => checkIn.goalId === goalId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  },
  
  getCircleMembers: (circleId) => {
    const { memberships } = get()
    return memberships.filter(
      membership => membership.circleId === circleId && membership.isActive
    )
  },
  
  createCircle: (circleData) => set(state => ({
    circles: [...state.circles, {
      ...circleData,
      circleId: generateId('circle'),
      createdAt: new Date().toISOString(),
      currentMembers: 1
    }]
  })),
  
  joinCircle: (circleId) => set(state => {
    const { user } = useAuthStore.getState()
    
    // Check if user is already a member
    const existingMembership = state.memberships.find(
      m => m.circleId === circleId && m.userId === user.userId
    )
    
    if (existingMembership) {
      // Reactivate membership if it exists but is inactive
      if (!existingMembership.isActive) {
        return {
          memberships: state.memberships.map(m => 
            m.membershipId === existingMembership.membershipId
              ? { ...m, isActive: true, lastActive: new Date().toISOString() }
              : m
          ),
          circles: state.circles.map(c => 
            c.circleId === circleId
              ? { ...c, currentMembers: c.currentMembers + 1 }
              : c
          )
        }
      }
      return state // No change if already an active member
    }
    
    // Create new membership
    return {
      memberships: [...state.memberships, {
        membershipId: generateId('membership'),
        userId: user.userId,
        circleId,
        joinedAt: new Date().toISOString(),
        role: 'member',
        isActive: true,
        lastActive: new Date().toISOString()
      }],
      circles: state.circles.map(c => 
        c.circleId === circleId
          ? { ...c, currentMembers: c.currentMembers + 1 }
          : c
      )
    }
  }),
  
  leaveCircle: (circleId) => set(state => {
    const { user } = useAuthStore.getState()
    
    return {
      memberships: state.memberships.map(m => 
        m.circleId === circleId && m.userId === user.userId
          ? { ...m, isActive: false }
          : m
      ),
      circles: state.circles.map(c => 
        c.circleId === circleId
          ? { ...c, currentMembers: Math.max(0, c.currentMembers - 1) }
          : c
      )
    }
  }),
  
  sendMessage: (circleId, content) => set(state => {
    const { user } = useAuthStore.getState()
    
    return {
      messages: [...state.messages, {
        messageId: generateId('message'),
        circleId,
        senderId: user.userId,
        senderName: user.username,
        isAI: false,
        content,
        sentAt: new Date().toISOString(),
        reactions: []
      }]
    }
  }),
  
  addReaction: (messageId, reaction) => set(state => ({
    messages: state.messages.map(message => 
      message.messageId === messageId
        ? { 
            ...message, 
            reactions: [...message.reactions, {
              userId: useAuthStore.getState().user.userId,
              reaction,
              createdAt: new Date().toISOString()
            }]
          }
        : message
    )
  })),
  
  createGoal: (goalData) => set(state => ({
    goals: [...state.goals, {
      ...goalData,
      goalId: generateId('goal'),
      userId: useAuthStore.getState().user.userId,
      createdAt: new Date().toISOString(),
      status: 'in-progress',
      progress: 0
    }]
  })),
  
  updateGoal: (goalId, updates) => set(state => ({
    goals: state.goals.map(goal => 
      goal.goalId === goalId
        ? { ...goal, ...updates }
        : goal
    )
  })),
  
  addCheckIn: (goalId, isCompleted, notes = '') => set(state => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const { user } = useAuthStore.getState()
    
    // Check if already checked in today
    const existingCheckIn = state.checkIns.find(
      checkIn => checkIn.goalId === goalId && 
                 checkIn.date === today &&
                 checkIn.userId === user.userId
    )
    
    if (existingCheckIn) {
      return {
        checkIns: state.checkIns.map(checkIn => 
          checkIn.checkInId === existingCheckIn.checkInId
            ? { ...checkIn, isCompleted, notes, createdAt: new Date().toISOString() }
            : checkIn
        )
      }
    }
    
    return {
      checkIns: [...state.checkIns, {
        checkInId: generateId('checkin'),
        goalId,
        userId: user.userId,
        date: today,
        isCompleted,
        notes,
        createdAt: new Date().toISOString()
      }]
    }
  }),
  
  updateMatchingPreferences: (preferences) => set(state => ({
    matchingPreferences: { ...state.matchingPreferences, ...preferences }
  })),
  
  updatePrivacySettings: (settings) => set(state => ({
    privacySettings: { ...state.privacySettings, ...settings }
  })),
  
  // Analytics and statistics
  getCircleStats: (circleId) => {
    const { goals, checkIns, messages } = get()
    const circleGoals = goals.filter(goal => goal.circleId === circleId)
    
    // Get all check-ins for the circle's goals
    const goalIds = circleGoals.map(goal => goal.goalId)
    const circleCheckIns = checkIns.filter(checkIn => goalIds.includes(checkIn.goalId))
    
    // Get circle messages
    const circleMessages = messages.filter(message => message.circleId === circleId)
    
    return {
      totalGoals: circleGoals.length,
      completedGoals: circleGoals.filter(goal => goal.status === 'completed').length,
      checkInCompletionRate: circleCheckIns.length > 0 
        ? circleCheckIns.filter(checkIn => checkIn.isCompleted).length / circleCheckIns.length 
        : 0,
      totalMessages: circleMessages.length,
      aiMessages: circleMessages.filter(message => message.isAI).length,
      memberMessages: circleMessages.filter(message => !message.isAI).length,
      // Calculate average progress across all goals
      averageProgress: circleGoals.length > 0
        ? circleGoals.reduce((sum, goal) => sum + goal.progress, 0) / circleGoals.length
        : 0
    }
  },
  
  getUserCircleStats: () => {
    const { goals, checkIns } = get()
    const { user } = useAuthStore.getState()
    
    const userGoals = goals.filter(goal => goal.userId === user.userId)
    const userCheckIns = checkIns.filter(checkIn => checkIn.userId === user.userId)
    
    // Calculate streak
    const sortedCheckIns = [...userCheckIns]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
    
    let streak = 0
    const today = format(new Date(), 'yyyy-MM-dd')
    let currentDate = today
    
    while (streak < 30) {
      const hasCompletedCheckIn = sortedCheckIns.some(
        checkIn => checkIn.date === currentDate && checkIn.isCompleted
      )
      
      if (!hasCompletedCheckIn) break
      
      streak++
      currentDate = format(subDays(new Date(currentDate), 1), 'yyyy-MM-dd')
    }
    
    return {
      totalGoals: userGoals.length,
      completedGoals: userGoals.filter(goal => goal.status === 'completed').length,
      inProgressGoals: userGoals.filter(goal => goal.status === 'in-progress').length,
      checkInCompletionRate: userCheckIns.length > 0 
        ? userCheckIns.filter(checkIn => checkIn.isCompleted).length / userCheckIns.length 
        : 0,
      currentStreak: streak,
      // Calculate average progress across all goals
      averageProgress: userGoals.length > 0
        ? userGoals.reduce((sum, goal) => sum + goal.progress, 0) / userGoals.length
        : 0
    }
  }
}))

