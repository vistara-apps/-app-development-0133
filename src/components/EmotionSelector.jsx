/**
 * Emotion Selector Component
 * 
 * A component for selecting emotions with intensity levels.
 */

import React, { useState } from 'react';
import { 
  EmotionCategories, 
  EmotionGroups, 
  IntensityLevels 
} from '../models/EmotionalDataTypes';
import { 
  Smile, 
  Meh, 
  Frown,
  ThumbsUp,
  Heart,
  Sun,
  Coffee,
  Zap,
  Award,
  Clock,
  Search,
  AlertCircle,
  Loader,
  Battery,
  Frown as FrownIcon,
  CloudRain,
  XCircle
} from 'lucide-react';

export function EmotionSelector({ 
  selectedEmotion, 
  intensity = 3,
  onSelect,
  onIntensityChange,
  groupFilter = null,
  showIntensity = true,
  size = 'medium' // 'small', 'medium', 'large'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get icon for emotion
  const getEmotionIcon = (emotion) => {
    const iconMap = {
      // Positive emotions
      joyful: Smile,
      grateful: Heart,
      inspired: Sun,
      calm: Coffee,
      focused: Search,
      energetic: Zap,
      confident: Award,
      
      // Neutral emotions
      content: ThumbsUp,
      neutral: Meh,
      contemplative: Clock,
      curious: Search,
      
      // Challenging emotions
      anxious: AlertCircle,
      stressed: Loader,
      overwhelmed: Battery,
      frustrated: XCircle,
      sad: FrownIcon,
      tired: Coffee,
      angry: XCircle,
      disappointed: CloudRain
    };
    
    return iconMap[emotion] || Meh;
  };
  
  // Get color for emotion
  const getEmotionColor = (emotion) => {
    if (EmotionGroups.POSITIVE.includes(emotion)) {
      return 'text-green-500';
    } else if (EmotionGroups.NEUTRAL.includes(emotion)) {
      return 'text-yellow-500';
    } else if (EmotionGroups.CHALLENGING.includes(emotion)) {
      return 'text-red-500';
    }
    return 'text-gray-500';
  };
  
  // Filter emotions based on search term and group filter
  const filteredEmotions = Object.values(EmotionCategories).filter(emotion => {
    const matchesSearch = emotion.includes(searchTerm.toLowerCase());
    const matchesGroup = groupFilter ? 
      (groupFilter === 'positive' ? EmotionGroups.POSITIVE.includes(emotion) :
       groupFilter === 'neutral' ? EmotionGroups.NEUTRAL.includes(emotion) :
       groupFilter === 'challenging' ? EmotionGroups.CHALLENGING.includes(emotion) : true)
      : true;
    
    return matchesSearch && matchesGroup;
  });
  
  // Group emotions by category
  const groupedEmotions = {
    positive: filteredEmotions.filter(e => EmotionGroups.POSITIVE.includes(e)),
    neutral: filteredEmotions.filter(e => EmotionGroups.NEUTRAL.includes(e)),
    challenging: filteredEmotions.filter(e => EmotionGroups.CHALLENGING.includes(e))
  };
  
  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          button: 'p-1.5',
          icon: 'w-4 h-4',
          text: 'text-xs'
        };
      case 'large':
        return {
          button: 'p-3',
          icon: 'w-8 h-8 mb-1',
          text: 'text-sm'
        };
      case 'medium':
      default:
        return {
          button: 'p-2',
          icon: 'w-6 h-6',
          text: 'text-xs'
        };
    }
  };
  
  const sizeClasses = getSizeClasses();
  
  // Render emotions in a grid
  const renderEmotionGrid = (emotions, showLabels = true) => {
    return (
      <div className={`grid ${size === 'small' ? 'grid-cols-4' : 'grid-cols-3 sm:grid-cols-4'} gap-2`}>
        {emotions.map(emotion => {
          const EmotionIcon = getEmotionIcon(emotion);
          return (
            <button
              key={emotion}
              onClick={() => onSelect(emotion)}
              className={`
                ${sizeClasses.button} rounded-lg border-2 transition-all 
                ${selectedEmotion === emotion
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-gray-300'
                }
                ${size === 'large' ? 'flex flex-col items-center' : 'flex items-center'}
              `}
            >
              <EmotionIcon className={`${sizeClasses.icon} ${getEmotionColor(emotion)} ${size !== 'large' ? 'mr-1.5' : ''}`} />
              {showLabels && (
                <div className={`${sizeClasses.text} font-medium capitalize`}>{emotion}</div>
              )}
            </button>
          );
        })}
      </div>
    );
  };
  
  // Render intensity selector
  const renderIntensitySelector = () => {
    if (!showIntensity || !selectedEmotion) return null;
    
    return (
      <div className="mt-3">
        <label className="block text-sm font-medium text-text-primary mb-1">
          Intensity ({intensity}/5)
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={intensity}
          onChange={(e) => onIntensityChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-text-secondary mt-1">
          <span>Mild</span>
          <span>Moderate</span>
          <span>Strong</span>
        </div>
      </div>
    );
  };
  
  // If using group filter, only show that group
  if (groupFilter) {
    return (
      <div className="space-y-3">
        {renderEmotionGrid(groupedEmotions[groupFilter] || [])}
        {renderIntensitySelector()}
      </div>
    );
  }
  
  // Otherwise show all groups with search
  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search emotions..."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      
      {searchTerm ? (
        <div>
          <h4 className="text-sm text-text-secondary mb-2">Search Results</h4>
          {renderEmotionGrid(filteredEmotions)}
        </div>
      ) : (
        <>
          {groupedEmotions.positive.length > 0 && (
            <div>
              <h4 className="text-sm text-text-secondary mb-2">Positive</h4>
              {renderEmotionGrid(groupedEmotions.positive)}
            </div>
          )}
          
          {groupedEmotions.neutral.length > 0 && (
            <div>
              <h4 className="text-sm text-text-secondary mb-2">Neutral</h4>
              {renderEmotionGrid(groupedEmotions.neutral)}
            </div>
          )}
          
          {groupedEmotions.challenging.length > 0 && (
            <div>
              <h4 className="text-sm text-text-secondary mb-2">Challenging</h4>
              {renderEmotionGrid(groupedEmotions.challenging)}
            </div>
          )}
        </>
      )}
      
      {renderIntensitySelector()}
    </div>
  );
}

export default EmotionSelector;

