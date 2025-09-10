import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MessageSquare, Share2, CheckCircle, Zap, Users, Clock } from 'lucide-react'
import { Button } from './Button'

const OneTapIntegrations = ({ className = '' }) => {
  const [integrations, setIntegrations] = useState({
    calendar: false,
    slack: false,
    share: false
  })

  const [isConnecting, setIsConnecting] = useState(null)

  const handleIntegration = async (type) => {
    setIsConnecting(type)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIntegrations(prev => ({
      ...prev,
      [type]: true
    }))
    
    setIsConnecting(null)
  }

  const integrationConfig = {
    calendar: {
      icon: Calendar,
      title: 'Calendar Sync',
      description: 'Get wellness reminders before meetings and schedule recovery time',
      benefits: ['Smart scheduling', 'Stress prediction', 'Recovery time blocks'],
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    slack: {
      icon: MessageSquare,
      title: 'Slack Wellness',
      description: 'Receive gentle nudges and share wellness updates with your team',
      benefits: ['Private nudges', 'Team wellness', 'Slash commands'],
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    share: {
      icon: Share2,
      title: 'Share Progress',
      description: 'Celebrate milestones and inspire others in your network',
      benefits: ['Progress sharing', 'Inspiration', 'Community building'],
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      borderColor: 'border-green-200 dark:border-green-800'
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`wellness-card p-6 ${className}`}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-950/30 dark:to-green-950/30 mb-2">
            <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">
            One-Tap Integrations
          </h2>
          <p className="text-sm text-text-secondary">
            Connect your tools for seamless wellness
          </p>
        </div>

        {/* Integration Cards */}
        <div className="space-y-4">
          {Object.entries(integrationConfig).map(([key, config]) => {
            const IconComponent = config.icon
            const isConnected = integrations[key]
            const isCurrentlyConnecting = isConnecting === key

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  isConnected 
                    ? `${config.bgColor} ${config.borderColor}` 
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-lg ${
                    isConnected ? config.bgColor : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      isConnected ? config.color : 'text-gray-500'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold ${
                        isConnected ? 'text-text-primary' : 'text-text-primary'
                      }`}>
                        {config.title}
                      </h3>
                      {isConnected && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    
                    <p className="text-sm text-text-secondary">
                      {config.description}
                    </p>

                    {/* Benefits */}
                    <div className="flex flex-wrap gap-2">
                      {config.benefits.map((benefit, index) => (
                        <span 
                          key={index}
                          className={`text-xs px-2 py-1 rounded-full ${
                            isConnected 
                              ? 'bg-white/50 dark:bg-black/20 text-text-secondary' 
                              : 'bg-gray-200 dark:bg-gray-700 text-text-secondary'
                          }`}
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    {isConnected ? (
                      <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Connected</span>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleIntegration(key)}
                        disabled={isCurrentlyConnecting}
                        className="min-w-[100px]"
                      >
                        {isCurrentlyConnecting ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Connecting...</span>
                          </div>
                        ) : (
                          'Connect'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Additional Features */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <Users className="w-5 h-5 text-blue-500 mx-auto" />
              <div className="text-xs text-text-secondary">Team Wellness</div>
            </div>
            <div className="space-y-1">
              <Clock className="w-5 h-5 text-green-500 mx-auto" />
              <div className="text-xs text-text-secondary">Smart Timing</div>
            </div>
            <div className="space-y-1">
              <Zap className="w-5 h-5 text-purple-500 mx-auto" />
              <div className="text-xs text-text-secondary">Instant Setup</div>
            </div>
          </div>
        </div>

        {/* Encouraging Message */}
        <div className="text-center pt-2">
          <p className="text-sm text-text-secondary italic">
            {Object.values(integrations).every(Boolean) 
              ? "All set! Your wellness journey is now seamlessly integrated 🌟"
              : "Connect your tools to make wellness effortless 💫"
            }
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default OneTapIntegrations