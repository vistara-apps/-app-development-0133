/**
 * Insight Generator Service
 * 
 * This service provides mock insights and reports for demo purposes.
 */

/**
 * Gets mock insights for demo
 * @returns {Array} - Mock insights
 */
export function getMockInsights() {
  return [
    {
      insightId: 'insight-1',
      title: 'Weekly Pattern Detected',
      content: 'You tend to feel more positive on weekends and Wednesdays. Consider scheduling challenging tasks on these days when your resilience is naturally higher.',
      confidence: 'High',
      category: 'pattern',
      suggestions: [
        'Schedule important meetings on Wednesdays when possible',
        'Use weekends for creative or challenging projects'
      ],
      generatedAt: new Date(Date.now() - 86400000).toISOString(),
      viewed: true
    },
    {
      insightId: 'insight-2',
      title: 'Activity Recommendation',
      content: 'Based on your preferences, mindfulness activities have been most effective for you. Try incorporating them during stressful periods.',
      confidence: 'Medium',
      category: 'recommendation',
      suggestions: [
        'Try a 5-minute mindfulness session before stressful meetings',
        'Use the breathing exercises when you notice stress building'
      ],
      generatedAt: new Date(Date.now() - 172800000).toISOString(),
      viewed: true
    },
    {
      insightId: 'insight-3',
      title: 'Emotional Recovery',
      content: 'Your data shows you typically recover from negative emotional states within 2-3 days when you engage with activities consistently.',
      confidence: 'High',
      category: 'observation',
      suggestions: [
        'When feeling down, remember that your typical recovery time is 2-3 days',
        'Maintain activity consistency especially during challenging periods'
      ],
      generatedAt: new Date(Date.now() - 259200000).toISOString(),
      viewed: true
    }
  ];
}

/**
 * Gets a mock weekly report for demo
 * @returns {Object} - Mock weekly report
 */
export function getMockWeeklyReport() {
  // Calculate date range
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);
  
  return {
    reportId: 'report-1',
    weekStart: weekStart.toISOString(),
    weekEnd: today.toISOString(),
    summary: {
      title: 'Your Week in Review',
      content: 'This week showed improved emotional resilience compared to last week. You had more positive days and engaged with activities consistently. Your stress management is showing progress.'
    },
    emotionalTrends: {
      content: 'Your emotional state was more stable this week, with fewer fluctuations. You experienced more positive emotions on weekdays, which is a change from your previous pattern.'
    },
    stressPatterns: {
      content: 'Stress levels peaked on Tuesday and Thursday, often correlated with your work meetings. Your recovery time has improved from 3 days to 1-2 days.'
    },
    activityEffectiveness: {
      content: 'Mindfulness activities were most effective at reducing your stress levels. Physical activities helped boost your energy on low-energy days.'
    },
    progressMetrics: {
      checkInRate: 85,
      activityCompletionRate: 70,
      averageEmotionalState: 3.8,
      recoveryTime: 36
    },
    recommendations: [
      {
        title: 'Schedule Mindfulness Before Meetings',
        content: 'Try a 5-minute mindfulness session before important meetings to reduce anticipatory stress.'
      },
      {
        title: 'Morning Energy Boost',
        content: 'Your data shows lower energy in the mornings. Consider a short morning activity to boost your energy levels for the day.'
      },
      {
        title: 'Stress Buffer Days',
        content: 'Schedule buffer time after high-stress days to allow for recovery and prevent stress accumulation.'
      }
    ],
    generatedAt: new Date(Date.now() - 86400000).toISOString(),
    viewed: false
  };
}

/**
 * Gets mock nudges for demo
 * @returns {Array} - Mock nudges
 */
export function getMockNudges() {
  return [
    {
      nudgeId: 'nudge-1',
      type: 'breathing',
      content: 'Taking a few deep breaths can help reduce your stress levels. Try a 2-minute breathing exercise.',
      actionDescription: 'Start Breathing Exercise',
      actionable: true,
      priority: 'high',
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      createdAt: new Date().toISOString(),
      viewed: false,
      actioned: false,
      dismissed: false
    },
    {
      nudgeId: 'nudge-2',
      type: 'mindfulness',
      content: 'A quick mindfulness moment can help center your thoughts. Take 3 minutes to practice mindful awareness.',
      actionDescription: 'Start Mindfulness',
      actionable: true,
      priority: 'normal',
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      viewed: true,
      actioned: false,
      dismissed: false
    },
    {
      nudgeId: 'nudge-3',
      type: 'perspective',
      content: 'Remember that challenging situations are temporary. Try reframing your current situation.',
      actionDescription: 'Reframe Perspective',
      actionable: true,
      priority: 'normal',
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      viewed: true,
      actioned: true,
      dismissed: false
    }
  ];
}

export default {
  getMockInsights,
  getMockWeeklyReport,
  getMockNudges
};

