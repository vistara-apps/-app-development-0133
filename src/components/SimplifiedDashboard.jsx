import React, { useEffect, useState } from 'react';
import { Card } from './Card';
import { Link } from 'react-router-dom';
import { useDataStore } from '../stores/dataStore';
import { useCirclesStore } from '../stores/circlesStore';
import { format, subDays } from 'date-fns';
import { 
  TrendingUp, 
  Activity, 
  Target, 
  Users, 
  ArrowRight,
  Heart,
  Brain,
  CheckCircle,
  Clock,
  Sparkles,
  Star
} from 'lucide-react';

export function SimplifiedDashboard() {
  const { dailyEntries, activityLogs, activities, getRecentEntries, getActivityCompletionStreak, getCheckInStreak, getTodayEntry } = useDataStore();
  const { circles } = useCirclesStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const todayEntry = getTodayEntry();
  const activityStreak = getActivityCompletionStreak();
  const checkInStreak = getCheckInStreak();

  // Calculate last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, 'yyyy-MM-dd');
  }).reverse();

  // Calculate completion rates
  const totalCheckIns = dailyEntries.filter(entry => 
    last7Days.includes(entry.date)
  ).length;

  const totalActivities = activityLogs.filter(log => 
    last7Days.includes(log.completionDate)
  ).length;

  // Key stats for simplified dashboard
  const stats = [
    {
      label: 'Check-in Streak',
      value: `${checkInStreak} days`,
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800'
    },
    {
      label: 'Activity Streak',
      value: `${activityStreak} days`,
      icon: <Target className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    {
      label: 'Today\'s Mood',
      value: todayEntry?.mood || 'Not set',
      icon: <Heart className="h-5 w-5" />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-950/20',
      borderColor: 'border-pink-200 dark:border-pink-800'
    },
    {
      label: 'Activities Done',
      value: totalActivities,
      icon: <Activity className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    }
  ];

  // Get recent activities
  const recentActivities = activityLogs
    .filter(log => last7Days.includes(log.completionDate))
    .slice(0, 3)
    .map(log => {
      const activity = activities.find(a => a.activityId === log.activityId);
      return {
        id: log.activityId,
        name: activity?.name || 'Unknown Activity',
        type: activity?.type || 'general',
        date: format(new Date(log.completionDate), 'MMM dd'),
        duration: activity?.duration || '5 min'
      };
    });

  // AI Insight - simplified to just one key insight
  const aiInsight = {
    title: "Your Resilience is Growing",
    content: "You've been consistent with your mindfulness activities this week. This regular practice is helping build your emotional resilience. Keep it up!"
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className={`fade-in-up ${isVisible ? 'visible' : ''} text-center mb-8`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-wellness-peace border border-wellness-calm/30 text-wellness-harmony font-medium mb-4">
          <Sparkles className="h-4 w-4" />
          Your Progress Dashboard
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-balance mb-2">
          Welcome back, <span className="text-gradient-wellness">Champion</span>
        </h1>
      </div>

      {/* Stats Grid - Simplified */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={stat.label}
            className={`fade-in-up ${isVisible ? 'visible' : ''}`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <Card className={`p-4 border ${stat.borderColor}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
              <div className={`text-xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* AI Insight - Simplified to just one key insight */}
      <Card className="p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-2">{aiInsight.title}</h3>
            <p className="text-text-secondary">{aiInsight.content}</p>
          </div>
        </div>
      </Card>

      {/* Recent Activities - Simplified */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-text-primary">Recent Activities</h3>
          <Link 
            to="/activities" 
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="space-y-3">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'mindfulness' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    activity.type === 'social' ? 'bg-green-100 dark:bg-green-900/30' :
                    'bg-purple-100 dark:bg-purple-900/30'
                  }`}>
                    {activity.type === 'mindfulness' ? <Brain className="h-4 w-4 text-blue-600" /> :
                     activity.type === 'social' ? <Users className="h-4 w-4 text-green-600" /> :
                     <Heart className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{activity.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{activity.date} • {activity.duration}</div>
                  </div>
                </div>
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <Activity className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400">No activities completed yet</p>
              <Link 
                to="/activities" 
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mt-2"
              >
                Start your first activity
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </Card>

      {/* Support Circles - Simplified */}
      {circles.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-text-primary">Your Support Circles</h3>
            <Link 
              to="/circles" 
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {circles.slice(0, 2).map((circle) => (
              <div 
                key={circle.circleId}
                className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{circle.name}</div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{circle.description}</p>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {circle.memberCount || 0} members
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Action */}
      <Card className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-wellness-calm to-wellness-peace mb-4">
          <Star className="h-6 w-6 text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-balance mb-3">
          Ready for Your Next Activity?
        </h3>
        
        <Link 
          to="/activities"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <Activity className="mr-2 h-4 w-4" />
          Start Activity
        </Link>
      </Card>
    </div>
  );
}

export default SimplifiedDashboard;

