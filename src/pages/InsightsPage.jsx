import React, { useState, useEffect } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { WeeklyReport } from '../components/WeeklyReport'
import { useDataStore } from '../stores/dataStore'
import { useAuthStore } from '../stores/authStore'
import { useCirclesStore } from '../stores/circlesStore'
import { useSettingsStore } from '../stores/settingsStore'
import { getInsights, getWeeklyReport, isOpenAIConfigured } from '../services/RealInsightGenerator'
import { getMockInsights, getMockWeeklyReport } from '../services/InsightGenerator'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb,
  AlertCircle,
  Crown,
  Sparkles,
  Users,
  ArrowRight,
  Calendar,
  BarChart,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react'

export function InsightsPage() {
  const { dailyEntries, activityLogs, userId } = useDataStore()
  const { user } = useAuthStore()
  const { getUserCircles } = useCirclesStore()
  const { features } = useSettingsStore()
  const navigate = useNavigate()
  const [insights, setInsights] = useState([])
  const [weeklyReport, setWeeklyReport] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [activeTab, setActiveTab] = useState('insights')

  const isPremium = user?.subscriptionTier === 'premium'

  // Load insights and report on mount
  useEffect(() => {
    if (isPremium || userId === 'demo-user-1') {
      loadInsights()
      loadWeeklyReport()
    }
  }, [isPremium, userId])

  // Load insights using real AI or mock data
  const loadInsights = async () => {
    setIsGenerating(true)
    try {
      const insightsData = await getInsights(userId)
      setInsights(insightsData)
    } catch (error) {
      console.error('Failed to load insights:', error)
      setInsights(getMockInsights()) // Fallback to mock
    } finally {
      setIsGenerating(false)
    }
  }

  // Load weekly report using real AI or mock data
  const loadWeeklyReport = async () => {
    setIsGeneratingReport(true)
    try {
      const reportData = await getWeeklyReport(userId)
      setWeeklyReport(reportData)
    } catch (error) {
      console.error('Failed to load weekly report:', error)
      setWeeklyReport(getMockWeeklyReport()) // Fallback to mock
    } finally {
      setIsGeneratingReport(false)
    }
  }

  // Handle upgrade navigation
  const handleUpgradeNavigation = () => {
    navigate('/pricing')
  }

  // Generate personalized insights
  const generatePersonalizedInsights = async () => {
    if (!isPremium) {
      handleUpgradeNavigation()
      return
    }

    await loadInsights()
  }
  
  // Generate weekly report
  const generateWeeklyReport = async () => {
    if (!isPremium) {
      handleUpgradeNavigation()
      return
    }
    
    await loadWeeklyReport()
  }
  
  // Mark report as viewed
  const handleReportViewed = (reportId) => {
    console.log('Report viewed:', reportId);
    // In a real implementation, this would update the report status
  };
  
  // Share report
  const handleShareReport = (reportId, method) => {
    console.log('Share report:', reportId, 'via', method);
    // In a real implementation, this would share the report
  };
  
  // Provide feedback on insight
  const handleInsightFeedback = (insightId, isHelpful) => {
    console.log('Insight feedback:', insightId, isHelpful ? 'helpful' : 'not helpful');
    // In a real implementation, this would record feedback
  };
  
  // Render tabs
  const renderTabs = () => {
    return (
      <div className="flex overflow-x-auto space-x-2 pb-2 mb-6">
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex items-center px-4 py-2 rounded-md whitespace-nowrap ${
            activeTab === 'insights'
              ? 'bg-primary/10 text-primary'
              : 'text-text-secondary hover:bg-gray-100'
          }`}
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          Insights
        </button>
        
        <button
          onClick={() => setActiveTab('weekly')}
          className={`flex items-center px-4 py-2 rounded-md whitespace-nowrap ${
            activeTab === 'weekly'
              ? 'bg-primary/10 text-primary'
              : 'text-text-secondary hover:bg-gray-100'
          }`}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Weekly Report
        </button>
        
        <button
          onClick={() => setActiveTab('data')}
          className={`flex items-center px-4 py-2 rounded-md whitespace-nowrap ${
            activeTab === 'data'
              ? 'bg-primary/10 text-primary'
              : 'text-text-secondary hover:bg-gray-100'
          }`}
        >
          <BarChart className="w-4 h-4 mr-2" />
          Data Summary
        </button>
      </div>
    );
  };
  
  // Render insights tab
  const renderInsightsTab = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium text-text-primary">Your Insights</h2>
          
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
              <Button onClick={handleUpgradeNavigation}>
                Upgrade to Premium
              </Button>
            </div>
          </Card>
        )}
        
        {/* Current Insights */}
        {insights.length > 0 ? (
          <div className="grid gap-6">
            {insights.map((insight, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {insight.category === 'pattern' ? (
                      <TrendingUp className="w-6 h-6 text-primary" />
                    ) : insight.category === 'recommendation' ? (
                      <Target className="w-6 h-6 text-primary" />
                    ) : insight.category === 'observation' ? (
                      <Lightbulb className="w-6 h-6 text-primary" />
                    ) : (
                      <Brain className="w-6 h-6 text-primary" />
                    )}
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
                    
                    {insight.suggestions && insight.suggestions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-text-primary mb-2">Suggestions:</h4>
                        <ul className="text-sm text-text-secondary space-y-1">
                          {insight.suggestions.map((suggestion, i) => (
                            <li key={i} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="mt-3 flex justify-end space-x-2">
                      <button
                        onClick={() => handleInsightFeedback(insight.insightId, true)}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <ThumbsUp className="w-4 h-4 text-text-secondary" />
                      </button>
                      <button
                        onClick={() => handleInsightFeedback(insight.insightId, false)}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <ThumbsDown className="w-4 h-4 text-text-secondary" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Lightbulb className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No Insights Available Yet
            </h3>
            <p className="text-text-secondary max-w-md mx-auto">
              Complete more check-ins and activities to receive personalized insights.
            </p>
          </div>
        )}
      </div>
    );
  };
  
  // Render weekly report tab
  const renderWeeklyReportTab = () => {
    return (
      <div className="space-y-6">
        {isPremium && !weeklyReport && (
          <div className="flex justify-end">
            <Button 
              onClick={generateWeeklyReport}
              disabled={isGeneratingReport}
            >
              {isGeneratingReport ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Generate Weekly Report
                </>
              )}
            </Button>
          </div>
        )}
        
        <WeeklyReport 
          report={weeklyReport}
          onView={handleReportViewed}
          onShare={handleShareReport}
          isLoading={isGeneratingReport}
        />
        
        {!isPremium && (
          <Card className="p-6 border-2 border-accent/20 bg-accent/5">
            <div className="flex items-center space-x-4">
              <Crown className="w-8 h-8 text-accent" />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-text-primary">
                  Unlock Weekly Reports
                </h3>
                <p className="text-text-secondary">
                  Get comprehensive weekly analysis and personalized recommendations with Premium
                </p>
              </div>
              <Button onClick={handleUpgradeNavigation}>
                Upgrade to Premium
              </Button>
            </div>
          </Card>
        )}
      </div>
    );
  };
  
  // Render data summary tab
  const renderDataSummaryTab = () => {
    return (
      <div className="space-y-6">
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
                {dailyEntries.filter(e => 
                  e.emotionalState === 'positive' || 
                  (e.primaryEmotion && features.enhancedPulseCheck ? 
                    ['joyful', 'grateful', 'inspired', 'calm', 'focused', 'energetic', 'confident'].includes(e.primaryEmotion) : 
                    false)
                ).length}
              </div>
              <div className="text-sm text-text-secondary">Positive Days</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">Emotional Distribution</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">Positive</span>
                <span className="text-text-primary">
                  {Math.round(dailyEntries.filter(e => e.emotionalState === 'positive').length / dailyEntries.length * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${Math.round(dailyEntries.filter(e => e.emotionalState === 'positive').length / dailyEntries.length * 100)}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">Neutral</span>
                <span className="text-text-primary">
                  {Math.round(dailyEntries.filter(e => e.emotionalState === 'neutral').length / dailyEntries.length * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${Math.round(dailyEntries.filter(e => e.emotionalState === 'neutral').length / dailyEntries.length * 100)}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">Negative</span>
                <span className="text-text-primary">
                  {Math.round(dailyEntries.filter(e => e.emotionalState === 'negative').length / dailyEntries.length * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${Math.round(dailyEntries.filter(e => e.emotionalState === 'negative').length / dailyEntries.length * 100)}%` }}
                />
              </div>
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
                <li>• Use the enhanced pulse check for more detailed emotional tracking</li>
                {!isPremium && (
                  <li>• Upgrade to Premium for AI-powered analysis</li>
                )}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    );
  };
  
  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'insights':
        return renderInsightsTab();
      case 'weekly':
        return renderWeeklyReportTab();
      case 'data':
        return renderDataSummaryTab();
      default:
        return renderInsightsTab();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Personalized Insights</h1>
        <p className="text-text-secondary">AI-powered analysis of your emotional patterns</p>
      </div>
      
      {renderTabs()}
      {renderTabContent()}
    </div>
  )
}
