import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { HomePage } from './pages/HomePage'
import { DashboardPage } from './pages/DashboardPage'
import { ActivitiesPage } from './pages/ActivitiesPage'
import { InsightsPage } from './pages/InsightsPage'
import { AuthPage } from './pages/AuthPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { useAuthStore } from './stores/authStore'

function App() {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <AuthPage />
  }

  if (user && !user.onboardingCompleted) {
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