import { format, addDays } from 'date-fns'

// This would normally use the OpenAI API, but for this implementation
// we'll use predefined prompts and responses

// Prompt templates for different circle types
const promptTemplates = {
  mindfulness: [
    "Take a moment to notice your breath. How does it feel? Share one observation about your current state of mind.",
    "What's one small mindful moment you experienced today? How did it affect your mood?",
    "Describe a simple mindfulness practice you could incorporate into your daily routine. What benefits might it bring?",
    "When you feel overwhelmed, what mindfulness technique helps you return to the present moment?",
    "Share one way you've noticed mindfulness changing your perspective on daily challenges.",
    "Describe a moment today when you were fully present. What did you notice that you might have otherwise missed?",
    "What's one distraction that frequently pulls you away from the present moment? How might you mindfully address it?",
    "How does your body feel right now? Take a moment to scan from head to toe and share one observation.",
    "Describe a routine activity (like brushing teeth or washing dishes) that you could practice more mindfully. How would that change the experience?",
    "What's one thing in your environment right now that you can appreciate with your full attention?"
  ],
  gratitude: [
    "What's something small that brought you joy today that you might normally overlook?",
    "Think of someone who helped you recently. What specifically are you grateful for about their support?",
    "What's one challenge you're facing that you can find a silver lining or learning opportunity in?",
    "Share something in nature that you're grateful for and how it impacts your wellbeing.",
    "What personal quality or strength are you grateful to have, especially during difficult times?",
    "Reflect on a mistake or setback that ultimately led to something positive. What are you grateful for about that experience?",
    "What's something your body allows you to do that you're grateful for today?",
    "Share a memory you're grateful to have. How does it continue to impact you?",
    "What's a simple pleasure in your daily routine that you appreciate?",
    "Who is someone that challenged you in a way that helped you grow? What specifically are you grateful for about that interaction?"
  ],
  anxiety: [
    "What's one small step you took today to manage anxiety, even if it seemed insignificant at the time?",
    "Share a grounding technique that helps when you feel anxious. How does it work for you?",
    "What's one anxious thought you've been able to reframe recently? How did the perspective shift help?",
    "Describe a physical sensation you associate with anxiety. How do you respond to it when you notice it?",
    "What's one boundary you've set (or could set) that helps reduce anxiety in your life?",
    "Share something that brought you a moment of calm today, however brief.",
    "What's one way you show yourself compassion when anxiety is high?",
    "Describe a situation where you felt anxious but moved forward anyway. What helped you take that step?",
    "What's one thing you've learned about your anxiety patterns that helps you manage them better?",
    "Share a mantra or phrase that helps you during anxious moments."
  ],
  general: [
    "What's one small win you experienced today? How did it make you feel?",
    "Share one thing you did today to take care of your emotional wellbeing.",
    "What's something you're looking forward to this week, even if it's small?",
    "Describe a moment of connection you experienced recently. How did it affect your mood?",
    "What's one thing you learned about yourself recently?",
    "Share a small act of kindness you witnessed or participated in recently.",
    "What's one healthy boundary you're working on maintaining in your life?",
    "Describe a moment when you felt proud of yourself this week.",
    "What's one way you could show yourself more compassion tomorrow?",
    "Share something that made you smile today."
  ]
}

// Response templates for different types of user messages
const responseTemplates = {
  encouragement: [
    "Thank you for sharing that. It takes courage to be vulnerable, and your openness creates space for others to do the same.",
    "I appreciate your reflection. Noticing these patterns is an important part of building emotional resilience.",
    "That's a valuable insight. Small steps like this consistently build toward meaningful change.",
    "Thank you for bringing that perspective to our circle. Your experience might resonate with others here too.",
    "I'm noticing the self-awareness in your reflection. That awareness itself is a powerful tool for growth."
  ],
  questions: [
    "What helped you notice that pattern in yourself?",
    "How might you extend that same compassion to yourself in other situations?",
    "What small step could you take tomorrow to build on this insight?",
    "How does sharing this experience in our circle feel different from keeping it to yourself?",
    "What would it look like to celebrate this small win in a meaningful way?"
  ],
  validation: [
    "That sounds really challenging. It makes sense that you'd feel that way given what you're navigating.",
    "I'm hearing how difficult this has been. Your feelings are completely valid.",
    "It's understandable to struggle with that. Many of us have similar experiences, though the details differ.",
    "Thank you for trusting the circle with this. It's okay to have these feelings.",
    "That's a lot to carry. Your resilience in facing this is remarkable, even when it doesn't feel that way."
  ],
  summary: [
    "I'm noticing themes of growth and self-awareness in our circle today. Each of you is approaching your journey with such thoughtfulness.",
    "Today's reflections highlight how small moments of mindfulness can create ripples of positive change in our lives.",
    "I'm struck by the compassion in this circle - both for yourselves and each other. This supportive environment is something you've created together.",
    "Your reflections today show how interconnected our emotional experiences are with our daily habits and choices.",
    "Today's conversation reveals how each of you is developing your own unique toolkit for emotional resilience."
  ]
}

// Circle types mapped to their primary focus
const circleTypes = {
  'circle-1': 'mindfulness',
  'circle-2': 'anxiety',
  'circle-3': 'gratitude',
  // Default to general for any other circles
}

