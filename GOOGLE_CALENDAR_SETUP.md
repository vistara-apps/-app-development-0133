# Google Calendar OAuth Setup Guide

This guide walks you through setting up Google Calendar integration with OAuth 2.0 for production use.

## Step 1: Google Cloud Console Setup

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name: "ResilientFlow" (or your preferred name)
4. Click "Create"

### 1.2 Enable Google Calendar API
1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Calendar API"
3. Click on it and press "ENABLE"

### 1.3 Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" (unless you have Google Workspace)
3. Fill out the required fields:
   - **App name**: ResilientFlow
   - **User support email**: your-email@example.com
   - **Developer contact information**: your-email@example.com
4. Click "Save and Continue"

5. **Scopes** (Step 2):
   - Click "Add or Remove Scopes"
   - Add: `https://www.googleapis.com/auth/calendar.events`
   - Click "Update" → "Save and Continue"

6. **Test users** (Step 3):
   - Add your email address for testing
   - Click "Save and Continue"

7. **Summary** (Step 4):
   - Review and click "Back to Dashboard"

### 1.4 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Fill out:
   - **Name**: ResilientFlow Web Client
   - **Authorized JavaScript origins**: 
     - `http://localhost:5173` (development)
     - `https://yourdomain.com` (production)
   - **Authorized redirect URIs**: 
     - `http://localhost:5173` (development)
     - `https://yourdomain.com` (production)
5. Click "Create"

6. **Save your credentials**:
   - Copy the **Client ID** (starts with numbers, ends with `.googleusercontent.com`)
   - You don't need the client secret for this type of integration

### 1.5 Create API Key
1. In "Credentials", click "Create Credentials" → "API key"
2. Copy the API key
3. Click "Restrict Key" and:
   - **Application restrictions**: HTTP referrers
   - **Website restrictions**: Add your domains:
     - `localhost:5173/*`
     - `yourdomain.com/*`
   - **API restrictions**: Restrict to "Google Calendar API"
4. Click "Save"

## Step 2: Update Environment Variables

Add these to your `.env` file:

```env
# Google APIs (Real Calendar Integration)
VITE_GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=AIzaSyABcdefghijklmnopqrstuvwxyz1234567890
```

## Step 3: Test the Integration

1. **Start your app**: `npm run dev`
2. **Go to Integrations page**: `http://localhost:5173/integrations`
3. **Connect Google Calendar**:
   - Click "Connect to Google Calendar"
   - Sign in with your Google account
   - Grant calendar permissions
   - You should see "Connected" status

4. **Test functionality**:
   - Schedule a wellness activity
   - Create daily check-in reminders
   - View upcoming events

## Step 4: Production Deployment

### 4.1 Update OAuth Settings
1. In Google Cloud Console → Credentials
2. Edit your OAuth client ID
3. Add your production domain to:
   - Authorized JavaScript origins: `https://yourdomain.com`
   - Authorized redirect URIs: `https://yourdomain.com`

### 4.2 Update Environment Variables
```env
# Production values
VITE_GOOGLE_CLIENT_ID=your-production-client-id
VITE_GOOGLE_API_KEY=your-production-api-key
```

### 4.3 Request Production OAuth Verification
For production use with many users:

1. Go to OAuth consent screen
2. Click "Publish App"
3. Submit for verification if needed (required for 100+ users)

## Integration Features

### ✅ What the integration does:

1. **OAuth Authentication**: Secure login with Google
2. **Schedule Activities**: Add wellness activities to calendar
3. **Daily Reminders**: Create recurring check-in reminders
4. **Event Management**: View and delete wellness events
5. **User Profile**: Display connected Google account info

### 🔧 Technical Features:

- **Dynamic script loading**: Google APIs loaded on demand
- **Token management**: Automatic token refresh handling
- **Security**: Proper OAuth 2.0 implementation
- **Error handling**: Graceful fallbacks for API failures
- **Session persistence**: Maintains connection across page reloads

## Security Best Practices

1. **Restrict API keys** to specific domains and APIs
2. **Use HTTPS** in production (required by Google)
3. **Validate tokens** server-side for sensitive operations
4. **Limit scopes** to only what's needed (calendar.events)
5. **Handle token expiration** gracefully

## Troubleshooting

### Common Issues:

1. **"Origin not allowed"**
   - Check JavaScript origins in OAuth settings
   - Ensure exact domain match (including protocol)

2. **"API key not valid"**
   - Check API key restrictions
   - Verify Google Calendar API is enabled

3. **"Access blocked"**
   - App needs verification for production use
   - Add test users during development

4. **"Calendar events not appearing"**
   - Check event permissions and sharing settings
   - Verify calendar API quotas

### Debug Steps:

1. **Check browser console** for JavaScript errors
2. **Verify credentials** in Google Cloud Console
3. **Test with minimal scopes** first
4. **Use Google's OAuth playground** for token testing

## Cost and Limits

- **Google Calendar API**: Free for most use cases
- **Rate limits**: 1,000 requests per 100 seconds per user
- **Daily quota**: 1,000,000 requests per day
- **No additional costs** for standard usage

## Support

- **Google OAuth Documentation**: https://developers.google.com/identity/protocols/oauth2
- **Calendar API Reference**: https://developers.google.com/calendar/api/v3/reference
- **Google Cloud Support**: Available in console

---

Your Google Calendar integration is now production-ready with secure OAuth 2.0 authentication! 🎉