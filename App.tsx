import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import Home from './pages/Home';
import LevelPage from './pages/LevelPage';
import FinalPage from './pages/FinalPage';
import BackgroundMusic from './components/BackgroundMusic';
import { getISTTime } from './utils/time';

// Wrapper to handle global logic like Final Mode auto-redirect
const AppContent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isDev = searchParams.get('dev') === 'true';
  const [isFinalMode, setIsFinalMode] = useState(false);

  useEffect(() => {
    const checkFinalMode = () => {
        if (isDev) return;
        
        const now = getISTTime();
        const targetYear = 2026; // Match data
        const finalTrigger = new Date(`${targetYear}-02-14T00:00:00+05:30`);
        
        // Auto-redirect to Final Page ONLY if it's exactly 00:00 on the 14th 
        // OR if we want to force the final view. 
        // However, requirements say "all levels show up again to be viewed again".
        // So we probably don't want a hard redirect blocking the map anymore once the 14th hits.
        // We only want the Level 8 on the map to be unlockable.
        
        // This state was used previously to FORCE the final page. 
        // Disabling the force redirect so users can see the map with Level 8 unlocked.
        setIsFinalMode(false); 
    };

    checkFinalMode();
  }, [isDev]);

  return (
    <>
      <BackgroundMusic />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/level/:id" element={<LevelPage />} />
        <Route path="/final" element={<FinalPage />} /> 
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;