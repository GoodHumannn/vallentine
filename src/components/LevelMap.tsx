import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Check, Star } from 'lucide-react';
import { LEVELS } from '../data/levels';
import { motion } from 'framer-motion';

interface LevelMapProps {
  unlockedLevelIds: number[];
  onLockedClick: (date: string) => void;
}

const LevelMap: React.FC<LevelMapProps> = ({ unlockedLevelIds, onLockedClick }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center space-y-8 py-12 relative">
      {/* Connecting Line */}
      <div className="absolute top-12 bottom-12 w-1 bg-gray-700 rounded-full -z-10" />

      {LEVELS.map((level, index) => {
        const isUnlocked = unlockedLevelIds.includes(level.id);
        const isCompleted = false; // Logic for completed could be added if we track game results here

        return (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <button
              onClick={() => {
                if (isUnlocked) {
                  navigate(`/level/${level.id}`);
                } else {
                  onLockedClick(level.unlockDate);
                }
              }}
              className={`
                w-24 h-24 md:w-32 md:h-32 rounded-full border-4 flex flex-col items-center justify-center
                transition-all duration-300 transform hover:scale-110 z-10 bg-gray-900
                ${isUnlocked 
                  ? 'border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.6)] cursor-pointer' 
                  : 'border-gray-600 opacity-80 cursor-not-allowed grayscale'}
              `}
            >
              {isUnlocked ? (
                 <span className="text-4xl">{level.icon}</span>
              ) : (
                <Lock className="w-8 h-8 text-gray-400" />
              )}
              
              {isUnlocked && (
                <div className="absolute -top-2 -right-2 bg-pink-600 rounded-full p-1 animate-pulse">
                   <Star size={12} fill="white" />
                </div>
              )}
            </button>
            
            {/* Label */}
            <div className={`
              absolute left-full ml-4 top-1/2 -translate-y-1/2 w-48 text-left
              ${isUnlocked ? 'text-pink-200' : 'text-gray-500'}
            `}>
              <h3 className="font-bold text-lg">{level.name}</h3>
              <p className="text-xs">{level.unlockDate}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default LevelMap;