import React, { useState } from 'react';
import { makeApiRequest } from '../utils/apiService';
import { toast } from 'sonner';

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error("Please select a rating");
    
    setIsSubmitting(true);
    try {
      const res = await makeApiRequest("/api/product/add-review", "POST", {
        productId,
        rating,
        comment
      });
      if (res.success) {
        toast.success("Review added successfully");
        onReviewAdded(res.data);
        setComment("");
        setRating(5);
      }
    } catch (error) {
      toast.error(error.message || "Failed to add review. Make sure you bought this item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-gray-200 p-6 rounded-lg bg-gray-50 shadow-sm w-full">
      <h3 className="font-semibold text-lg text-gray-900">Write a Review</h3>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              className={`text-3xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'} transition-colors hover:scale-110 active:scale-95`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Comment (Optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-md text-sm min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
          placeholder="Share your thoughts about this product..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-black text-white px-8 py-3 rounded-md text-sm font-bold tracking-wide w-max disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors shadow-md mt-2"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
