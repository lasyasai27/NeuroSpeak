import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';

const ProfilePage = () => {
  const { currentUser, updateProfile, updatePreferences, logout } = useAuth();
  const { textSize, setTextSize, audioFeedback, setAudioFeedback, highContrast, setHighContrast } = useAccessibility();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [dailyFocus, setDailyFocus] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Load user data when component mounts or currentUser changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setProfilePicture(currentUser.profilePicture || null);
      setDailyFocus(currentUser.preferences?.dailyFocus || '');
    }
  }, [currentUser]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!name || !email) {
      setMessage({ type: 'error', text: 'Name and email are required' });
      return;
    }
    
    try {
      setLoading(true);
      
      // Update profile info
      await updateProfile({ name, email, profilePicture });
      
      // Update preferences
      if (dailyFocus) {
        await updatePreferences({ dailyFocus });
      }
      
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleTextSizeChange = (size) => {
    setTextSize(size);
    updatePreferences({ textSize: size });
  };

  const handleAudioFeedbackChange = (value) => {
    setAudioFeedback(value);
    updatePreferences({ audioFeedback: value });
  };

  const handleHighContrastChange = (value) => {
    setHighContrast(value);
    updatePreferences({ highContrast: value });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <div className="flex-1 max-w-screen-lg mx-auto w-full px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-card overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white relative">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white/20 overflow-hidden flex items-center justify-center border-4 border-white/30">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">{name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                {isEditing && (
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-primary">
                      <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                      <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleProfilePictureChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold">{currentUser?.name}</h1>
                <p className="opacity-80">{currentUser?.email}</p>
              </div>
            </div>
            
            <div className="absolute top-4 right-4">
              {!isEditing ? (
                <motion.button
                  onClick={() => setIsEditing(true)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                    <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                  </svg>
                  Edit Profile
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => setIsEditing(false)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-3 font-medium transition-all ${
                activeTab === 'profile' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`flex-1 py-3 font-medium transition-all ${
                activeTab === 'accessibility' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('accessibility')}
            >
              Accessibility
            </button>
            <button
              className={`flex-1 py-3 font-medium transition-all ${
                activeTab === 'stats' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('stats')}
            >
              Stats
            </button>
          </div>
          
          {/* Profile Content */}
          <div className="p-6">
            {message.text && (
              <motion.div 
                className={`p-4 rounded-xl mb-6 ${
                  message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                }`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {message.text}
              </motion.div>
            )}
            
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {isEditing ? (
                    <form onSubmit={handleProfileUpdate}>
                      <div className="mb-6">
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                          Full Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="dailyFocus" className="block text-gray-700 font-medium mb-2">
                          Daily Focus
                        </label>
                        <input
                          id="dailyFocus"
                          type="text"
                          value={dailyFocus}
                          onChange={(e) => setDailyFocus(e.target.value)}
                          placeholder="Set your daily focus goal"
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        />
                      </div>
                      
                      <motion.button
                        type="submit"
                        disabled={loading}
                        className={`py-3 px-6 rounded-xl font-medium shadow-md flex items-center justify-center ${
                          loading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg'
                        }`}
                        whileHover={!loading ? { scale: 1.02 } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </motion.button>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">FULL NAME</h3>
                        <p className="mt-1 text-lg text-gray-800">{currentUser?.name}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">EMAIL</h3>
                        <p className="mt-1 text-lg text-gray-800">{currentUser?.email}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">DAILY FOCUS</h3>
                        <p className="mt-1 text-lg text-gray-800">
                          {currentUser?.preferences?.dailyFocus || "No daily focus set"}
                        </p>
                      </div>
                      
                      <div className="pt-6 border-t border-gray-200">
                        <motion.button
                          onClick={handleLogout}
                          className="px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition flex items-center"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                            <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
                          </svg>
                          Sign Out
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
              
              {activeTab === 'accessibility' && (
                <motion.div
                  key="accessibility"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">Text Size</h3>
                      <p className="text-gray-600 text-sm">Adjust the size of text throughout the app</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleTextSizeChange('small')}
                        className={`px-4 py-2 rounded-lg ${
                          textSize === 'small' 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Small
                      </button>
                      <button 
                        onClick={() => handleTextSizeChange('medium')}
                        className={`px-4 py-2 rounded-lg ${
                          textSize === 'medium' 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Medium
                      </button>
                      <button 
                        onClick={() => handleTextSizeChange('large')}
                        className={`px-4 py-2 rounded-lg ${
                          textSize === 'large' 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Large
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">Audio Feedback</h3>
                      <p className="text-gray-600 text-sm">Speak words aloud when tapped</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                      <input
                        type="checkbox"
                        id="audioFeedback"
                        className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                        checked={audioFeedback}
                        onChange={(e) => handleAudioFeedbackChange(e.target.checked)}
                      />
                      <label
                        htmlFor="audioFeedback"
                        className={`block h-full overflow-hidden rounded-full cursor-pointer ${
                          audioFeedback ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`block w-6 h-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                            audioFeedback ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">High Contrast Mode</h3>
                      <p className="text-gray-600 text-sm">Increase contrast for better visibility</p>
                    </div>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                      <input
                        type="checkbox"
                        id="highContrast"
                        className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                        checked={highContrast}
                        onChange={(e) => handleHighContrastChange(e.target.checked)}
                      />
                      <label
                        htmlFor="highContrast"
                        className={`block h-full overflow-hidden rounded-full cursor-pointer ${
                          highContrast ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`block w-6 h-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                            highContrast ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'stats' && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <h3 className="text-sm font-medium text-blue-700 uppercase">Practice Streak</h3>
                      <div className="mt-2 flex items-baseline">
                        <span className="text-3xl font-bold text-blue-800">
                          {currentUser?.preferences?.streak || 0}
                        </span>
                        <span className="ml-1 text-blue-600">days</span>
                      </div>
                      <p className="mt-1 text-sm text-blue-600">
                        {currentUser?.preferences?.streakChange > 0 
                          ? `+${currentUser.preferences.streakChange} days this week` 
                          : 'Keep practicing to build your streak!'}
                      </p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-xl">
                      <h3 className="text-sm font-medium text-green-700 uppercase">Words Learned</h3>
                      <div className="mt-2 flex items-baseline">
                        <span className="text-3xl font-bold text-green-800">
                          {currentUser?.preferences?.wordsLearned || 0}
                        </span>
                        <span className="ml-1 text-green-600">words</span>
                      </div>
                      <p className="mt-1 text-sm text-green-600">
                        {currentUser?.preferences?.wordsLearnedChange > 0 
                          ? `+${currentUser.preferences.wordsLearnedChange} new this week` 
                          : 'Start learning new words!'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Daily Focus</h3>
                    <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-xl text-white">
                      <p className="text-white/90">
                        {currentUser?.preferences?.dailyFocus || "No daily focus set"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
