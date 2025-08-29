/**
 * Nudge Notification Component
 * 
 * Displays contextual nudges to the user with options to
 * act on, dismiss, or provide feedback on the nudge.
 */

import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { 
  X, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle,
  Lightbulb,
  Wind,
  Brain,
  Coffee,
  Users,
  Heart,
  Clock,
  BatteryCharging
} from 'lucide-react';
import { NudgeTypes } from '../models/EmotionalDataTypes';
import { motion, AnimatePresence } from 'framer-motion';

export function NudgeNotification({ 
  nudge, 
  onView, 
  onAction, 
  onDismiss, 
  onFeedback,
  position = 'bottom-right',
  autoHide = true,
  hideDelay = 10000 // 10 seconds
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  
  // Mark as viewed when component mounts (only once per nudge)
  useEffect(() => {
    if (nudge && onView && nudge.nudgeId && !nudge.viewed) {
      onView(nudge.nudgeId);
    }
  }, [nudge?.nudgeId]); // Only depend on nudgeId, not the whole nudge object or onView function
  
  // Auto-hide after delay if enabled
  useEffect(() => {
    if (!autoHide || !isVisible) return;
    
    const timerId = setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
    
    return () => clearTimeout(timerId);
  }, [autoHide, isVisible, hideDelay]);
  
  // Handle dismiss
  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss(nudge.nudgeId, { reason: 'user_dismissed' });
    }
  };
  
  // Handle action
  const handleAction = () => {
    if (onAction) {
      onAction(nudge.nudgeId, { action: 'clicked' });
    }
  };
  
  // Handle feedback submission
  const handleFeedbackSubmit = () => {
    if (onFeedback && feedbackRating) {
      onFeedback(nudge.nudgeId, feedbackText, feedbackRating);
      setShowFeedback(false);
    }
  };
  
  // Get icon based on nudge type
  const getNudgeIcon = () => {
    switch (nudge.type) {
      case NudgeTypes.BREATHING:
        return <Wind className="w-5 h-5" />;
      case NudgeTypes.MINDFULNESS:
        return <Brain className="w-5 h-5" />;
      case NudgeTypes.PERSPECTIVE:
        return <Lightbulb className="w-5 h-5" />;
      case NudgeTypes.ACTIVITY:
        return <Clock className="w-5 h-5" />;
      case NudgeTypes.BREAK:
        return <Coffee className="w-5 h-5" />;
      case NudgeTypes.SOCIAL:
        return <Users className="w-5 h-5" />;
      case NudgeTypes.GRATITUDE:
        return <Heart className="w-5 h-5" />;
      case NudgeTypes.RECOVERY:
        return <BatteryCharging className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };
  
  // Get position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4';
    }
  };
  
  if (!nudge) return null;
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed ${getPositionClasses()} z-50 max-w-sm w-full shadow-lg`}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-4 border-l-4 border-l-primary">
            <div className="flex justify-between items-start">
              <div className="flex space-x-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  {getNudgeIcon()}
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">Resilify Nudge</h3>
                  <p className="text-sm text-text-secondary mt-1">{nudge.content}</p>
                </div>
              </div>
              <button 
                onClick={handleDismiss}
                className="text-text-secondary hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-3 flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowFeedback(!showFeedback)}
                  className="text-xs text-text-secondary hover:text-text-primary flex items-center"
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Feedback
                </button>
              </div>
              
              {nudge.actionable && (
                <Button size="sm" onClick={handleAction}>
                  {nudge.actionDescription || 'Try Now'}
                </Button>
              )}
            </div>
            
            {showFeedback && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-text-secondary mb-2">Was this helpful?</div>
                <div className="flex space-x-3 mb-2">
                  <button
                    onClick={() => setFeedbackRating(5)}
                    className={`p-1 rounded ${feedbackRating === 5 ? 'bg-green-100 text-green-600' : 'text-text-secondary hover:bg-gray-100'}`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setFeedbackRating(1)}
                    className={`p-1 rounded ${feedbackRating === 1 ? 'bg-red-100 text-red-600' : 'text-text-secondary hover:bg-gray-100'}`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
                
                {feedbackRating && (
                  <>
                    <input
                      type="text"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Any additional feedback? (optional)"
                      className="w-full text-xs p-2 border border-gray-200 rounded"
                    />
                    <div className="flex justify-end mt-2">
                      <Button size="sm" onClick={handleFeedbackSubmit}>
                        Submit
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default NudgeNotification;

