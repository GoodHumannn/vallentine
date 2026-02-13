import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface IntroProps {
  onComplete: () => void;
}

const Intro: React.FC<IntroProps> = React.memo(({ onComplete }) => {
  const text = "Since I can’t be with you for the week offline Devanshi, here’s a small gift from me to you.";
  const [displayedText, setDisplayedText] = useState("");
  const [showButton, setShowButton] = useState(false);
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i === text.length) {
        clearInterval(interval);
        setShowButton(true);
      }
    }, 50); // Speed of typing

    return () => clearInterval(interval);
  }, []); // Run only once on mount

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white p-8">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="max-w-2xl text-center mb-8"
      >
        <p className="text-2xl md:text-4xl font-script leading-relaxed text-pink-200">
          {displayedText}
          <span className="animate-pulse">|</span>
        </p>
      </motion.div>

      {showButton && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="px-8 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-pink-400/50"
        >
          Begin Journey ❤️
        </motion.button>
      )}
    </div>
  );
});

export default Intro;