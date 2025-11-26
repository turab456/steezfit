import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ 
  rating, 
  onRatingChange, 
  interactive = false, 
  size = 'default',
  showRatingText = true 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-5 h-5',
    large: 'w-6 h-6',
    xlarge: 'w-8 h-8'
  };

  const textSizeClasses = {
    small: 'text-xs',
    default: 'text-sm',
    large: 'text-base',
    xlarge: 'text-lg'
  };

  const handleStarClick = (starRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform duration-150`}
            onClick={() => handleStarClick(star)}
            disabled={!interactive}
          >
            <Star
              className={`${sizeClasses[size]} ${
                star <= rating
                  ? 'text-black fill-current' // Changed from yellow to black
                  : 'text-gray-300'
              } transition-colors duration-150`}
            />
          </button>
        ))}
      </div>
      {showRatingText && (
        <span className={`${textSizeClasses[size]} text-gray-600 ml-2`}>
          {rating > 0 ? `${rating.toFixed(1)}` : '0.0'}
        </span>
      )}
    </div>
  );
};

// Display-only star rating component
export const DisplayStarRating = ({ rating, size = 'default', showRatingText = true }) => {
  return (
    <StarRating
      rating={rating}
      interactive={false}
      size={size}
      showRatingText={showRatingText}
    />
  );
};

// Interactive star rating component
export const InteractiveStarRating = ({ rating, onRatingChange, size = 'default', showRatingText = true }) => {
  return (
    <StarRating
      rating={rating}
      onRatingChange={onRatingChange}
      interactive={true}
      size={size}
      showRatingText={showRatingText}
    />
  );
};

export default StarRating;