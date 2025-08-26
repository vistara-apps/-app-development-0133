import { create } from 'zustand'
import { format, subDays } from 'date-fns'
import { useAuthStore } from './authStore'
import { useDataStore } from './dataStore'

// Mock users for circles
const mockUsers = [
  {
    userId: 'user-2',
    username: 'Sarah Johnson',
    avatarUrl: 'https://i.pravatar.cc/150?img=32'
  },
  {
    userId: 'user-3',
    username: 'Michael Chen',
    avatarUrl: 'https://i.pravatar.cc/150?img=68'
  },
  {
    userId: 'user-4',
    username: 'Emily Rodriguez',
    avatarUrl: 'https://i.pravatar.cc/150?img=47'
  },
  {
    userId: 'user-5',
    username: 'David Kim',
    avatarUrl: 'https://i.pravatar.cc/150?img=12'
  },
  {
    userId: 'user-6',
    username: 'Jessica Taylor',
    avatarUrl: 'https://i.pravatar.cc/150?img=25'
  }
]

// Generate mock support circles
const generateMockCircles = () => {
  const focusAreas = ['Stress Management', 'Anxiety Relief', 'Positive Thinking', 'Work-Life Balance', 'Personal Growth']
  
  return [
    {
      circleId: 'circle-1',
      name: 'Mindfulness Masters',
      description: 'A group focused on daily mindfulness practices and supporting each other through stressful periods.',
      focusArea: focusAreas[0],
      createdAt: subDays(new Date(), 30).toISOString(),
      createdBy: 'user-2',
      isPrivate: false,
      memberLimit: 10,
      promptOfTheDay: 'What is one small thing you did today to take care of yourself?'
    },
    {
      circleId: 'circle-2',
      name: 'Gratitude Gang',
      description: 'Share daily gratitude practices and celebrate small wins together.',
      focusArea: focusAreas[2],
      createdAt: subDays(new Date(), 25).toISOString(),
      createdBy: 'user-3',
      isPrivate: true,
      memberLimit: 8,
      promptOfTheDay: 'Share three things you're grateful for today.'
    },
    {
      circleId: 'circle-3',
      name: 'Work-Life Harmony',
      description: 'Support for maintaining balance between professional demands and personal wellbeing.',
      focusArea: focusAreas[3],
      createdAt: subDays(new Date(), 15).toISOString(),
      createdBy: 'user-4',
      isPrivate: false,
      memberLimit: 12,
      promptOfTheDay: 'What boundaries did you maintain today?'
    }
  ]
}

// Generate mock circle memberships
const generateMockMemberships = () => {
  const circles = generateMockCircles()
  const memberships = []
  
  // Current user is a member of the first circle
  memberships.push({
    membershipId: 'membership-1',
    circleId: circles[0].circleId,
    userId: 'demo-user-1',
    joinedAt: subDays(new Date(), 28).toISOString(),
    role: 'member',
    privacySettings: {
      shareEmotionalState: true,
      shareActivityCompletion: true,
      shareNotes: false
    }
  })
  
  // Add other users to circles
  circles.forEach((circle, circleIndex) => {
    // Add creator as admin
    memberships.push({
      membershipId: `membership-creator-${circleIndex + 1}`,
      circleId: circle.circleId,
      userId: circle.createdBy,
      joinedAt: circle.createdAt,
      role: 'admin',
      privacySettings: {
        shareEmotionalState: true,
        shareActivityCompletion: true,
        shareNotes: true
      }
    })
    
    // Add 2-4 random members to each circle
    const memberCount = Math.floor(Math.random() * 3) + 2
    const availableUsers = [...mockUsers].filter(user => user.userId !== circle.createdBy)
    
    for (let i = 0; i < memberCount && i < availableUsers.length; i++) {
      const user = availableUsers[i]
      memberships.push({
        membershipId: `membership-${circleIndex + 1}-${i + 1}`,
        circleId: circle.circleId,
        userId: user.userId,
        joinedAt: subDays(new Date(), Math.floor(Math.random() * 20) + 5).toISOString(),
        role: 'member',
        privacySettings: {
          shareEmotionalState: Math.random() > 0.3,
          shareActivityCompletion: Math.random() > 0.2,
          shareNotes: Math.random() > 0.7
        }
      })
    }
  })
  
  return memberships
}

