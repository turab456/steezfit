import React, { useState } from 'react';
import { DisplayStarRating } from './StarRating';
const ReviewCard = ({ review }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };

  const [expanded, setExpanded] = useState(false);
  const commentText = review.comment || '';
  const showToggle = commentText && commentText.length > 250; // show "Read more" if long enough

  return (
    <div className="border-b border-gray-200 py-6 last:border-b-0">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-4">
          {/* User Avatar */}
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
            <span className="text-gray-900 font-medium text-sm">
              {getInitials(review.user?.firstName, review.user?.lastName)}
            </span>
          </div>
          
          {/* User & Date Info */}
          <div>
            <h4 className="font-semibold text-gray-900">
              {review.user?.firstName} {review.user?.lastName}
            </h4>
            <p className="text-sm text-gray-500">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>

        {/* Featured Badge - Redesigned for B&W theme */}
        {review.is_featured && (
          <span className="border border-gray-800 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-md tracking-wide">
            Featured
          </span>
        )}
      </div>

      {/* Star Rating */}
      <div className="mb-4">
        <DisplayStarRating rating={review.rating} size="small" showRatingText={false} />
      </div>

      {/* Review Content */}
      {commentText && (
        <div>
          <p
            className="text-gray-800 leading-relaxed"
            style={
              expanded
                ? {}
                : { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }
            }
          >
            {commentText}
          </p>
          {showToggle && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-2 text-red-600 text-sm font-medium hover:underline"
            >
              {expanded ? 'Read less' : 'Read more'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
