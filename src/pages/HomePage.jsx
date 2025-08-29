import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDataStore } from '../stores/dataStore'
import { useSettingsStore } from '../stores/settingsStore'
import { useStressDetection } from '../hooks/useStressDetection'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { 
  Heart, 
  TrendingUp, 
  Calendar, 
  Activity, 
  Target, 
  Users, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Brain,
  Zap,
  Shield,
  Star,
  Play,
  BookOpen,
  Users2,
  BarChart3,
  Clock,
  Award
} from 'lucide-react'

export function HomePage() {
  const navigate = useNavigate()
  const { 
    dailyEntries, 
    activityLogs, 
    getActivityCompletionStreak, 
    getCheckInStreak,
    getTodayEntry 
  } = useDataStore()
  
  const { privacy } = useSettingsStore()
  const { stressLevel, stressType } = useStressDetection()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const todayEntry = getTodayEntry()
  const checkInStreak = getCheckInStreak()
  const activityStreak = getActivityCompletionStreak()

  const navigateToActivity = (activityName) => {
    // First try exact match
    let targetActivity = null
    
    // Look for exact match first
    targetActivity = dailyEntries.find(entry => 
      entry.activities?.some(activity => 
        activity.name.toLowerCase() === activityName.toLowerCase()
      )
    )
    
    if (!targetActivity) {
      // Then try partial match
      targetActivity = dailyEntries.find(entry => 
        entry.activities?.some(activity => 
          activity.name.toLowerCase().includes(activityName.toLowerCase())
        )
      )
    }
    
    if (targetActivity) {
      const activity = targetActivity.activities.find(a => 
        a.name.toLowerCase().includes(activityName.toLowerCase())
      )
      if (activity) {
        navigate(`/activities?start=${activity.activityId}`)
        return
      }
    }
    
    // Fallback to activities page
    navigate('/activities')
  }

  const handleConnectCalendar = () => {
    // Ensure external integrations are enabled in privacy settings
    const { privacy, updatePrivacy } = useSettingsStore.getState()
    
    if (!privacy.allowExternalIntegrations) {
      updatePrivacy({ allowExternalIntegrations: true })
    }

    // Navigate to integrations page
    navigate('/integrations')
  }

  const recommendedActivities = [
    {
      name: 'Mindful Breathing',
      description: 'Take 5 deep breaths to center yourself',
      icon: <Brain className="h-6 w-6" />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20'
    },
    {
      name: 'Gratitude Journal',
      description: 'Write down 3 things you\'re grateful for',
      icon: <BookOpen className="h-6 w-6" />,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20'
    },
    {
      name: 'Quick Walk',
      description: 'Take a 10-minute walk outside',
      icon: <Activity className="h-6 w-6" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-950/20'
    }
  ]

  const stats = [
    {
      label: 'Emotional Score',
      value: todayEntry?.emotionalScore || 0,
      icon: <Heart className="h-5 w-5" />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-950/20',
      borderColor: 'border-pink-200 dark:border-pink-800'
    },
    {
      label: 'Stress Level',
      value: stressLevel || 'Low',
      icon: <Shield className="h-5 w-5" />,
      color: stressLevel === 'High' ? 'text-red-600' : stressLevel === 'Moderate' ? 'text-yellow-600' : 'text-green-600',
      bgColor: stressLevel === 'High' ? 'bg-red-50 dark:bg-red-950/20' : stressLevel === 'Moderate' ? 'bg-yellow-50 dark:bg-yellow-950/20' : 'bg-green-50 dark:bg-green-950/20',
      borderColor: stressLevel === 'High' ? 'border-red-200 dark:border-red-800' : stressLevel === 'Moderate' ? 'border-yellow-200 dark:border-yellow-800' : 'border-green-200 dark:border-green-800'
    },
    {
      label: 'Activity Streak',
      value: `${activityStreak} days`,
                       icon: <Target className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      label: 'Check-in Streak',
      value: `${checkInStreak} days`,
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-700">
      {/* Hero Section */}
      <section className="section-padding container-padding">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          {/* Welcome Badge */}
          <div className={`fade-in-up visible inline-flex items-center gap-2 px-4 py-2 rounded-full border border-wellness-calm/30 text-wellness-harmony font-medium`}>
            <Sparkles className="h-4 w-4" />
            Welcome to ResilientFlow
          </div>

          {/* Main Heading */}
          <h1 className={`fade-in-up ${isVisible ? 'visible' : ''} text-5xl md:text-6xl lg:text-7xl font-bold text-balance`}>
            Build Your
            <span className="text-gradient-wellness block">Mental Resilience</span>
            Every Day
          </h1>

          {/* Subtitle */}
          <p className={`fade-in-up ${isVisible ? 'visible' : ''} max-w-3xl mx-auto text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed`}>
            Track your emotional well-being, build healthy habits, and connect with a supportive community. 
            Your journey to mental strength starts here.
          </p>

          {/* CTA Buttons */}
          <div className={`fade-in-up ${isVisible ? 'visible' : ''} flex flex-col sm:flex-row gap-4 justify-center items-center`}>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="wellness-button group"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/activities')}
              className="btn-secondary px-6 py-3 text-base font-semibold"
            >
              Explore Activities
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="container-padding pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className={`fade-in-up ${isVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`wellness-card h-full border ${stat.borderColor}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                      <div className={stat.color}>
                        {stat.icon}
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {stat.label}
                    </h3>
                  </div>
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Activities */}
      <section className="container-padding pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">
              Recommended for You
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Based on your current state, here are some activities to help you build resilience today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedActivities.map((activity, index) => (
              <div 
                key={activity.name}
                className={`fade-in-up ${isVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="wellness-card h-full group cursor-pointer hover:shadow-large transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${activity.bgColor}`}>
                      <div className={`bg-gradient-to-r ${activity.color} bg-clip-text text-transparent`}>
                        {activity.icon}
                      </div>
                    </div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Recommended
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    {activity.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {activity.description}
                  </p>
                  
                  <Button 
                    onClick={() => navigateToActivity(activity.name)}
                    className="w-full btn-primary group"
                  >
                    <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Try Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-padding pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">
              Why Choose ResilientFlow?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our comprehensive approach to mental wellness combines science-backed methods with intuitive design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="h-8 w-8" />,
                title: 'AI-Powered Insights',
                description: 'Get personalized recommendations based on your emotional patterns and progress.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: <Users2 className="h-8 w-8" />,
                title: 'Supportive Community',
                description: 'Connect with others on similar journeys in our safe, moderated circles.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                                           icon: <Target className="h-8 w-8" />,
                title: 'Goal Tracking',
                description: 'Set meaningful goals and track your progress with visual insights.',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: <BarChart3 className="h-8 w-8" />,
                title: 'Progress Analytics',
                description: 'Understand your emotional trends with detailed analytics and reports.',
                color: 'from-orange-500 to-red-500'
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: 'Privacy First',
                description: 'Your data is secure and private. You control what you share.',
                color: 'from-indigo-500 to-blue-500'
              },
              {
                icon: <Award className="h-8 w-8" />,
                title: 'Evidence-Based',
                description: 'Built on proven psychological principles and mental health research.',
                color: 'from-yellow-500 to-orange-500'
              }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className={`fade-in-up ${isVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="wellness-card h-full text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-700 mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className={`bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                      {feature.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calendar Integration CTA */}
      <section className="container-padding pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="wellness-card text-center p-8 md:p-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-wellness-calm to-wellness-peace mb-6">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">
              Connect Your Calendar
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Sync your schedule with ResilientFlow to get timely reminders and integrate wellness activities into your daily routine.
            </p>
            
            <Button 
              onClick={handleConnectCalendar}
              className="wellness-button group"
              disabled={!privacy.allowExternalIntegrations}
            >
              <Zap className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Connect Calendar
            </Button>
            
            {!privacy.allowExternalIntegrations && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Enable external integrations in your privacy settings first
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Get Started CTA */}
      <section className="container-padding pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="wellness-card p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">
              Ready to Build Your Resilience?
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already on their journey to better mental health and emotional strength.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/dashboard')}
                className="wellness-button group"
              >
                <Star className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Start Free Today
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/pricing')}
                className="btn-secondary px-6 py-3 text-base font-semibold"
              >
                View Plans
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
