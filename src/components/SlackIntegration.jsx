/**
 * Slack Integration Component
 * 
 * Handles Slack integration for workplace resilience support,
 * including authentication, channel selection, and message delivery.
 */

import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { useSettingsStore } from '../stores/settingsStore';
import { 
  MessageSquare, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Bell,
  Hash
} from 'lucide-react';
import { initializeSlackIntegration } from '../services/SlackService';

export function SlackIntegration() {
  const { slack, updateSlack } = useSettingsStore();
  
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [workHoursStart, setWorkHoursStart] = useState('09:00');
  const [workHoursEnd, setWorkHoursEnd] = useState('17:00');
  const [selectedWorkDays, setSelectedWorkDays] = useState([1, 2, 3, 4, 5]);
  
  // Initialize connection status and settings
  useEffect(() => {
    setIsConnected(slack.enabled);
    setWorkHoursStart(slack.workHoursStart || '09:00');
    setWorkHoursEnd(slack.workHoursEnd || '17:00');
    setSelectedWorkDays(slack.workDays || [1, 2, 3, 4, 5]);
  }, [slack]);
  
  // Connect to Slack
  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      const success = await initializeSlackIntegration({
        features: { slackIntegration: true }
      });
      
      if (success) {
        setIsConnected(true);
        updateSlack({ enabled: true });
      }
    } catch (error) {
      console.error('Error connecting to Slack:', error);
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Disconnect from Slack
  const handleDisconnect = () => {
    setIsConnected(false);
    updateSlack({ enabled: false });
  };
  
  // Toggle feature setting
  const toggleFeature = (feature) => {
    updateSlack({
      [feature]: !slack[feature]
    });
  };
  
  // Toggle work day selection
  const toggleWorkDay = (day) => {
    setSelectedWorkDays(prev => {
      const isSelected = prev.includes(day);
      
      if (isSelected) {
        return prev.filter(d => d !== day);
      } else {
        return [...prev, day].sort();
      }
    });
  };
  
  // Save work hours settings
  const saveWorkHoursSettings = () => {
    updateSlack({
      workHoursStart,
      workHoursEnd,
      workDays: selectedWorkDays
    });
  };
  
  // Get day name
  const getDayName = (day) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[day];
  };
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Slack Integration
          </h2>
          <p className="text-text-secondary">
            Connect Slack for workplace resilience support
          </p>
        </div>
        
        {isConnected ? (
          <Button 
            variant="secondary"
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        ) : (
          <Button 
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Button>
        )}
      </div>
      
      {isConnected ? (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 p-3 bg-green-50 text-green-700 rounded-lg">
            <Check className="w-5 h-5" />
            <span>Connected to Slack</span>
          </div>
          
          {/* Basic Settings */}
          <div>
            <h3 className="text-md font-medium text-text-primary mb-3">
              Notification Settings
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-text-secondary">
                  Allow direct messages
                </label>
                <input
                  type="checkbox"
                  checked={slack.allowDirectMessages}
                  onChange={() => toggleFeature('allowDirectMessages')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-text-secondary">
                  Allow slash commands
                </label>
                <input
                  type="checkbox"
                  checked={slack.allowSlashCommands}
                  onChange={() => toggleFeature('allowSlashCommands')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-text-secondary">
                  Only send during work hours
                </label>
                <input
                  type="checkbox"
                  checked={slack.workHoursOnly}
                  onChange={() => toggleFeature('workHoursOnly')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
          
          {/* Channel Settings */}
          <div>
            <h3 className="text-md font-medium text-text-primary mb-3">
              Channel Settings
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-text-secondary mb-1">
                  Weekly Report Channel (optional)
                </label>
                <div className="flex items-center">
                  <Hash className="w-5 h-5 text-text-secondary mr-2" />
                  <Input
                    placeholder="channel-name"
                    value={slack.channelId || ''}
                    onChange={(e) => updateSlack({ channelId: e.target.value })}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  Leave empty to receive reports via direct message
                </p>
              </div>
            </div>
          </div>
          
          {/* Work Hours Settings */}
          {slack.workHoursOnly && (
            <div>
              <h3 className="text-md font-medium text-text-primary mb-3">
                Work Hours
              </h3>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">
                      Start Time
                    </label>
                    <Input
                      type="time"
                      value={workHoursStart}
                      onChange={(e) => setWorkHoursStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">
                      End Time
                    </label>
                    <Input
                      type="time"
                      value={workHoursEnd}
                      onChange={(e) => setWorkHoursEnd(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-text-secondary mb-2">
                    Work Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[0, 1, 2, 3, 4, 5, 6].map(day => (
                      <button
                        key={day}
                        onClick={() => toggleWorkDay(day)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedWorkDays.includes(day)
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-text-secondary'
                        }`}
                      >
                        {getDayName(day)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <Button 
                  size="sm"
                  onClick={saveWorkHoursSettings}
                >
                  Save Work Hours
                </Button>
              </div>
            </div>
          )}
          
          {/* Advanced Settings */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-text-primary font-medium"
            >
              {showAdvanced ? (
                <ChevronUp className="w-4 h-4 mr-1" />
              ) : (
                <ChevronDown className="w-4 h-4 mr-1" />
              )}
              Advanced Settings
            </button>
            
            {showAdvanced && (
              <div className="mt-3 space-y-3 pl-2 border-l-2 border-gray-100">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">
                    Nudge Frequency
                  </label>
                  <select
                    value={slack.nudgeFrequency || 'medium'}
                    onChange={(e) => updateSlack({ nudgeFrequency: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="low">Low (1-2 per day)</option>
                    <option value="medium">Medium (3-5 per day)</option>
                    <option value="high">High (5-8 per day)</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-text-secondary">
                    Send weekly reports via Slack
                  </label>
                  <input
                    type="checkbox"
                    checked={slack.sendWeeklyReports}
                    onChange={() => toggleFeature('sendWeeklyReports')}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-text-secondary">
                    Allow check-in reminders
                  </label>
                  <input
                    type="checkbox"
                    checked={slack.allowReminders}
                    onChange={() => toggleFeature('allowReminders')}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Test Integration */}
          <div className="pt-4 border-t border-gray-100">
            <Button size="sm">
              Send Test Message
            </Button>
            <p className="text-xs text-text-secondary mt-2">
              This will send a test message to verify your Slack integration is working correctly.
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <MessageSquare className="w-12 h-12 text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Connect Your Slack Workspace
          </h3>
          <p className="text-text-secondary max-w-md mx-auto mb-6">
            Connecting Slack allows Resilify to provide resilience support in your work environment,
            including quick check-ins, nudges, and weekly reports.
          </p>
          <Button onClick={handleConnect} disabled={isConnecting}>
            {isConnecting ? 'Connecting...' : 'Connect Slack'}
          </Button>
        </div>
      )}
    </Card>
  );
}

export default SlackIntegration;

