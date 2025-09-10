import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { HomePage } from './pages/HomePage'
import { DashboardPage } from './pages/DashboardPage'
import { ActivitiesPage } from './pages/ActivitiesPage'
import { InsightsPage } from './pages/InsightsPage'
import { CirclesPage } from './pages/CirclesPage'
import { SettingsPage } from './pages/SettingsPage'
import { PrivacySettingsPage } from './pages/PrivacySettingsPage'
import { IntegrationsPage } from './pages/IntegrationsPage'
import { PricingPage } from './pages/PricingPage'
import { AuthPage } from './pages/AuthPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { TestPage } from './pages/TestPage'
import { useAuthStore } from './stores/authStore'
import { useSettingsStore } from './stores/settingsStore'
import { PrivacyConsent } from './components/PrivacyConsent'
import { NudgeNotification } from './components/NudgeNotification'
import { PaymentModal } from './components/PaymentModal'

function App() {
  const { isAuthenticated, user } = useAuthStore()
  const { features } = useSettingsStore()
  const [showPrivacyConsent, setShowPrivacyConsent] = useState(false)
  const navigate = useNavigate()

  // Check if privacy consent is needed
  useEffect(() => {
    if (isAuthenticated && user) {
      // In a real app, this would check if the user has given consent
      const hasGivenConsent = localStorage.getItem('privacyConsent') === 'true';
      setShowPrivacyConsent(!hasGivenConsent);
    }
  }, [isAuthenticated, user]);
  
  // Handle privacy consent
  const handleConsentGiven = () => {
    localStorage.setItem('privacyConsent', 'true');
    setShowPrivacyConsent(false);
  };

  if (!isAuthenticated) {
    return <AuthPage />
  }

  if (user && !user.onboardingCompleted) {
    return <OnboardingPage />
  }
  
  // Show privacy consent modal if needed
  if (showPrivacyConsent) {
    return (
      <PrivacyConsent 
        userId={user.userId}
        onConsentGiven={handleConsentGiven}
        isModal={true}
        showSkip={true}
      />
    );
  }

  return (
    <>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/activities" element={<HomePage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/circles" element={<CirclesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/privacy" element={<PrivacySettingsPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/integrations/calendar" element={<IntegrationsPage />} />
          <Route path="/integrations/slack" element={<IntegrationsPage />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </AppShell>
      
      {/* Payment Modal */}
      <PaymentModal />
    </>
  )
}

export default App

