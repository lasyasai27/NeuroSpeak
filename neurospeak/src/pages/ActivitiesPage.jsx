import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import useSpeech from '../hooks/useSpeech';
import { useAccessibility } from '../context/AccessibilityContext';

// Sample data for communication categories and subcategories
const activitiesData = {
  name: 'Activities',
  icon: '🏃‍♂️',
  subcategories: {
    leisure: {
      name: 'Leisure',
      items: [
        { id: 'leis-1', icon: '📺', label: 'TV' },
        { id: 'leis-2', icon: '🎵', label: 'Music' },
        { id: 'leis-3', icon: '📱', label: 'Phone' },
        { id: 'leis-4', icon: '📚', label: 'Book' },
        { id: 'leis-5', icon: '🎮', label: 'Game' },
        { id: 'leis-6', icon: '🎨', label: 'Art' },
        { id: 'leis-7', icon: '🎬', label: 'Movie' },
        { id: 'leis-8', icon: '🧩', label: 'Puzzle' },
        { id: 'leis-9', icon: '🎭', label: 'Show' },
        { id: 'leis-10', icon: '🎧', label: 'Podcast' },
        { id: 'leis-11', icon: '🎲', label: 'Board game' },
        { id: 'leis-12', icon: '📷', label: 'Photos' },
        { id: 'leis-13', icon: '🎹', label: 'Instrument' },
        { id: 'leis-14', icon: '🎯', label: 'Hobby' },
        { id: 'leis-15', icon: '🌳', label: 'Garden' },
        { id: 'leis-16', icon: '🎪', label: 'Entertainment' },
      ]
    },
    movement: {
      name: 'Movement',
      items: [
        { id: 'move-1', icon: '🚶', label: 'Walk' },
        { id: 'move-2', icon: '🏃‍♂️', label: 'Exercise' },
        { id: 'move-3', icon: '🧘', label: 'Stretch' },
        { id: 'move-4', icon: '🚗', label: 'Drive' },
        { id: 'move-5', icon: '🚪', label: 'Outside' },
        { id: 'move-6', icon: '🏠', label: 'Home' },
        { id: 'move-7', icon: '🚶‍♀️', label: 'Slow down' },
        { id: 'move-8', icon: '🏃‍♀️', label: 'Faster' },
        { id: 'move-9', icon: '🧍', label: 'Stand up' },
        { id: 'move-10', icon: '🪑', label: 'Sit down' },
        { id: 'move-11', icon: '🛌', label: 'Lie down' },
        { id: 'move-12', icon: '🚶‍♂️', label: 'Follow me' },
        { id: 'move-13', icon: '🏋️‍♀️', label: 'Therapy' },
        { id: 'move-14', icon: '🚲', label: 'Bicycle' },
        { id: 'move-15', icon: '🏊‍♂️', label: 'Swim' },
        { id: 'move-16', icon: '⛹️‍♀️', label: 'Play sports' },
      ]
    },
    daily: {
      name: 'Daily Tasks',
      items: [
        { id: 'task-1', icon: '🧹', label: 'Clean' },
        { id: 'task-2', icon: '🧺', label: 'Laundry' },
        { id: 'task-3', icon: '🛒', label: 'Shopping' },
        { id: 'task-4', icon: '📝', label: 'Work' },
        { id: 'task-5', icon: '💻', label: 'Computer' },
        { id: 'task-6', icon: '📞', label: 'Call' },
        { id: 'task-7', icon: '📆', label: 'Appointment' },
        { id: 'task-8', icon: '💰', label: 'Pay bills' },
        { id: 'task-9', icon: '🍳', label: 'Cook' },
        { id: 'task-10', icon: '🧽', label: 'Dishes' },
        { id: 'task-11', icon: '📧', label: 'Email' },
        { id: 'task-12', icon: '📦', label: 'Package' },
        { id: 'task-13', icon: '✉️', label: 'Mail' },
        { id: 'task-14', icon: '🛠️', label: 'Fix' },
        { id: 'task-15', icon: '🧾', label: 'Paperwork' },
        { id: 'task-16', icon: '⏰', label: 'Schedule' },
      ]
    }
  }
};

