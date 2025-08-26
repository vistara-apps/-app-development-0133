import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from './Card'
import { Button } from './Button'
import { Crown, Lock, ChevronRight } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

export function PremiumFeature({
  children,
  title = 'Premium Feature',
  description = 'Upgrade to Premium to unlock this feature',
  showPreview = false,
  previewHeight = '200px',
  onUpgrade,
  className = '',
}) {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [showDetails, setShowDetails] = useState(false)
  
  const isPremium = user?.subscriptionTier === 'premium'
  
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade()
    } else {
      navigate('/subscription')
    }
  }
  
  // If user is premium, just render the children
  if (isPremium) {
    return children
  }
  
  return (
    <Card 
      className={`overflow-hidden border-2 border-accent/20 ${className}`}
      variant="flat"
    >
      {/* Preview area (blurred if not expanded) */}
      {showPreview && (
        <div 
          className={`relative ${!showDetails ? 'max-h-[200px] overflow-hidden' : ''}`}
          style={{ height: showDetails ? 'auto' : previewHeight }}
        >
          <div className={`${!showDetails ? 'blur-sm' : ''}`}>
            {children}
          </div>
          
          {!showDetails && (
            <div className="absolute inset-0 bg-gradient-to-t from-surface dark:from-dark-surface to-transparent" />
          )}
        </div>
      )}
      
      {/* Premium badge */}
      <div className="flex items-center justify-between p-4 bg-accent/10 border-t border-accent/20">
        <div className="flex items-center">
          <Crown className="w-5 h-5 text-accent mr-2" aria-hidden="true" />
          <div>
            <h3 className="font-medium text-text-primary dark:text-dark-text-primary">
              {title}
            </h3>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
              {description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {showPreview && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              aria-expanded={showDetails}
              aria-controls="premium-preview"
            >
              {showDetails ? 'Hide Preview' : 'Show Preview'}
              <ChevronRight className={`ml-1 w-4 h-4 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
            </Button>
          )}
          
          <Button 
            onClick={handleUpgrade}
            size="sm"
          >
            <Lock className="w-4 h-4 mr-1" aria-hidden="true" />
            Upgrade
          </Button>
        </div>
      </div>
    </Card>
  )
}

export function UpgradePrompt({
  title = 'Upgrade to Premium',
  description = 'Get access to all premium features and unlock the full potential of ResilientFlow',
  features = [
    'Personalized AI insights',
    'Advanced analytics and reports',
    'Unlimited activity access',
    'Priority support'
  ],
  onUpgrade,
  className = '',
}) {
  const navigate = useNavigate()
  
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade()
    } else {
      navigate('/subscription')
    }
  }
  return (
    <Card 
      className={`border-2 border-accent/20 ${className}`}
      variant="flat"
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Crown className="w-6 h-6 text-accent mr-2" aria-hidden="true" />
          <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">
            {title}
          </h3>
        </div>
        
        <p className="text-text-secondary dark:text-dark-text-secondary mb-6">
          {description}
        </p>
        
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center mr-3">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-text-primary dark:text-dark-text-primary">{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="flex flex-col sm:flex-row sm:justify-between items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="text-center sm:text-left">
            <div className="text-2xl font-bold text-text-primary dark:text-dark-text-primary">
              $10<span className="text-sm font-normal text-text-secondary dark:text-dark-text-secondary">/month</span>
            </div>
            <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
              Cancel anytime
            </div>
          </div>
          
          <Button 
            onClick={handleUpgrade}
            size="lg"
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    </Card>
  )
}