// Generate mock messages for circles
const generateMockMessages = () => {
  const circles = generateMockCircles()
  const messages = []
  
  circles.forEach(circle => {
    // Get memberships for this circle
    const circleMemberships = generateMockMemberships().filter(m => m.circleId === circle.circleId)
    const memberIds = circleMemberships.map(m => m.userId)
    
    // Generate 10-20 messages for each circle
    const messageCount = Math.floor(Math.random() * 11) + 10
    
    for (let i = 0; i < messageCount; i++) {
      const daysAgo = Math.floor(Math.random() * 10)
      const hoursAgo = Math.floor(Math.random() * 24)
      const minutesAgo = Math.floor(Math.random() * 60)
      
      const date = new Date()
      date.setDate(date.getDate() - daysAgo)
      date.setHours(date.getHours() - hoursAgo)
      date.setMinutes(date.getMinutes() - minutesAgo)
      
      const senderId = memberIds[Math.floor(Math.random() * memberIds.length)]
      
      // Message templates
      const messageTemplates = [
        'Just completed a mindfulness session. Feeling much calmer now!',
        'Had a tough day today. Could use some support.',
        'Grateful for this circle. You all make such a difference!',
        'Anyone have tips for dealing with work stress?',
        'Completed my daily gratitude practice. It really shifts my perspective.',
        'Struggling with motivation today. Any suggestions?',
        'Just wanted to check in and see how everyone is doing.',
        'Sharing a win: I maintained my boundaries at work today!',
        'Found a great new meditation app. Happy to share if anyone's interested.',
        'Reminder to be kind to yourself today. Progress isn't always linear.'
      ]
      
      messages.push({
        messageId: `message-${circle.circleId}-${i}`,
        circleId: circle.circleId,
        userId: senderId,
        content: messageTemplates[Math.floor(Math.random() * messageTemplates.length)],
        createdAt: date.toISOString(),
        reactions: []
      })
    }
    
    // Add a message from the current user in the first circle
    if (circle.circleId === circles[0].circleId) {
      messages.push({
        messageId: `message-${circle.circleId}-current-user`,
        circleId: circle.circleId,
        userId: 'demo-user-1',
        content: 'Hi everyone! Excited to be part of this circle and work on mindfulness together.',
        createdAt: subDays(new Date(), 27).toISOString(),
        reactions: []
      })
    }
  })
  
  // Sort messages by date
  return messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
}

