import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [hasDynamicIsland, setHasDynamicIsland] = useState(false);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    // Check if device has a Dynamic Island or notch
    const checkForDynamicIsland = () => {
      // iPhone models with Dynamic Island or notch
      const iPhoneWithNotchUserAgents = [
        // iPhone X, XS, XR, 11, 12, 13, 14, 15 series
        /iPhone1[0-5],/i,
        // Generic detection for newer models
        /iPhone/i
      ];
      
      const userAgent = navigator.userAgent;
      const hasNotch = iPhoneWithNotchUserAgents.some(regex => regex.test(userAgent));
      
      // Additional check for viewport dimensions typical of newer iPhones
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const aspectRatio = viewportHeight / viewportWidth;
      
      // Modern iPhones have aspect ratios > 2
      const hasModernAspectRatio = aspectRatio > 2;
      
      setHasDynamicIsland(hasNotch || hasModernAspectRatio);
    };
    
    checkForDynamicIsland();
    
    // Set a custom CSS property for viewport height
    const setVhProperty = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVhProperty();
    
    window.addEventListener('resize', setVhProperty);
    return () => window.removeEventListener('resize', setVhProperty);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-10 w-full ${hasDynamicIsland ? 'pt-safe' : ''} bg-[#f0f4ff]`}
      style={{
        height: 'auto',
        minHeight: '40px'
      }}
    >
      <div className="container mx-auto px-4 py-1 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <motion.div 
              className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-blue"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-base font-bold">N</span>
            </motion.div>
          </Link>
          <h1 className="text-lg font-bold text-darkBlue ml-2">NeuroSpeak</h1>
        </div>
        
        <Link to="/profile">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white shadow-sm overflow-hidden">
              {currentUser?.profilePicture ? (
                <img 
                  src={currentUser.profilePicture} 
                  alt={currentUser.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : '👤'}
                </span>
              )}
            </div>
            {currentUser && (
              <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                {currentUser.name}
              </span>
            )}
          </motion.div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
