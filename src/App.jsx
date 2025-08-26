import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { HomePage } from './pages/HomePage'
import { DashboardPage } from './pages/DashboardPage'
import { ActivitiesPage } from './pages/ActivitiesPage'
import { InsightsPage } from './pages/InsightsPage'
import { SubscriptionPage } from './pages/SubscriptionPage'
import { AuthPage } from './pages/AuthPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { useAuthStore } from './stores/authStore'
import { StripeProvider } from './components/StripeProvider'
import { ToastProvider } from './components/ToastProvider'

function App() {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <AuthPage />
  }

  if (user && !user.onboardingCompleted) {
    return <OnboardingPage />
  }

  return (
    <StripeProvider>
      <ToastProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
          </Routes>
        </AppShell>
      </ToastProvider>
    </StripeProvider>
  )
}

export default App
