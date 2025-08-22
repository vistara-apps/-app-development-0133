import React, { useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { useAuthStore } from '../stores/authStore'
import { useDataStore } from '../stores/dataStore'
import { Smile, Meh, Frown, ChevronRight, CheckCircle } from 'lucide-react'

export function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [emotionalState, setEmotionalState] = useState('')
  const [goals, setGoals] = useState([])
  const [notes, setNotes] = useState('')
  const { updateUser } = useAuthStore()
  const { addDailyEntry } = useDataStore()

  const emotionOptions = [
    { value: 'positive', icon: Smile, label: 'Positive', color: 'text-green-500' },
    { value: 'neutral', icon: Meh, label: 'Neutral', color: 'text-yellow-500' },
    { value: 'negative', icon: Frown, label: 'Negative', color: 'text-red-500' },
  ]

  const goalOptions = [
    'Reduce daily stress',
    'Improve emotional awareness',
    'Build better coping strategies',
    'Develop mindfulness habits',
    'Increase overall well-being',
    'Manage anxiety better'
  ]

  const handleGoalToggle = (goal) => {
    setGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    )
  }

  const completeOnboarding = () => {
    // Save initial check-in
    addDailyEntry({
      userId: 'demo-user-1',
      date: new Date().toISOString().split('T')[0],
      emotionalState,
      notes
    })

    // Mark onboarding as complete
    updateUser({ onboardingCompleted: true })
  }

  const steps = [
    {
      title: 'Welcome to ResilientFlow',
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl">🌱</div>
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Let's build your emotional resilience together
            </h2>
            <p className="text-text-secondary">
              ResilientFlow helps you track your emotional journey and provides 
              personalized activities to strengthen your mental well-being.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'How are you feeling today?',
      content: (
        <div className="space-y-6">
          <p className="text-text-secondary text-center">
            Let's start with your current emotional state. This will be your baseline.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {emotionOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setEmotionalState(option.value)}
                className={`
                  p-6 rounded-lg border-2 transition-all text-center
                  ${emotionalState === option.value
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <option.icon className={`w-12 h-12 mx-auto mb-3 ${option.color}`} />
                <div className="font-medium">{option.label}</div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'What are your goals?',
      content: (
        <div className="space-y-6">
          <p className="text-text-secondary text-center">
            Select the areas you'd like to focus on. We'll personalize your experience accordingly.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {goalOptions.map((goal) => (
              <button
                key={goal}
                onClick={() => handleGoalToggle(goal)}
                className={`
                  p-4 rounded-lg border-2 transition-all text-left
                  ${goals.includes(goal)
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${goals.includes(goal) ? 'border-primary bg-primary' : 'border-gray-300'}
                  `}>
                    {goals.includes(goal) && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="font-medium">{goal}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Any additional thoughts?',
      content: (
        <div className="space-y-6">
          <p className="text-text-secondary text-center">
            Share anything else about your current state or what brought you here today.
          </p>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What's on your mind today? (optional)"
            rows={4}
          />
        </div>
      )
    }
  ]

  const canContinue = () => {
    switch (step) {
      case 1: return emotionalState !== ''
      case 2: return goals.length > 0
      default: return true
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="space-y-8">
          {/* Progress bar */}
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full ${
                  index <= step ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Step content */}
          <div className="min-h-[400px] flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-text-primary text-center mb-8">
              {steps[step].title}
            </h1>
            {steps[step].content}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
            >
              Back
            </Button>
            
            {step < steps.length - 1 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canContinue()}
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={completeOnboarding}
                disabled={!canContinue()}
              >
                Get Started
                <CheckCircle className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}