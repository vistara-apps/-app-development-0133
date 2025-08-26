import React, { useState, useEffect } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { useDataStore } from '../stores/dataStore'
import { useAuthStore } from '../stores/authStore'
import { useCirclesStore } from '../stores/circlesStore'
import { Link } from 'react-router-dom'
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb,
  AlertCircle,
  Crown,
  Sparkles,
  Users,
  ArrowRight
} from 'lucide-react'

export function InsightsPage() {
  const { dailyEntries, activityLogs } = useDataStore()
  const { user } = useAuthStore()
  const { getUserCircles } = useCirclesStore()
  const [insights, setInsights] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)

  const isPremium = user?.subscriptionTier === 'premium'

  // Mock insights for demo
  const mockInsights = [
    {
      type: 'pattern',
      title: 'Weekly Pattern Detected',
      content: 'You tend to feel more positive on weekends and Wednesdays. Consider scheduling challenging tasks on these days when your resilience is naturally higher.',
      confidence: 'High',
      icon: TrendingUp
    },
    {
      type: 'recommendation',
      title: 'Activity Recommendation',
      content: 'Based on your preferences, mindfulness activities have been most effective for you. Try incorporating them during stressful periods.',
      confidence: 'Medium',
      icon: Target
    },
    {
      type: 'insight',
      title: 'Emotional Recovery',
      content: 'Your data shows you typically recover from negative emotional states within 2-3 days when you engage with activities consistently.',
      confidence: 'High',
      icon: Lightbulb
    }
  ]

  useEffect(() => {
    if (isPremium) {
      setInsights(mockInsights)
    }
  }, [isPremium])

  const generatePersonalizedInsights = async () => {
    if (!isPremium) {
      setShowUpgrade(true)
      return
    }

    setIsGenerating(true)
    
    try {
      // Simulate AI generation with timeout
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const aiInsight = {
        type: 'ai-generated',
        title: 'AI-Generated Insight',
        content: `Based on your ${dailyEntries.length} check-ins and ${activityLogs.length} completed activities, you show strong consistency in emotional tracking. Your resilience building efforts are most effective when combined with regular mindfulness practices.`,
        confidence: 'AI-Powered',
        icon: Brain
      }

      setInsights([aiInsight, ...mockInsights])
    } catch (error) {
      console.error('Error generating insights:', error)
      setInsights(mockInsights)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Personalized Insights</h1>
          <p className="text-text-secondary">AI-powered analysis of your emotional patterns</p>
        </div>
        
        {isPremium && (
          <Button 
            onClick={generatePersonalizedInsights}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Generate New Insights
              </>
            )}
          </Button>
        )}
      </div>

      {!isPremium && (
        <Card className="p-6 border-2 border-accent/20 bg-accent/5">
          <div className="flex items-center space-x-4">
            <Crown className="w-8 h-8 text-accent" />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-text-primary">
                Unlock AI-Powered Insights
              </h3>
              <p className="text-text-secondary">
                Get personalized recommendations and pattern analysis with Premium
              </p>
            </div>
            <Button onClick={() => setShowUpgrade(true)}>
              Upgrade to Premium
            </Button>
          </div>
        </Card>
      )}

      {/* Current Insights */}
      {insights.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-medium text-text-primary">Your Insights</h2>
          
          <div className="grid gap-6">
            {insights.map((insight, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <insight.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-text-primary">
                        {insight.title}
                      </h3>
                      <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-sm">
                        {insight.confidence}
                      </span>
                    </div>
                    <p className="text-text-secondary leading-relaxed">
                      {insight.content}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Data Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-text-primary mb-4">Data Summary</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{dailyEntries.length}</div>
            <div className="text-sm text-text-secondary">Total Check-ins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{activityLogs.length}</div>
            <div className="text-sm text-text-secondary">Activities Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {dailyEntries.filter(e => e.emotionalState === 'positive').length}
            </div>
            <div className="text-sm text-text-secondary">Positive Days</div>
          </div>
        </div>
      </Card>

      {/* Support Circles Insights */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-text-primary">Support Circles Insights</h3>
          <Link 
            to="/circles" 
            className="text-sm text-primary flex items-center hover:underline"
          >
            View Circles
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {getUserCircles().length > 0 ? (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <Users className="w-5 h-5 text-primary" />
                  <h4 className="font-medium text-text-primary">Group Progress</h4>
                </div>
                <p className="text-text-secondary text-sm">
                  Members in your circles have a 78% higher activity completion rate compared to solo users.
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <h4 className="font-medium text-text-primary">Emotional Trends</h4>
                </div>
                <p className="text-text-secondary text-sm">
                  Circle members report 23% more positive emotional states after participating in group activities.
                </p>
              </div>
            </div>
            
            <div className="text-sm text-text-secondary">
              Join more circles or invite friends to enhance your resilience journey together.
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <Users className="w-10 h-10 mx-auto text-text-secondary mb-2" />
            <p className="text-text-secondary mb-3">
              Join support circles to gain collective insights and improve faster
            </p>
            <Link 
              to="/circles" 
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Explore Circles
            </Link>
          </div>
        )}
      </Card>
      
      {/* Tips */}
      {!isPremium && (
        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-6 h-6 text-blue-500 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-2">
                Getting Better Insights
              </h3>
              <ul className="text-text-secondary space-y-1 text-sm">
                <li>• Complete daily check-ins consistently</li>
                <li>• Try different types of activities</li>
                <li>• Add notes to your entries for richer data</li>
                <li>• Join support circles for collective progress</li>
                <li>• Upgrade to Premium for AI-powered analysis</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
