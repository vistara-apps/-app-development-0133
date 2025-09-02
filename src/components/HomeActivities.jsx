import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './Card';
import { Button } from './Button';
import { activityIcons } from '../../public/icons/activity-icons';
import { useDataStore } from '../stores/dataStore';
import {
  Sparkles,
  ArrowRight,
  Brain,
  Heart,
  Users,
  Play,
  Clock,
  Filter,
  Star
} from 'lucide-react';

export function HomeActivities() {
  const navigate = useNavigate();
  const { activities, addActivityLog } = useDataStore();
  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showActivity, setShowActivity] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const activityTypes = {
    mindfulness: { icon: Brain, color: 'text-blue-500', label: 'Mindfulness' },
    social: { icon: Users, color: 'text-green-500', label: 'Social' },
    journaling: { icon: Heart, color: 'text-pink-500', label: 'Journaling' }
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  const startActivity = (activity) => {
    setSelectedActivity(activity);
    setShowActivity(true);
  };

  const completeActivity = () => {
    if (!selectedActivity || rating === 0) return;

    addActivityLog({
      userId: 'demo-user-1',
      activityId: selectedActivity.activityId,
      completionDate: new Date().toISOString().split('T')[0],
      rating,
      feedback,
      activity: selectedActivity
    });

    setShowActivity(false);
    setSelectedActivity(null);
    setRating(0);
    setFeedback('');
  };

  // Featured activities - show a curated selection
  const featuredActivities = activities
    .filter(activity => ['mindful-breathing', 'gratitude-journal', 'quick-walk'].includes(activity.activityId))
    .slice(0, 3);

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
            Start with a simple activity to improve your wellbeing right now.
          </p>
        </div>
      </section>

      {/* Featured Activities */}
      <section className="container-padding pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-balance mb-4">
              Recommended for You
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Try one of these activities to boost your resilience today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredActivities.map((activity, index) => (
              <div 
                key={activity.activityId}
                className={`fade-in-up ${isVisible ? 'visible' : ''}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="wellness-card h-full group cursor-pointer hover:shadow-large transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 mr-3">
                        <Brain className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-2xl">{activityIcons[activity.activityId] || "✨"}</span>
                    </div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      5-10 min
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    {activity.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {activity.description}
                  </p>
                  
                  <Button 
                    onClick={() => startActivity(activity)}
                    className="w-full btn-primary group"
                  >
                    <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Start Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activity Categories */}
      <section className="container-padding pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-text-primary">All Activities</h2>
            
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-text-secondary" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Types</option>
                {Object.entries(activityTypes).map(([key, type]) => (
                  <option key={key} value={key}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Object.entries(activityTypes).map(([key, type]) => (
              <Card 
                key={key} 
                className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                  filter === key ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setFilter(filter === key ? 'all' : key)}
              >
                <div className="text-center">
                  <type.icon className={`w-8 h-8 mx-auto mb-2 ${type.color}`} />
                  <div className="font-medium text-text-primary">{type.label}</div>
                  <div className="text-sm text-text-secondary">
                    {activities.filter(a => a.type === key).length} activities
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Activities Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => {
              const TypeIcon = activityTypes[activity.type]?.icon || Brain;
              const typeColor = activityTypes[activity.type]?.color || 'text-gray-500';
              
              return (
                <Card key={activity.activityId} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <TypeIcon className={`w-6 h-6 ${typeColor} mr-2`} />
                        <span className="text-lg">{activityIcons[activity.activityId] || "✨"}</span>
                      </div>
                      <div className="text-sm text-text-secondary capitalize">
                        {activity.type}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-text-primary mb-2">
                        {activity.name}
                      </h3>
                      <p className="text-text-secondary text-sm">
                        {activity.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-text-secondary">
                        <Clock className="w-4 h-4" />
                        <span>5-10 min</span>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => startActivity(activity)}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Activity Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-text-primary">{selectedActivity.name}</h2>
                <button 
                  onClick={() => setShowActivity(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-text-primary mb-2">Instructions</h4>
                  <p className="text-text-secondary whitespace-pre-line">
                    {selectedActivity.guideContent}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      How helpful was this activity? *
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`w-8 h-8 ${
                            star <= rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          <Star className="w-full h-full fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Any thoughts or feedback? (optional)
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="How did this activity make you feel?"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    variant="secondary" 
                    className="flex-1"
                    onClick={() => setShowActivity(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={completeActivity}
                    disabled={rating === 0}
                  >
                    Complete Activity
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeActivities;

