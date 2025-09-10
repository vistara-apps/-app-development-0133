/**
 * Privacy Consent Component
 * 
 * Handles user consent for data usage, AI analysis, and third-party integrations.
 */

import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Modal } from './Modal';
import { 
  Shield, 
  Check, 
  AlertCircle,
  Brain,
  Activity,
  TrendingUp,
  Calendar,
  MessageSquare,
  Database,
  Lock
} from 'lucide-react';
// Mock privacy service functions for demo purposes
const recordUserConsent = (userId, consent, version) => {
  console.log('Privacy consent recorded:', { userId, consent, version });
};

const getUserPrivacySettings = (userId) => {
  return { consentGiven: false };
};

export function PrivacyConsent({ 
  userId, 
  onConsentGiven, 
  onConsentDeclined,
  isModal = false,
  showSkip = false
}) {
  const [consentGiven, setConsentGiven] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [settings, setSettings] = useState({
    allowEmotionalAnalysis: true,
    allowStressDetection: true,
    allowPatternRecognition: true,
    allowExternalIntegrations: false,
    shareAnonymizedData: false
  });
  
  // Check if consent has already been given
  useEffect(() => {
    if (userId) {
      const userSettings = getUserPrivacySettings(userId);
      setConsentGiven(userSettings.consentGiven);
    }
  }, [userId]);
  
  // Handle consent submission
  const handleSubmit = () => {
    if (userId) {
      recordUserConsent(userId, true, '1.0');
      
      // Record specific settings
      const updatedSettings = {
        dataUsage: {
          ...settings
        }
      };
      
      setConsentGiven(true);
      
      if (onConsentGiven) {
        onConsentGiven(updatedSettings);
      }
    }
  };
  
  // Handle consent decline
  const handleDecline = () => {
    if (userId) {
      recordUserConsent(userId, false, '1.0');
      
      if (onConsentDeclined) {
        onConsentDeclined();
      }
    }
  };
  
  // Handle skip (for demo purposes)
  const handleSkip = () => {
    if (onConsentGiven) {
      onConsentGiven({
        dataUsage: {
          allowEmotionalAnalysis: true,
          allowStressDetection: true,
          allowPatternRecognition: true,
          allowExternalIntegrations: false,
          shareAnonymizedData: false
        }
      });
    }
  };
  
  // Toggle a specific setting
  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  const consentContent = (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary/10 rounded-full">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-text-primary">
          Privacy & Data Consent
        </h2>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-text-secondary">
          Resilify uses AI to provide personalized resilience support. To deliver these features, 
          we need your consent to analyze your emotional data. Your privacy is important to us, 
          and you can control exactly how your data is used.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="emotional-analysis"
            checked={settings.allowEmotionalAnalysis}
            onChange={() => toggleSetting('allowEmotionalAnalysis')}
            className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <div>
            <label 
              htmlFor="emotional-analysis"
              className="block font-medium text-text-primary flex items-center"
            >
              <Brain className="w-4 h-4 mr-1" />
              Emotional Analysis
            </label>
            <p className="text-sm text-text-secondary">
              Allow AI to analyze your emotional check-ins to provide personalized insights.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="stress-detection"
            checked={settings.allowStressDetection}
            onChange={() => toggleSetting('allowStressDetection')}
            className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <div>
            <label 
              htmlFor="stress-detection"
              className="block font-medium text-text-primary flex items-center"
            >
              <Activity className="w-4 h-4 mr-1" />
              Stress Detection
            </label>
            <p className="text-sm text-text-secondary">
              Allow AI to detect signs of stress in your entries and provide timely support.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="pattern-recognition"
            checked={settings.allowPatternRecognition}
            onChange={() => toggleSetting('allowPatternRecognition')}
            className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <div>
            <label 
              htmlFor="pattern-recognition"
              className="block font-medium text-text-primary flex items-center"
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Pattern Recognition
            </label>
            <p className="text-sm text-text-secondary">
              Allow AI to identify patterns in your emotional data to provide deeper insights.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="external-integrations"
            checked={settings.allowExternalIntegrations}
            onChange={() => toggleSetting('allowExternalIntegrations')}
            className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <div>
            <label 
              htmlFor="external-integrations"
              className="block font-medium text-text-primary flex items-center"
            >
              <Calendar className="w-4 h-4 mr-1" />
              External Integrations
            </label>
            <p className="text-sm text-text-secondary">
              Allow integration with Google Calendar and Slack for contextual support.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="anonymized-data"
            checked={settings.shareAnonymizedData}
            onChange={() => toggleSetting('shareAnonymizedData')}
            className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <div>
            <label 
              htmlFor="anonymized-data"
              className="block font-medium text-text-primary flex items-center"
            >
              <Database className="w-4 h-4 mr-1" />
              Anonymized Data Sharing
            </label>
            <p className="text-sm text-text-secondary">
              Allow sharing of anonymized data to improve the service (no personal information).
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex items-center space-x-2 text-text-primary font-medium mb-2">
          <Lock className="w-4 h-4" />
          <span>Our Privacy Commitment</span>
        </div>
        <ul className="text-sm text-text-secondary space-y-1">
          <li>• Your data is encrypted and stored securely</li>
          <li>• You can export or delete your data at any time</li>
          <li>• We never sell your personal information</li>
          <li>• You can change these settings at any time</li>
        </ul>
      </div>
      
      <div className="flex space-x-3">
        <Button 
          variant="secondary" 
          className="flex-1"
          onClick={handleDecline}
        >
          Decline
        </Button>
        <Button 
          className="flex-1"
          onClick={handleSubmit}
          disabled={!settings.allowEmotionalAnalysis && !settings.allowStressDetection && !settings.allowPatternRecognition}
        >
          I Consent
        </Button>
      </div>
      
      {showSkip && (
        <div className="text-center">
          <button
            onClick={handleSkip}
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            Skip for now (demo mode)
          </button>
        </div>
      )}
      
      <div className="text-xs text-text-secondary text-center">
        By consenting, you agree to our{' '}
        <a href="#" className="text-primary hover:underline">Privacy Policy</a>{' '}
        and{' '}
        <a href="#" className="text-primary hover:underline">Terms of Service</a>.
      </div>
    </div>
  );
  
  // If consent has already been given, show a confirmation
  if (consentGiven) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-3 text-green-600">
          <Check className="w-6 h-6" />
          <h3 className="font-medium">Privacy consent has been provided</h3>
        </div>
        <p className="text-text-secondary mt-2">
          You can update your privacy settings at any time in your account settings.
        </p>
      </Card>
    );
  }
  
  // Render as modal or card based on prop
  return isModal ? (
    <Modal
      isOpen={true}
      onClose={() => {}}
      title="Privacy & Data Consent"
      className="max-w-2xl"
      showCloseButton={false}
    >
      {consentContent}
    </Modal>
  ) : (
    <Card className="p-6">
      {consentContent}
    </Card>
  );
}

export default PrivacyConsent;

