import React, { useState, useEffect, useRef } from 'react';
import { GameStatus } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Stars, Shield, Infinity as InfinityIcon, Hand } from 'lucide-react';

interface MiniGameProps {
  type: string;
  onComplete: (score: number) => void;
}

const MiniGame: React.FC<MiniGameProps> = ({ type, onComplete }) => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [successMsg, setSuccessMsg] = useState("");
  
  // Game Specific States
  const [particles, setParticles] = useState<{id: number, x: number, y: number}[]>([]); // Bloom / Kisses
  const [holding, setHolding] = useState(false); // Steady Heart
  const [draggedItems, setDraggedItems] = useState(0); // Memory Jar
  const [shieldAngle, setShieldAngle] = useState(0); // Protect Heart
  const [shadows, setShadows] = useState<{id: number, x: number, y: number, speed: number}[]>([]); // Protect Heart
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); // Thread
  const [threadPath, setThreadPath] = useState(""); // Thread
  const [rhythmBeat, setRhythmBeat] = useState(false); // Hug Rhythm

  // Refs for loops
  const requestRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Start Game
  const startGame = () => {
    setStatus(GameStatus.PLAYING);
    setProgress(0);
    setParticles([]);
    setShadows([]);
    setDraggedItems(0);
  };

  // Win Logic
  useEffect(() => {
    if (status === GameStatus.PLAYING && progress >= 100) {
      setTimeout(() => {
        setStatus(GameStatus.WON);
        const msgs = ["Good girl", "Wow baby", "Awww", "Yayyy", "Woahh", "Hehehehe", "Mwahhh"];
        setSuccessMsg(msgs[Math.floor(Math.random() * msgs.length)]);
        onComplete(100);
      }, 500);
    }
  }, [progress, status, onComplete]);


  // --- GAME 1: BLOOM THE ROSE (Click Particles) ---
  useEffect(() => {
    if (type === 'bloomRose' && status === GameStatus.PLAYING) {
      const interval = setInterval(() => {
        if (particles.length < 5) {
          setParticles(prev => [...prev, {
            id: Date.now(),
            x: Math.random() * 80 + 10,
            y: Math.random() * 80 + 10
          }]);
        }
      }, 800);
      return () => clearInterval(interval);
    }
  }, [type, status, particles.length]);

  // --- GAME 2: STEADY MY HEART (Hold Press) ---
  useEffect(() => {
    if (type === 'steadyHeart' && status === GameStatus.PLAYING) {
      let interval: any;
      if (holding) {
        interval = setInterval(() => {
          setProgress(p => Math.min(p + 1.5, 100)); // ~7 seconds to hold
        }, 100);
      } else {
        interval = setInterval(() => {
          setProgress(p => Math.max(p - 0.5, 0)); // Slowly decay if not holding
        }, 100);
      }
      return () => clearInterval(interval);
    }
  }, [type, status, holding]);

  // --- GAME 4: PROTECT HEART (Shield vs Shadows) ---
  useEffect(() => {
    if (type === 'protectHeart' && status === GameStatus.PLAYING) {
      // Spawn Shadows
      const spawnInterval = setInterval(() => {
        const angle = Math.random() * Math.PI * 2;
        const radius = 150; // spawn distance
        setShadows(prev => [...prev, {
          id: Date.now(),
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          speed: 0.5 + Math.random() * 0.5
        }]);
      }, 1000);

      // Game Loop
      const updateGame = () => {
        setShadows(prev => {
          const next = [];
          for (let s of prev) {
             // Move towards center (0,0)
             const angle = Math.atan2(-s.y, -s.x);
             s.x += Math.cos(angle) * s.speed;
             s.y += Math.sin(angle) * s.speed;
             
             const dist = Math.sqrt(s.x*s.x + s.y*s.y);
             
             // Check Collision with Shield (Radius approx 40-50)
             if (dist < 50 && dist > 30) {
                 // Check angle difference
                 const shadowAngle = Math.atan2(s.y, s.x);
                 let diff = Math.abs(shadowAngle - shieldAngle);
                 if (diff > Math.PI) diff = 2 * Math.PI - diff;
                 
                 if (diff < 1) { // Shield covers about 60 degrees (1 radian)
                     // Blocked!
                     continue; 
                 }
             }

             if (dist < 10) {
                 // Hit heart - slightly reduce progress or shake (visual only for this cute version, hard to lose)
                 // Keeping it "cute" and hard to lose, just visual.
             } else {
                 next.push(s);
             }
          }
          return next;
        });
        
        // Auto increment progress for surviving
        setProgress(p => Math.min(p + 0.1, 100));
        requestRef.current = requestAnimationFrame(updateGame);
      };
      
      requestRef.current = requestAnimationFrame(updateGame);
      
      return () => {
        clearInterval(spawnInterval);
        cancelAnimationFrame(requestRef.current);
      };
    }
  }, [type, status, shieldAngle]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (type === 'protectHeart' && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          setShieldAngle(Math.atan2(e.clientY - cy, e.clientX - cx));
      }
      if (type === 'connectHearts' && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          // Logic for thread drawing
          const relativeX = e.clientX - rect.left;
          const relativeY = e.clientY - rect.top;
          
          // Simple SVG path update
          // Start point is roughly (50, height/2)
          // End point is mouse
          setThreadPath(`M 60 ${rect.height/2} Q ${(60 + relativeX)/2} ${(rect.height/2 + relativeY)/2 + (Math.random()*10)} ${relativeX} ${relativeY}`);
          
          // Check win (reached right side)
          if (relativeX > rect.width - 60) {
              setProgress(100);
          }
      }
  };

  // --- GAME 6: HUG RHYTHM ---
  useEffect(() => {
      if (type === 'hugRhythm' && status === GameStatus.PLAYING) {
          const interval = setInterval(() => {
              setRhythmBeat(true);
              setTimeout(() => setRhythmBeat(false), 500); // Pulse duration
          }, 2000); // 2 sec beat
          return () => clearInterval(interval);
      }
  }, [type, status]);

  const handleRhythmClick = () => {
      if (rhythmBeat) {
          setProgress(p => p + 20); // 5 good clicks to win
      } else {
          // Miss (optional: shake or small deduction)
      }
  };

  // --- GAME 7: CATCH KISSES ---
  useEffect(() => {
    if (type === 'catchKisses' && status === GameStatus.PLAYING) {
        const interval = setInterval(() => {
            setParticles(prev => [
                ...prev, 
                { id: Date.now(), x: Math.random() * 80 + 10, y: -10 }
            ]);
        }, 600);
        return () => clearInterval(interval);
    }
  }, [type, status]);

  // --- RENDER HELPERS ---
  const handleParticleClick = (id: number) => {
      setParticles(prev => prev.filter(p => p.id !== id));
      setProgress(p => Math.min(p + 10, 100)); // 10 clicks to win
  };


  // --- UI RENDER ---
  if (status === GameStatus.IDLE) {
      let title = "";
      let desc = "";
      switch(type) {
          case 'bloomRose': title="Bloom The Rose"; desc="Catch the light to help love grow."; break;
          case 'steadyHeart': title="Steady My Heart"; desc="Hold the heart to calm the nerves."; break;
          case 'memoryJar': title="Sweet Memory Jar"; desc="Collect the tiny sweet moments."; break;
          case 'protectHeart': title="Protect The Little Heart"; desc="Move your mouse to shield the heart."; break;
          case 'connectHearts': title="Tie The Promise Thread"; desc="Draw a thread to connect us."; break;
          case 'hugRhythm': title="Bring Us Closer"; desc="Tap when the circle pulses."; break;
          case 'catchKisses': title="Catch The Kisses"; desc="Don't let them fade away."; break;
          default: title="Mini Game";
      }

    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.1)]">
        <h3 className="text-2xl font-bold mb-3 text-pink-200 font-script">{title}</h3>
        <p className="text-sm text-gray-400 mb-6 italic">{desc}</p>
        <button 
            onClick={startGame}
            className="px-8 py-2 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full text-white font-bold hover:scale-105 transition-transform shadow-lg shadow-pink-900/50"
        >
            Start
        </button>
      </div>
    );
  }

  if (status === GameStatus.WON) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
            <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="text-6xl mb-4"
            >
                {type === 'bloomRose' ? '🌹' : 
                 type === 'steadyHeart' ? '💖' : 
                 type === 'connectHearts' ? '♾️' : '✨'}
            </motion.div>
            <h3 className="text-2xl font-script text-pink-300">{successMsg}</h3>
        </div>
      );
  }

  return (
    <div 
        ref={containerRef}
        className="relative w-full h-80 bg-gray-900/80 rounded-xl overflow-hidden border border-pink-500/30 shadow-inner cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseDown={() => type === 'steadyHeart' && setHolding(true)}
        onMouseUp={() => type === 'steadyHeart' && setHolding(false)}
        onTouchStart={() => type === 'steadyHeart' && setHolding(true)}
        onTouchEnd={() => type === 'steadyHeart' && setHolding(false)}
    >
        {/* BLOOM ROSE */}
        {type === 'bloomRose' && (
            <div className="w-full h-full flex items-center justify-center relative">
                <motion.div 
                    className="text-6xl z-10 filter drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]"
                    animate={{ scale: 0.5 + (progress / 150), filter: `brightness(${0.5 + progress/100})` }}
                >
                    🌹
                </motion.div>
                {particles.map(p => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1, x: Math.sin(Date.now()/1000)*10 }}
                        className="absolute cursor-pointer text-yellow-200"
                        style={{ left: `${p.x}%`, top: `${p.y}%` }}
                        onClick={() => handleParticleClick(p.id)}
                    >
                        ✨
                    </motion.div>
                ))}
            </div>
        )}

        {/* STEADY HEART */}
        {type === 'steadyHeart' && (
            <div className="w-full h-full flex flex-col items-center justify-center">
                 <motion.div 
                    className="text-8xl"
                    animate={holding ? { 
                        scale: 1.2, 
                        filter: "drop-shadow(0 0 20px #ff0055)" 
                    } : { 
                        scale: [1, 1.1, 1], 
                        x: [-5, 5, -5, 5, 0],
                        filter: "drop-shadow(0 0 0px #000)" 
                    }}
                    transition={{ duration: holding ? 2 : 0.2 }}
                >
                    ❤️
                </motion.div>
                <p className="mt-8 text-pink-200/50 text-sm animate-pulse">
                    {holding ? "It's calming down..." : "Hold to steady me..."}
                </p>
            </div>
        )}

        {/* MEMORY JAR */}
        {type === 'memoryJar' && (
            <div className="w-full h-full relative">
                {/* The Jar */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-40 border-4 border-white/30 rounded-b-xl rounded-t-md bg-white/5 backdrop-blur-sm z-10 flex items-end justify-center overflow-hidden">
                     <motion.div 
                        className="w-full bg-gradient-to-t from-amber-500/40 to-yellow-200/20"
                        animate={{ height: `${progress}%` }}
                     />
                </div>
                {/* Floating Memories (simplified drag interaction: click to collect for this strict env) */}
                <div className="absolute inset-0 z-20">
                    <AnimatePresence>
                    {Array.from({length: 5 - draggedItems}).map((_, i) => (
                        <motion.button
                            key={i}
                            initial={{ x: Math.random() * 200 - 100, y: Math.random() * -50 }}
                            animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 + Math.random() }}
                            className="absolute top-10 left-1/2 text-3xl cursor-grab active:cursor-grabbing"
                            style={{ marginLeft: `${(i-2)*50}px` }}
                            drag
                            dragConstraints={{ top: 0, bottom: 200, left: -100, right: 100 }}
                            onDragEnd={(e, info) => {
                                if (info.point.y > 200) { // Dropped low enough
                                    setDraggedItems(d => d + 1);
                                    setProgress(p => p + 20);
                                }
                            }}
                        >
                            {['🍬', '🍫', '✨', '🧸', '💌'][i]}
                        </motion.button>
                    ))}
                    </AnimatePresence>
                </div>
                <p className="absolute top-4 w-full text-center text-gray-400 text-xs">Drag the memories into the jar</p>
            </div>
        )}

        {/* PROTECT HEART */}
        {type === 'protectHeart' && (
            <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                {/* Shield */}
                <motion.div 
                    className="absolute w-24 h-24 rounded-full border-4 border-blue-400/50 border-t-blue-200"
                    style={{ rotate: `${shieldAngle + Math.PI/2}rad` }}
                />
                <div className="text-4xl z-10">🤍</div>
                
                {/* Shadows */}
                {shadows.map(s => (
                    <div 
                        key={s.id}
                        className="absolute w-4 h-4 bg-black rounded-full shadow-[0_0_5px_rgba(0,0,0,0.8)]"
                        style={{ transform: `translate(${s.x}px, ${s.y}px)` }}
                    />
                ))}
            </div>
        )}

        {/* CONNECT HEARTS (Promise Thread) */}
        {type === 'connectHearts' && (
            <div className="w-full h-full relative flex items-center justify-between px-16">
                <div className="text-4xl z-10">💞</div>
                <div className="text-4xl z-10 animate-pulse text-white/50">💞</div>
                
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path 
                        d={threadPath} 
                        fill="none" 
                        stroke="#ec4899" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_5px_#ec4899]"
                    />
                </svg>
                {progress > 90 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <InfinityIcon size={64} className="text-pink-400 animate-pulse" />
                    </div>
                )}
            </div>
        )}

        {/* HUG RHYTHM */}
        {type === 'hugRhythm' && (
            <div className="w-full h-full flex flex-col items-center justify-center" onClick={handleRhythmClick}>
                <div className="flex items-center space-x-8 mb-8">
                    {/* Left Person */}
                    <motion.div 
                        className="w-16 h-32 bg-pink-400/20 rounded-t-full"
                        animate={{ x: progress }} // Move Right
                    />
                     {/* Right Person */}
                    <motion.div 
                        className="w-16 h-32 bg-blue-400/20 rounded-t-full"
                        animate={{ x: -progress }} // Move Left
                    />
                </div>

                {/* Rhythm Indicator */}
                <div className="relative">
                    <motion.div 
                        className="w-16 h-16 rounded-full border-4 border-white/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        animate={{ scale: rhythmBeat ? 1.5 : 1, opacity: rhythmBeat ? 0 : 1 }}
                        transition={{ duration: 0.5 }}
                    />
                    <div className={`w-12 h-12 rounded-full ${rhythmBeat ? 'bg-pink-500 shadow-[0_0_20px_#ec4899]' : 'bg-gray-700'} transition-colors duration-200`} />
                </div>
                <p className="mt-4 text-xs text-gray-500">Tap on the beat</p>
            </div>
        )}

        {/* CATCH KISSES (LEVEL 7) */}
        {type === 'catchKisses' && (
            <div className="w-full h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-red-950/20 pointer-events-none" />
                {particles.map(p => (
                    <motion.div
                        key={p.id}
                        initial={{ top: '100%', opacity: 1, scale: 0.5 }}
                        animate={{ top: '-10%', opacity: 0, scale: 1.5 }}
                        transition={{ duration: 3, ease: "easeOut" }}
                        style={{ left: `${p.x}%`, position: 'absolute' }}
                        className="cursor-pointer text-4xl drop-shadow-[0_0_10px_rgba(255,0,0,0.6)]"
                        onMouseDown={() => handleParticleClick(p.id)}
                    >
                        💋
                    </motion.div>
                ))}
            </div>
        )}

    </div>
  );
};

export default MiniGame;