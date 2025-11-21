import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingBag, Menu, Search, Phone, MapPin, Instagram, Facebook, AlertCircle, Dog, ChevronRight, CheckCircle, User, LogIn } from 'lucide-react';
import { MOCK_PRODUCTS, CATEGORY_LABELS, ASSETS } from './constants';
import { Product, CartItem, Review } from './types';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { GeminiAssistant } from './components/GeminiAssistant';
import { ProductDetailModal } from './components/ProductDetailModal';
import { fetchProducts } from './services/ghlService';
import { MobileMenu } from './components/MobileMenu';
import { LoginModal } from './components/LoginModal';

interface UserState {
  name: string;
  email?: string;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Load cart from local storage
    try {
      const saved = localStorage.getItem('pawhootz-cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<UserState | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [imageError, setImageError] = useState(false);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  // Fetch Products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const ghlProducts = await fetchProducts();
        
        if (ghlProducts.length > 0) {
          setProducts(ghlProducts);
          setError(null);
        } else {
          console.warn("API returned 0 products, staying empty or using mock if configured.");
          setProducts(MOCK_PRODUCTS); 
        }
      } catch (err) {
        console.error("Failed to load GHL products, falling back to mock:", err);
        setProducts(MOCK_PRODUCTS);
        setError("Live products unavailable. Viewing demo catalog.");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Persist Cart
  useEffect(() => {
    localStorage.setItem('pawhootz-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Check for saved user
  useEffect(() => {
    const savedUser = localStorage.getItem('pawhootz-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Cart Logic
  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setShowCheckoutSuccess(true);
    setCartItems([]); // Clear cart
    localStorage.removeItem('pawhootz-cart');
    setTimeout(() => setShowCheckoutSuccess(false), 5000);
  };

  // Review Logic
  const handleAddReview = (productId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `r${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          reviews: [newReview, ...p.reviews]
        };
      }
      return p;
    }));

    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(prev => prev ? {
        ...prev,
        reviews: [newReview, ...prev.reviews]
      } : null);
    }
  };

  // Auth Logic
  const handleLogin = (name: string) => {
    const newUser = { name };
    setUser(newUser);
    localStorage.setItem('pawhootz-user', JSON.stringify(newUser));
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pawhootz-user');
  };

  const categoryKeys = ['all', ...Object.keys(CATEGORY_LABELS)];

  // Group products by category for the "All" view
  const productsByCategory = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    products.forEach(p => {
      // Filter by search query even in groups
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return;
      }
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, [products, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-paw-bg font-sans text-paw-text-primary">
      
      {/* Checkout Success Modal */}
      {showCheckoutSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-500 w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-paw-text-primary mb-2">Order Placed!</h3>
            <p className="text-paw-text-secondary mb-6">
              Thank you for shopping with PawHootz! We'll have your items ready for pickup at your next visit.
            </p>
            <button 
              onClick={() => setShowCheckoutSuccess(false)}
              className="w-full bg-paw-orange text-white py-3 rounded-xl font-bold hover:bg-paw-orange-dark transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
      
      {/* Top Bar (Contact Info) */}
      <div className="bg-paw-purple text-paw-text-contrast py-2 px-4 text-xs sm:text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone size={14} /> (817) 498-6410</span>
            <span className="flex items-center gap-1 hidden sm:flex"><MapPin size={14} /> 80 Grapevine Hwy, Hurst, TX 76054</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Follow us:</span>
            <Facebook size={14} className="cursor-pointer hover:text-paw-orange transition-colors" />
            <Instagram size={14} className="cursor-pointer hover:text-paw-orange transition-colors" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-paw-bg-paper shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo Area */}
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => {setSelectedCategory('all'); setSearchQuery(''); window.scrollTo(0,0);}}
            >
              {!imageError ? (
                <img 
                  src={ASSETS.LOGO_FULL} 
                  alt="PawHootz Pet Resort" 
                  className="h-14 w-auto object-contain"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex items-center gap-2">
                   <div className="flex flex-col leading-none">
                      <div className="flex items-baseline gap-0.5">
                         <span className="text-3xl font-extrabold text-paw-purple">Paw</span>
                         <span className="text-3xl font-extrabold text-paw-purple">H</span>
                         <span className="text-3xl font-extrabold text-red-900">oo</span>
                         <span className="text-3xl font-extrabold text-red-900">t</span>
                         <span className="text-3xl font-extrabold text-paw-orange">z</span>
                      </div>
                      <span className="text-[10px] font-bold text-paw-purple tracking-[0.2em] uppercase mt-0.5 ml-1">Pet Resort</span>
                   </div>
                </div>
              )}
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
              <input
                type="text"
                placeholder="Search for shampoos, treats, toys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:border-paw-purple focus:ring-2 focus:ring-paw-purple/20 outline-none transition-all text-paw-text-primary placeholder-paw-text-secondary"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-paw-text-secondary" size={18} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button 
                className="p-2 hover:bg-gray-50 rounded-full lg:hidden"
                onClick={() => {
                  const searchInput = document.getElementById('mobile-search');
                  if (searchInput) searchInput.focus();
                }}
              >
                <Search size={24} className="text-paw-text-secondary" />
              </button>
              
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-gray-50 rounded-full group"
              >
                <ShoppingBag size={24} className="text-paw-purple group-hover:text-paw-orange transition-colors" />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 bg-paw-orange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white transform translate-x-1 -translate-y-1">
                    {cartItems.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </button>

              {/* Desktop Login Button */}
              <div className="hidden lg:block border-l border-gray-200 pl-4 ml-2">
                 {user ? (
                   <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-paw-text-secondary font-medium">Hello,</p>
                        <p className="text-sm font-bold text-paw-purple leading-none">{user.name}</p>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Sign Out"
                      >
                        <LogIn size={14} className="rotate-180" />
                      </button>
                   </div>
                 ) : (
                   <button 
                     onClick={() => setIsLoginOpen(true)}
                     className="flex items-center gap-2 text-paw-purple font-bold hover:text-paw-orange transition-colors text-sm"
                   >
                     <User size={18} />
                     Login
                   </button>
                 )}
              </div>
              
              {/* Mobile Menu Button */}
              <button 
                className="p-2 hover:bg-gray-50 rounded-full lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={24} className="text-paw-text-secondary" />
              </button>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="mt-3 md:hidden">
             <div className="relative">
              <input
                id="mobile-search"
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-paw-purple focus:ring-2 focus:ring-paw-purple/20 outline-none text-paw-text-primary"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-paw-text-secondary" size={16} />
             </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Brand Gradient */}
      <div className="bg-paw-header text-white">
        <div className="container mx-auto px-4 py-12 sm:py-20 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-1 rounded-full text-sm font-medium border border-white/20">
              New Shampoos & Treats Available
            </div>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Pamper Your <br/>
              <span className="text-paw-orange-light">Best Friend</span>
            </h2>
            <p className="text-white/90 text-lg max-w-lg mx-auto md:mx-0">
              From premium grooming tools to cozy beds, shop the same high-quality products we trust at our resort.
            </p>
            <button 
              onClick={() => {
                setSelectedCategory('all');
                const shopElement = document.getElementById('shop-section');
                shopElement?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-paw-orange text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-paw-orange-dark transition-all transform hover:-translate-y-1"
            >
              Shop Now
            </button>
          </div>
          <div className="flex-1 relative">
             <div className="relative w-full max-w-md mx-auto aspect-square">
                <div className="absolute inset-0 bg-paw-purple-light/30 rounded-full blur-3xl animate-pulse"></div>
                
                <video 
                  src={ASSETS.HERO_VIDEO} 
                  className="relative z-10 w-full h-full object-cover rounded-2xl shadow-2xl border-4 border-white/20 rotate-3 hover:rotate-0 transition-transform duration-700"
                  autoPlay
                  muted
                  playsInline
                />

                {/* Floating Icon Logo Badge */}
                <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center p-2 z-20 hidden md:flex">
                  <img src={ASSETS.LOGO_ICON} alt="PawHootz" className="w-full h-full object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Shop Section */}
      <main id="shop-section" className="flex-1 container mx-auto px-4 py-12">
        
        {/* Error/Status Message */}
        {error && (
          <div className="max-w-4xl mx-auto bg-paw-bg-paper border border-gray-200 p-3 mb-8 flex items-center gap-3 rounded-lg shadow-sm text-xs sm:text-sm">
            <AlertCircle className="text-paw-purple flex-shrink-0" size={16} />
            <div>
              <span className="font-semibold text-paw-text-primary mr-1">Demo Mode:</span>
              <span className="text-paw-text-secondary">Unable to connect to live inventory (Network/CORS). Showing sample products.</span>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col space-y-6 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-paw-text-primary">Our Collection</h3>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-2 sticky top-20 bg-paw-bg py-2 z-20 transition-all">
            {categoryKeys.map(key => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === key 
                    ? 'bg-paw-purple text-white shadow-lg shadow-paw-purple/30 scale-105' 
                    : 'bg-white text-paw-text-secondary hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {key === 'all' ? 'All Products' : CATEGORY_LABELS[key]}
              </button>
            ))}
          </div>
        </div>

        {/* Product Display */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <div key={n} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-96 animate-pulse">
                <div className="bg-gray-200 w-full h-48 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mt-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
             {/* No Results */}
             {Object.keys(productsByCategory).length === 0 && (
               <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                 <Dog className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                 <h3 className="text-lg font-medium text-paw-text-primary">No products found</h3>
                 <p className="text-paw-text-secondary">Try adjusting your search or category filter.</p>
                 <button 
                   onClick={() => {setSelectedCategory('all'); setSearchQuery('');}}
                   className="mt-4 text-paw-purple font-medium hover:underline"
                 >
                   Clear all filters
                 </button>
               </div>
             )}

             {/* Grouped View (All Categories) */}
             {selectedCategory === 'all' ? (
               <div className="space-y-16">
                 {Object.entries(CATEGORY_LABELS).map(([catKey, catLabel]) => {
                   const catProducts = productsByCategory[catKey];
                   if (!catProducts || catProducts.length === 0) return null;
                   
                   return (
                     <section key={catKey} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                       <div className="flex items-center justify-between mb-6">
                         <div className="flex items-center gap-3">
                            <div className="h-8 w-1 bg-paw-orange rounded-full"></div>
                            <h2 className="text-2xl font-bold text-paw-text-primary">{catLabel}</h2>
                            <span className="text-sm text-paw-text-secondary bg-gray-100 px-2 py-0.5 rounded-full">{catProducts.length}</span>
                         </div>
                         <button 
                           onClick={() => setSelectedCategory(catKey)}
                           className="text-sm font-medium text-paw-purple hover:text-paw-orange flex items-center transition-colors"
                         >
                           View All <ChevronRight size={16} />
                         </button>
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                         {catProducts.slice(0, 4).map(product => (
                           <ProductCard 
                             key={product.id} 
                             product={product} 
                             onAddToCart={addToCart} 
                             onViewDetails={setSelectedProduct}
                           />
                         ))}
                       </div>
                     </section>
                   );
                 })}
               </div>
             ) : (
               // Single Category View
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in zoom-in duration-300">
                 {productsByCategory[selectedCategory]?.map(product => (
                   <ProductCard 
                     key={product.id} 
                     product={product} 
                     onAddToCart={addToCart} 
                     onViewDetails={setSelectedProduct}
                   />
                 ))}
               </div>
             )}
          </>
        )}
      </main>

      {/* Feature Banner */}
      <section className="bg-paw-purple-light/10 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md text-paw-purple">
                <ShoppingBag size={32} />
              </div>
              <h4 className="text-lg font-bold text-paw-purple mb-2">Curated Selection</h4>
              <p className="text-paw-text-secondary">Hand-picked products used by our professional trainers and groomers.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md text-paw-purple">
                <MapPin size={32} />
              </div>
              <h4 className="text-lg font-bold text-paw-purple mb-2">Local Pickup</h4>
              <p className="text-paw-text-secondary">Order online and pick up your items when you drop off your pup.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md text-paw-purple">
                <Dog size={32} />
              </div>
              <h4 className="text-lg font-bold text-paw-purple mb-2">Expert Advice</h4>
              <p className="text-paw-text-secondary">Not sure what to get? Ask our AI assistant Hootie for recommendations!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-paw-text-primary text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                 <img src={ASSETS.LOGO_ICON} alt="Logo" className="w-8 h-8" onError={(e) => e.currentTarget.style.display = 'none'} />
                 <span className="text-2xl font-bold text-white">PawHootz</span>
              </div>
              <p className="max-w-xs text-paw-text-secondary text-gray-400">
                Your pet's favorite home away from home. Now bringing the best products directly to you.
              </p>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Shop</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-paw-orange transition-colors">Treats & Chews</a></li>
                <li><a href="#" className="hover:text-paw-orange transition-colors">Toys</a></li>
                <li><a href="#" className="hover:text-paw-orange transition-colors">Grooming Tools</a></li>
                <li><a href="#" className="hover:text-paw-orange transition-colors">Apparel</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">Customer Care</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-paw-orange transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-paw-orange transition-colors">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-paw-orange transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-paw-orange transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; 2024 PawHootz Pet Resort. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Overlays */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
      />
      
      <ProductDetailModal 
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
        onAddReview={handleAddReview}
      />
      
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogoutClick={handleLogout}
        onSelectCategory={setSelectedCategory}
      />

      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />

      <GeminiAssistant products={products} />
    </div>
  );
}

export default App;