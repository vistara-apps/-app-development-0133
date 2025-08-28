/**
 * Integrations Page
 * 
 * Manages external integrations with Google Calendar and Slack.
 */

import React from 'react';
import { CalendarIntegration } from '../components/CalendarIntegration';
import { GoogleCalendarIntegration } from '../components/GoogleCalendarIntegration';
import { SlackIntegration } from '../components/SlackIntegration';
import { Card } from '../components/Card';
import { useSettingsStore } from '../stores/settingsStore';
import { 
  Puzzle, 
  Calendar, 
  MessageSquare,
  Lock,
  AlertCircle
} from 'lucide-react';

export function IntegrationsPage() {
  const { privacy } = useSettingsStore();
  
  // Check if external integrations are allowed in privacy settings
  const integrationsAllowed = privacy.allowExternalIntegrations;
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Integrations</h1>
        <p className="text-text-secondary">Connect external services for enhanced resilience support</p>
      </div>
      
      {!integrationsAllowed ? (
        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Lock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-2">
                External Integrations Disabled
              </h3>
              <p className="text-text-secondary mb-4">
                You need to enable external integrations in your privacy settings to connect with Google Calendar and Slack.
              </p>
              <a 
                href="/settings/privacy" 
                className="text-primary hover:underline"
              >
                Update Privacy Settings
              </a>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {/* Google Calendar Integration */}
          <GoogleCalendarIntegration />
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-medium text-text-primary">Legacy Calendar</h3>
              </div>
              <p className="text-text-secondary mb-4">
                Basic calendar integration for simple scheduling support.
              </p>
              <a 
                href="/integrations/calendar" 
                className="text-primary hover:underline"
              >
                Configure Legacy Integration
              </a>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MessageSquare className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-medium text-text-primary">Slack</h3>
              </div>
              <p className="text-text-secondary mb-4">
                Connect Slack for workplace resilience support, including quick check-ins, nudges, and weekly reports.
              </p>
              <a 
                href="/integrations/slack" 
                className="text-primary hover:underline"
              >
                Configure Slack Integration
              </a>
            </Card>
          </div>
          
          <CalendarIntegration />
          
          <SlackIntegration />
          
          <Card className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  About External Integrations
                </h3>
                <p className="text-text-secondary mb-2">
                  External integrations enhance your resilience-building experience by providing context-aware support in the tools you use every day.
                </p>
                <ul className="text-text-secondary space-y-1 text-sm list-disc pl-5">
                  <li>Your data is only shared with the services you explicitly connect</li>
                  <li>You can disconnect integrations at any time</li>
                  <li>We only access the minimum data needed for the integration to function</li>
                  <li>All data transfers are encrypted and secure</li>
                </ul>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export default IntegrationsPage;

