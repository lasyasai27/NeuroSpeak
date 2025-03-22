import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import useSpeech from '../hooks/useSpeech';
import { useAccessibility } from '../context/AccessibilityContext';

// Sample data for main categories
const mainCategories = [
  {
    id: 'communication',
    name: 'Communication',
    icon: '💬',
    description: 'Express yourself with speech assistance',
    color: 'from-blue-400 to-blue-600',
    route: null, // No direct route - expands to subcategories
    buttons: [
      { label: 'Quick Phrases', icon: '⚡', action: 'quickPhrases' },
      { label: 'Recent Messages', icon: '🕒', action: 'recentMessages' },
      { label: 'Favorites', icon: '⭐', action: 'favorites' }
    ]
  },
  {
    id: 'therapy',
    name: 'Speech Therapy',
    icon: '🧠',
    description: 'Daily exercises to improve your speech',
    color: 'from-purple-400 to-purple-600',
    route: '/therapy', // Direct route to therapy page
    buttons: [
      { label: 'Daily Practice', icon: '📆', action: 'dailyPractice' },
      { label: 'Exercises', icon: '🏋️‍♂️', action: 'exercises' },
      { label: 'Progress', icon: '📈', action: 'progress' }
    ]
  }
];

// Sample data for communication categories
const communicationData = {
  basics: {
    name: 'Basics',
    icon: '👋',
    description: 'Essential communication for everyday needs',
    color: 'from-blue-400 to-blue-600',
    route: '/basics',
    buttons: [
      { label: 'Greetings', icon: '👋', action: 'greetings' },
      { label: 'Feelings', icon: '😊', action: 'feelings' },
      { label: 'Help', icon: '🆘', action: 'help' }
    ]
  },
  needs: {
    name: 'Needs',
    icon: '🛌',
    description: 'Express personal needs and comfort',
    color: 'from-red-400 to-red-600',
    route: '/needs',
    buttons: [
      { label: 'Food & Drink', icon: '🍽️', action: 'food' },
      { label: 'Personal Care', icon: '🚿', action: 'personalCare' },
      { label: 'Comfort', icon: '🛋️', action: 'comfort' }
    ]
  },
  activities: {
    name: 'Activities',
    icon: '🏃‍♂️',
    description: 'Communicate about daily activities',
    color: 'from-green-400 to-green-600',
    route: '/activities',
    buttons: [
      { label: 'Entertainment', icon: '🎮', action: 'entertainment' },
      { label: 'Movement', icon: '🚶', action: 'movement' },
      { label: 'Daily Tasks', icon: '📝', action: 'dailyTasks' }
    ]
  },
  people: {
    name: 'People',
    icon: '👨‍👩‍👧‍👦',
    description: 'Reference people in your life',
    color: 'from-purple-400 to-purple-600',
    route: '/people',
    buttons: [
      { label: 'Family', icon: '👪', action: 'family' },
      { label: 'Care Team', icon: '👨‍⚕️', action: 'careTeam' },
      { label: 'Social', icon: '👥', action: 'social' }
    ]
  }
};

