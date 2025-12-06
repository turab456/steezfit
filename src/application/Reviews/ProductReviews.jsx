import React, { useState, useEffect } from 'react';
import { reviewService } from './api/ReviewApi';
import ReviewCard from './ReviewCard';
import ReviewSummary from './ReviewSummary';
import Loader from '../../components/common/Loader';

const REVIEWS_PER_PAGE = 5;

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filterRating, setFilterRating] = useState(null);

  const fetchReviewsData = async (isLoadMore = false) => {
    if (!productId) return;

    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setReviews([]); // Reset reviews on initial fetch or filter change
        setPage(1);
      }
      setError(null);

      const currentPage = isLoadMore ? page + 1 : 1;
      const response = await reviewService.getProductReviews(productId, {
        page: currentPage,
        limit: REVIEWS_PER_PAGE,
        rating: filterRating,
      });

      setReviews(prev => isLoadMore ? [...prev, ...response.reviews] : response.reviews);
      if (!isLoadMore) {
        setSummary(response.summary);
      }
      setHasMore(response.reviews.length === REVIEWS_PER_PAGE);
      setPage(currentPage);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchReviewsData(false);
  }, [productId, filterRating]);

  if (loading) {
    return (
      <div className="w-full p-12 text-center">
        <Loader className="justify-center" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center p-12">
        <p className="text-red-500">Error loading reviews: {error}</p>
        <button onClick={() => fetchReviewsData(false)} className="mt-2 text-black underline">
          Try again
        </button>
      </div>
    );
  }
  
  if (!summary || summary.totalReviews === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
        <p className="text-gray-500">No reviews yet.</p>
        <p className="text-sm text-gray-400">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="font-sans bg-white p-4 md:p-8 rounded-2xl shadow-sm">
      {/* Hide scrollbar for the scrollable reviews column */}
      <style>{`
        #reviews-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        #reviews-scroll::-webkit-scrollbar { display: none; }
      `}</style>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-16">
        {/* Left Column: Summary */}
        <div className="md:col-span-4 md:sticky md:top-20 lg:top-24 self-start rounded-xl bg-white p-5">
          <ReviewSummary 
            summary={summary} 
            onRatingFilter={setFilterRating} 
            selectedRating={filterRating} 
          />
        </div>

        {/* Right Column: Review List */}
        <div
          id="reviews-scroll"
          className="md:col-span-8 md:max-h-[calc(100vh-8rem)] md:overflow-y-auto lg:max-h-[calc(100vh-6rem)] pr-1"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {filterRating ? `${filterRating}-Star Reviews` : `All Reviews`} 
              <span className="text-base font-normal text-gray-500 ml-2">({reviews.length} of {summary?.totalReviews || 0})</span>
            </h3>
          </div>
          
          {reviews.length > 0 ? (
            <div>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>

              {summary?.totalReviews > REVIEWS_PER_PAGE && (
                <div className="mt-6 md:mt-8 text-center">
                  <button
                    onClick={() => (hasMore ? fetchReviewsData(true) : fetchReviewsData(false))}
                    disabled={loadingMore}
                    className="px-3 py-2 text-sm md:px-6 md:py-3 md:text-base border border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors font-semibold disabled:opacity-50"
                  >
                    {loadingMore ? 'Loading...' : hasMore ? 'Show more' : 'Show less'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
                <p className="font-semibold text-gray-800">No reviews found for this filter.</p>
                <p className="text-gray-500 text-sm mt-1">Try selecting another rating.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
