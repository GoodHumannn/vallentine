import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Intro from '../components/Intro';
import LevelMap from '../components/LevelMap';
import { LEVELS } from '../data/levels';
import { getISTTime, isLevelUnlocked, getCountdownStatus } from '../utils/time';
import { motion, AnimatePresence } from 'framer-motion';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [introFinished, setIntroFinished] = useState(() => {
    try {
      return localStorage.getItem('introShown') === 'true';
    } catch (e) {
      console.warn("Storage access denied");
      return false;
    }
  });
  
  const [searchParams] = useSearchParams();
  const isUrlDev = searchParams.get('dev') === 'true';

  const [unlockedLevelIds, setUnlockedLevelIds] = useState<number[]>([]);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  
  // Countdown State
  const [countdown, setCountdown] = useState<{show: boolean, timeLeft: number} | null>(null);

  // Secret Dev Mode State
  const [titleClicks, setTitleClicks] = useState(0);
  const [isSecretDev, setIsSecretDev] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const isDev = isUrlDev || isSecretDev;

  // Time Check Logic (Unlocks & Countdown)
  useEffect(() => {
    // CRITICAL FIX: Do not run time checks (which trigger re-renders) while Intro is showing.
    // This prevents the Intro component from being unmounted/remounted or re-rendered excessively.
    if (!introFinished) return;

    const checkTime = () => {
      // 1. Check Unlocked Levels using IST
      const newUnlocked = LEVELS.filter(level => isLevelUnlocked(level.unlockDate, isDev)).map(l => l.id);
      
      setUnlockedLevelIds(prev => {
        // Prevent re-render if array hasn't changed
        if (prev.length === newUnlocked.length && prev.every((id, index) => id === newUnlocked[index])) {
            return prev;
        }
        return newUnlocked;
      });

      // 2. Check Countdown (5 mins before Feb 14)
      if (!isDev) {
          const status = getCountdownStatus();
          if (status.show) {
              const now = new Date();
              const diff = status.target.getTime() - now.getTime(); // ms
              if (diff > 0) {
                  setCountdown({ show: true, timeLeft: diff });
              } else {
                  setCountdown(null);
              }
          } else {
              setCountdown(prev => prev === null ? null : null);
          }
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 1000); // Check every second for countdown precision
    return () => clearInterval(interval);
  }, [isDev, introFinished]);

  const handleIntroComplete = useCallback(() => {
    try {
      localStorage.setItem('introShown', 'true');
    } catch (e) {
      console.warn("LocalStorage access failed", e);
    }
    setIntroFinished(true);
  }, []);

  const handleLockedClick = (isoDate: string) => {
    // Parse ISO date to readable string
    const dateObj = new Date(isoDate);
    const readable = dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
    setPopupMessage(`Come back on ${readable} yawr`);
    setTimeout(() => setPopupMessage(null), 2000);
  };

  const handleTitleClick = () => {
    if (isSecretDev) return;
    const newCount = titleClicks + 1;
    setTitleClicks(newCount);
    if (newCount >= 7) {
      setShowPasswordModal(true);
      setTitleClicks(0);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "babu") {
      setIsSecretDev(true);
      setShowPasswordModal(false);
      setPopupMessage("❤️ Dev Mode Unlocked! All Levels Open ❤️");
      setTimeout(() => setPopupMessage(null), 3000);
    } else if (passwordInput === "hmmm-") {
      setShowPasswordModal(false);
      navigate('/final');
    } else {
      setPopupMessage("❌ Wrong Password 🥺");
      setTimeout(() => setPopupMessage(null), 2000);
      setPasswordInput("");
    }
  };

  if (!introFinished) {
    // Passing the stable callback
    return <Intro onComplete={handleIntroComplete} />;
  }

  // Countdown Overlay
  if (countdown && countdown.show) {
      const minutes = Math.floor((countdown.timeLeft / 1000 / 60) % 60);
      const seconds = Math.floor((countdown.timeLeft / 1000) % 60);
      return (
          <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center text-center p-6">
              <h1 className="text-3xl font-script text-pink-400 mb-8 animate-pulse">Almost there...</h1>
              <div className="font-mono text-6xl md:text-8xl text-white font-bold tracking-widest">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <p className="mt-8 text-gray-500 text-sm">Waiting for Feb 14th...</p>
          </div>
      );
  }

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="min-h-screen pb-20 pt-10 relative"
    >
        <div className="text-center mb-8 select-none">
            <h1 
              className="text-4xl font-script text-pink-500 mb-2 cursor-pointer active:scale-95 transition-transform inline-block"
              onClick={handleTitleClick}
            >
              Valentine Quest
            </h1>
            <p className="text-gray-400 text-sm uppercase tracking-widest">For Devanshi</p>
            {isSecretDev && (
              <p className="text-xs text-green-500 mt-2 font-mono animate-pulse">
                [DEV MODE ACTIVE]
              </p>
            )}
        </div>

        <LevelMap 
            unlockedLevelIds={unlockedLevelIds}
            onLockedClick={handleLockedClick}
        />

        {/* Locked Popup */}
        <AnimatePresence>
            {popupMessage && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                >
                    <div className="bg-black/80 text-white px-6 py-4 rounded-xl border border-pink-500 backdrop-blur-md text-center shadow-lg shadow-pink-500/20 z-50">
                        {popupMessage}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Secret Password Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-gray-900 w-full max-w-sm p-8 rounded-2xl border border-pink-500/50 shadow-2xl relative"
              >
                <button 
                  onClick={() => setShowPasswordModal(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                  ✕
                </button>
                <h2 className="text-xl font-bold text-pink-400 mb-6 text-center">Secret Access</h2>
                <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                  <input
                    type="text" 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter secret code..."
                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors placeholder-gray-600 text-center tracking-widest"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Unlock
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </motion.div>
  );
};

export default Home;