import React, { useState } from 'react'
import { Lightbulb, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '../Button'

export function DailyPrompt({ prompt }) {
  const [feedback, setFeedback] = useState(null)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  
  const handleFeedback = (isPositive) => {
    setFeedback(isPositive)
    setShowFeedbackForm(true)
  }
  
  const handleSubmitFeedback = () => {
    // In a real implementation, this would send feedback to the server
    console.log('Prompt feedback:', {
      promptId: prompt.promptId,
      isPositive: feedback,
      feedbackText
    })
    
    setShowFeedbackForm(false)
  }
  
  return (
    <div className="bg-accent/10 dark:bg-accent/5 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-accent/20 dark:bg-accent/10 rounded-full p-2 mr-3">
          <Lightbulb className="h-5 w-5 text-accent dark:text-accent/90" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-medium text-accent dark:text-accent/90">
              Today's Prompt
            </h3>
            <span className="text-xs text-text-tertiary dark:text-dark-text-tertiary">
              {format(new Date(prompt.scheduledFor), 'MMM d')}
            </span>
          </div>
          
          <p className="text-text-primary dark:text-dark-text-primary text-base mb-3">
            {prompt.content}
          </p>
          
          {!feedback && !showFeedbackForm ? (
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-text-secondary dark:text-dark-text-secondary mr-1">
                Was this prompt helpful?
              </span>
              <button
                onClick={() => handleFeedback(true)}
                className="p-1 rounded-full hover:bg-accent/10 dark:hover:bg-accent/5 text-text-secondary dark:text-dark-text-secondary hover:text-accent dark:hover:text-accent/90 transition-colors"
                aria-label="Thumbs up"
              >
                <ThumbsUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleFeedback(false)}
                className="p-1 rounded-full hover:bg-error/10 dark:hover:bg-error/5 text-text-secondary dark:text-dark-text-secondary hover:text-error dark:hover:text-error/90 transition-colors"
                aria-label="Thumbs down"
              >
                <ThumbsDown className="h-4 w-4" />
              </button>
            </div>
          ) : showFeedbackForm ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={feedback ? "What did you like about this prompt?" : "How could this prompt be improved?"}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-dark-surface border border-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary dark:text-dark-text-primary resize-none"
                rows={2}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFeedbackForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSubmitFeedback}
                >
                  Submit Feedback
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center mt-2 text-xs text-text-secondary dark:text-dark-text-secondary">
              <span className="flex items-center">
                {feedback ? (
                  <>
                    <ThumbsUp className="h-3 w-3 mr-1 text-accent dark:text-accent/90" />
                    Thank you for your feedback!
                  </>
                ) : (
                  <>
                    <ThumbsDown className="h-3 w-3 mr-1 text-error dark:text-error/90" />
                    Thanks for your feedback. We'll improve our prompts.
                  </>
                )}
              </span>
            </div>
          )}
          
          <div className="mt-3 flex items-center">
            <MessageCircle className="h-4 w-4 text-text-tertiary dark:text-dark-text-tertiary mr-1" />
            <span className="text-xs text-text-tertiary dark:text-dark-text-tertiary">
              Share your thoughts in the chat below
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

