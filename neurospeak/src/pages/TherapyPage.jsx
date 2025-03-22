import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import useSpeech from '../hooks/useSpeech';
import { useAccessibility } from '../context/AccessibilityContext';

// Sample therapy exercises
const exercises = [
  {
    id: 1,
    title: 'Word Repetition',
    description: 'Listen to the word and repeat it clearly.',
    words: ['Apple', 'Window', 'Hospital', 'Beautiful', 'Conversation'],
    difficulty: 'Easy',
    icon: '🔊'
  },
  {
    id: 2,
    title: 'Sentence Formation',
    description: 'Create a sentence using the provided words.',
    words: ['today', 'happy', 'weather', 'family'],
    difficulty: 'Medium',
    icon: '📝'
  },
  {
    id: 3,
    title: 'Reading Practice',
    description: 'Read the paragraph aloud and record yourself.',
    text: 'The sun was shining brightly in the clear blue sky. Birds were singing in the trees, and flowers were blooming in the garden.',
    difficulty: 'Medium',
    icon: '📖'
  },
  {
    id: 4,
    title: 'Object Naming',
    description: 'Name the objects shown in the images.',
    objects: ['Clock', 'Chair', 'Telephone', 'Glasses', 'Book'],
    difficulty: 'Easy',
    icon: '🖼️'
  },
  {
    id: 5,
    title: 'Tongue Twisters',
    description: 'Practice these tongue twisters to improve articulation.',
    twisters: [
      'She sells seashells by the seashore.',
      'Red lorry, yellow lorry.',
      'Peter Piper picked a peck of pickled peppers.'
    ],
    difficulty: 'Hard',
    icon: '👅'
  }
];

