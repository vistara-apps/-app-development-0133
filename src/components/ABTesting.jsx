import React, { createContext, useContext, useState, useEffect } from 'react'

// A/B Testing Context
const ABTestingContext = createContext()

export function useABTesting() {
  const context = useContext(ABTestingContext)
  if (!context) {
    throw new Error('useABTesting must be used within an ABTestingProvider')
  }
  return context
}

// A/B Testing Provider
export function ABTestingProvider({ children }) {
  const [experiments, setExperiments] = useState({})
  const [userVariant, setUserVariant] = useState({})

  // Initialize A/B tests
  useEffect(() => {
    const initializeABTests = () => {
      const tests = {
        'homepage-layout': {
          variants: ['card-grid', 'list-view', 'timeline'],
          weights: [0.4, 0.3, 0.3],
          description: 'Different homepage layouts to test engagement'
        },
        'onboarding-flow': {
          variants: ['3-step', '5-step', 'guided-tour'],
          weights: [0.5, 0.3, 0.2],
          description: 'Different onboarding experiences'
        },
        'notification-timing': {
          variants: ['morning', 'evening', 'adaptive'],
          weights: [0.3, 0.3, 0.4],
          description: 'When to send wellness reminders'
        },
        'gamification-level': {
          variants: ['minimal', 'moderate', 'intensive'],
          weights: [0.2, 0.5, 0.3],
          description: 'Level of gamification elements'
        },
        'color-scheme': {
          variants: ['calm-blues', 'energetic-greens', 'warm-oranges'],
          weights: [0.4, 0.4, 0.2],
          description: 'Different color schemes for emotional impact'
        }
      }

      // Assign user to variants based on consistent hashing
      const userId = localStorage.getItem('userId') || 'demo-user'
      const assignedVariants = {}

      Object.entries(tests).forEach(([testName, testConfig]) => {
        const hash = hashString(userId + testName)
        const random = hash % 100
        let cumulative = 0
        let selectedVariant = testConfig.variants[0]

        for (let i = 0; i < testConfig.variants.length; i++) {
          cumulative += testConfig.weights[i] * 100
          if (random < cumulative) {
            selectedVariant = testConfig.variants[i]
            break
          }
        }

        assignedVariants[testName] = selectedVariant
      })

      setExperiments(tests)
      setUserVariant(assignedVariants)
      
      // Store for analytics
      localStorage.setItem('abTestVariants', JSON.stringify(assignedVariants))
    }

    initializeABTests()
  }, [])

  // Track experiment events
  const trackEvent = (experimentName, event, data = {}) => {
    const variant = userVariant[experimentName]
    const eventData = {
      experiment: experimentName,
      variant,
      event,
      timestamp: new Date().toISOString(),
      userId: localStorage.getItem('userId') || 'demo-user',
      ...data
    }

    // In a real app, this would send to analytics service
    console.log('A/B Test Event:', eventData)
    
    // Store locally for demo
    const events = JSON.parse(localStorage.getItem('abTestEvents') || '[]')
    events.push(eventData)
    localStorage.setItem('abTestEvents', JSON.stringify(events))
  }

  // Get current variant for an experiment
  const getVariant = (experimentName) => {
    return userVariant[experimentName] || null
  }

  // Check if user is in specific variant
  const isVariant = (experimentName, variant) => {
    return userVariant[experimentName] === variant
  }

  // Get experiment configuration
  const getExperiment = (experimentName) => {
    return experiments[experimentName] || null
  }

  const value = {
    experiments,
    userVariant,
    trackEvent,
    getVariant,
    isVariant,
    getExperiment
  }

  return (
    <ABTestingContext.Provider value={value}>
      {children}
    </ABTestingContext.Provider>
  )
}

// Simple hash function for consistent user assignment
function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

// A/B Test Wrapper Component
export function ABTestWrapper({ 
  experiment, 
  variants, 
  children, 
  fallback = null 
}) {
  const { getVariant, trackEvent } = useABTesting()
  const variant = getVariant(experiment)

  useEffect(() => {
    if (variant) {
      trackEvent(experiment, 'view', { variant })
    }
  }, [experiment, variant, trackEvent])

  if (!variant) {
    return fallback
  }

  const VariantComponent = variants[variant]
  if (!VariantComponent) {
    return fallback
  }

  return <VariantComponent />
}

// A/B Test Button Component
export function ABTestButton({ 
  experiment, 
  variant, 
  children, 
  onClick, 
  className = '',
  ...props 
}) {
  const { isVariant, trackEvent } = useABTesting()
  const isActive = isVariant(experiment, variant)

  const handleClick = (e) => {
    trackEvent(experiment, 'click', { variant, element: 'button' })
    if (onClick) onClick(e)
  }

  if (!isActive) {
    return null
  }

  return (
    <button 
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  )
}

// A/B Test Analytics Dashboard (for demo purposes)
export function ABTestAnalytics() {
  const { experiments, userVariant } = useABTesting()
  const [events, setEvents] = useState([])

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('abTestEvents') || '[]')
    setEvents(storedEvents)
  }, [])

  const getEventStats = (experiment) => {
    const experimentEvents = events.filter(e => e.experiment === experiment)
    const views = experimentEvents.filter(e => e.event === 'view').length
    const clicks = experimentEvents.filter(e => e.event === 'click').length
    const conversionRate = views > 0 ? (clicks / views * 100).toFixed(1) : 0

    return { views, clicks, conversionRate }
  }

  return (
    <div className="wellness-card p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        A/B Testing Analytics
      </h3>
      
      <div className="space-y-4">
        {Object.entries(experiments).map(([experimentName, config]) => {
          const stats = getEventStats(experimentName)
          const currentVariant = userVariant[experimentName]
          
          return (
            <div key={experimentName} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-text-primary">
                  {experimentName.replace('-', ' ').toUpperCase()}
                </h4>
                <span className="text-sm text-text-secondary">
                  Current: {currentVariant}
                </span>
              </div>
              
              <p className="text-sm text-text-secondary mb-3">
                {config.description}
              </p>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-text-secondary">Views</div>
                  <div className="font-semibold text-text-primary">{stats.views}</div>
                </div>
                <div>
                  <div className="text-text-secondary">Clicks</div>
                  <div className="font-semibold text-text-primary">{stats.clicks}</div>
                </div>
                <div>
                  <div className="text-text-secondary">Conversion</div>
                  <div className="font-semibold text-text-primary">{stats.conversionRate}%</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

