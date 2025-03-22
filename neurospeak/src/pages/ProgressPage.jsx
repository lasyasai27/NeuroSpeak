import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';

// Simple chart component for demonstration
const LineChart = ({ data, label }) => {
  const max = Math.max(...data);
  
  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-2">{label}</h3>
      <div className="flex items-end h-32 gap-1">
        {data.map((value, index) => (
          <motion.div
            key={index}
            className="bg-primary rounded-t-md w-full"
            initial={{ height: 0 }}
            animate={{ height: `${(value / max) * 100}%` }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          ></motion.div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-textSecondary">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
    </div>
  );
};

const BarChart = ({ data, label }) => {
  const max = Math.max(...data);
  
  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-2">{label}</h3>
      <div className="space-y-2">
        {data.map((value, index) => (
          <div key={index} className="flex items-center">
            <span className="w-12 text-sm text-textSecondary">Day {index + 1}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
              <motion.div
                className="bg-secondary h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(value / max) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              ></motion.div>
            </div>
            <span className="ml-2 text-sm font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, highlight }) => {
  return (
    <motion.div
      className="card"
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center mb-2">
        <div className={`p-2 rounded-xl mr-2 ${highlight ? 'bg-accent/30' : 'bg-gray-100'}`}>
          <span className="text-xl">{icon}</span>
        </div>
        <span className="text-textSecondary text-sm">{title}</span>
      </div>
      <div className="text-xl font-semibold">{value}</div>
    </motion.div>
  );
};

const ProgressPage = () => {
  // Sample data
  const clarityData = [65, 70, 68, 75, 80, 78, 85];
  const phrasesData = [5, 8, 12, 10, 15, 14, 18];
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 px-4 py-6 max-w-screen-md mx-auto w-full">
        {/* Weekly Summary */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Weekly Progress</h2>
          
          <div className="card mb-4">
            <div className="flex justify-between items-center">
              <span className="text-lg">This week:</span>
              <div className="bg-primary/20 px-3 py-1 rounded-full">
                <span className="font-medium">4/5 therapy days completed</span>
              </div>
            </div>
            
            {/* Celebration message */}
            <div className="mt-4 p-3 bg-accent/20 rounded-xl text-center">
              <span className="text-lg">🎉 You crushed your goal this week!</span>
            </div>
          </div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="card">
            <LineChart data={clarityData} label="Word Clarity Score (%)" />
          </div>
          
          <div className="card">
            <BarChart data={phrasesData} label="Total Phrases Spoken" />
          </div>
        </div>
        
        {/* Stats */}
        <h2 className="text-xl font-semibold mb-3">Your Stats</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <StatCard 
            icon="🔤" 
            title="Most Repeated Words" 
            value="Water, Help, Yes" 
          />
          
          <StatCard 
            icon="⏱️" 
            title="Total Session Time" 
            value="2h 15m" 
          />
          
          <StatCard 
            icon="📈" 
            title="Improvement" 
            value="+15% clarity" 
            highlight={true}
          />
          
          <StatCard 
            icon="🔥" 
            title="Longest Streak" 
            value="5 days" 
            highlight={true}
          />
        </div>
      </main>
    </div>
  );
};

export default ProgressPage;
