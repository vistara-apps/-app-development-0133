/**
 * Weekly Report Component
 * 
 * Displays a comprehensive weekly report with emotional trends,
 * activity effectiveness, and personalized recommendations.
 */

import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Chart } from './Chart';
import { format, parseISO } from 'date-fns';
import { 
  Calendar, 
  TrendingUp, 
  Activity, 
  Lightbulb,
  Share2,
  Download,
  Mail,
  MessageSquare
} from 'lucide-react';

export function WeeklyReport({ 
  report, 
  onView, 
  onShare,
  isLoading = false
}) {
  const [activeTab, setActiveTab] = useState('summary');
  
  // Mark as viewed when component mounts
  React.useEffect(() => {
    if (report && onView) {
      onView(report.reportId);
    }
  }, [report, onView]);
  
  // Handle share
  const handleShare = (method) => {
    if (onShare) {
      onShare(report.reportId, method);
    }
  };
  
  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
        <div className="space-y-4">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }
  
  if (!report) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No Weekly Report Available
          </h3>
          <p className="text-text-secondary max-w-md mx-auto">
            Complete daily check-ins and activities throughout the week to receive a personalized weekly report.
          </p>
        </div>
      </Card>
    );
  }
  
  // Format date range for display
  const formatDateRange = () => {
    if (!report.weekStart || !report.weekEnd) return '';
    
    const start = parseISO(report.weekStart);
    const end = parseISO(report.weekEnd);
    
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  };
  
  // Render tabs
  const renderTabs = () => {
    const tabs = [
      { id: 'summary', label: 'Summary', icon: Calendar },
      { id: 'trends', label: 'Trends', icon: TrendingUp },
      { id: 'activities', label: 'Activities', icon: Activity },
      { id: 'recommendations', label: 'Recommendations', icon: Lightbulb }
    ];
    
    return (
      <div className="flex overflow-x-auto space-x-2 pb-2 mb-4 border-b border-gray-100">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-3 py-2 rounded-md whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary/10 text-primary'
                : 'text-text-secondary hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>
    );
  };
  
  // Render summary tab
  const renderSummaryTab = () => {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-2">
            {report.summary.title || 'Weekly Summary'}
          </h3>
          <p className="text-text-secondary">
            {report.summary.content}
          </p>
        </div>
        
        {report.progressMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-text-secondary">Check-in Rate</div>
              <div className="text-xl font-bold text-text-primary">{report.progressMetrics.checkInRate}%</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-text-secondary">Activity Completion</div>
              <div className="text-xl font-bold text-text-primary">{report.progressMetrics.activityCompletionRate}%</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-text-secondary">Avg. Emotional State</div>
              <div className="text-xl font-bold text-text-primary">{report.progressMetrics.averageEmotionalState}/5</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-text-secondary">Recovery Time</div>
              <div className="text-xl font-bold text-text-primary">{report.progressMetrics.recoveryTime} min</div>
            </div>
          </div>
        )}
        
        {report.recommendations && report.recommendations.length > 0 && (
          <div>
            <h3 className="text-md font-medium text-text-primary mb-2">
              Key Recommendations
            </h3>
            <div className="space-y-2">
              {report.recommendations.slice(0, 2).map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-text-primary">{recommendation.title}</div>
                    <div className="text-sm text-text-secondary">{recommendation.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render trends tab
  const renderTrendsTab = () => {
    // Mock data for chart
    const emotionalData = [
      { date: 'Mon', value: 2 },
      { date: 'Tue', value: 3 },
      { date: 'Wed', value: 4 },
      { date: 'Thu', value: 3 },
      { date: 'Fri', value: 2 },
      { date: 'Sat', value: 4 },
      { date: 'Sun', value: 5 }
    ];
    
    const stressData = [
      { date: 'Mon', value: 3 },
      { date: 'Tue', value: 4 },
      { date: 'Wed', value: 2 },
      { date: 'Thu', value: 3 },
      { date: 'Fri', value: 4 },
      { date: 'Sat', value: 2 },
      { date: 'Sun', value: 1 }
    ];
    
    return (
      <div className="space-y-6">
        {report.emotionalTrends && (
          <div>
            <h3 className="text-md font-medium text-text-primary mb-2">
              Emotional Trends
            </h3>
            <p className="text-text-secondary mb-4">
              {report.emotionalTrends.content}
            </p>
            <Chart variant="line" data={emotionalData} />
          </div>
        )}
        
        {report.stressPatterns && (
          <div>
            <h3 className="text-md font-medium text-text-primary mb-2 mt-6">
              Stress Patterns
            </h3>
            <p className="text-text-secondary mb-4">
              {report.stressPatterns.content}
            </p>
            <Chart variant="line" data={stressData} />
          </div>
        )}
      </div>
    );
  };
  
  // Render activities tab
  const renderActivitiesTab = () => {
    // Mock data for chart
    const activityData = [
      { name: 'Mindfulness', effectiveness: 85 },
      { name: 'Breathing', effectiveness: 90 },
      { name: 'Gratitude', effectiveness: 75 },
      { name: 'Physical', effectiveness: 60 }
    ];
    
    return (
      <div className="space-y-6">
        {report.activityEffectiveness && (
          <div>
            <h3 className="text-md font-medium text-text-primary mb-2">
              Activity Effectiveness
            </h3>
            <p className="text-text-secondary mb-4">
              {report.activityEffectiveness.content}
            </p>
            
            <div className="space-y-3">
              {activityData.map((activity, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-primary">{activity.name}</span>
                    <span className="text-text-secondary">{activity.effectiveness}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${activity.effectiveness}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <h3 className="text-md font-medium text-text-primary mb-2 mt-6">
            Activity Completion
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-text-secondary">This Week</span>
              <span className="font-medium text-text-primary">
                {report.progressMetrics?.activityCompletionRate || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${report.progressMetrics?.activityCompletionRate || 0}%` }}
              />
            </div>
            <div className="text-sm text-text-secondary">
              {report.progressMetrics?.activityCompletionRate >= 80 
                ? "Excellent activity completion! Keep up the great work."
                : report.progressMetrics?.activityCompletionRate >= 50
                ? "Good progress on activities this week."
                : "Try to complete more activities next week for better results."
              }
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render recommendations tab
  const renderRecommendationsTab = () => {
    return (
      <div className="space-y-6">
        {report.recommendations && report.recommendations.length > 0 ? (
          <div className="space-y-4">
            {report.recommendations.map((recommendation, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary mb-1">
                      {recommendation.title}
                    </h4>
                    <p className="text-text-secondary text-sm">
                      {recommendation.content}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Lightbulb className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No Recommendations Available
            </h3>
            <p className="text-text-secondary max-w-md mx-auto">
              Complete more check-ins and activities to receive personalized recommendations.
            </p>
          </div>
        )}
      </div>
    );
  };
  
  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return renderSummaryTab();
      case 'trends':
        return renderTrendsTab();
      case 'activities':
        return renderActivitiesTab();
      case 'recommendations':
        return renderRecommendationsTab();
      default:
        return renderSummaryTab();
    }
  };
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Weekly Report</h2>
          <p className="text-text-secondary">{formatDateRange()}</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleShare('download')}
          >
            <Download className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleShare('share')}
          >
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>
      </div>
      
      {renderTabs()}
      {renderTabContent()}
      
      {/* Share options */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="text-sm text-text-secondary mb-2">Share this report:</div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleShare('email')}
          >
            <Mail className="w-4 h-4 mr-1" />
            Email
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleShare('slack')}
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            Slack
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default WeeklyReport;

