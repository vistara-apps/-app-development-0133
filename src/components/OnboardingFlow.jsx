import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Users, Sparkles, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from './Button'
import WellnessSnapshot from './WellnessSnapshot'
import AIOnboarding from './AIOnboarding'

const OnboardingFlow = ({ onComplete, className = '' }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [onboardingData, setOnboardingData] = useState({})
  const [isAnimating, setIsAnimating] = useState(false)

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to ResilientFlow',
      subtitle: 'Your journey to emotional resilience starts here',
      component: WelcomeStep
    },
    {
      id: 'personalization',
      title: 'Personalize Your Experience',
      subtitle: 'Help us understand your wellness goals',
      component: PersonalizationStep
    },
    {
      id: 'dashboard',
      title: 'Your Wellness Dashboard',
      subtitle: 'Everything you need to build resilience',
      component: DashboardStep
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(prev => prev + 1)
        setIsAnimating(false)
      }, 300)
    } else {
      onComplete(onboardingData)
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

  const handleStepData = (stepId, data) => {
    setOnboardingData(prev => ({
      ...prev,
      [stepId]: data
    }))
  }

  const currentStepConfig = steps[currentStep]
  const CurrentComponent = currentStepConfig.component

  return (
    <div className={`min-h-screen bg-gradient-to-br from-wellness-serenity via-wellness-tranquility to-wellness-peace ${className}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-text-secondary mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-white/50 dark:bg-gray-800/50 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentComponent 
              onNext={handleNext}
              onPrevious={handlePrevious}
              onData={handleStepData}
              stepId={currentStepConfig.id}
              data={onboardingData[currentStepConfig.id]}
              isFirst={currentStep === 0}
              isLast={currentStep === steps.length - 1}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// Step 1: Welcome
const WelcomeStep = ({ onNext, isFirst, isLast }) => {
  return (
    <div className="text-center space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/50 dark:to-green-900/50 mb-4">
          <Heart className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary">
          Welcome to
          <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            ResilientFlow
          </span>
        </h1>
        
        <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Your gentle companion for building emotional resilience through mindful practices, 
          community support, and personalized wellness journeys.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
      >
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/20">
            <Heart className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="font-semibold text-text-primary">Gentle Practices</h3>
          <p className="text-sm text-text-secondary">
            Mindfulness, meditation, and self-care activities designed for your pace
          </p>
        </div>
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 dark:bg-green-950/20">
            <Users className="w-6 h-6 text-green-500" />
          </div>
          <h3 className="font-semibold text-text-primary">Community Support</h3>
          <p className="text-sm text-text-secondary">
            Connect with others on similar wellness journeys
          </p>
        </div>
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-950/20">
            <Sparkles className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="font-semibold text-text-primary">AI Insights</h3>
          <p className="text-sm text-text-secondary">
            Personalized recommendations based on your unique patterns
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="pt-8"
      >
        <Button 
          onClick={onNext}
          className="inline-flex items-center space-x-2 px-8 py-3"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  )
}

// Step 2: Personalization
const PersonalizationStep = ({ onNext, onPrevious, onData, stepId, data }) => {
  const handleComplete = (responses) => {
    onData(stepId, responses)
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-text-primary">
          Personalize Your Experience
        </h2>
        <p className="text-text-secondary">
          Help us understand your wellness goals and preferences
        </p>
      </div>
      
      <AIOnboarding onComplete={handleComplete} />
    </div>
  )
}

// Step 3: Dashboard Preview
const DashboardStep = ({ onNext, onPrevious, data }) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-text-primary">
          Your Wellness Dashboard
        </h2>
        <p className="text-text-secondary">
          Everything you need to build emotional resilience
        </p>
      </div>

      {/* Dashboard Preview */}
      <div className="space-y-6">
        <WellnessSnapshot 
          score={150}
          streak={1}
          stressLevel="moderate"
          className="max-w-md mx-auto"
        />
        
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Heart className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="font-semibold text-text-primary">Daily Activities</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Personalized wellness activities based on your preferences
            </p>
          </div>
          
          <div className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <Users className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="font-semibold text-text-primary">Support Circles</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Connect with others on similar wellness journeys
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-8">
        <Button
          variant="secondary"
          onClick={onPrevious}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        <Button
          onClick={onNext}
          className="flex items-center space-x-2"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Complete Setup</span>
        </Button>
      </div>
    </div>
  )
}

export default OnboardingFlow