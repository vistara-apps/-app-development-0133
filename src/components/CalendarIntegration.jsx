/**
 * Calendar Integration Component
 * 
 * Handles Google Calendar integration for schedule-aware resilience support,
 * including authentication, calendar selection, and event analysis.
 */

import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { useSettingsStore } from '../stores/settingsStore';
import { 
  Calendar, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp,
  Clock,
  AlertCircle
} from 'lucide-react';
import { 
  initializeCalendarIntegration,
  getCalendars,
  analyzeUpcomingEvents
} from '../services/GoogleCalendarService';

export function CalendarIntegration() {
  const { googleCalendar, updateGoogleCalendar } = useSettingsStore();
  
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendars, setSelectedCalendars] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Initialize connection status
  useEffect(() => {
    setIsConnected(googleCalendar.enabled);
    setSelectedCalendars(googleCalendar.calendarIds || ['primary']);
  }, [googleCalendar]);
  
  // Connect to Google Calendar
  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      const success = await initializeCalendarIntegration({
        features: { calendarIntegration: true }
      });
      
      if (success) {
        setIsConnected(true);
        updateGoogleCalendar({ enabled: true });
        
        // Get available calendars
        const availableCalendars = await getCalendars();
        setCalendars(availableCalendars);
      }
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Disconnect from Google Calendar
  const handleDisconnect = () => {
    setIsConnected(false);
    updateGoogleCalendar({ enabled: false });
  };
  
  // Toggle calendar selection
  const toggleCalendar = (calendarId) => {
    setSelectedCalendars(prev => {
      const isSelected = prev.includes(calendarId);
      
      if (isSelected) {
        return prev.filter(id => id !== calendarId);
      } else {
        return [...prev, calendarId];
      }
    });
  };
  
  // Save calendar settings
  const saveCalendarSettings = () => {
    updateGoogleCalendar({
      calendarIds: selectedCalendars
    });
  };
  
  // Toggle feature setting
  const toggleFeature = (feature) => {
    updateGoogleCalendar({
      [feature]: !googleCalendar[feature]
    });
  };
  
  // Analyze upcoming events
  const handleAnalyzeEvents = async () => {
    if (!isConnected) return;
    
    setIsAnalyzing(true);
    
    try {
      const analyses = await analyzeUpcomingEvents({
        googleCalendar: {
          calendarIds: selectedCalendars
        }
      });
      
      setUpcomingEvents(analyses);
    } catch (error) {
      console.error('Error analyzing upcoming events:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-text-primary flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Google Calendar Integration
          </h2>
          <p className="text-text-secondary">
            Connect your calendar for schedule-aware resilience support
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
            <span>Connected to Google Calendar</span>
          </div>
          
          {/* Calendar Selection */}
          <div>
            <h3 className="text-md font-medium text-text-primary mb-3">
              Select Calendars to Analyze
            </h3>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {calendars.length > 0 ? (
                calendars.map(calendar => (
                  <div 
                    key={calendar.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`calendar-${calendar.id}`}
                        checked={selectedCalendars.includes(calendar.id)}
                        onChange={() => toggleCalendar(calendar.id)}
                        className="mr-3 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label 
                        htmlFor={`calendar-${calendar.id}`}
                        className="text-text-primary"
                      >
                        {calendar.name}
                      </label>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-text-secondary text-center py-4">
                  No calendars found
                </div>
              )}
            </div>
            
            <Button 
              size="sm"
              onClick={saveCalendarSettings}
              className="mt-3"
            >
              Save Calendar Selection
            </Button>
          </div>
          
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
                <div className="flex items-center justify-between">
                  <label className="text-text-secondary">
                    Analyze events for stress potential
                  </label>
                  <input
                    type="checkbox"
                    checked={googleCalendar.analyzeEvents}
                    onChange={() => toggleFeature('analyzeEvents')}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-text-secondary">
                    Suggest preparation for stressful events
                  </label>
                  <input
                    type="checkbox"
                    checked={googleCalendar.suggestPreparation}
                    onChange={() => toggleFeature('suggestPreparation')}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-text-secondary">
                    Suggest recovery after stressful events
                  </label>
                  <input
                    type="checkbox"
                    checked={googleCalendar.suggestRecovery}
                    onChange={() => toggleFeature('suggestRecovery')}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-text-secondary">
                    Schedule resilience activities in calendar
                  </label>
                  <input
                    type="checkbox"
                    checked={googleCalendar.scheduleActivities}
                    onChange={() => toggleFeature('scheduleActivities')}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Upcoming Events Analysis */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-medium text-text-primary">
                Upcoming Events Analysis
              </h3>
              <Button 
                size="sm"
                onClick={handleAnalyzeEvents}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Now'}
              </Button>
            </div>
            
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {upcomingEvents.map((analysis, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg ${
                      analysis.stressPotential >= 4 ? 'bg-red-50' :
                      analysis.stressPotential >= 3 ? 'bg-yellow-50' :
                      'bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between">
                      <div className="font-medium text-text-primary">
                        {analysis.event.summary}
                      </div>
                      <div className={`text-sm ${
                        analysis.stressPotential >= 4 ? 'text-red-600' :
                        analysis.stressPotential >= 3 ? 'text-yellow-600' :
                        'text-text-secondary'
                      }`}>
                        Stress: {analysis.stressPotential}/5
                      </div>
                    </div>
                    <div className="text-sm text-text-secondary flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(analysis.event.start.dateTime).toLocaleString()}
                    </div>
                    {analysis.preparationStrategy && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Preparation: </span>
                        {analysis.preparationStrategy}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <AlertCircle className="w-8 h-8 text-text-secondary mx-auto mb-2" />
                <p className="text-text-secondary">
                  {isAnalyzing ? 'Analyzing your upcoming events...' : 'No event analysis available yet'}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Calendar className="w-12 h-12 text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Connect Your Google Calendar
          </h3>
          <p className="text-text-secondary max-w-md mx-auto mb-6">
            Connecting your calendar allows Resilify to provide schedule-aware resilience support, 
            including preparation for stressful events and recovery suggestions.
          </p>
          <Button onClick={handleConnect} disabled={isConnecting}>
            {isConnecting ? 'Connecting...' : 'Connect Google Calendar'}
          </Button>
        </div>
      )}
    </Card>
  );
}

export default CalendarIntegration;

