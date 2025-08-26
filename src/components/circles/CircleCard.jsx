import React from 'react'
import { Users, Lock, MessageCircle, CheckCircle } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { useCircleStore } from '../../stores/circleStore'

export function CircleCard({ circle, isActive, onClick }) {
  const { 
    circleId, 
    name, 
    description, 
    currentMembers, 
    maxMembers, 
    isPublic, 
    tags, 
    imageUrl,
    createdAt 
  } = circle
  
  // Get the latest message for this circle
  const messages = useCircleStore(state => 
    state.messages.filter(m => m.circleId === circleId)
  )
  const latestMessage = messages.length > 0 
    ? messages.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))[0]
    : null
  
  // Get active goals for this circle
  const goals = useCircleStore(state => 
    state.goals.filter(g => g.circleId === circleId && g.status === 'in-progress')
  )
  
  return (
    <div 
      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
        isActive 
          ? 'bg-primary-light border-primary dark:bg-primary/20 dark:border-primary/50' 
          : 'bg-surface hover:bg-gray-50 border-border dark:bg-dark-surface dark:hover:bg-dark-border/50 dark:border-dark-border'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        {/* Circle image */}
        <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name} 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-primary/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>
        
        {/* Circle info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-medium truncate ${
              isActive ? 'text-primary dark:text-primary' : 'text-text-primary dark:text-dark-text-primary'
            }`}>
              {name}
            </h3>
            {!isPublic && (
              <Lock className="h-4 w-4 text-text-tertiary dark:text-dark-text-tertiary" />
            )}
          </div>
          
          <p className="mt-1 text-sm text-text-secondary dark:text-dark-text-secondary line-clamp-2">
            {description}
          </p>
          
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.slice(0, 3).map(tag => (
                <span 
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary dark:bg-primary/20 dark:text-primary/90"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-text-secondary dark:bg-dark-border dark:text-dark-text-secondary">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          {/* Latest activity */}
          <div className="mt-2 flex items-center text-xs text-text-tertiary dark:text-dark-text-tertiary">
            {latestMessage ? (
              <>
                <MessageCircle className="h-3.5 w-3.5 mr-1" />
                <span className="truncate">
                  {latestMessage.isAI ? 'AI Facilitator' : latestMessage.senderName}: {' '}
                  {latestMessage.content.length > 20 
                    ? latestMessage.content.substring(0, 20) + '...' 
                    : latestMessage.content
                  }
                </span>
                <span className="mx-1">·</span>
                <span>{formatDistanceToNow(new Date(latestMessage.sentAt), { addSuffix: true })}</span>
              </>
            ) : goals.length > 0 ? (
              <>
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                <span>{goals.length} active {goals.length === 1 ? 'goal' : 'goals'}</span>
              </>
            ) : (
              <>
                <Users className="h-3.5 w-3.5 mr-1" />
                <span>Created {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-border dark:border-dark-border flex justify-between items-center text-xs text-text-secondary dark:text-dark-text-secondary">
        <div className="flex items-center">
          <Users className="h-3.5 w-3.5 mr-1" />
          <span>{currentMembers}/{maxMembers} members</span>
        </div>
        
        <div>
          {isPublic ? 'Public' : 'Private'} Circle
        </div>
      </div>
    </div>
  )
}

