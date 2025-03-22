import React from 'react';
import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <div className="flex items-center">
      <div className="relative mr-2">
        <motion.div
          className="w-10 h-10 rounded-lg bg-darkBlue flex items-center justify-center shadow-blue"
          animate={{ 
            boxShadow: ['0 4px 14px 0 rgba(59, 91, 219, 0.2)', '0 4px 14px 0 rgba(59, 91, 219, 0.3)', '0 4px 14px 0 rgba(59, 91, 219, 0.2)']
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <motion.svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <path 
              d="M12 15.5C14.21 15.5 16 13.71 16 11.5V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11.5C8 13.71 9.79 15.5 12 15.5Z" 
              fill="#ffffff" 
            />
            <path 
              d="M19 11.5C19 11.5 19 15.5 12 15.5C5 15.5 5 11.5 5 11.5" 
              stroke="#4DABF7" 
              strokeWidth="2" 
              strokeLinecap="round" 
            />
            <path 
              d="M12 15.5V20.5M8 20.5H16" 
              stroke="#ffffff" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </motion.svg>
        </motion.div>
        
        <motion.div 
          className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5
          }}
        />
      </div>
      
      <div className="flex flex-col">
        <motion.span 
          className="text-lg font-bold text-darkBlue leading-tight"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          NeuroSpeak
        </motion.span>
        <motion.span 
          className="text-xs text-primary leading-tight"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Communication Assistant
        </motion.span>
      </div>
    </div>
  );
};

export default Logo;