export const useCirclesStore = create((set, get) => ({
  circles: generateMockCircles(),
  memberships: generateMockMemberships(),
  messages: generateMockMessages(),
  users: [...mockUsers, {
    userId: 'demo-user-1',
    username: useAuthStore.getState().user.username,
    avatarUrl: 'https://i.pravatar.cc/150?img=57'
  }],
  
  // Get all circles
  getAllCircles: () => get().circles,
  
  // Get circles the current user is a member of
  getUserCircles: () => {
    const currentUserId = useAuthStore.getState().user.userId
    const userMemberships = get().memberships.filter(m => m.userId === currentUserId)
    return get().circles.filter(circle => 
      userMemberships.some(membership => membership.circleId === circle.circleId)
    )
  },
  
  // Get a specific circle by ID
  getCircleById: (circleId) => get().circles.find(c => c.circleId === circleId),
  
  // Get members of a circle
  getCircleMembers: (circleId) => {
    const circleMemberships = get().memberships.filter(m => m.circleId === circleId)
    return circleMemberships.map(membership => {
      const user = get().users.find(u => u.userId === membership.userId)
      return {
        ...user,
        role: membership.role,
        joinedAt: membership.joinedAt
      }
    })
  },
  
  // Get messages for a circle
  getCircleMessages: (circleId) => {
    const messages = get().messages.filter(m => m.circleId === circleId)
    return messages.map(message => {
      const user = get().users.find(u => u.userId === message.userId)
      return {
        ...message,
        user
      }
    })
  },
  
  // Get user's membership in a circle
  getUserMembership: (circleId) => {
    const currentUserId = useAuthStore.getState().user.userId
    return get().memberships.find(m => m.circleId === circleId && m.userId === currentUserId)
  },
  
  // Create a new circle
  createCircle: (circleData) => set(state => {
    const currentUserId = useAuthStore.getState().user.userId
    const newCircle = {
      ...circleData,
      circleId: `circle-${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: currentUserId
    }
    
    // Create membership for creator
    const newMembership = {
      membershipId: `membership-${Date.now()}`,
      circleId: newCircle.circleId,
      userId: currentUserId,
      joinedAt: new Date().toISOString(),
      role: 'admin',
      privacySettings: {
        shareEmotionalState: true,
        shareActivityCompletion: true,
        shareNotes: false
      }
    }
    
    return {
      circles: [...state.circles, newCircle],
      memberships: [...state.memberships, newMembership]
    }
  }),
  
  // Join a circle
  joinCircle: (circleId) => set(state => {
    const currentUserId = useAuthStore.getState().user.userId
    
    // Check if already a member
    const existingMembership = state.memberships.find(
      m => m.circleId === circleId && m.userId === currentUserId
    )
    
    if (existingMembership) return state
    
    const newMembership = {
      membershipId: `membership-${Date.now()}`,
      circleId,
      userId: currentUserId,
      joinedAt: new Date().toISOString(),
      role: 'member',
      privacySettings: {
        shareEmotionalState: true,
        shareActivityCompletion: true,
        shareNotes: false
      }
    }
    
    return {
      memberships: [...state.memberships, newMembership]
    }
  }),
  
  // Leave a circle
  leaveCircle: (circleId) => set(state => {
    const currentUserId = useAuthStore.getState().user.userId
    return {
      memberships: state.memberships.filter(
        m => !(m.circleId === circleId && m.userId === currentUserId)
      )
    }
  }),
  
  // Send a message to a circle
  sendMessage: (circleId, content) => set(state => {
    const currentUserId = useAuthStore.getState().user.userId
    const currentUser = state.users.find(u => u.userId === currentUserId)
    
    const newMessage = {
      messageId: `message-${Date.now()}`,
      circleId,
      userId: currentUserId,
      content,
      createdAt: new Date().toISOString(),
      reactions: [],
      user: currentUser
    }
    
    return {
      messages: [...state.messages, newMessage]
    }
  }),
  
  // Update privacy settings
  updatePrivacySettings: (circleId, settings) => set(state => {
    const currentUserId = useAuthStore.getState().user.userId
    
    return {
      memberships: state.memberships.map(membership => {
        if (membership.circleId === circleId && membership.userId === currentUserId) {
          return {
            ...membership,
            privacySettings: {
              ...membership.privacySettings,
              ...settings
            }
          }
        }
        return membership
      })
    }
  }),
  
  // Update circle prompt of the day
  updateCirclePrompt: (circleId, prompt) => set(state => {
    return {
      circles: state.circles.map(circle => {
        if (circle.circleId === circleId) {
          return {
            ...circle,
            promptOfTheDay: prompt
          }
        }
        return circle
      })
    }
  }),
  
  // Get circle progress data
  getCircleProgressData: (circleId) => {
    const members = get().getCircleMembers(circleId)
    const memberships = get().memberships.filter(m => m.circleId === circleId)
    const dataStore = useDataStore.getState()
    
    // Calculate activity completion rate for the past 7 days
    const activityData = []
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
      
      // Count members who completed activities on this date
      let completedCount = 0
      members.forEach(member => {
        const membership = memberships.find(m => m.userId === member.userId)
        
        // Only count if they share activity completion
        if (membership && membership.privacySettings.shareActivityCompletion) {
          const hasActivity = dataStore.activityLogs.some(
            log => log.userId === member.userId && log.completionDate === date
          )
          if (hasActivity) completedCount++
        }
      })
      
      activityData.push({
        date: format(new Date(date), 'MM/dd'),
        value: completedCount / members.length
      })
    }
    
    // Calculate emotional state trends
    const emotionalData = {
      positive: 0,
      neutral: 0,
      negative: 0
    }
    
    members.forEach(member => {
      const membership = memberships.find(m => m.userId === member.userId)
      
      // Only count if they share emotional state
      if (membership && membership.privacySettings.shareEmotionalState) {
        const recentEntries = dataStore.dailyEntries
          .filter(entry => entry.userId === member.userId)
          .slice(-7)
        
        recentEntries.forEach(entry => {
          emotionalData[entry.emotionalState]++
        })
      }
    })
    
    // Calculate streak data
    const streakData = []
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dateStr = format(date, 'yyyy-MM-dd')
      
      // Count members who logged entries on this date
      let entryCount = 0
      members.forEach(member => {
        const membership = memberships.find(m => m.userId === member.userId)
        
        // Only count if they share emotional state
        if (membership && membership.privacySettings.shareEmotionalState) {
          const hasEntry = dataStore.dailyEntries.some(
            entry => entry.userId === member.userId && entry.date === dateStr
          )
          if (hasEntry) entryCount++
        }
      })
      
      streakData.push({
        label: format(date, 'EEE'),
        value: format(date, 'd'),
        completedPercentage: members.length > 0 ? (entryCount / members.length) * 100 : 0
      })
    }
    
    return {
      activityData,
      emotionalData,
      streakData
    }
  }
}))

