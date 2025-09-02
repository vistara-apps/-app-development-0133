import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './Card';
import { Button } from './Button';
import { featureIcons } from '../../public/icons/feature-icons';
import {
  Sparkles,
  ArrowRight,
  Brain,
  Users2,
  Target,
  BarChart3,
  Shield,
  Award,
  Calendar,
  Zap,
  Star
} from 'lucide-react';

export function Homepage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
                emoji: featureIcons['ai-powered-insights'],
                title: 'AI-Powered Insights',
                description: 'Get personalized recommendations based on your emotional patterns and progress.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: <Users2 className="h-8 w-8" />,
                emoji: featureIcons['supportive-community'],
                title: 'Supportive Community',
                description: 'Connect with others on similar journeys in our safe, moderated circles.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: <Target className="h-8 w-8" />,
                emoji: featureIcons['goal-tracking'],
                title: 'Goal Tracking',
                description: 'Set meaningful goals and track your progress with visual insights.',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: <BarChart3 className="h-8 w-8" />,
                emoji: featureIcons['progress-analytics'],
                title: 'Progress Analytics',
                description: 'Understand your emotional trends with detailed analytics and reports.',
                color: 'from-orange-500 to-red-500'
              },
              {
                icon: <Shield className="h-8 w-8" />,
                emoji: featureIcons['privacy-first'],
                title: 'Privacy First',
                description: 'Your data is secure and private. You control what you share.',
                color: 'from-indigo-500 to-blue-500'
              },
              {
                icon: <Award className="h-8 w-8" />,
                emoji: featureIcons['evidence-based'],
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
                    <div className={`bg-gradient-to-r ${feature.color} bg-clip-text text-transparent flex items-center justify-center`}>
                      {feature.icon}
                      <span className="ml-2 text-2xl">{feature.emoji}</span>
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
              <span className="ml-2 text-2xl text-white">{featureIcons['calendar-integration']}</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">
              Connect Your Calendar
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Sync your schedule with ResilientFlow to get timely reminders and integrate wellness activities into your daily routine.
            </p>
            
            <Button 
              onClick={() => navigate('/integrations')}
              className="wellness-button group"
            >
              <Zap className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Connect Calendar
            </Button>
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
  );
}

export default Homepage;