const ExerciseCard = ({ exercise, onSelect }) => {
  const { getTextSizeClass } = useAccessibility();
  
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md p-4 mb-4"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(exercise)}
    >
      <div className="flex items-start">
        <div className="bg-secondary/20 text-secondary rounded-full p-3 mr-4 text-2xl">
          {exercise.icon}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${getTextSizeClass()}`}>{exercise.title}</h3>
          <p className="text-textSecondary mb-2">{exercise.description}</p>
          <div className="flex justify-between items-center">
            <span className={`pill ${
              exercise.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
              exercise.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {exercise.difficulty}
            </span>
            <button className="btn-small btn-primary">
              Start
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ExerciseDetail = ({ exercise, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const { speak, startListening, stopListening, isListening } = useSpeech();
  const { getTextSizeClass } = useAccessibility();
  
  const handleListen = () => {
    if (exercise.words) {
      speak(exercise.words[currentStep]);
    } else if (exercise.text) {
      speak(exercise.text);
    } else if (exercise.twisters) {
      speak(exercise.twisters[currentStep]);
    } else if (exercise.objects) {
      speak(exercise.objects[currentStep]);
    }
  };
  
  const handleRecord = () => {
    if (isRecording) {
      stopListening();
      setIsRecording(false);
      // In a real app, we would save the recording here
      setRecordedAudio('Recording saved');
    } else {
      startListening({
        onResult: (event) => {
          // In a real app, we would process speech recognition results here
          console.log('Speech recognition result:', event);
        }
      });
      setIsRecording(true);
    }
  };
  
  const handleNext = () => {
    let maxSteps = 1;
    if (exercise.words) maxSteps = exercise.words.length;
    else if (exercise.twisters) maxSteps = exercise.twisters.length;
    else if (exercise.objects) maxSteps = exercise.objects.length;
    
    if (currentStep < maxSteps - 1) {
      setCurrentStep(currentStep + 1);
      setRecordedAudio(null);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setRecordedAudio(null);
    }
  };
  
  const renderExerciseContent = () => {
    if (exercise.words) {
      return (
        <div className="text-center py-10">
          <h3 className={`text-3xl font-bold mb-4 ${getTextSizeClass()}`}>
            {exercise.words[currentStep]}
          </h3>
          <p className="text-textSecondary mb-4">
            Listen and repeat this word clearly
          </p>
        </div>
      );
    } else if (exercise.text) {
      return (
        <div className="py-6">
          <p className={`mb-4 leading-relaxed ${getTextSizeClass()}`}>
            {exercise.text}
          </p>
          <p className="text-textSecondary mb-4">
            Read this paragraph aloud and record yourself
          </p>
        </div>
      );
    } else if (exercise.twisters) {
      return (
        <div className="text-center py-10">
          <h3 className={`text-xl font-bold mb-4 ${getTextSizeClass()}`}>
            {exercise.twisters[currentStep]}
          </h3>
          <p className="text-textSecondary mb-4">
            Practice saying this tongue twister clearly
          </p>
        </div>
      );
    } else if (exercise.objects) {
      return (
        <div className="text-center py-10">
          <div className="bg-gray-200 rounded-xl p-10 mb-4 flex items-center justify-center">
            <span className="text-6xl">{
              exercise.objects[currentStep] === 'Clock' ? '🕰️' :
              exercise.objects[currentStep] === 'Chair' ? '🪑' :
              exercise.objects[currentStep] === 'Telephone' ? '☎️' :
              exercise.objects[currentStep] === 'Glasses' ? '👓' :
              '📚'
            }</span>
          </div>
          <p className="text-textSecondary mb-4">
            Name this object out loud
          </p>
        </div>
      );
    }
  };
  
  return (
    <div>
      <div className="flex items-center mb-4">
        <button 
          className="btn-icon mr-2"
          onClick={onBack}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h2 className={`text-xl font-bold ${getTextSizeClass()}`}>{exercise.title}</h2>
      </div>
      
      <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
        {renderExerciseContent()}
        
        {recordedAudio && (
          <div className="bg-green-50 text-green-700 p-3 rounded-xl mb-4">
            {recordedAudio}
          </div>
        )}
        
        <div className="flex justify-between gap-3 mb-4">
          <button 
            className="btn btn-secondary flex-1"
            onClick={handleListen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
            </svg>
            Listen
          </button>
          
          <button 
            className={`btn flex-1 ${isRecording ? 'btn-danger' : 'btn-primary'}`}
            onClick={handleRecord}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
            {isRecording ? 'Stop' : 'Record'}
          </button>
        </div>
        
        {(exercise.words || exercise.twisters || exercise.objects) && (
          <div className="flex justify-between">
            <button 
              className="btn-small btn-gray"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </button>
            
            <div className="text-center">
              <span className="text-sm text-textSecondary">
                {currentStep + 1} of {
                  exercise.words ? exercise.words.length :
                  exercise.twisters ? exercise.twisters.length :
                  exercise.objects ? exercise.objects.length : 1
                }
              </span>
            </div>
            
            <button 
              className="btn-small btn-gray"
              onClick={handleNext}
              disabled={currentStep === (
                exercise.words ? exercise.words.length - 1 :
                exercise.twisters ? exercise.twisters.length - 1 :
                exercise.objects ? exercise.objects.length - 1 : 0
              )}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const TherapyPage = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 px-4 py-6 max-w-screen-md mx-auto w-full">
        {selectedExercise ? (
          <ExerciseDetail 
            exercise={selectedExercise} 
            onBack={() => setSelectedExercise(null)} 
          />
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6">Speech Therapy</h1>
            
            <div className="mb-6">
              <div className="card mb-4">
                <h2 className="text-lg font-semibold mb-2">Today's Goal</h2>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-textSecondary">Progress</span>
                    <span className="text-primary font-medium">2/5 exercises</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Exercises</h2>
            
            {exercises.map(exercise => (
              <ExerciseCard 
                key={exercise.id} 
                exercise={exercise} 
                onSelect={setSelectedExercise} 
              />
            ))}
          </>
        )}
      </main>
    </div>
  );
};

export default TherapyPage;
