
import React, { useState, useMemo } from 'react';
import { X, Star, ShoppingBag, Send } from 'lucide-react';
import { Product, Review } from '../types';
import { CATEGORY_LABELS } from '../constants';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAddReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onAddReview
}) => {
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Hook must run unconditionally, so we handle null product inside
  const averageRating = useMemo(() => {
    if (!product || !product.reviews || product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / product.reviews.length).toFixed(1);
  }, [product]);

  // Conditional rendering must happen AFTER all hooks
  if (!isOpen || !product) return null;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReviewAuthor.trim() && newReviewComment.trim()) {
      onAddReview(product.id, {
        author: newReviewAuthor,
        rating: newReviewRating,
        comment: newReviewComment
      });
      setNewReviewAuthor('');
      setNewReviewComment('');
      setNewReviewRating(5);
      setShowReviewForm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white rounded-full backdrop-blur-md transition-colors"
        >
          <X size={24} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-white h-64 md:h-auto relative group p-8 flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain max-h-[50vh] md:max-h-full"
          />
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 flex flex-col max-h-[90vh] overflow-hidden bg-paw-bg-paper">
          <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
            <div className="mb-1">
              <span className="text-paw-purple-light text-sm font-bold uppercase tracking-wider">
                {CATEGORY_LABELS[product.category] || product.category}
              </span>
            </div>
            
            <h2 className="text-3xl font-bold text-paw-purple mb-2">{product.name}</h2>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star className="text-yellow-400 fill-yellow-400" size={18} />
                <span className="font-bold text-paw-text-primary">
                  {Number(averageRating) > 0 ? averageRating : 'New'}
                </span>
                <span className="text-paw-text-secondary text-sm">
                  ({product.reviews.length} reviews)
                </span>
              </div>
              <span className="text-2xl font-bold text-paw-text-primary">${product.price.toFixed(2)}</span>
            </div>

            <p className="text-paw-text-secondary mb-8 text-lg leading-relaxed">
              {product.description}
            </p>

            <button 
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="w-full bg-paw-orange text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-paw-orange-dark hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-2 mb-8"
            >
              <ShoppingBag size={20} />
              Add to Cart
            </button>

            {/* Reviews Section */}
            <div className="border-t border-gray-100 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-paw-text-primary">Customer Reviews</h3>
                <button 
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="text-sm text-paw-purple font-medium hover:text-paw-orange"
                >
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </button>
              </div>

              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="bg-paw-bg p-4 rounded-xl mb-6 animate-in slide-in-from-top-2">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-paw-text-primary mb-1">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          className={`p-1 transition-transform hover:scale-110 ${star <= newReviewRating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          <Star className="fill-current" size={24} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-paw-text-primary mb-1">Name</label>
                    <input 
                      type="text" 
                      required
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-paw-purple/20 outline-none"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-paw-text-primary mb-1">Review</label>
                    <textarea 
                      required
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="What did you think about this product?"
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-paw-purple/20 outline-none resize-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-paw-purple text-white py-2 rounded-lg font-medium hover:bg-paw-purple-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <Send size={16} /> Submit Review
                  </button>
                </form>
              )}

              <div className="space-y-4">
                {product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <div key={review.id} className="bg-paw-bg p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-paw-text-primary">{review.author}</span>
                        <span className="text-xs text-paw-text-secondary">{review.date}</span>
                      </div>
                      <div className="flex text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={i < review.rating ? "fill-current" : "text-gray-300"} 
                          />
                        ))}
                      </div>
                      <p className="text-paw-text-secondary text-sm">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-paw-text-secondary bg-paw-bg rounded-xl">
                    No reviews yet. Be the first to share your thoughts!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
