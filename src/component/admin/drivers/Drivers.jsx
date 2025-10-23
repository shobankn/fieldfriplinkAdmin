import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import AdminSidebar from '../sidebar/AdminSidebar';
import AdminTopBar from '../sidebar/AdminTopbar';
import DriversManagement from './DriverManagment';

// Welcome Popup Component
const WelcomeAdminPopup = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setIsAnimating(true), 10);

    // Auto close after 3 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0  bg-black/20  bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20  bg-opacity-50 backdrop-blur-sm"></div>
      
      {/* Popup */}
      <div className={`relative bg-gradient-to-br from-red-50 to-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors duration-200 p-1 hover:bg-red-50 rounded-full"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon/Logo */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Welcome Text */}
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back, Field Trip Admin!
          </h2>
          <p className="text-gray-600 mb-6">
            We're glad to see you again. Ready to manage your dashboard?
          </p>

          {/* Decorative Element */}
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Bottom Accent */}
        <div className="h-2 bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-b-2xl"></div>
      </div>
    </div>
  );
};

function Drivers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check localStorage for welcomeadmin key
    try {
      const hasSeenWelcome = localStorage.getItem('welcomeadmin');
      
      if (!hasSeenWelcome) {
        setShowWelcome(true);
        // Set the key so popup won't show again
        localStorage.setItem('welcomeadmin', 'true');
      }
    } catch (error) {
      // Fallback if localStorage is not available
      console.log('localStorage not available');
    }
  }, []);

  return (
    <>
      {showWelcome && <WelcomeAdminPopup onClose={() => setShowWelcome(false)} />}
      
      <div className="flex bg-gray-50 min-h-screen">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col min-h-screen lg:ml-58">
          <AdminTopBar onMenuClick={() => setSidebarOpen(true)} className="lg:ml-58" />
          
          <main className="flex-1 lg:p-6 overflow-y-auto">
            <DriversManagement />
          </main>
        </div>
      </div>
    </>
  );
}

export default Drivers;