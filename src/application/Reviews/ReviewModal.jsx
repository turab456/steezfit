import React, { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { reviewService } from './api/ReviewApi';
import { InteractiveStarRating } from './StarRating';

const ReviewModal = ({ isOpen, onClose, productData, orderId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditing = productData?.isEditing;
  const reviewToEdit = productData?.review;

  useEffect(() => {
    if (isOpen) {
      if (isEditing && reviewToEdit) {
        setRating(reviewToEdit.rating || 0);
        setComment(reviewToEdit.comment || '');
      } else {
        setRating(0);
        setComment('');
      }
    }
  }, [isOpen, isEditing, reviewToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    setIsSubmitting(true);

    try {
      if (isEditing) {
        // Handle Update
        await reviewService.updateReview(reviewToEdit.id, { rating, comment: comment.trim() || null });
        toast.success('Review updated successfully!');
      } else {
        // Handle Create
        await reviewService.createReview({
          product_id: productData.product_id,
          order_id: orderId,
          rating,
          comment: comment.trim() || null
        });
        toast.success('Review submitted successfully!');
      }
      onReviewSubmitted();
    } catch (error) {
      toast.error(error.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen || !productData) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="bg-white rounded-xl max-w-md w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">{isEditing ? 'Edit Your Review' : 'Write a Review'}</h2>
            <button onClick={handleClose} disabled={isSubmitting} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={productData.product_image}
                alt={productData.product_name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-medium">{productData.product_name}</h3>
                <p className="text-sm text-gray-500">Order #{orderId.substring(0, 8)}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Your Rating *</label>
                <InteractiveStarRating rating={rating} onRatingChange={setRating} size="large" />
              </div>
              <div>
                <label htmlFor="comment" className="block text-sm font-medium mb-2">Your Review</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black resize-none"
                  rows="4"
                  maxLength="1000"
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 border rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rating === 0 || isSubmitting}
                  className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-medium disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : (isEditing ? 'Update Review' : 'Submit Review')}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewModal;