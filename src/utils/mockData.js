import { format, subDays } from 'date-fns'

/**
 * Generate mock daily entries
 * @returns {Array} Array of mock daily entries
 */
export const generateMockEntries = () => {
  const entries = []
  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
    const emotionalStates = ['positive', 'neutral', 'negative']
    const state = emotionalStates[Math.floor(Math.random() * 3)]
    
    entries.push({
      id: `entry-${i}`,
      user_id: 'demo-user-1',
      date,
      emotional_state: state,
      notes: i < 5 ? `Feeling ${state} today` : '',
      created_at: new Date(date).toISOString(),
      updated_at: new Date(date).toISOString()
    })
  }
  return entries
}

/**
 * Generate mock activities
 * @returns {Array} Array of mock activities
 */
export const generateMockActivities = () => [
  {
    id: 'activity-1',
    name: 'Mindful Breathing',
    description: 'A 5-minute guided breathing exercise to center yourself',
    type: 'mindfulness',
    guide_content: 'Find a comfortable position. Close your eyes and focus on your breath...',
    target_emotion: 'calm',
    premium_only: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'activity-2',
    name: 'Gratitude Journal',
    description: 'Write down three things you\'re grateful for today',
    type: 'gratitude',
    guide_content: 'Think about your day and identify three things, big or small, that you\'re grateful for...',
    target_emotion: 'positive',
    premium_only: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'activity-3',
    name: 'Cognitive Reframing',
    description: 'Challenge negative thoughts with a more balanced perspective',
    type: 'cognitive',
    guide_content: 'Identify a negative thought. Ask yourself: Is this thought helpful? What evidence supports or contradicts it?',
    target_emotion: 'balanced',
    premium_only: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'activity-4',
    name: 'Progressive Muscle Relaxation',
    description: 'Release physical tension through systematic muscle relaxation',
    type: 'relaxation',
    guide_content: 'Starting with your toes, tense each muscle group for 5 seconds, then release...',
    target_emotion: 'relaxed',
    premium_only: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

/**
 * Generate mock activity logs
 * @returns {Array} Array of mock activity logs
 */
export const generateMockActivityLogs = () => {
  const logs = []
  const activities = generateMockActivities()
  
  for (let i = 14; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
    const activity = activities[Math.floor(Math.random() * activities.length)]
    
    if (Math.random() > 0.3) { // 70% chance of activity completion
      logs.push({
        id: `log-${i}`,
        user_id: 'demo-user-1',
        activity_id: activity.id,
        completion_date: date,
        rating: Math.floor(Math.random() * 5) + 1,
        feedback: Math.random() > 0.7 ? 'This helped me feel more centered' : '',
        created_at: new Date(date).toISOString(),
        updated_at: new Date(date).toISOString(),
        activities: activity
      })
    }
  }
  return logs
}

