
import React from 'react';
import { X, ChevronRight, LogIn, LogOut, User, ShoppingBag } from 'lucide-react';
import { CATEGORY_LABELS, ASSETS } from '../constants';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string } | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onSelectCategory: (key: string) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  onLoginClick, 
  onLogoutClick,
  onSelectCategory 
}) => {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Menu Drawer */}
      <div className={`fixed inset-y-0 left-0 w-[300px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="p-6 bg-paw-purple text-white relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-10 -mb-10"></div>

            <button onClick={onClose} className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors">
              <X size={24} />
            </button>
            
            <div className="flex items-center gap-3 mb-6 mt-2 relative z-10">
               <div className="w-12 h-12 bg-white rounded-full p-1.5 shadow-md">
                  <img 
                    src={ASSETS.LOGO_ICON} 
                    className="w-full h-full object-contain" 
                    alt="Logo" 
                    onError={(e) => e.currentTarget.style.display = 'none'}
                  />
               </div>
               <div>
                 <h2 className="font-bold text-xl leading-none">PawHootz</h2>
                 <p className="text-xs text-white/70 mt-1">Pet Resort Store</p>
               </div>
            </div>

            {user ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 border border-white/10">
                <div className="bg-paw-orange p-2.5 rounded-full shadow-sm">
                  <User size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">Hi, {user.name}</p>
                  <p className="text-xs text-white/70">Member Status: Active</p>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => { onClose(); onLoginClick(); }}
                className="w-full bg-white text-paw-purple py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-lg"
              >
                <LogIn size={18} /> Member Login
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
             <div className="px-6 mb-2">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Shop Categories</h3>
             </div>
             <nav className="space-y-1">
               <button 
                 onClick={() => { onSelectCategory('all'); onClose(); }}
                 className="w-full flex items-center justify-between px-6 py-3.5 text-paw-text-primary hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-paw-orange group"
               >
                 <span className="font-medium group-hover:text-paw-purple transition-colors">All Products</span>
                 <ChevronRight size={16} className="text-gray-300 group-hover:text-paw-purple" />
               </button>
               {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                 <button
                   key={key}
                   onClick={() => { onSelectCategory(key); onClose(); }}
                   className="w-full flex items-center justify-between px-6 py-3.5 text-paw-text-primary hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-paw-orange group"
                 >
                   <span className="font-medium group-hover:text-paw-purple transition-colors">{label}</span>
                   <ChevronRight size={16} className="text-gray-300 group-hover:text-paw-purple" />
                 </button>
               ))}
             </nav>

             <div className="border-t border-gray-100 my-4 pt-6">
               <div className="px-6 mb-2">
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Support</h3>
               </div>
               <nav className="space-y-1">
                 <a href="#" className="block px-6 py-3 text-sm font-medium text-paw-text-secondary hover:text-paw-purple hover:bg-gray-50 transition-colors">Contact Us</a>
                 <a href="#" className="block px-6 py-3 text-sm font-medium text-paw-text-secondary hover:text-paw-purple hover:bg-gray-50 transition-colors">Shipping & Returns</a>
                 <a href="#" className="block px-6 py-3 text-sm font-medium text-paw-text-secondary hover:text-paw-purple hover:bg-gray-50 transition-colors">FAQ</a>
               </nav>
             </div>
          </div>

          {/* Footer */}
          {user && (
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={() => { onLogoutClick(); onClose(); }}
                className="w-full flex items-center justify-center gap-2 text-red-500 py-3 hover:bg-red-50 rounded-xl transition-colors font-medium border border-transparent hover:border-red-100"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
