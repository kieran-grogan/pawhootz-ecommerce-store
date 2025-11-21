import React, { useMemo, useState } from 'react';
import { Plus, Star } from 'lucide-react';
import { Product } from '../types';
import { CATEGORY_LABELS, ASSETS } from '../constants';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  const [imgError, setImgError] = useState(false);

  const averageRating = useMemo(() => {
    if (product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / product.reviews.length).toFixed(1);
  }, [product.reviews]);

  // Only show image if URL exists and we haven't encountered an error
  const shouldShowImage = product.image && product.image.trim() !== '' && !imgError;

  return (
    <div className="group bg-paw-bg-paper rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
      <div 
        className="relative aspect-square overflow-hidden bg-white cursor-pointer flex items-center justify-center p-4"
        onClick={() => onViewDetails(product)}
      >
        {shouldShowImage ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-3/4 h-3/4 flex flex-col items-center justify-center opacity-20 p-6">
            <img 
              src={ASSETS.LOGO_ICON} 
              alt="PawHootz" 
              className="w-full h-full object-contain grayscale" 
              onError={(e) => e.currentTarget.style.display = 'none'} 
            />
          </div>
        )}
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="absolute bottom-3 right-3 bg-paw-orange text-white p-3 rounded-full shadow-lg hover:bg-paw-orange-dark transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
          aria-label="Add to cart"
        >
          <Plus size={20} />
        </button>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center mb-2">
          {product.reviews.length > 0 && (
             <div className="flex text-yellow-400 mr-1">
               <Star className="fill-current" size={14} />
             </div>
          )}
          <span className="text-xs font-medium text-paw-text-secondary">
            {Number(averageRating) > 0 ? averageRating : 'New Arrival'} 
            {product.reviews.length > 0 && <span className="text-paw-text-secondary/70 font-normal ml-0.5">({product.reviews.length})</span>}
          </span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-xs font-medium text-paw-purple-light uppercase tracking-wider truncate flex-1">
            {CATEGORY_LABELS[product.category] || product.category}
          </span>
        </div>
        
        <h3 
          onClick={() => onViewDetails(product)}
          className="text-lg font-bold text-paw-purple mb-1 leading-tight cursor-pointer hover:text-paw-orange transition-colors line-clamp-1"
        >
          {product.name}
        </h3>
        <p className="text-sm text-paw-text-secondary mb-4 line-clamp-2 flex-1">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-paw-text-primary">${product.price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};