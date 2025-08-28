import React, { useEffect, useState } from 'react'
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
import { useAuthStore } from './stores/authStore'
import { useSettingsStore } from './stores/settingsStore'
import { PrivacyConsent } from './components/PrivacyConsent'
import { NudgeNotification } from './components/NudgeNotification'
import { PaymentModal } from './components/PaymentModal'
import { useContextualNudges } from './hooks/useContextualNudges'

function App() {
  const { isAuthenticated, user } = useAuthStore()
  const { features } = useSettingsStore()
  const [showPrivacyConsent, setShowPrivacyConsent] = useState(false)
  const navigate = useNavigate()
  
  
  // Initialize contextual nudges if enabled
  const { 
    currentNudge, 
    markNudgeAsViewed, 
    markNudgeAsActioned, 
    dismissNudge 
  } = features.contextualNudges ? useContextualNudges({
    autoGenerate: true,
    deliveryChannel: 'app'
  }) : { currentNudge: null };
  
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

  // Handle nudge action with navigation
  const handleNudgeAction = (nudgeId, details) => {
    // First mark the nudge as actioned
    markNudgeAsActioned(nudgeId, details);
    
    // Then navigate based on nudge type
    if (currentNudge) {
      switch (currentNudge.type) {
        case 'breathing':
        case 'mindfulness':
          navigate('/activities?filter=mindfulness');
          break;
        case 'gratitude':
          navigate('/activities?filter=gratitude');
          break;
        case 'perspective':
          navigate('/activities?filter=cognitive');
          break;
        case 'activity':
        case 'break':
        case 'recovery':
          navigate('/activities?filter=relaxation');
          break;
        case 'social':
          navigate('/circles');
          break;
        default:
          navigate('/activities');
          break;
      }
    }
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
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/circles" element={<CirclesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/privacy" element={<PrivacySettingsPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/integrations/calendar" element={<IntegrationsPage />} />
          <Route path="/integrations/slack" element={<IntegrationsPage />} />
        </Routes>
      </AppShell>
      
      {/* Contextual Nudge Notification */}
      {currentNudge && (
        <NudgeNotification
          nudge={currentNudge}
          onView={markNudgeAsViewed}
          onAction={handleNudgeAction}
          onDismiss={dismissNudge}
          position="bottom-right"
          autoHide={true}
        />
      )}

      {/* Payment Modal */}
      <PaymentModal />
    </>
  )
}

export default App
