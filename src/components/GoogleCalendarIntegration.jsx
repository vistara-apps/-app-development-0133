import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { googleCalendar, isGoogleCalendarConfigured } from '../services/GoogleCalendarService';
import { useDataStore } from '../stores/dataStore';
import { Calendar, Clock, CheckCircle, AlertCircle, User, Plus, Trash2 } from 'lucide-react';

export function GoogleCalendarIntegration() {
  const { activities } = useDataStore();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isSchedulingActivity, setIsSchedulingActivity] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [scheduledTime, setScheduledTime] = useState('');
  const [reminderTime, setReminderTime] = useState('19:00');
  const [isCreatingReminder, setIsCreatingReminder] = useState(false);

  // Check initial connection status
  useEffect(() => {
    checkConnectionStatus();
    if (isGoogleCalendarConfigured()) {
      initializeGoogleCalendar();
    }
  }, []);

  const checkConnectionStatus = () => {
    const connected = googleCalendar.isAuthenticated();
    setIsConnected(connected);
    
    if (connected) {
      loadUserInfo();
      loadUpcomingEvents();
    }
  };

  const initializeGoogleCalendar = async () => {
    try {
      await googleCalendar.initialize();
    } catch (error) {
      console.error('Failed to initialize Google Calendar:', error);
    }
  };

  const loadUserInfo = async () => {
    try {
      const user = await googleCalendar.oauth.getUserInfo();
      setUserInfo(user);
    } catch (error) {
      console.error('Failed to load user info:', error);
    }
  };

  const loadUpcomingEvents = async () => {
    try {
      const events = await googleCalendar.getUpcomingWellnessEvents(7);
      setUpcomingEvents(events);
    } catch (error) {
      console.error('Failed to load upcoming events:', error);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      await googleCalendar.authenticate();
      setIsConnected(true);
      await loadUserInfo();
      await loadUpcomingEvents();
    } catch (error) {
      console.error('Failed to connect to Google Calendar:', error);
      alert('Failed to connect to Google Calendar. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await googleCalendar.signOut();
      setIsConnected(false);
      setUserInfo(null);
      setUpcomingEvents([]);
    } catch (error) {
      console.error('Failed to disconnect from Google Calendar:', error);
    }
  };

  const handleScheduleActivity = async () => {
    if (!selectedActivity || !scheduledTime) {
      alert('Please select an activity and time');
      return;
    }

    setIsSchedulingActivity(true);

    try {
      const activity = activities.find(a => a.activityId === selectedActivity);
      const scheduledDateTime = new Date(scheduledTime);

      await googleCalendar.createWellnessEvent({
        activity,
        scheduledTime: scheduledDateTime,
        duration: activity.estimated_duration_minutes || 30
      });

      // Reload events
      await loadUpcomingEvents();
      
      // Reset form
      setSelectedActivity(null);
      setScheduledTime('');
      
      alert('Activity scheduled successfully!');

    } catch (error) {
      console.error('Failed to schedule activity:', error);
      alert('Failed to schedule activity. Please try again.');
    } finally {
      setIsSchedulingActivity(false);
    }
  };

  const handleCreateDailyReminder = async () => {
    setIsCreatingReminder(true);

    try {
      await googleCalendar.createDailyCheckInReminder(reminderTime);
      alert('Daily reminder created successfully!');
      
      // Reload events
      await loadUpcomingEvents();

    } catch (error) {
      console.error('Failed to create daily reminder:', error);
      alert('Failed to create daily reminder. Please try again.');
    } finally {
      setIsCreatingReminder(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await googleCalendar.deleteEvent(eventId);
      await loadUpcomingEvents();
      alert('Event deleted successfully!');
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const formatEventTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get tomorrow's date for default scheduling
  const getTomorrowISO = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // Default to 9 AM
    return tomorrow.toISOString().slice(0, 16);
  };

  if (!isGoogleCalendarConfigured()) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="w-6 h-6 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-400">Google Calendar Integration</h3>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-yellow-500 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Google Calendar integration is not configured. Please add your Google API keys to enable this feature.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Required: VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_API_KEY
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Calendar className={`w-6 h-6 ${isConnected ? 'text-green-500' : 'text-gray-400'}`} />
            <h3 className="text-lg font-semibold">Google Calendar Integration</h3>
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            isConnected 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          }`}>
            {isConnected ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>

        {isConnected && userInfo && (
          <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <User className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium">{userInfo.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{userInfo.email}</p>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          {!isConnected ? (
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isConnecting ? 'Connecting...' : 'Connect to Google Calendar'}
            </Button>
          ) : (
            <Button 
              onClick={handleDisconnect}
              variant="outline"
            >
              Disconnect
            </Button>
          )}
        </div>
      </Card>

      {/* Schedule Activity */}
      {isConnected && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Schedule Wellness Activity
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Activity</label>
              <select
                value={selectedActivity || ''}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              >
                <option value="">Choose an activity...</option>
                {activities.map((activity) => (
                  <option key={activity.activityId} value={activity.activityId}>
                    {activity.name} ({activity.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Schedule Time</label>
              <input
                type="datetime-local"
                value={scheduledTime || getTomorrowISO()}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleScheduleActivity}
                disabled={isSchedulingActivity || !selectedActivity}
                className="w-full"
              >
                {isSchedulingActivity ? 'Scheduling...' : 'Schedule Activity'}
              </Button>
            </div>
          </div>

          {selectedActivity && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              {(() => {
                const activity = activities.find(a => a.activityId === selectedActivity);
                return activity ? (
                  <div>
                    <p className="font-medium">{activity.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Duration: {activity.estimated_duration_minutes || 30} minutes
                    </p>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </Card>
      )}

      {/* Daily Reminders */}
      {isConnected && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Daily Check-in Reminder
          </h4>

          <div className="flex items-end space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Reminder Time</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              />
            </div>
            <Button
              onClick={handleCreateDailyReminder}
              disabled={isCreatingReminder}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isCreatingReminder ? 'Creating...' : 'Create Daily Reminder'}
            </Button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            This will create a recurring daily reminder for your emotional wellness check-in.
          </p>
        </Card>
      )}

      {/* Upcoming Events */}
      {isConnected && upcomingEvents.length > 0 && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Upcoming Wellness Events</h4>
          
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{event.summary}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatEventTime(event.start.dateTime)}
                  </p>
                </div>
                <Button
                  onClick={() => handleDeleteEvent(event.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}