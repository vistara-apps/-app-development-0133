import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { HomePage } from './pages/HomePage'
import { DashboardPage } from './pages/DashboardPage'
import { ActivitiesPage } from './pages/ActivitiesPage'
import { InsightsPage } from './pages/InsightsPage'
import { AuthPage } from './pages/AuthPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { useAuthStore } from './stores/authStore'
import { useDataStore } from './stores/dataStore'
import { LoadingIndicator } from './components/LoadingIndicator'

function App() {
  const { isAuthenticated, user, profile, initializeAuth, isLoading: authLoading } = useAuthStore()
  const { initializeData, isLoading } = useDataStore()
  const [appInitialized, setAppInitialized] = useState(false)

  // Initialize authentication
  useEffect(() => {
    const initialize = async () => {
      await initializeAuth()
      setAppInitialized(true)
    }
    
    initialize()
  }, [initializeAuth])

  // Initialize data after authentication
  useEffect(() => {
    if (isAuthenticated && user) {
      initializeData()
    }
  }, [isAuthenticated, user, initializeData])

  // Show loading indicator while initializing
  if (!appInitialized || authLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <LoadingIndicator size="large" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthPage />
  }

  if (profile && !profile.onboarding_completed) {
    return <OnboardingPage />
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/insights" element={<InsightsPage />} />
      </Routes>
    </AppShell>
  )
}

export default App
