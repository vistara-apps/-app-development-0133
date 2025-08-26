import React from 'react'
import { Users, Tag, ThumbsUp, UserPlus } from 'lucide-react'
import { circleMatcher } from '../../utils/CircleMatcher'
import { useCircleStore } from '../../stores/circleStore'
import { useAuthStore } from '../../stores/authStore'
import { Button } from '../Button'

export function CircleRecommendations({ recommendations, onSelect }) {
  const { user } = useAuthStore()
  const { matchingPreferences, joinCircle } = useCircleStore()
  
  // Handle join circle
  const handleJoinCircle = (circleId, e) => {
    e.stopPropagation()
    joinCircle(circleId)
  }
  
  return (
    <div className="space-y-3">
      {recommendations.map(circle => {
        // Generate explanation for why this circle was recommended
        const reasons = circleMatcher.generateMatchExplanation(
          user,
          matchingPreferences,
          circle,
          circle.matchScore
        )
        
        return (
          <div 
            key={circle.circleId}
            className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border hover:border-primary/50 dark:hover:border-primary/50 rounded-lg p-3 cursor-pointer transition-colors"
            onClick={() => onSelect(circle.circleId)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-medium text-text-primary dark:text-dark-text-primary">
                  {circle.name}
                </h3>
                
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1 line-clamp-2">
                  {circle.description}
                </p>
                
                {/* Match reasons */}
                <div className="mt-2 space-y-1">
                  {reasons.map((reason, index) => (
                    <div key={index} className="flex items-center text-xs text-text-tertiary dark:text-dark-text-tertiary">
                      <ThumbsUp className="h-3 w-3 text-primary mr-1" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
                
                {/* Tags */}
                {circle.tags && circle.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {circle.tags.slice(0, 3).map(tag => (
                      <span 
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary dark:bg-primary/20 dark:text-primary/90"
                      >
                        {tag}
                      </span>
                    ))}
                    {circle.tags.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-text-secondary dark:bg-dark-border dark:text-dark-text-secondary">
                        +{circle.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center text-xs text-text-tertiary dark:text-dark-text-tertiary">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span>{circle.currentMembers}/{circle.maxMembers}</span>
                </div>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => handleJoinCircle(circle.circleId, e)}
                  disabled={circle.currentMembers >= circle.maxMembers}
                >
                  <UserPlus className="h-3.5 w-3.5 mr-1" />
                  Join
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

