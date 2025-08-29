import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Clock,
  RefreshCw,
  ChevronRight,
  Plus,
  ExternalLink,
  Users
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { cn } from '../utils/cn';

// Utility function for cn
function cnUtil(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Grid Pattern Card Components
function GridPatternCard({ 
  children, 
  className,
  patternClassName,
  gradientClassName
}) {
  return (
    <motion.div
      className={cnUtil(
        "border w-full rounded-lg overflow-hidden",
        "bg-white dark:bg-zinc-950",
        "border-zinc-200 dark:border-zinc-900",
        className
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className={cnUtil(
        "size-full bg-repeat bg-[length:50px_50px]",
        "bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)]",
        patternClassName
      )}>
        <div className={cnUtil(
          "size-full bg-gradient-to-tr",
          "from-white via-white/[0.85] to-white",
          "dark:from-zinc-950 dark:via-zinc-950/[.85] dark:to-zinc-950",
          gradientClassName
        )}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

function GridPatternCardBody({ className, ...props }) {
  return (
    <div 
      className={cnUtil("text-left p-4 md:p-6", className)} 
      {...props} 
    />
  );
}

// Status Components
const StatusIndicator = ({ status, className }) => {
  const statusConfig = {
    connected: {
      icon: CheckCircle,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
      label: "Connected",
      description: "Successfully synced"
    },
    disconnected: {
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      label: "Disconnected",
      description: "Connection failed"
    },
    syncing: {
      icon: RefreshCw,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      label: "Syncing",
      description: "Updating calendar data"
    },
    error: {
      icon: AlertCircle,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      label: "Error",
      description: "Authentication required"
    },
    warning: {
      icon: AlertCircle,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-950/20",
      label: "Limited Access",
      description: "Some features unavailable"
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cnUtil("flex items-center gap-3", className)}>
      <div className={cnUtil("p-2 rounded-full", config.bgColor)}>
        <Icon 
          className={cnUtil("h-4 w-4", config.color, status === 'syncing' && "animate-spin")} 
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{config.label}</span>
          {status === 'connected' && (
            <div className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">{config.description}</p>
      </div>
    </div>
  );
};

// Calendar Event Component
const CalendarEventCard = ({ event }) => {
  const typeColors = {
    meeting: "bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400",
    reminder: "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400",
    event: "bg-purple-100 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400"
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-3 rounded-lg border bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-2 h-8 rounded-full bg-blue-500"></div>
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{event.title}</h4>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="h-3 w-3 text-gray-500 dark:text-gray-400" />
            <span className="text-xs text-gray-600 dark:text-gray-400">{event.time}</span>
            {event.attendees && (
              <>
                <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{event.attendees} attendees</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Badge variant="secondary" className={cnUtil("text-xs", typeColors[event.type])}>
        {event.type}
      </Badge>
    </motion.div>
  );
};

// Main Google Calendar Integration Component
const GoogleCalendarIntegration = ({ className }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState('disconnected');
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());
  const [userInfo, setUserInfo] = useState(null);

  // Mock upcoming events
  const upcomingEvents = [
    {
      id: '1',
      title: 'Team Standup',
      time: '9:00 AM',
      attendees: 5,
      type: 'meeting'
    },
    {
      id: '2',
      title: 'Project Review',
      time: '2:00 PM',
      attendees: 8,
      type: 'meeting'
    },
    {
      id: '3',
      title: 'Submit Report',
      time: '5:00 PM',
      type: 'reminder'
    }
  ];

  const handleConnect = async () => {
    setStatus('syncing');
    
    try {
      // Use the existing Google Calendar service
      const { GoogleCalendarService } = await import('../services/GoogleCalendarService');
      const calendarService = new GoogleCalendarService();
      
      const response = await calendarService.signIn();
      
      if (response && response.access_token) {
        setIsConnected(true);
        setStatus('connected');
        setLastSync(new Date());
        
        // Get user info
        try {
          const user = await calendarService.getUserInfo();
          setUserInfo(user);
        } catch (error) {
          console.warn('Failed to fetch user info:', error);
        }
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Connection failed:', error);
      setStatus('error');
    }
  };

  const handleDisconnect = async () => {
    try {
      const { GoogleCalendarService } = await import('../services/GoogleCalendarService');
      const calendarService = new GoogleCalendarService();
      await calendarService.signOut();
      
      setIsConnected(false);
      setStatus('disconnected');
      setUserInfo(null);
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  const handleSync = () => {
    setStatus('syncing');
    setTimeout(() => {
      setStatus('connected');
      setLastSync(new Date());
    }, 1500);
  };

  const openGoogleCalendar = () => {
    window.open('https://calendar.google.com', '_blank');
  };

  return (
    <div className={cnUtil("w-full max-w-4xl mx-auto space-y-6", className)}>
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
            <CalendarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Google Calendar</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage your calendar integration</p>
          </div>
        </div>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Connection Status Card */}
      <GridPatternCard>
        <GridPatternCardBody>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Connection Status</h3>
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Active" : "Inactive"}
            </Badge>
          </div>
          
          <StatusIndicator status={status} className="mb-6" />
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Auto-sync</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Automatically sync calendar events
              </p>
            </div>
            <Switch 
              checked={syncEnabled} 
              onCheckedChange={setSyncEnabled}
              disabled={!isConnected}
            />
          </div>

          {isConnected && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>Last synced: {lastSync.toLocaleTimeString()}</span>
                <Button variant="ghost" size="sm" onClick={handleSync}>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Sync now
                </Button>
              </div>
            </motion.div>
          )}
        </GridPatternCardBody>
      </GridPatternCard>

      {/* Action Buttons */}
      <motion.div 
        className="flex gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {!isConnected ? (
          <Button onClick={handleConnect} className="flex-1" disabled={status === 'syncing'}>
            {status === 'syncing' ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Connect Google Calendar
              </>
            )}
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={handleDisconnect} className="flex-1">
              Disconnect
            </Button>
            <Button variant="outline" onClick={openGoogleCalendar} className="flex-1">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Calendar
            </Button>
          </>
        )}
      </motion.div>

      {/* Upcoming Events */}
      <AnimatePresence>
        {isConnected && status === 'connected' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Upcoming Events</h3>
                <Button variant="ghost" size="sm">
                  View all
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CalendarEventCard event={event} />
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {upcomingEvents.length} events today
                  </span>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add event
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Integration Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Integration Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Real-time Sync</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Automatically sync events and updates
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Smart Notifications</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Get notified about upcoming events
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Calendar Management</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Create and manage events directly
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Multi-Calendar Support</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Sync multiple Google calendars
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default GoogleCalendarIntegration;