// Communication Tile Component
const CommunicationTile = ({ item, onSelect }) => {
  const { textSize } = useAccessibility();
  
  const getTextSizeClass = () => {
    switch (textSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };
  
  return (
    <motion.div
      className="communication-tile bg-white rounded-xl p-4 flex flex-col items-center justify-center shadow-card hover:shadow-hover border border-gray-100 transition-all duration-300"
      whileHover={{ scale: 1.05, y: -4, backgroundColor: "#f0f4ff" }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(item)}
    >
      <motion.span 
        className="text-3xl mb-2"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {item.icon}
      </motion.span>
      <span className={`text-center font-medium ${getTextSizeClass()} text-gray-800`}>
        {item.label}
      </span>
    </motion.div>
  );
};

// Subcategory Pill Component
const SubcategoryPill = ({ name, active, onClick }) => {
  return (
    <motion.button
      className={`pill flex items-center justify-center rounded-xl px-4 py-3 font-medium transition-all duration-300 ${
        active 
          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md' 
          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
      }`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {name}
    </motion.button>
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

const ActivitiesPage = () => {
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [sentence, setSentence] = useState([]);
  const { speak, speechSynthesisAvailable } = useSpeech();
  const { audioFeedback } = useAccessibility();
  const navigate = useNavigate();
  
  // Set the first subcategory as default when component mounts
  useEffect(() => {
    const firstSubcategory = Object.keys(activitiesData.subcategories)[0];
    setSelectedSubcategory(firstSubcategory);
  }, []);
  
  const handleTileSelect = (item) => {
    setSentence([...sentence, item.label]);
    
    // Provide audio feedback if enabled
    if (audioFeedback) {
      speak(item.label);
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
  
  const handleBack = () => {
    navigate('/communicate');
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
              <span className="text-gray-400 italic">Tap tiles to build a sentence...</span>
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
        {/* Back button */}
        <div className="mb-4">
          <motion.button
            className="flex items-center text-primary font-medium"
            onClick={handleBack}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
              <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
            </svg>
            Back to Categories
          </motion.button>
        </div>
        
        {/* Quick Suggestions */}
        <div className="mb-6 overflow-x-auto pb-2">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-primary">
              <path d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
              <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
            </svg>
            Quick Phrases
          </h2>
          <div className="flex gap-3 flex-wrap">
            <QuickSuggestion text="I want to walk" onSelect={handleQuickSuggestion} />
            <QuickSuggestion text="I want to watch TV" onSelect={handleQuickSuggestion} />
            <QuickSuggestion text="I want to listen to music" onSelect={handleQuickSuggestion} />
            <QuickSuggestion text="I need to make a call" onSelect={handleQuickSuggestion} />
            <QuickSuggestion text="I want to go outside" onSelect={handleQuickSuggestion} />
            <QuickSuggestion text="I want to play a game" onSelect={handleQuickSuggestion} />
          </div>
        </div>
        
        {/* Category Header */}
        <div className="flex items-center mb-4">
          <div className="text-3xl mr-3">{activitiesData.icon}</div>
          <h1 className="text-2xl font-bold text-gray-800">{activitiesData.name}</h1>
        </div>
        
        {/* Subcategories */}
        <div className="overflow-x-auto mb-4 bg-white p-3 rounded-xl shadow-sm">
          <div className="flex gap-3 pb-1 snap-x snap-mandatory">
            {Object.entries(activitiesData.subcategories).map(([key, subcategory]) => (
              <div key={key} className="snap-start">
                <SubcategoryPill 
                  name={subcategory.name}
                  active={selectedSubcategory === key}
                  onClick={() => setSelectedSubcategory(key)}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Communication Tiles */}
        {selectedSubcategory && (
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedSubcategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-card border border-gray-100"
            >
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {activitiesData.subcategories[selectedSubcategory].items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <CommunicationTile 
                      item={item} 
                      onSelect={handleTileSelect} 
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default ActivitiesPage;
