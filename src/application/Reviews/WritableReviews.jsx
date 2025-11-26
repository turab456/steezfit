import React, { useState, useEffect } from 'react';
import { Star, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { reviewService } from './api/ReviewApi';
import ReviewModal from './ReviewModal';
import { DisplayStarRating } from './StarRating';

const WritableReviews = ({ orderId, onReviewSubmitted }) => {
  const [writableItems, setWritableItems] = useState([]);
  const [reviewedItems, setReviewedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const allItems = [...writableItems, ...reviewedItems];

  const fetchReviewsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewService.getWritableReviews();
      
      const orderWritable = response.writableReviews.filter(
        review => review.order_id === orderId
      );
      const orderReviewed = response.reviewedReviews.filter(
        review => review.order_id === orderId
      );
      
      setWritableItems(orderWritable);
      setReviewedItems(orderReviewed);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching review data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsData();
  }, [orderId]);

  useEffect(() => {
    if (allItems.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === allItems.length - 1 ? 0 : prevIndex + 1
        );
      }, 8000); // Auto-slide every 7 seconds

      return () => clearInterval(interval);
    }
  }, [allItems.length]);

  const handleWriteReview = (item) => {
    setSelectedItem({ ...item, isEditing: false });
    setShowReviewModal(true);
  };

  const handleEditReview = (item) => {
    setSelectedItem({ ...item, isEditing: true });
    setShowReviewModal(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewService.deleteReview(reviewId);
        toast.success('Review deleted successfully');
        fetchReviewsData(); // Refresh list
        if (onReviewSubmitted) onReviewSubmitted();
      } catch (err) {
        toast.error(err.message || 'Failed to delete review');
      }
    }
  };
  
  const handleReviewSubmitted = () => {
    setShowReviewModal(false);
    setSelectedItem(null);
    fetchReviewsData(); // Refresh the lists
    if (onReviewSubmitted) {
      onReviewSubmitted();
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) return null; // Or show an error message
  if (allItems.length === 0) return null;

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900">Share Your Experience</h3>
          <p className="text-gray-600 mt-1">Review the products from your recent order.</p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {allItems.map((item) => (
                <div key={`${item.order_id}-${item.product_id}`} className="w-full flex-shrink-0">
                  <div className="border-2 border-gray-100 rounded-xl p-6 mx-2">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <img
                        src={item.product_image || 'https://placehold.co/150'}
                        alt={item.product_name}
                        className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
                      />
                      <div className="flex-grow text-center md:text-left">
                        <h4 className="font-bold text-xl text-gray-900">
                          {item.product_name}
                        </h4>
                        
                        {item.review ? (
                          <div className="mt-2 flex flex-col items-center md:items-start">
                            <div className="mb-2">
                              <DisplayStarRating rating={item.review.rating} size="small" />
                            </div>
                            <p className="text-sm text-gray-600 italic text-center md:text-left mb-3">"{item.review.comment}"</p>
                            <div className="flex justify-center md:justify-start gap-2 w-full">
                              <button onClick={() => handleEditReview(item)} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800">
                                <Edit size={14} className="mr-1" /> Edit
                              </button>
                              <button onClick={() => handleDeleteReview(item.review.id)} className="flex items-center text-sm font-semibold text-red-600 hover:text-red-800">
                                <Trash2 size={14} className="mr-1" /> Delete
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 mt-1">Purchased on {new Date(item.order_date).toLocaleDateString()}</p>
                        )}
                      </div>
                      
                      {!item.review && (
                        <div className="flex-shrink-0">
                          <button
                            onClick={() => handleWriteReview(item)}
                            className="flex items-center space-x-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold"
                          >
                            <Star className="w-5 h-5" />
                            <span>Write a Review</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bullet Indicators */}
          {allItems.length > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {allItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentIndex === index ? 'bg-black' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setSelectedItem(null)}
        productData={selectedItem}
        orderId={orderId}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </>
  );
};

export default WritableReviews;
