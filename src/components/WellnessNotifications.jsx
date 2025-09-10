import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Heart, Brain, Users, Calendar, X, CheckCircle, Clock, Sparkles } from 'lucide-react'
import { Button } from './Button'

const WellnessNotifications = ({ className = '' }) => {
  const [notifications, setNotifications] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  // Sample notifications data
  const sampleNotifications = [
    {
      id: 1,
      type: 'reminder',
      title: 'Time for your daily check-in',
      message: 'How are you feeling today? Take a moment to reflect.',
      icon: Heart,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-950/20',
      time: '2 minutes ago',
      read: false,
      action: 'Start Check-in'
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Streak Milestone! 🔥',
      message: 'You\'ve maintained your wellness streak for 7 days!',
      icon: Sparkles,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      time: '1 hour ago',
      read: false,
      action: 'Celebrate'
    },
    {
      id: 3,
      type: 'suggestion',
      title: 'Mindful Break Suggestion',
      message: 'You seem stressed. Try a 5-minute breathing exercise.',
      icon: Brain,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      time: '3 hours ago',
      read: true,
      action: 'Try Now'
    },
    {
      id: 4,
      type: 'community',
      title: 'New Circle Activity',
      message: 'Sarah shared a gratitude practice in your Wellness Circle.',
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      time: '5 hours ago',
      read: true,
      action: 'View Circle'
    },
    {
      id: 5,
      type: 'calendar',
      title: 'Wellness Time Blocked',
      message: 'Your calendar has been updated with recovery time after your meeting.',
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      time: '1 day ago',
      read: true,
      action: 'View Calendar'
    }
  ]

  useEffect(() => {
    setNotifications(sampleNotifications)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const handleNotificationAction = (notification) => {
    markAsRead(notification.id)
    // Here you would handle the specific action based on notification type
    console.log(`Action triggered: ${notification.action}`)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
      >
        <Bell className="w-5 h-5 text-text-primary" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-xl shadow-large border border-gray-200 dark:border-gray-700 z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text-primary">
                  Notifications
                </h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={markAllAsRead}
                      className="text-xs"
                    >
                      Mark all read
                    </Button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <X className="w-4 h-4 text-text-secondary" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-text-secondary">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((notification, index) => {
                    const IconComponent = notification.icon
                    
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                          !notification.read ? 'bg-blue-50/50 dark:bg-blue-950/10' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {/* Icon */}
                          <div className={`p-2 rounded-lg ${notification.bgColor} flex-shrink-0`}>
                            <IconComponent className={`w-4 h-4 ${notification.color}`} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className={`text-sm font-medium ${
                                  !notification.read ? 'text-text-primary' : 'text-text-secondary'
                                }`}>
                                  {notification.title}
                                </h4>
                                <p className="text-xs text-text-secondary mt-1">
                                  {notification.message}
                                </p>
                                <div className="flex items-center space-x-2 mt-2">
                                  <span className="text-xs text-text-tertiary">
                                    {notification.time}
                                  </span>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center space-x-1 ml-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleNotificationAction(notification)}
                                  className="text-xs px-2 py-1"
                                >
                                  {notification.action}
                                </Button>
                                <button
                                  onClick={() => removeNotification(notification.id)}
                                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                >
                                  <X className="w-3 h-3 text-text-tertiary" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="secondary"
                onClick={() => setIsOpen(false)}
                className="w-full text-sm"
              >
                Close
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default WellnessNotifications