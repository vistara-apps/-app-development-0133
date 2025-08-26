/**
 * Privacy Settings Page
 * 
 * Manages user privacy settings, data consent, and data management.
 */

import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { PrivacyConsent } from '../components/PrivacyConsent';
import { useAuthStore } from '../stores/authStore';
import { 
  Shield, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff,
  Lock,
  FileText,
  BarChart,
  AlertCircle
} from 'lucide-react';
import { 
  getUserPrivacySettings, 
  updateUserPrivacySettings,
  generatePrivacyReport,
  exportUserData
} from '../services/PrivacyService';

export function PrivacySettingsPage() {
  const { user } = useAuthStore();
  
  const [settings, setSettings] = useState({
    dataUsage: {
      allowEmotionalAnalysis: true,
      allowStressDetection: true,
      allowPatternRecognition: true,
      allowExternalIntegrations: false,
      shareAnonymizedData: false
    },
    dataRetention: {
      retentionPeriodDays: 365,
      autoDeleteEnabled: true
    }
  });
  
  const [privacyReport, setPrivacyReport] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Load user privacy settings
  useEffect(() => {
    if (user?.userId) {
      const userSettings = getUserPrivacySettings(user.userId);
      setSettings({
        dataUsage: userSettings.dataUsage || settings.dataUsage,
        dataRetention: userSettings.dataRetention || settings.dataRetention
      });
      
      // Generate privacy report
      const report = generatePrivacyReport(user.userId, {
        totalEntries: 42,
        totalActivities: 28,
        oldestEntry: '2023-01-15T00:00:00.000Z',
        newestEntry: new Date().toISOString(),
        dataSize: 256 // KB
      });
      
      setPrivacyReport(report);
    }
  }, [user]);
  
  // Toggle a data usage setting
  const toggleDataUsage = (setting) => {
    setSettings(prev => ({
      ...prev,
      dataUsage: {
        ...prev.dataUsage,
        [setting]: !prev.dataUsage[setting]
      }
    }));
  };
  
  // Update retention period
  const updateRetentionPeriod = (days) => {
    setSettings(prev => ({
      ...prev,
      dataRetention: {
        ...prev.dataRetention,
        retentionPeriodDays: days
      }
    }));
  };
  
  // Toggle auto delete
  const toggleAutoDelete = () => {
    setSettings(prev => ({
      ...prev,
      dataRetention: {
        ...prev.dataRetention,
        autoDeleteEnabled: !prev.dataRetention.autoDeleteEnabled
      }
    }));
  };
  
  // Save privacy settings
  const saveSettings = () => {
    if (!user?.userId) return;
    
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      updateUserPrivacySettings(user.userId, settings);
      setIsSaving(false);
    }, 500);
  };
  
  // Export user data
  const handleExportData = () => {
    if (!user?.userId) return;
    
    setIsExporting(true);
    
    // Simulate API call
    setTimeout(() => {
      const userData = {
        entries: [],
        activities: [],
        insights: [],
        settings: {}
      };
      
      const exportData = exportUserData(user.userId, userData);
      
      // In a real app, this would trigger a download
      console.log('Exporting user data:', exportData);
      
      setIsExporting(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center">
          <Shield className="w-6 h-6 mr-2" />
          Privacy Settings
        </h1>
        <p className="text-text-secondary">Manage your data and privacy preferences</p>
      </div>
      
      <PrivacyConsent userId={user?.userId} />
      
      <Card className="p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">
          Data Usage Preferences
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-text-primary">Emotional Analysis</div>
              <div className="text-sm text-text-secondary">
                Allow AI to analyze your emotional check-ins
              </div>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="toggle-emotional"
                checked={settings.dataUsage.allowEmotionalAnalysis}
                onChange={() => toggleDataUsage('allowEmotionalAnalysis')}
                className="sr-only"
              />
              <label
                htmlFor="toggle-emotional"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                  settings.dataUsage.allowEmotionalAnalysis ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white transform ${
                    settings.dataUsage.allowEmotionalAnalysis ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-text-primary">Stress Detection</div>
              <div className="text-sm text-text-secondary">
                Allow AI to detect signs of stress in your entries
              </div>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="toggle-stress"
                checked={settings.dataUsage.allowStressDetection}
                onChange={() => toggleDataUsage('allowStressDetection')}
                className="sr-only"
              />
              <label
                htmlFor="toggle-stress"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                  settings.dataUsage.allowStressDetection ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white transform ${
                    settings.dataUsage.allowStressDetection ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-text-primary">Pattern Recognition</div>
              <div className="text-sm text-text-secondary">
                Allow AI to identify patterns in your emotional data
              </div>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="toggle-pattern"
                checked={settings.dataUsage.allowPatternRecognition}
                onChange={() => toggleDataUsage('allowPatternRecognition')}
                className="sr-only"
              />
              <label
                htmlFor="toggle-pattern"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                  settings.dataUsage.allowPatternRecognition ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white transform ${
                    settings.dataUsage.allowPatternRecognition ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-text-primary">External Integrations</div>
              <div className="text-sm text-text-secondary">
                Allow integration with Google Calendar and Slack
              </div>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="toggle-integrations"
                checked={settings.dataUsage.allowExternalIntegrations}
                onChange={() => toggleDataUsage('allowExternalIntegrations')}
                className="sr-only"
              />
              <label
                htmlFor="toggle-integrations"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                  settings.dataUsage.allowExternalIntegrations ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white transform ${
                    settings.dataUsage.allowExternalIntegrations ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-text-primary">Anonymized Data Sharing</div>
              <div className="text-sm text-text-secondary">
                Allow sharing of anonymized data to improve the service
              </div>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="toggle-anonymized"
                checked={settings.dataUsage.shareAnonymizedData}
                onChange={() => toggleDataUsage('shareAnonymizedData')}
                className="sr-only"
              />
              <label
                htmlFor="toggle-anonymized"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                  settings.dataUsage.shareAnonymizedData ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white transform ${
                    settings.dataUsage.shareAnonymizedData ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </label>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">
          Data Retention
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-2">
              Retention Period
            </label>
            <select
              value={settings.dataRetention.retentionPeriodDays}
              onChange={(e) => updateRetentionPeriod(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
              <option value={180}>6 months</option>
              <option value={365}>1 year</option>
              <option value={730}>2 years</option>
              <option value={1825}>5 years</option>
            </select>
            <p className="text-xs text-text-secondary mt-1">
              Data older than this will be automatically deleted if auto-delete is enabled.
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-text-primary">Auto-Delete Old Data</div>
              <div className="text-sm text-text-secondary">
                Automatically delete data older than the retention period
              </div>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="toggle-auto-delete"
                checked={settings.dataRetention.autoDeleteEnabled}
                onChange={toggleAutoDelete}
                className="sr-only"
              />
              <label
                htmlFor="toggle-auto-delete"
                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                  settings.dataRetention.autoDeleteEnabled ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white transform ${
                    settings.dataRetention.autoDeleteEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </label>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">
          Data Management
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-text-primary">Privacy Report</div>
              <div className="text-sm text-text-secondary">
                View a report of your data and privacy settings
              </div>
            </div>
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => setShowReport(!showReport)}
            >
              {showReport ? (
                <>
                  <EyeOff className="w-4 h-4 mr-1" />
                  Hide Report
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-1" />
                  View Report
                </>
              )}
            </Button>
          </div>
          
          {showReport && privacyReport && (
            <div className="p-4 border border-gray-200 rounded-lg space-y-3">
              <div>
                <h4 className="text-sm font-medium text-text-primary">Data Summary</h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="text-sm">
                    <span className="text-text-secondary">Total Entries:</span>{' '}
                    <span className="text-text-primary">{privacyReport.dataStats.totalEntries}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-text-secondary">Total Activities:</span>{' '}
                    <span className="text-text-primary">{privacyReport.dataStats.totalActivities}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-text-secondary">Oldest Entry:</span>{' '}
                    <span className="text-text-primary">
                      {new Date(privacyReport.dataStats.oldestEntry).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-text-secondary">Data Size:</span>{' '}
                    <span className="text-text-primary">{privacyReport.dataStats.dataSize} KB</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-text-primary">Retention Policy</h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="text-sm">
                    <span className="text-text-secondary">Retention Period:</span>{' '}
                    <span className="text-text-primary">{privacyReport.retentionPolicy.retentionPeriodDays} days</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-text-secondary">Auto-Delete:</span>{' '}
                    <span className="text-text-primary">
                      {privacyReport.retentionPolicy.autoDeleteEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  {privacyReport.retentionPolicy.nextScheduledDeletion && (
                    <div className="text-sm col-span-2">
                      <span className="text-text-secondary">Next Scheduled Deletion:</span>{' '}
                      <span className="text-text-primary">
                        {new Date(privacyReport.retentionPolicy.nextScheduledDeletion).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-text-primary">Data Protection</h4>
                <ul className="mt-2 space-y-1">
                  <li className="text-sm flex items-center">
                    <Lock className="w-3 h-3 text-green-500 mr-1" />
                    <span>Your data is encrypted and stored securely</span>
                  </li>
                  <li className="text-sm flex items-center">
                    <FileText className="w-3 h-3 text-green-500 mr-1" />
                    <span>You can export your data at any time</span>
                  </li>
                  <li className="text-sm flex items-center">
                    <Trash2 className="w-3 h-3 text-green-500 mr-1" />
                    <span>You can delete your data at any time</span>
                  </li>
                  <li className="text-sm flex items-center">
                    <BarChart className="w-3 h-3 text-green-500 mr-1" />
                    <span>Your data is only used for the purposes you've consented to</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-text-primary">Export Your Data</div>
              <div className="text-sm text-text-secondary">
                Download all your data in a portable format
              </div>
            </div>
            <Button 
              size="sm" 
              variant="secondary"
              onClick={handleExportData}
              disabled={isExporting}
            >
              <Download className="w-4 h-4 mr-1" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-text-primary">Delete Your Data</div>
              <div className="text-sm text-text-secondary">
                Permanently delete all your data from our servers
              </div>
            </div>
            <Button 
              size="sm" 
              variant="secondary" 
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={saveSettings}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Privacy Settings'}
        </Button>
      </div>
      
      <Card className="p-6">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-blue-100 rounded-full">
            <AlertCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              About Your Privacy
            </h3>
            <p className="text-text-secondary mb-2">
              At Resilify, we take your privacy seriously. We believe that your emotional data is sensitive and personal, 
              and we're committed to giving you full control over how it's used.
            </p>
            <ul className="text-text-secondary space-y-1 text-sm list-disc pl-5">
              <li>We only use your data for the purposes you've explicitly consented to</li>
              <li>You can change your privacy settings at any time</li>
              <li>You can export or delete your data at any time</li>
              <li>We use industry-standard encryption to protect your data</li>
              <li>We never sell your personal information to third parties</li>
            </ul>
            <p className="text-text-secondary mt-2">
              For more information, please read our{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PrivacySettingsPage;

