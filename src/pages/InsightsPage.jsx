import React, { useState, useEffect } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { useDataStore } from '../stores/dataStore'
import { useAuthStore } from '../stores/authStore'
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb,
  AlertCircle,
  Crown,
  Sparkles
} from 'lucide-react'

export function InsightsPage() {
  const { dailyEntries, activityLogs } = useDataStore()
  const { user } = useAuthStore()
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
                <li>• Upgrade to Premium for AI-powered analysis</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}