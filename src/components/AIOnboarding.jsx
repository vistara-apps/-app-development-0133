import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Brain, Users, Clock, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from './Button'

const AIOnboarding = ({ onComplete, className = '' }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState({})
  const [isAnimating, setIsAnimating] = useState(false)

  const questions = [
    {
      id: 'wellness-goals',
      title: 'What brings you here today?',
      subtitle: 'Help us understand your wellness journey',
      type: 'multiple',
      options: [
        { id: 'stress-management', label: 'Managing daily stress', icon: Brain, color: 'text-blue-500' },
        { id: 'emotional-wellness', label: 'Building emotional resilience', icon: Heart, color: 'text-pink-500' },
        { id: 'mindfulness', label: 'Developing mindfulness habits', icon: Sparkles, color: 'text-purple-500' },
        { id: 'work-life-balance', label: 'Finding work-life balance', icon: Clock, color: 'text-green-500' },
        { id: 'social-connection', label: 'Strengthening relationships', icon: Users, color: 'text-orange-500' }
      ]
    },
    {
      id: 'current-challenges',
      title: 'What feels most challenging right now?',
      subtitle: 'We all face different obstacles',
      type: 'multiple',
      options: [
        { id: 'overwhelm', label: 'Feeling overwhelmed', icon: Brain, color: 'text-red-500' },
        { id: 'anxiety', label: 'Managing anxiety', icon: Heart, color: 'text-yellow-500' },
        { id: 'focus', label: 'Staying focused', icon: Sparkles, color: 'text-indigo-500' },
        { id: 'energy', label: 'Low energy levels', icon: Clock, color: 'text-orange-500' },
        { id: 'loneliness', label: 'Feeling disconnected', icon: Users, color: 'text-purple-500' }
      ]
    },
    {
      id: 'time-availability',
      title: 'How much time can you dedicate daily?',
      subtitle: 'Even 5 minutes makes a difference',
      type: 'single',
      options: [
        { id: '5-minutes', label: '5 minutes', description: 'Quick mindfulness moments' },
        { id: '10-minutes', label: '10 minutes', description: 'Focused practice sessions' },
        { id: '15-minutes', label: '15 minutes', description: 'Comprehensive wellness' },
        { id: '20-plus', label: '20+ minutes', description: 'Deep transformation work' }
      ]
    },
    {
      id: 'preferred-activities',
      title: 'What resonates with you?',
      subtitle: 'Choose activities that feel right',
      type: 'multiple',
      options: [
        { id: 'breathing', label: 'Breathing exercises', icon: Heart, color: 'text-blue-500' },
        { id: 'meditation', label: 'Meditation', icon: Brain, color: 'text-purple-500' },
        { id: 'journaling', label: 'Journaling', icon: Sparkles, color: 'text-green-500' },
        { id: 'movement', label: 'Gentle movement', icon: Clock, color: 'text-orange-500' },
        { id: 'gratitude', label: 'Gratitude practice', icon: Heart, color: 'text-pink-500' }
      ]
    },
    {
      id: 'support-preferences',
      title: 'How would you like support?',
      subtitle: 'We\'re here to help you succeed',
      type: 'single',
      options: [
        { id: 'gentle-reminders', label: 'Gentle reminders', description: 'Soft nudges when you need them' },
        { id: 'daily-checkins', label: 'Daily check-ins', description: 'Regular wellness touchpoints' },
        { id: 'community-support', label: 'Community support', description: 'Connect with others on similar journeys' },
        { id: 'ai-insights', label: 'AI insights', description: 'Personalized recommendations' }
      ]
    }
  ]

  const handleResponse = (questionId, response) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }))
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(prev => prev + 1)
        setIsAnimating(false)
      }, 300)
    } else {
      onComplete(responses)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(prev => prev - 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const currentQuestion = questions[currentStep]
  const hasResponse = responses[currentQuestion.id]
  const canProceed = currentQuestion.type === 'single' ? hasResponse : hasResponse && hasResponse.length > 0

  return (
    <div className={`max-w-2xl mx-auto p-6 ${className}`}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-text-secondary mb-2">
          <span>Step {currentStep + 1} of {questions.length}</span>
          <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Question Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-text-primary">
              {currentQuestion.title}
            </h2>
            <p className="text-text-secondary">
              {currentQuestion.subtitle}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = currentQuestion.type === 'single' 
                ? responses[currentQuestion.id] === option.id
                : responses[currentQuestion.id]?.includes(option.id)

              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    if (currentQuestion.type === 'single') {
                      handleResponse(currentQuestion.id, option.id)
                    } else {
                      const currentResponses = responses[currentQuestion.id] || []
                      const newResponses = currentResponses.includes(option.id)
                        ? currentResponses.filter(r => r !== option.id)
                        : [...currentResponses, option.id]
                      handleResponse(currentQuestion.id, newResponses)
                    }
                  }}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                    isSelected 
                      ? 'bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800' 
                      : 'bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {option.icon && (
                      <div className={`p-2 rounded-lg ${
                        isSelected ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <option.icon className={`w-5 h-5 ${option.color}`} />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className={`font-medium ${
                        isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-text-primary'
                      }`}>
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-sm text-text-secondary mt-1">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <Button
          variant="secondary"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="flex items-center space-x-2"
        >
          <span>{currentStep === questions.length - 1 ? 'Complete Setup' : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export default AIOnboarding