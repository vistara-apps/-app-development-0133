/**
 * Google Calendar Integration Service for ResilientFlow
 * 
 * This service handles Google OAuth authentication and Calendar API integration
 * for scheduling wellness activities and reminders.
 */

// Google API Configuration
const GOOGLE_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  discoveryDoc: 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
  scopes: 'https://www.googleapis.com/auth/calendar.events'
};

/**
 * Google Calendar OAuth Manager
 */
export class GoogleCalendarOAuth {
  constructor() {
    this.gapi = null;
    this.tokenClient = null;
    this.isInitialized = false;
    this.isAuthorized = false;
  }

  /**
   * Initialize Google APIs and OAuth
   */
  async initialize() {
    try {
      // Load Google APIs
      await this.loadGoogleAPIs();
      
      // Initialize gapi
      await this.gapi.load('client', async () => {
        await this.gapi.client.init({
          apiKey: GOOGLE_CONFIG.apiKey,
          discoveryDocs: [GOOGLE_CONFIG.discoveryDoc],
        });
      });

      // Initialize OAuth token client
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CONFIG.clientId,
        scope: GOOGLE_CONFIG.scopes,
        callback: '', // Will be set for each request
      });

      this.isInitialized = true;
      console.log('Google Calendar API initialized successfully');
      return true;

    } catch (error) {
      console.error('Failed to initialize Google Calendar API:', error);
      return false;
    }
  }

  /**
   * Load Google APIs dynamically
   */
  loadGoogleAPIs() {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.gapi && window.google) {
        this.gapi = window.gapi;
        resolve();
        return;
      }

      // Load gapi
      const gapiScript = document.createElement('script');
      gapiScript.src = 'https://apis.google.com/js/api.js';
      gapiScript.onload = () => {
        this.gapi = window.gapi;
        
        // Load Google Identity Services
        const gisScript = document.createElement('script');
        gisScript.src = 'https://accounts.google.com/gsi/client';
        gisScript.onload = () => resolve();
        gisScript.onerror = () => reject(new Error('Failed to load Google Identity Services'));
        document.head.appendChild(gisScript);
      };
      gapiScript.onerror = () => reject(new Error('Failed to load Google APIs'));
      document.head.appendChild(gapiScript);
    });
  }

  /**
   * Sign in to Google and authorize calendar access
   */
  async signIn() {
    if (!this.isInitialized) {
      throw new Error('Google Calendar API not initialized');
    }

    return new Promise((resolve, reject) => {
      try {
        this.tokenClient.callback = async (response) => {
          if (response.error) {
            reject(new Error(response.error));
            return;
          }

          this.isAuthorized = true;
          
          // Store token info for session
          sessionStorage.setItem('google_access_token', response.access_token);
          sessionStorage.setItem('google_token_expires', Date.now() + (response.expires_in * 1000));
          
          resolve(response);
        };

        // Check if already authorized
        const existingToken = sessionStorage.getItem('google_access_token');
        const tokenExpires = sessionStorage.getItem('google_token_expires');
        
        if (existingToken && tokenExpires && Date.now() < parseInt(tokenExpires)) {
          this.isAuthorized = true;
          resolve({ access_token: existingToken });
          return;
        }

        // Request authorization
        this.tokenClient.requestAccessToken({ prompt: 'consent' });
        
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Sign out and revoke access
   */
  async signOut() {
    try {
      const token = sessionStorage.getItem('google_access_token');
      if (token) {
        // Revoke the token
        await fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
      }

      // Clear session
      sessionStorage.removeItem('google_access_token');
      sessionStorage.removeItem('google_token_expires');
      this.isAuthorized = false;

      console.log('Signed out from Google Calendar');
      return true;

    } catch (error) {
      console.error('Error signing out:', error);
      return false;
    }
  }

  /**
   * Check if currently authorized
   */
  isSignedIn() {
    const token = sessionStorage.getItem('google_access_token');
    const expires = sessionStorage.getItem('google_token_expires');
    return token && expires && Date.now() < parseInt(expires);
  }

  /**
   * Get current user's Google account info
   */
  async getUserInfo() {
    if (!this.isSignedIn()) {
      throw new Error('Not signed in to Google');
    }

    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('google_access_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get user info');
      }

      return await response.json();

    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
  }
}

/**
 * Google Calendar API Service
 */
export class GoogleCalendarService {
  constructor() {
    this.oauth = new GoogleCalendarOAuth();
  }

  /**
   * Initialize the service
   */
  async initialize() {
    return await this.oauth.initialize();
  }

  /**
   * Authenticate with Google
   */
  async authenticate() {
    return await this.oauth.signIn();
  }

  /**
   * Sign out
   */
  async signOut() {
    return await this.oauth.signOut();
  }

  /**
   * Check authentication status
   */
  isAuthenticated() {
    return this.oauth.isSignedIn();
  }

  /**
   * Get user's calendars
   */
  async getCalendars() {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Google');
    }

    try {
      const response = await this.oauth.gapi.client.calendar.calendarList.list({
        showHidden: false,
        showDeleted: false
      });

      return response.result.items || [];

    } catch (error) {
      console.error('Error getting calendars:', error);
      throw error;
    }
  }

  /**
   * Create a wellness activity event
   */
  async createWellnessEvent(activityData) {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Google');
    }

    try {
      const { activity, scheduledTime, duration = 30 } = activityData;
      
      const startTime = new Date(scheduledTime);
      const endTime = new Date(startTime.getTime() + (duration * 60000)); // Add duration in minutes

      const event = {
        summary: `🧘 ${activity.name} - ResilientFlow`,
        description: `${activity.description}\n\n📱 Activity from ResilientFlow app\n🎯 Target: ${activity.targetEmotion}\n\nGuide: ${activity.guideContent}`,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 10 },
            { method: 'email', minutes: 60 }
          ]
        },
        colorId: '2', // Green color for wellness events
        source: {
          title: 'ResilientFlow',
          url: window.location.origin
        }
      };

      const response = await this.oauth.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        sendUpdates: 'all'
      });

      console.log('Wellness event created:', response.result);
      return response.result;

    } catch (error) {
      console.error('Error creating wellness event:', error);
      throw error;
    }
  }

  /**
   * Create a daily check-in reminder
   */
  async createDailyCheckInReminder(time = '19:00') { // Default 7 PM
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Google');
    }

    try {
      const today = new Date();
      const reminderTime = new Date();
      const [hours, minutes] = time.split(':');
      reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // If time has passed today, start tomorrow
      if (reminderTime <= today) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }

      const event = {
        summary: '📝 Daily Emotional Check-in - ResilientFlow',
        description: 'Time for your daily emotional wellness check-in!\n\n🎯 Reflect on your day and track your emotional state\n📱 Open ResilientFlow to complete your check-in',
        start: {
          dateTime: reminderTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: new Date(reminderTime.getTime() + (15 * 60000)).toISOString(), // 15 minutes
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        recurrence: ['RRULE:FREQ=DAILY'], // Repeat daily
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 0 },
            { method: 'email', minutes: 30 }
          ]
        },
        colorId: '9', // Blue color for check-ins
        source: {
          title: 'ResilientFlow',
          url: window.location.origin
        }
      };

      const response = await this.oauth.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        sendUpdates: 'all'
      });

      console.log('Daily reminder created:', response.result);
      return response.result;

    } catch (error) {
      console.error('Error creating daily reminder:', error);
      throw error;
    }
  }

  /**
   * Get upcoming wellness events
   */
  async getUpcomingWellnessEvents(days = 7) {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Google');
    }

    try {
      const timeMin = new Date();
      const timeMax = new Date();
      timeMax.setDate(timeMax.getDate() + days);

      const response = await this.oauth.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        q: 'ResilientFlow',
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 50
      });

      return response.result.items || [];

    } catch (error) {
      console.error('Error getting wellness events:', error);
      throw error;
    }
  }

  /**
   * Delete a wellness event
   */
  async deleteEvent(eventId) {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Google');
    }

    try {
      await this.oauth.gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId
      });

      console.log('Event deleted:', eventId);
      return true;

    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  /**
   * Check if Google Calendar is configured
   */
  static isConfigured() {
    return !!(GOOGLE_CONFIG.clientId && 
              GOOGLE_CONFIG.apiKey && 
              GOOGLE_CONFIG.clientId !== 'your_google_client_id_here' &&
              GOOGLE_CONFIG.apiKey !== 'your_google_api_key_here');
  }
}

// Export singleton instance
export const googleCalendar = new GoogleCalendarService();

// Export configuration check
export const isGoogleCalendarConfigured = GoogleCalendarService.isConfigured;

export default googleCalendar;