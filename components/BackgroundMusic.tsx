import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { LEVELS } from '../data/levels';
import { Volume2, VolumeX } from 'lucide-react';

const BackgroundMusic: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const location = useLocation();
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Default Home Music
  const HOME_MUSIC = "https://assets.mixkit.co/music/preview/mixkit-stars-in-space-6.mp3"; 

  // Calculate the current source based on the route
  const currentSrc = useMemo(() => {
    // Exact match for home or final page
    if (location.pathname === '/' || location.pathname === '/final') {
      return HOME_MUSIC;
    }
    
    // Check for level pages using Regex
    const match = location.pathname.match(/\/level\/(\d+)/);
    if (match) {
      const id = parseInt(match[1]);
      const level = LEVELS.find(l => l.id === id);
      if (level && level.audioSrc) {
        return level.audioSrc;
      }
    }
    
    // Fallback for any other route
    return HOME_MUSIC;
  }, [location.pathname]);

  // Global Interaction Listener to unlock Audio Context
  useEffect(() => {
    const handleInteract = () => {
      setHasInteracted(true);
      const audio = audioRef.current;
      
      // Only attempt to play if we have a valid source and the element is ready
      if (audio && audio.src && audio.paused && !audio.muted) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            // Ignore expected errors during interaction/loading phases
            if (e.name !== 'NotAllowedError' && e.name !== 'AbortError') {
               console.debug("Play deferred:", e.message);
            }
          });
        }
      }
    };

    // Listen for any interaction
    window.addEventListener('click', handleInteract);
    window.addEventListener('touchstart', handleInteract);
    window.addEventListener('keydown', handleInteract);

    return () => {
      window.removeEventListener('click', handleInteract);
      window.removeEventListener('touchstart', handleInteract);
      window.removeEventListener('keydown', handleInteract);
    };
  }, []);

  // Handle Playback when Source Changes or Mute State Changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // React automatically updates the 'src' attribute via JSX.
    // We use a small timeout to allow the DOM to update before triggering play.
    if (hasInteracted && !isMuted) {
      const timer = setTimeout(() => {
          if (audio.src && audio.paused) {
            audio.play().catch(error => {
               if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
                 console.debug("Autoplay prevented or interrupted:", error.message);
               }
            });
          }
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [currentSrc, isMuted, hasInteracted]);

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      audioRef.current.muted = newMutedState;
      
      // If unmuting, manual trigger counts as interaction
      if (!newMutedState) {
         setHasInteracted(true);
         if(audioRef.current.paused && audioRef.current.src) {
             audioRef.current.play().catch(() => {});
         }
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio 
        ref={audioRef} 
        src={currentSrc}
        loop 
        muted={isMuted}
      />
      
      <button 
        onClick={toggleMute}
        className="bg-black/50 backdrop-blur-md p-3 rounded-full border border-pink-500/50 text-pink-300 hover:bg-pink-900/50 transition-colors shadow-lg hover:scale-105 active:scale-95"
        aria-label={isMuted ? "Unmute music" : "Mute music"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
    </div>
  );
};

export default BackgroundMusic;