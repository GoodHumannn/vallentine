import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { X, Heart } from 'lucide-react';

const MYSTERIES = [
  {
    question: "First mystery: What I always wanted to say?",
    answer: "iloveyou",
    textHint: "Three words..."
  },
  {
    question: "Second mystery: Where my heart rests?",
    answer: "withyou",
    textHint: "Not a place, but a feeling..."
  },
  {
    question: "Third mystery: You are my",
    answer: "universe",
    textHint: "Vaster than the stars..."
  },
  {
    question: "Final mystery: How long will this last?",
    answer: "forever",
    textHint: "Timeless..."
  }
];

// Personal photos for the polaroid gallery
const PHOTOS = [
  { src: "https://file-service-alpha.vercel.app/6300435/1000/1740286829-1740286829705-75791771-460b-46a4-9e90-2795c6b441bb.png", caption: "School Days & Sweet Smiles" },
  { src: "https://file-service-alpha.vercel.app/6300435/1000/1740286829-1740286829707-88229f3d-51b8-4c37-a2f0-91a7428ac052.png", caption: "Low Key Loves You" },
  { src: "https://file-service-alpha.vercel.app/6300435/1000/1740286829-1740286829707-1e8c750b-426b-4e4b-9d41-38374d9e96e9.png", caption: "Close to my Heart" },
  { src: "https://file-service-alpha.vercel.app/6300435/1000/1740286829-1740286829707-422f25b2-3286-444f-b676-e13d9697193a.png", caption: "Adventures Together" }
];

// Safe storage accessor
const getSafeStorage = (key: string) => {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
};

interface PhotoItemProps {
  photo: typeof PHOTOS[0];
  onClick: () => void;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo, onClick }) => {
    const [hasError, setHasError] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, rotate: (Math.random() - 0.5) * 10, scale: 0.8 }}
            whileInView={{ opacity: 1, rotate: (Math.random() - 0.5) * 6, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white p-4 pb-12 shadow-2xl transform hover:scale-105 hover:rotate-0 transition-transform duration-500 cursor-pointer"
            onClick={onClick}
        >
            <div className="aspect-square bg-gray-200 overflow-hidden mb-4 border border-gray-100 relative flex items-center justify-center">
                {!hasError ? (
                    <img 
                        src={photo.src} 
                        alt={photo.caption} 
                        className="w-full h-full object-cover" 
                        onError={() => setHasError(true)}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center bg-pink-100 w-full h-full text-pink-400 p-4 text-center">
                        <Heart size={32} className="mb-2" />
                        <span className="text-xs font-terminal text-pink-600">Image Missing</span>
                    </div>
                )}
            </div>
            <div className="font-script text-gray-800 text-3xl text-center">
                {photo.caption}
            </div>
        </motion.div>
    );
};

const FinalPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isDev = searchParams.get('dev') === 'true';

  const [currentStage, setCurrentStage] = useState(() => {
    const stored = getSafeStorage('mysteryStage');
    return Number(stored) || 0;
  });
  
  const [inputVal, setInputVal] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showGallery, setShowGallery] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<{src: string, caption: string} | null>(null);

  // Refs for animation loop
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef(currentStage);
  
  // Sync state to refs
  useEffect(() => {
    stageRef.current = currentStage;
    if (currentStage >= MYSTERIES.length) {
        setShowGallery(true);
    }
  }, [currentStage]);

  // PIXEL ART CAMPFIRE ANIMATION
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set Low Resolution for Pixel Art Look
    const PIXEL_SCALE = 4;
    let width = 0;
    let height = 0;

    const handleResize = () => {
        width = Math.ceil(window.innerWidth / PIXEL_SCALE);
        height = Math.ceil(window.innerHeight / PIXEL_SCALE);
        if (width === 0 || height === 0) return;
        canvas.width = width;
        canvas.height = height;
        ctx.imageSmoothingEnabled = false;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // --- Asset Definitions (Procedural Pixel Art) ---
    const stars = Array.from({ length: 60 }, () => ({
        x: Math.random() * (width || 300),
        y: Math.random() * ((height || 300) * 0.7),
        size: Math.random() > 0.9 ? 2 : 1,
        blinkSpeed: 0.01 + Math.random() * 0.04,
        opacity: Math.random(),
        twinkleOffset: Math.random() * 100
    }));

    interface Particle { x: number; y: number; vy: number; vx: number; color: string; life: number; type: 'fire' | 'smoke' }
    let particles: Particle[] = [];
    const FIRE_COLORS = ['#ffcc00', '#ff9900', '#ff5500', '#ff2200'];
    const SMOKE_COLORS = ['#333333', '#444444', '#222222'];

    let time = 0;
    let animationId: number;
    
    const animate = () => {
      time++;
      const stage = stageRef.current;
      
      if (!width || !height) {
         animationId = requestAnimationFrame(animate);
         return;
      }

      // 1. SKY & BACKGROUND
      ctx.fillStyle = '#0a0a1a'; // Darker night
      ctx.fillRect(0, 0, width, height);
      
      // Moon
      ctx.fillStyle = '#ffffe0';
      ctx.fillRect(width - 40, 30, 10, 10); 
      ctx.fillStyle = 'rgba(255,255,224, 0.1)'; 
      ctx.fillRect(width - 42, 28, 14, 14);

      // Stars
      stars.forEach(star => {
          star.opacity = 0.5 + 0.5 * Math.sin(time * star.blinkSpeed + star.twinkleOffset);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
          ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
      });

      // 2. GROUND
      const groundY = height - 40;
      ctx.fillStyle = '#111'; // Pitch black ground
      ctx.fillRect(0, groundY, width, 40);
      
      // 3. CAMPFIRE
      const fireX = Math.floor(width / 2);
      const fireY = groundY;
      
      // Glow on ground
      const glowRadius = 30 + Math.sin(time * 0.1) * 2;
      const glow = ctx.createRadialGradient(fireX, fireY, 2, fireX, fireY, glowRadius);
      glow.addColorStop(0, 'rgba(255, 100, 0, 0.3)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(fireX - 40, fireY - 40, 80, 50);

      // Logs
      ctx.fillStyle = '#4a3c31';
      ctx.fillRect(fireX - 7, fireY - 2, 14, 4);
      ctx.fillStyle = '#3e2b22';
      ctx.fillRect(fireX - 5, fireY - 4, 10, 2);

      // Spawn Fire & Smoke
      if (Math.random() < 0.7) {
          particles.push({
              x: fireX + (Math.random() * 6 - 3),
              y: fireY - 3,
              vy: 0.3 + Math.random() * 0.4,
              vx: (Math.random() - 0.5) * 0.2,
              color: FIRE_COLORS[Math.floor(Math.random() * FIRE_COLORS.length)],
              life: 1.0,
              type: 'fire'
          });
      }
      if (Math.random() < 0.2) {
           particles.push({
              x: fireX + (Math.random() * 4 - 2),
              y: fireY - 10,
              vy: 0.1 + Math.random() * 0.2,
              vx: (Math.random() * 0.5) - 0.1, // drift right slightly
              color: SMOKE_COLORS[Math.floor(Math.random() * SMOKE_COLORS.length)],
              life: 1.0,
              type: 'smoke'
          });
      }

      // Update & Draw Particles
      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
          p.y -= p.vy;
          p.x += p.vx;
          p.life -= p.type === 'fire' ? 0.04 : 0.01;
          
          ctx.fillStyle = p.color;
          if (p.type === 'smoke') ctx.fillStyle = `rgba(100,100,100, ${p.life * 0.5})`;
          
          const size = p.type === 'fire' ? (p.life > 0.5 ? 2 : 1) : 2;
          ctx.fillRect(Math.floor(p.x), Math.floor(p.y), size, size);
      });

      // 4. THE COUPLE (Pixel Sprites - Upgraded)
      // They lean in based on 'stage'
      const lean = stage > 0 ? 4 : 0;
      const headBob = Math.floor(Math.sin(time * 0.05) * 1); // Subtle breathing

      // Boy (Left)
      const boyX = fireX - 22 + lean;
      const boyY = groundY - 16; 
      
      // Boy Body
      ctx.fillStyle = '#3b213b'; 
      ctx.fillRect(boyX, boyY, 11, 15);
      // Boy Legs
      ctx.fillStyle = '#1a222e'; 
      ctx.fillRect(boyX + 9, boyY + 11, 9, 5);
      // Boy Head
      ctx.fillStyle = '#ffdbac'; 
      ctx.fillRect(boyX + 1, boyY - 9 + headBob, 9, 9);
      // Glasses
      ctx.fillStyle = '#000';
      ctx.fillRect(boyX + 2, boyY - 6 + headBob, 3, 1);
      ctx.fillRect(boyX + 6, boyY - 6 + headBob, 3, 1);
      ctx.fillRect(boyX + 5, boyY - 6 + headBob, 1, 1);
      // Hair
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(boyX - 1, boyY - 11 + headBob, 12, 4); 

      // Girl (Right)
      const girlX = fireX + 12 - lean;
      const girlY = groundY - 16;

      // Girl Body
      ctx.fillStyle = '#c0a3e5'; 
      ctx.fillRect(girlX, girlY, 11, 15);
      // Girl Legs
      ctx.fillStyle = '#2d3748'; 
      ctx.fillRect(girlX - 7, girlY + 11, 9, 5);
      // Girl Head
      ctx.fillStyle = '#ffdbac';
      ctx.fillRect(girlX + 1, girlY - 9 + headBob, 9, 9);
      // Hair
      ctx.fillStyle = '#3e2723'; 
      ctx.fillRect(girlX, girlY - 11 + headBob, 11, 4); 
      ctx.fillRect(girlX + 9, girlY - 7 + headBob, 3, 14); // Ponytail

      // Love Heart (Floating)
      if (lean > 0 && time % 80 < 40) {
          const heartY = boyY - 20 - (time % 20) * 0.2;
          ctx.fillStyle = '#ff0055';
          ctx.fillRect(fireX - 1, heartY, 3, 3);
          ctx.fillRect(fireX - 3, heartY - 2, 7, 1);
          ctx.fillRect(fireX - 3, heartY - 3, 2, 1);
          ctx.fillRect(fireX + 1, heartY - 3, 2, 1);
      }

      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDev && inputVal.toLowerCase().trim() === "skip") {
        setCurrentStage(MYSTERIES.length);
        try { localStorage.setItem('mysteryStage', String(MYSTERIES.length)); } catch {}
        return;
    }

    const currentMystery = MYSTERIES[currentStage];
    const normalizedInput = inputVal.trim().toLowerCase().replace(/\s/g, '');
    const normalizedAnswer = currentMystery.answer;

    if (normalizedInput === normalizedAnswer) {
        const nextStage = currentStage + 1;
        setCurrentStage(nextStage);
        setWrongAttempts(0);
        try { localStorage.setItem('mysteryStage', String(nextStage)); } catch {}
        setInputVal("");
        setFeedback("");
        if (nextStage >= MYSTERIES.length) {
            setShowGallery(true);
        }
    } else {
        setWrongAttempts(prev => prev + 1);
        setFeedback("Not quite. Try again.");
        setInputVal("");
        setTimeout(() => setFeedback(""), 2000);
    }
  };

  const showHint = wrongAttempts >= 2;

  return (
    <div className="relative min-h-screen text-pink-100 overflow-hidden font-terminal">
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pixelated w-full h-full" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        
        <AnimatePresence mode="wait">
          {!showGallery ? (
            <motion.div 
                key="mystery-box"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -50 }}
                className="bg-black/80 backdrop-blur-md border-4 border-pink-700 p-8 max-w-lg w-full rounded-none shadow-[10px_10px_0px_rgba(236,72,153,0.4)]"
            >
                <div className="text-center mb-8">
                    <h2 className="text-xl md:text-2xl font-retro text-pink-400 mb-4 tracking-widest glow-text">
                        MYSTERY {currentStage + 1}
                    </h2>
                    <p className="text-xl md:text-2xl font-terminal text-white leading-relaxed">
                        {MYSTERIES[currentStage]?.question}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input 
                        type="text" 
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        className="bg-gray-900 border-2 border-pink-500 p-4 text-center font-retro text-pink-300 focus:outline-none focus:border-pink-300 focus:shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all rounded-none"
                        placeholder="TYPE ANSWER..."
                        autoFocus
                    />
                    
                    <div className="h-8 text-center flex flex-col items-center justify-center">
                        {feedback ? (
                            <span className="text-red-400 font-terminal text-lg animate-pulse">
                                {'>'} {feedback}
                            </span>
                        ) : (
                          <AnimatePresence>
                             {showHint && (
                                <motion.span 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.8 }}
                                    exit={{ opacity: 0 }}
                                    className="text-pink-300 font-terminal text-sm italic"
                                >
                                    (Hint: {MYSTERIES[currentStage].textHint})
                                </motion.span>
                             )}
                          </AnimatePresence>
                        )}
                    </div>

                    <button 
                        type="submit"
                        className="bg-pink-700 hover:bg-pink-600 text-white font-retro py-4 px-6 rounded-none border-b-4 border-r-4 border-pink-900 active:border-0 active:translate-y-1 transition-all"
                    >
                        UNLOCK
                    </button>
                </form>
            </motion.div>
          ) : (
            <motion.div 
                key="gallery"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="w-full max-w-4xl pt-10 pb-20"
            >
                <div className="text-center mb-12 bg-black/50 p-6 rounded-xl backdrop-blur-sm">
                    <h1 className="text-4xl md:text-6xl font-script text-pink-400 mb-6 glow-text animate-pulse">
                        I looooovveeeee you baby
                    </h1>
                    <p className="text-xl font-terminal text-pink-200">
                        Our journey is just beginning...
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-4">
                    {PHOTOS.map((photo, index) => (
                        <PhotoItem 
                            key={index} 
                            photo={photo} 
                            onClick={() => setSelectedPhoto(photo)} 
                        />
                    ))}
                </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lightbox Modal */}
        <AnimatePresence>
            {selectedPhoto && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-zoom-out"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <div className="relative max-w-4xl max-h-screen flex flex-col items-center">
                        <button className="absolute -top-12 right-0 text-white hover:text-pink-500">
                            <X size={32} />
                        </button>
                        
                        <div className="bg-white p-2 md:p-4 rounded-sm shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                             <img 
                                src={selectedPhoto.src} 
                                alt={selectedPhoto.caption}
                                className="max-h-[70vh] w-auto border-2 border-gray-100" 
                                onError={(e) => {
                                   e.currentTarget.src = "https://placehold.co/600x600/pink/white?text=Love+You";
                                }}
                            />
                        </div>
                        
                        <p className="text-center text-white font-script text-3xl mt-6 bg-black/50 px-6 py-2 rounded-full backdrop-blur-sm">
                            {selectedPhoto.caption}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default FinalPage;