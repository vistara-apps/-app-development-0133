/**
 * Integrations Page
 * 
 * Manages external integrations with Google Calendar and Slack.
 */

import React from 'react';
import { CalendarIntegration } from '../components/CalendarIntegration';
import GoogleCalendarIntegration from '../components/GoogleCalendarIntegration';
import { SlackIntegration } from '../components/SlackIntegration';
import { Card } from '../components/Card';
import { useSettingsStore } from '../stores/settingsStore';
import { 
  Puzzle, 
  Calendar, 
  MessageSquare,
  Lock,
  AlertCircle,
  Zap,
  Shield,
  CheckCircle
} from 'lucide-react';

export function IntegrationsPage() {
  const { privacy } = useSettingsStore();
  
  // Check if external integrations are allowed in privacy settings
  const integrationsAllowed = privacy.allowExternalIntegrations;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Puzzle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Integrations
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Connect external services for enhanced resilience support and seamless workflow integration
            </p>
          </div>
          
          {!integrationsAllowed ? (
            <Card className="p-8 max-w-2xl mx-auto">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                  <Lock className="w-8 h-8 text-yellow-600 dark:text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    External Integrations Disabled
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    You need to enable external integrations in your privacy settings to connect with Google Calendar, Slack, and other services for enhanced resilience support.
                  </p>
                  <a 
                    href="/settings/privacy" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Update Privacy Settings
                  </a>
                </div>
              </div>
            </Card>
          ) : (
            <>
              {/* Google Calendar Integration - Main Feature */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <GoogleCalendarIntegration />
              </div>
              
              {/* Other Integration Options */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Legacy Calendar</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Basic calendar integration for simple scheduling support and event management.
                  </p>
                  <a 
                    href="/integrations/calendar" 
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    Configure Legacy Integration
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </a>
                </Card>
                
                <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Slack</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Connect Slack for workplace resilience support, including quick check-ins, nudges, and weekly reports.
                  </p>
                  <a 
                    href="/integrations/slack" 
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    Configure Slack Integration
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </a>
                </Card>
              </div>
              
              {/* Legacy Components */}
              <div className="space-y-6">
                <CalendarIntegration />
                <SlackIntegration />
              </div>
              
              {/* Integration Benefits */}
              <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                      <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Why Integrate?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Seamlessly connect your favorite tools to enhance your resilience journey with automated workflows, 
                    smart reminders, and comprehensive insights across all your platforms.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Automated Workflows
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Set up automatic syncs and reminders to never miss important resilience activities
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Enhanced Privacy
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Full control over what data is shared with external services
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Puzzle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Seamless Experience
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Access your resilience tools wherever you work and collaborate
                    </p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default IntegrationsPage;