class AIFacilitator {
  // Generate a daily prompt for a specific circle
  generateDailyPrompt(circleId) {
    const circleType = circleTypes[circleId] || 'general'
    const templates = promptTemplates[circleType]
    
    // Select a prompt based on the day to ensure variety
    const dayOfYear = this._getDayOfYear()
    const promptIndex = dayOfYear % templates.length
    
    return {
      promptId: `prompt-${circleId}-${Date.now()}`,
      circleId,
      content: templates[promptIndex],
      createdAt: new Date().toISOString(),
      scheduledFor: new Date().toISOString(),
      isUsed: false
    }
  }
  
  // Generate prompts for the next several days
  generateUpcomingPrompts(circleId, days = 5) {
    const circleType = circleTypes[circleId] || 'general'
    const templates = promptTemplates[circleType]
    const prompts = []
    
    for (let i = 0; i < days; i++) {
      const date = addDays(new Date(), i)
      const dayOfYear = this._getDayOfYear(date)
      const promptIndex = (dayOfYear + i) % templates.length
      
      prompts.push({
        promptId: `prompt-${circleId}-${Date.now()}-${i}`,
        circleId,
        content: templates[promptIndex],
        createdAt: new Date().toISOString(),
        scheduledFor: date.toISOString(),
        isUsed: false
      })
    }
    
    return prompts
  }
  
  // Generate a response to a user message
  generateResponse(message, circleId, messageHistory = []) {
    // Analyze message content to determine appropriate response type
    // This would normally use NLP/sentiment analysis via the OpenAI API
    
    // Simple keyword-based approach for demo purposes
    const messageText = message.toLowerCase()
    let responseType = 'encouragement' // default
    
    if (messageText.includes('?') || 
        messageText.includes('wonder') || 
        messageText.includes('curious')) {
      responseType = 'questions'
    } 
    else if (messageText.includes('sad') || 
             messageText.includes('anxious') || 
             messageText.includes('worried') ||
             messageText.includes('stressed')) {
      responseType = 'validation'
    }
    else if (messageHistory.length > 5) {
      // Occasionally provide a summary response after several messages
      if (Math.random() < 0.3) {
        responseType = 'summary'
      }
    }
    
    // Select a response template
    const templates = responseTemplates[responseType]
    const responseIndex = Math.floor(Math.random() * templates.length)
    
    return {
      messageId: `ai-message-${Date.now()}`,
      circleId,
      senderId: 'ai-facilitator',
      senderName: 'AI Facilitator',
      isAI: true,
      content: templates[responseIndex],
      sentAt: new Date().toISOString(),
      reactions: []
    }
  }
  
  // Generate a check-in reminder
  generateCheckInReminder(goalId, userName) {
    return {
      messageId: `reminder-${Date.now()}`,
      circleId: null, // This could be sent as a direct message
      senderId: 'ai-facilitator',
      senderName: 'AI Facilitator',
      isAI: true,
      content: `Hi ${userName}, just a gentle reminder to check in on your goal today. How's your progress coming along?`,
      sentAt: new Date().toISOString(),
      reactions: []
    }
  }
  
  // Generate a milestone celebration message
  generateMilestoneCelebration(goalId, milestone, userName, circleId) {
    const celebrations = [
      `Congratulations, ${userName}! You've reached ${milestone}% of your goal. That's a significant achievement worth celebrating.`,
      `Amazing progress, ${userName}! Hitting ${milestone}% of your goal shows your dedication and persistence.`,
      `${userName}, reaching ${milestone}% of your goal is a meaningful milestone. How does it feel to see your consistent efforts paying off?`,
      `The circle celebrates with you, ${userName}! Reaching ${milestone}% of your goal is inspiring to all of us.`,
      `What an achievement, ${userName}! ${milestone}% progress demonstrates your commitment to growth and resilience.`
    ]
    
    const index = Math.floor(Math.random() * celebrations.length)
    
    return {
      messageId: `celebration-${Date.now()}`,
      circleId,
      senderId: 'ai-facilitator',
      senderName: 'AI Facilitator',
      isAI: true,
      content: celebrations[index],
      sentAt: new Date().toISOString(),
      reactions: []
    }
  }
  
  // Generate a welcome message for a new circle member
  generateWelcomeMessage(userName, circleId) {
    const circleType = circleTypes[circleId] || 'general'
    
    const welcomeMessages = {
      mindfulness: `Welcome to our Mindfulness Circle, ${userName}! This is a space to develop present-moment awareness and share your mindfulness journey. We're glad you're here.`,
      gratitude: `Welcome to our Gratitude Circle, ${userName}! We focus on appreciating the good in our lives, big and small. We're excited to have your perspective.`,
      anxiety: `Welcome to our Anxiety Support Circle, ${userName}. This is a safe space to share experiences and strategies for managing anxiety. We're here to support each other.`,
      general: `Welcome to our Support Circle, ${userName}! This is a space for sharing, growth, and mutual support on our emotional resilience journeys. We're glad you've joined us.`
    }
    
    return {
      messageId: `welcome-${Date.now()}`,
      circleId,
      senderId: 'ai-facilitator',
      senderName: 'AI Facilitator',
      isAI: true,
      content: welcomeMessages[circleType],
      sentAt: new Date().toISOString(),
      reactions: []
    }
  }
  
  // Helper method to get day of year (1-366)
  _getDayOfYear(date = new Date()) {
    const start = new Date(date.getFullYear(), 0, 0)
    const diff = date - start
    const oneDay = 1000 * 60 * 60 * 24
    return Math.floor(diff / oneDay)
  }
}

// Export a singleton instance
export const aiFacilitator = new AIFacilitator()

