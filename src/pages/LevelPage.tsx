import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LEVELS } from '../data/levels';
import MiniGame from '../components/MiniGame';
import LoveNotes from '../components/LoveNotes';
import FinalPage from './FinalPage';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const LevelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const level = LEVELS.find(l => l.id === Number(id));

  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    if (!level) navigate('/');
  }, [level, navigate]);

  if (!level) return null;

  // Special Handling for Final Level (Level 7)
  if (level.minigameType === 'mysteryUnlock') {
      return <FinalPage />;
  }

  return (
    <div className={`min-h-screen p-6 ${level.bgGradient || 'bg-gradient-to-b from-gray-900 to-black'} transition-colors duration-1000`}>
      <button 
        onClick={() => navigate('/')}
        className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="mr-2" /> Back to Journey
      </button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="text-center mb-10 mt-4">
            <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                className="text-7xl block mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
                {level.icon}
            </motion.span>
            <h1 className="text-4xl md:text-5xl font-script text-pink-200 drop-shadow-md">{level.name}</h1>
        </div>

        {/* Paragraph */}
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-lg md:text-xl text-center text-gray-200 italic mb-10 max-w-lg mx-auto leading-loose font-light tracking-wide"
        >
            "{level.paragraph}"
        </motion.p>

        {/* Mini Game */}
        <div className="mb-12 max-w-md mx-auto">
            <MiniGame type={level.minigameType} onComplete={() => setGameCompleted(true)} />
        </div>

        {/* Love Notes - Reveal only after game or partial logic? Requirement says render flip cards. */}
        <div className="max-w-md mx-auto pb-10">
            <h3 className="text-center text-pink-300/70 text-sm uppercase tracking-[0.2em] mb-6">
                Whispers of Us
            </h3>
            <LoveNotes notes={level.loveNotes} />
        </div>

      </motion.div>
    </div>
  );
};

export default LevelPage;