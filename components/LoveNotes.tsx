import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface LoveNotesProps {
  notes: string[];
}

const LoveNotes: React.FC<LoveNotesProps> = ({ notes }) => {
  return (
    <div className="grid grid-cols-2 gap-4 my-8">
      {notes.map((note, index) => (
        <FlipCard key={index} note={note} index={index} />
      ))}
    </div>
  );
};

const FlipCard: React.FC<{ note: string; index: number }> = ({ note, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="h-32 w-full perspective-1000 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full transition-transform duration-500 transform-style-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div className="absolute inset-0 bg-pink-900/50 border border-pink-500/30 rounded-xl flex items-center justify-center backface-hidden shadow-lg hover:shadow-pink-500/20 transition-shadow">
          <Heart className="text-pink-400 w-8 h-8 animate-pulse" />
        </div>

        {/* Back */}
        <div 
            className="absolute inset-0 bg-pink-100 text-pink-900 rounded-xl flex items-center justify-center p-4 text-center text-sm font-bold backface-hidden shadow-lg"
            style={{ transform: 'rotateY(180deg)' }}
        >
          {note}
        </div>
      </motion.div>
    </div>
  );
};

export default LoveNotes;