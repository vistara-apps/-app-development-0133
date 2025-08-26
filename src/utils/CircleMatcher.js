// CircleMatcher.js - Utility for matching users to appropriate support circles

class CircleMatcher {
  constructor() {
    // Define matching criteria weights
    this.weights = {
      interestMatch: 3,      // Weight for matching interests/tags
      goalAlignment: 2,      // Weight for similar/diverse goals
      activityLevel: 1.5,    // Weight for activity level preference
      privacyLevel: 1,       // Weight for privacy preference
      circleSize: 1          // Weight for circle size preference
    }
  }
  
  // Main matching function
  findMatches(user, userPreferences, availableCircles, limit = 3) {
    // Calculate scores for each available circle
    const scoredCircles = availableCircles.map(circle => {
      const score = this.calculateMatchScore(user, userPreferences, circle)
      return { ...circle, matchScore: score }
    })
    
    // Sort by score (descending) and return top matches
    return scoredCircles
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit)
  }
  
  // Calculate match score between user and circle
  calculateMatchScore(user, preferences, circle) {
    let score = 0
    
    // Interest/tag matching
    score += this.calculateInterestScore(preferences.interests, circle.tags) * this.weights.interestMatch
    
    // Goal alignment matching
    score += this.calculateGoalAlignmentScore(preferences.goalAlignment, circle) * this.weights.goalAlignment
    
    // Activity level matching
    score += this.calculateActivityLevelScore(preferences.activityLevel, circle) * this.weights.activityLevel
    
    // Privacy level matching
    score += this.calculatePrivacyScore(preferences.privacyLevel, circle) * this.weights.privacyLevel
    
    // Circle size matching
    score += this.calculateSizeScore(preferences.circleSize, circle) * this.weights.circleSize
    
    return score
  }
  
  // Calculate interest/tag match score (0-1)
  calculateInterestScore(userInterests, circleTags) {
    if (!userInterests || !userInterests.length || !circleTags || !circleTags.length) {
      return 0
    }
    
    // Count matching interests
    const matchingInterests = userInterests.filter(interest => 
      circleTags.includes(interest)
    )
    
    // Calculate score based on proportion of matching interests
    return matchingInterests.length / Math.max(userInterests.length, 1)
  }
  
  // Calculate goal alignment score (0-1)
  calculateGoalAlignmentScore(goalAlignmentPref, circle) {
    // This would normally analyze the goals of circle members
    // For demo purposes, we'll use circle tags as a proxy
    
    // Determine if circle has diverse or similar goals based on tags
    const hasDiverseTags = circle.tags && circle.tags.length >= 3
    
    switch (goalAlignmentPref) {
      case 'similar':
        return hasDiverseTags ? 0.3 : 1.0
      case 'diverse':
        return hasDiverseTags ? 1.0 : 0.3
      case 'any':
      default:
        return 0.7 // Neutral score
    }
  }
  
  // Calculate activity level match score (0-1)
  calculateActivityLevelScore(activityPref, circle) {
    // Estimate circle activity level based on members and message frequency
    // For demo, we'll use currentMembers as a proxy
    let circleActivity
    
    if (circle.currentMembers <= 3) {
      circleActivity = 'light'
    } else if (circle.currentMembers <= 7) {
      circleActivity = 'moderate'
    } else {
      circleActivity = 'active'
    }
    
    // Score based on match between preference and estimated activity
    if (activityPref === circleActivity) {
      return 1.0
    } else if (
      (activityPref === 'moderate' && ['light', 'active'].includes(circleActivity)) ||
      (circleActivity === 'moderate' && ['light', 'active'].includes(activityPref))
    ) {
      return 0.6 // Adjacent levels
    } else {
      return 0.2 // Opposite ends of spectrum
    }
  }
  
  // Calculate privacy level match score (0-1)
  calculatePrivacyScore(privacyPref, circle) {
    // Match based on circle's public/private status
    const isPublic = circle.isPublic
    
    switch (privacyPref) {
      case 'open':
        return isPublic ? 1.0 : 0.2
      case 'private':
        return isPublic ? 0.2 : 1.0
      case 'balanced':
      default:
        return 0.7 // Neutral score
    }
  }
  
  // Calculate circle size match score (0-1)
  calculateSizeScore(sizePref, circle) {
    // Determine circle size category
    let circleSize
    
    if (circle.maxMembers <= 5) {
      circleSize = 'small'
    } else if (circle.maxMembers <= 10) {
      circleSize = 'medium'
    } else {
      circleSize = 'large'
    }
    
    // Score based on match between preference and actual size
    if (sizePref === circleSize) {
      return 1.0
    } else if (
      (sizePref === 'medium' && ['small', 'large'].includes(circleSize)) ||
      (circleSize === 'medium' && ['small', 'large'].includes(sizePref))
    ) {
      return 0.6 // Adjacent sizes
    } else {
      return 0.3 // Opposite ends of spectrum
    }
  }
  
  // Generate explanation for why a circle was matched
  generateMatchExplanation(user, preferences, circle, matchScore) {
    const reasons = []
    
    // Interest match explanation
    const interestScore = this.calculateInterestScore(preferences.interests, circle.tags)
    if (interestScore > 0.5) {
      const matchingInterests = preferences.interests.filter(interest => 
        circle.tags.includes(interest)
      )
      reasons.push(`Shares ${matchingInterests.length} of your interests: ${matchingInterests.join(', ')}`)
    }
    
    // Size preference explanation
    let circleSize
    if (circle.maxMembers <= 5) {
      circleSize = 'small'
    } else if (circle.maxMembers <= 10) {
      circleSize = 'medium'
    } else {
      circleSize = 'large'
    }
    
    if (preferences.circleSize === circleSize) {
      reasons.push(`Matches your preference for ${circleSize} circles`)
    }
    
    // Privacy preference explanation
    if ((preferences.privacyLevel === 'open' && circle.isPublic) ||
        (preferences.privacyLevel === 'private' && !circle.isPublic)) {
      reasons.push(`Aligns with your privacy preferences`)
    }
    
    // Activity level explanation (using members as proxy)
    let activityLevel
    if (circle.currentMembers <= 3) {
      activityLevel = 'light'
    } else if (circle.currentMembers <= 7) {
      activityLevel = 'moderate'
    } else {
      activityLevel = 'active'
    }
    
    if (preferences.activityLevel === activityLevel) {
      reasons.push(`Has ${activityLevel} activity level, matching your preference`)
    }
    
    // If we don't have enough reasons, add a generic one
    if (reasons.length === 0) {
      reasons.push('Seems like a good overall match for your preferences')
    }
    
    return reasons
  }
}

// Export a singleton instance
export const circleMatcher = new CircleMatcher()

