
import React from 'react';
import { DisplayStarRating } from './StarRating';

const ReviewSummary = ({ summary, onRatingFilter, selectedRating }) => {
  const { totalReviews, averageRating, ratingDistribution } = summary;

  const getPercentage = (count) => {
    if (totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  const handleFilterClick = (rating) => {
    // If the currently selected rating is clicked again, clear the filter
    if (rating === selectedRating) {
      onRatingFilter(null);
    } else {
      onRatingFilter(rating);
    }
  };

  return (
    <div className="bg-white  ">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-center md:text-left">Customer Reviews</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Rating Block */}
        <div className="flex flex-col items-center justify-center text-center md:border-r md:border-gray-200 md:pr-6">
          <div className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
          <div className="my-2">
            <DisplayStarRating rating={averageRating} size="default" showRatingText={false} />
          </div>
          <div className="text-sm text-gray-500">
            Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </div>
        </div>

        {/* Rating Distribution Block */}
        <div className="md:col-span-2">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const distribution = ratingDistribution.find(dist => dist.rating === rating);
              const count = distribution ? distribution.count : 0;
              const percentage = getPercentage(count);

              return (
                <button
                  key={rating}
                  onClick={() => handleFilterClick(rating)}
                  disabled={count === 0 && !selectedRating}
                  className={`flex items-center w-full p-1 rounded-md transition-colors group disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedRating === rating ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm font-medium text-gray-700 w-12">{rating} star</span>
                  <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-black h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right font-mono">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;