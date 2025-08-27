/**
 * Settings Page
 * 
 * Manages user settings, including AI Copilot preferences,
 * privacy settings, and notification preferences.
 */

import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { AISettings } from '../components/AISettings';
import { PrivacyConsent } from '../components/PrivacyConsent';
import { SubscriptionSettings } from '../components/SubscriptionSettings';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Brain,
  Moon,
  Sun,
  LogOut,
  Download,
  Trash2,
  CreditCard
} from 'lucide-react';

export function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, updateTheme } = useSettingsStore();
  
  const [activeTab, setActiveTab] = useState('subscription');
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    updateTheme({
      darkMode: !theme.darkMode
    });
  };
  
  // Render tabs
  const renderTabs = () => {
    const tabs = [
      { id: 'subscription', label: 'Subscription', icon: CreditCard },
      { id: 'ai', label: 'AI Copilot', icon: Brain },
      { id: 'privacy', label: 'Privacy', icon: Shield },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'account', label: 'Account', icon: User }
    ];
    
    return (
      <div className="flex overflow-x-auto space-x-2 pb-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-md whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary/10 text-primary'
                : 'text-text-secondary hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>
    );
  };
  
  // Render AI settings tab
  const renderAITab = () => {
    return (
      <AISettings />
    );
  };
  
  // Render privacy tab
  const renderPrivacyTab = () => {
    return (
      <div className="space-y-6">
        <PrivacyConsent userId={user?.userId} />
        
        <Card className="p-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">
            Data Management
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-text-primary">Export Your Data</div>
                <div className="text-sm text-text-secondary">
                  Download all your data in a portable format
                </div>
              </div>
              <Button size="sm" variant="secondary">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-text-primary">Delete Your Data</div>
                <div className="text-sm text-text-secondary">
                  Permanently delete all your data from our servers
                </div>
              </div>
              <Button size="sm" variant="secondary" className="text-red-500 hover:text-red-600">
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-text-secondary">
            <p>
              Your data is stored securely and is never shared with third parties without your explicit consent.
              You can export or delete your data at any time.
            </p>
          </div>
        </Card>
      </div>
    );
  };
  
  // Render notifications tab
  const renderNotificationsTab = () => {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">
          Notification Preferences
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-text-primary">In-App Notifications</div>
              <div className="text-sm text-text-secondary">
                Nudges, insights, and activity suggestions
              </div>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="toggle-in-app"
                checked={true}
                className="sr-only"
              />
              <label
                htmlFor="toggle-in-app"
                className="block overflow-hidden h-6 rounded-full cursor-pointer bg-primary"
              >
                <span
                  className="block h-6 w-6 rounded-full bg-white transform translate-x-4"
                />
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-text-primary">Browser Notifications</div>
              <div className="text-sm text-text-secondary">
                Receive notifications when the app is in the background
              </div>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="toggle-browser"
                checked={true}
                className="sr-only"
              />
              <label
                htmlFor="toggle-browser"
                className="block overflow-hidden h-6 rounded-full cursor-pointer bg-primary"
              >
                <span
                  className="block h-6 w-6 rounded-full bg-white transform translate-x-4"
                />
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-text-primary">Email Notifications</div>
              <div className="text-sm text-text-secondary">
                Weekly reports and important updates
              </div>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="toggle-email"
                checked={false}
                className="sr-only"
              />
              <label
                htmlFor="toggle-email"
                className="block overflow-hidden h-6 rounded-full cursor-pointer bg-gray-300"
              >
                <span
                  className="block h-6 w-6 rounded-full bg-white transform translate-x-0"
                />
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-text-primary">Daily Check-in Reminder</div>
              <div className="text-sm text-text-secondary">
                Reminder to complete your daily emotional check-in
              </div>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="toggle-reminder"
                checked={true}
                className="sr-only"
              />
              <label
                htmlFor="toggle-reminder"
                className="block overflow-hidden h-6 rounded-full cursor-pointer bg-primary"
              >
                <span
                  className="block h-6 w-6 rounded-full bg-white transform translate-x-4"
                />
              </label>
            </div>
          </div>
        </div>
      </Card>
    );
  };
  
  // Render account tab
  const renderAccountTab = () => {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">
            Account Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">
                Email
              </label>
              <div className="p-2 bg-gray-50 rounded-md">
                {user?.email || 'user@example.com'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-text-secondary mb-1">
                Username
              </label>
              <div className="p-2 bg-gray-50 rounded-md">
                {user?.username || 'user123'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-text-secondary mb-1">
                Subscription
              </label>
              <div className="p-2 bg-gray-50 rounded-md">
                {user?.subscriptionTier === 'premium' ? 'Premium' : 'Free'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-text-secondary mb-1">
                Member Since
              </label>
              <div className="p-2 bg-gray-50 rounded-md">
                {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            <Button variant="secondary" className="text-red-500 hover:text-red-600">
              <LogOut className="w-4 h-4 mr-1" />
              Sign Out
            </Button>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">
            Appearance
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-text-primary">Dark Mode</div>
              <div className="text-sm text-text-secondary">
                Switch between light and dark theme
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleDarkMode}
            >
              {theme.darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </div>
        </Card>
      </div>
    );
  };
  
  // Render subscription tab
  const renderSubscriptionTab = () => {
    return <SubscriptionSettings />;
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'subscription':
        return renderSubscriptionTab();
      case 'ai':
        return renderAITab();
      case 'privacy':
        return renderPrivacyTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'account':
        return renderAccountTab();
      default:
        return renderSubscriptionTab();
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary">Customize your experience</p>
      </div>
      
      {renderTabs()}
      {renderTabContent()}
    </div>
  );
}

export default SettingsPage;

