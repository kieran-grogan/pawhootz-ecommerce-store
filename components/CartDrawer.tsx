import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem,
  onCheckout
}) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-paw-bg-paper shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-paw-purple text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} />
              <h2 className="text-xl font-bold">Your Cart ({items.length})</h2>
            </div>
            <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-paw-bg rounded-full flex items-center justify-center text-paw-text-secondary">
                  <ShoppingBag size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-paw-text-primary">Your cart is empty</h3>
                  <p className="text-paw-text-secondary mt-1">Looks like you haven't added any treats yet!</p>
                </div>
                <button 
                  onClick={onClose}
                  className="bg-paw-orange text-white px-6 py-2 rounded-full font-medium hover:bg-paw-orange-dark transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-paw-text-primary line-clamp-1">{item.name}</h3>
                    <p className="text-paw-purple font-bold mt-1">${item.price.toFixed(2)}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="px-3 py-1 hover:bg-gray-50 text-gray-600"
                        >
                          -
                        </button>
                        <span className="px-2 text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="px-3 py-1 hover:bg-gray-50 text-gray-600"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-paw-bg">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-paw-text-secondary">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-paw-text-secondary">
                  <span>Taxes (est.)</span>
                  <span>${(total * 0.0825).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-paw-purple pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>${(total * 1.0825).toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={onCheckout}
                className="w-full bg-paw-orange text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-paw-orange-dark transform hover:scale-[1.02] transition-all"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};