// Category Card Component
const CategoryCard = ({ category, data, onClick, handleButtonAction }) => {
  return (
    <motion.div
      className="category-card bg-white rounded-xl overflow-hidden shadow-card hover:shadow-hover border border-gray-100 transition-all duration-300"
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(category)}
    >
      <div className={`bg-gradient-to-r ${data.color} p-4 flex justify-center items-center`}>
        <span className="text-5xl">{data.icon}</span>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-1">{data.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{data.description}</p>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-2">
          {data.buttons && data.buttons.map((button, index) => (
            <motion.button
              key={index}
              className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-lg text-xs font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                handleButtonAction(button.action);
              }}
            >
              <span className="mr-1">{button.icon}</span>
              {button.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Main Category Card Component
const MainCategoryCard = ({ data, onClick, handleButtonAction }) => {
  return (
    <motion.div
      className="category-card bg-white rounded-xl overflow-hidden shadow-card hover:shadow-hover border border-gray-100 transition-all duration-300"
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(data)}
    >
      <div className={`bg-gradient-to-r ${data.color} p-5 flex justify-center items-center`}>
        <span className="text-6xl">{data.icon}</span>
      </div>
      <div className="p-5">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">{data.name}</h3>
        <p className="text-gray-600 mb-4">{data.description}</p>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-3">
          {data.buttons && data.buttons.map((button, index) => (
            <motion.button
              key={index}
              className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                handleButtonAction(button.action);
              }}
            >
              <span className="mr-1">{button.icon}</span>
              {button.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Quick Suggestion Component
const QuickSuggestion = ({ text, onSelect }) => {
  return (
    <motion.button
      className="pill rounded-xl px-4 py-3 bg-white text-gray-700 whitespace-nowrap hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow transition-all duration-300"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(text)}
    >
      {text}
    </motion.button>
  );
};

const CommunicationPage = () => {
  const [sentence, setSentence] = useState([]);
  const [showCommunicationCategories, setShowCommunicationCategories] = useState(false);
  const { speak, speechSynthesisAvailable } = useSpeech();
  const { audioFeedback } = useAccessibility();
  const navigate = useNavigate();
  
  const handleMainCategorySelect = (category) => {
    if (category.route) {
      // If it has a direct route, navigate to it
      navigate(category.route);
    } else {
      // Otherwise, show the subcategories
      setShowCommunicationCategories(true);
    }
  };
  
  const handleCategorySelect = (category) => {
    navigate(communicationData[category].route);
  };
  
  const handleButtonAction = (action) => {
    // Handle different button actions
    console.log(`Action triggered: ${action}`);
    
    // Example implementation
    switch(action) {
      case 'quickPhrases':
        // Show quick phrases section
        break;
      case 'recentMessages':
        // Show recent messages
        break;
      case 'favorites':
        // Show favorites
        break;
      case 'dailyPractice':
        navigate('/therapy?mode=daily');
        break;
      case 'exercises':
        navigate('/therapy?mode=exercises');
        break;
      case 'progress':
        navigate('/progress');
        break;
      default:
        // For subcategory actions, navigate to the appropriate section
        if (action === 'greetings' || action === 'feelings' || action === 'help') {
          navigate(`/basics?section=${action}`);
        } else if (action === 'food' || action === 'personalCare' || action === 'comfort') {
          navigate(`/needs?section=${action}`);
        } else if (action === 'entertainment' || action === 'movement' || action === 'dailyTasks') {
          navigate(`/activities?section=${action}`);
        } else if (action === 'family' || action === 'careTeam' || action === 'social') {
          navigate(`/people?section=${action}`);
        }
    }
  };

  const handleClear = () => {
    setSentence([]);
  };
  
  const handleSpeak = () => {
    if (sentence.length > 0) {
      speak(sentence.join(' '));
    }
  };
  
  const handleQuickSuggestion = (text) => {
    setSentence(text.split(' '));
    
    // Provide audio feedback if enabled
    if (audioFeedback) {
      speak(text);
    }
  };
  
  const handleBackToMain = () => {
    setShowCommunicationCategories(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Sentence Builder */}
      <div className="sticky top-[40px] z-10 bg-white/80 backdrop-blur-sm shadow-md py-3 border-b border-gray-100">
        <div className="max-w-screen-lg mx-auto px-4">
          <div className="min-h-12 p-4 bg-white rounded-xl mb-3 flex flex-wrap gap-2 shadow-card border border-gray-100">
            {sentence.length > 0 ? (
              sentence.map((word, index) => (
                <motion.span 
                  key={index} 
                  className="pill bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full font-medium shadow-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {word}
                </motion.span>
              ))
            ) : (
              <span className="text-gray-400 italic">Select a category to build a sentence...</span>
            )}
          </div>
          
          <div className="flex justify-between gap-3">
            <motion.button 
              className={`btn flex-1 py-2 px-6 rounded-xl font-medium shadow-md flex items-center justify-center ${
                sentence.length === 0 || !speechSynthesisAvailable
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg'
              }`}
              whileHover={sentence.length > 0 ? { scale: 1.02 } : {}}
              whileTap={sentence.length > 0 ? { scale: 0.98 } : {}}
              onClick={handleSpeak}
              disabled={sentence.length === 0 || !speechSynthesisAvailable}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-5 h-5 mr-2"
              >
                <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
              </svg>
              Speak
            </motion.button>
            
            {sentence.length > 0 && (
              <motion.button 
                className="btn py-2 px-6 rounded-xl font-medium bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClear}
              >
                Clear
              </motion.button>
            )}
          </div>
        </div>
      </div>
      
      <main className="flex-1 px-4 py-4 max-w-screen-lg mx-auto w-full pb-safe">
        {/* Quick Suggestions */}
        <div className="mb-8 overflow-x-auto pb-2">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-primary">
              <path d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
              <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
            </svg>
            Quick Phrases
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
            <div className="snap-start">
              <QuickSuggestion text="Hello there" onSelect={handleQuickSuggestion} />
            </div>
            <div className="snap-start">
              <QuickSuggestion text="I need help" onSelect={handleQuickSuggestion} />
            </div>
            <div className="snap-start">
              <QuickSuggestion text="I'm hungry" onSelect={handleQuickSuggestion} />
            </div>
            <div className="snap-start">
              <QuickSuggestion text="I'm thirsty" onSelect={handleQuickSuggestion} />
            </div>
            <div className="snap-start">
              <QuickSuggestion text="I need bathroom" onSelect={handleQuickSuggestion} />
            </div>
            <div className="snap-start">
              <QuickSuggestion text="Thank you" onSelect={handleQuickSuggestion} />
            </div>
          </div>
        </div>
        
        {/* Main Categories */}
        {!showCommunicationCategories ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Main Categories</h2>
            <div className="grid grid-cols-1 gap-6 mb-6">
              {mainCategories.map((category) => (
                <MainCategoryCard 
                  key={category.id}
                  data={category}
                  onClick={handleMainCategorySelect}
                  handleButtonAction={handleButtonAction}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Back Button */}
            <div className="mb-4">
              <motion.button
                className="flex items-center text-primary font-medium"
                onClick={handleBackToMain}
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to Main Categories
              </motion.button>
            </div>
            
            {/* Communication Categories */}
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Communication Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(communicationData).map(([key, category]) => (
                <CategoryCard 
                  key={key}
                  category={key}
                  data={category}
                  onClick={handleCategorySelect}
                  handleButtonAction={handleButtonAction}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CommunicationPage;
