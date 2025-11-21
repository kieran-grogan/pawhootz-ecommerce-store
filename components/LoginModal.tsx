
import React, { useState } from 'react';
import { X, Mail, Lock, LogIn } from 'lucide-react';
import { ASSETS } from '../constants';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (name: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login delay
    setTimeout(() => {
      const name = email.split('@')[0];
      // Capitalize first letter of name derived from email
      const displayName = name.charAt(0).toUpperCase() + name.slice(1);
      onLogin(displayName);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-paw-purple p-6 text-center text-white relative">
          <button 
            onClick={onClose} 
            className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 p-2 shadow-lg">
             <img 
               src={ASSETS.LOGO_ICON} 
               className="w-full h-full object-contain" 
               alt="Logo" 
               onError={(e) => e.currentTarget.style.display = 'none'}
             />
          </div>
          <h2 className="text-2xl font-bold">Welcome Back!</h2>
          <p className="text-white/80 text-sm mt-1">Sign in to your PawHootz Member account</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-paw-text-primary mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-paw-purple/20 focus:border-paw-purple outline-none transition-all text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-paw-text-primary mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-paw-purple/20 focus:border-paw-purple outline-none transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-paw-purple focus:ring-paw-purple w-4 h-4" />
                <span className="text-paw-text-secondary">Remember me</span>
              </label>
              <button type="button" className="text-paw-purple font-medium hover:underline">Forgot password?</button>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-paw-orange text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-paw-orange-dark transition-all flex items-center justify-center gap-2 disabled:opacity-70 hover:-translate-y-0.5"
            >
              {isLoading ? (
                'Signing in...'
              ) : (
                <>
                  <LogIn size={20} /> Sign In
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-paw-text-secondary">
            Don't have an account? <button className="text-paw-purple font-bold hover:underline ml-1">Register now</button>
          </div>
        </div>
      </div>
    </div>
  );
};
