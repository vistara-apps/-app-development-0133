import React from 'react'
import { useAuthStore } from '../stores/authStore'
import { useDataStore } from '../stores/dataStore'
import OnboardingFlow from '../components/OnboardingFlow'

export function OnboardingPage() {
  const { updateUser } = useAuthStore()
  const { addDailyEntry } = useDataStore()

  const completeOnboarding = (onboardingData) => {
    // Save initial check-in if personalization data exists
    if (onboardingData.personalization) {
      addDailyEntry({
        userId: 'demo-user-1',
        date: new Date().toISOString().split('T')[0],
        emotionalState: 'neutral', // Default state
        notes: 'Initial onboarding completed'
      })
    }

    // Mark onboarding as complete
    updateUser({ onboardingCompleted: true })
  }

  return (
    <OnboardingFlow onComplete={completeOnboarding} />
  )
}