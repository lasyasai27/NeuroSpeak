import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isIOS, setIsIOS] = useState(false);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    // Detect iOS
    const detectIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };
    
    setIsIOS(detectIOS());
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add status bar style
  useEffect(() => {
    document.documentElement.style.setProperty('--status-bar-color', 'white');
    
    // Set a custom CSS property for viewport height (iOS fix)
    const setVhProperty = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVhProperty();
    window.addEventListener('resize', setVhProperty);
    
    return () => {
      document.documentElement.style.removeProperty('--status-bar-color');
      window.removeEventListener('resize', setVhProperty);
    };
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  // Get time of day for personalized greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Get user's first name
  const getUserFirstName = () => {
    if (!currentUser?.name) return "";
    return currentUser.name.split(' ')[0];
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f4ff]">
      <Header />
      
      <main className="flex-grow px-4 pt-4 pb-16 max-w-screen-xl mx-auto w-full">
        <motion.div
          className="grid grid-cols-1 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome Section */}
          <motion.section variants={itemVariants} className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-darkBlue mb-1">
              {getTimeBasedGreeting()}, {getUserFirstName()}!
            </h1>
            <p className="text-textSecondary text-sm md:text-base">Let's continue your speech journey today.</p>
          </motion.section>

          {/* Stats Cards */}
          <motion.section variants={itemVariants} className="grid grid-cols-2 gap-4 mb-4">
            <div className="stat-card p-4">
              <div className="flex flex-col">
                <span className="text-textSecondary text-xs uppercase font-medium tracking-wide mb-1">Practice Streak</span>
                <div className="flex items-baseline">
                  <span className="text-darkBlue text-2xl font-bold">
                    {currentUser?.preferences?.streak || 0}
                  </span>
                  <span className="text-textSecondary text-xs ml-1">days</span>
                </div>
                <div className="mt-2 text-xs text-success font-medium">
                  {currentUser?.preferences?.streakChange > 0 
                    ? `+${currentUser.preferences.streakChange} days this week` 
                    : 'Start your streak today!'}
                </div>
              </div>
            </div>
            
            <div className="stat-card p-4">
              <div className="flex flex-col">
                <span className="text-textSecondary text-xs uppercase font-medium tracking-wide mb-1">Words Learned</span>
                <div className="flex items-baseline">
                  <span className="text-darkBlue text-2xl font-bold">
                    {currentUser?.preferences?.wordsLearned || 0}
                  </span>
                  <span className="text-textSecondary text-xs ml-1">words</span>
                </div>
                <div className="mt-2 text-xs text-success font-medium">
                  {currentUser?.preferences?.wordsLearnedChange > 0 
                    ? `+${currentUser.preferences.wordsLearnedChange} new this week` 
                    : 'Start learning new words!'}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Today's Focus */}
          <motion.section variants={itemVariants} className="focus-card p-5 mb-4">
            <h2 className="text-base md:text-lg font-semibold text-white mb-2">Today's Focus</h2>
            <p className="text-xs md:text-sm text-white/90 mb-3">
              {currentUser?.preferences?.dailyFocus || "Practice communication skills for 10 minutes"}
            </p>
            <Link to="/therapy">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white text-primary py-2 px-5 rounded-xl text-sm font-semibold shadow-sm"
              >
                Start Practice
              </motion.button>
            </Link>
          </motion.section>

          {/* Navigation Cards */}
          <motion.section variants={itemVariants} className="grid grid-cols-1 gap-4 mb-4">
            <NavCard 
              to="/communicate"
              title="Communicate"
              description="Express yourself with speech assistance"
              icon="💬"
              color="bg-blue-100"
              textColor="text-primary"
            />
            
            <NavCard 
              to="/therapy"
              title="Speech Therapy"
              description="Daily exercises to improve your speech"
              icon="🧠"
              color="bg-purple-100"
              textColor="text-secondary-dark"
            />
            
            <NavCard 
              to="/progress"
              title="Track Progress"
              description="View your improvement over time"
              icon="📊"
              color="bg-green-100"
              textColor="text-success"
            />
            
            <NavCard 
              to="/profile"
              title="Profile"
              description="Manage your account settings"
              icon="👤"
              color="bg-yellow-100"
              textColor="text-yellow-700"
            />
          </motion.section>
        </motion.div>
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#f0f4ff] border-t border-gray-100 z-10 pb-safe">
        <div className="absolute bottom-0 left-0 right-0 flex pb-2">
          <NavItem icon="🏠" label="Home" isActive={true} to="/" />
          <NavItem icon="💬" label="Talk" isActive={false} to="/communicate" />
          <NavItem icon="🧠" label="Practice" isActive={false} to="/therapy" />
          <NavItem icon="📊" label="Progress" isActive={false} to="/progress" />
          <NavItem icon="👤" label="Profile" isActive={false} to="/profile" />
        </div>
      </nav>
    </div>
  );
};

const NavCard = ({ to, title, description, icon, color, textColor }) => {
  return (
    <Link to={to} className="block">
      <motion.div 
        className={`nav-card ${color} p-4 flex items-start gap-4 shadow-card`}
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
      >
        <div className={`${textColor} text-2xl`}>{icon}</div>
        <div>
          <h3 className={`font-semibold text-base ${textColor}`}>{title}</h3>
          <p className="text-textSecondary text-sm mt-1">{description}</p>
        </div>
      </motion.div>
    </Link>
  );
};

const NavItem = ({ icon, label, isActive, to }) => {
  return (
    <Link to={to} className="flex flex-col items-center flex-1">
      <div className={`text-xl ${isActive ? 'text-primary' : 'text-gray-400'}`}>
        {icon}
      </div>
      <span className={`text-xs mt-1 ${isActive ? 'font-medium text-primary' : 'text-gray-500'}`}>
        {label}
      </span>
    </Link>
  );
};

export default HomePage;
