"use client";

import { useState, useEffect } from "react";
import { contentLibrary } from "../data/content";
import { themes } from "../data/themes";
import KokuaChat from "../components/KokuaChat";
import ActivityModal from "../components/ActivityModal";
import OnboardingQuiz from "../components/OnboardingQuiz";
import LotusCoin from "../components/LotusCoin";
import AudioManager from "../components/AudioManager"; // Import the DJ
import confetti from "canvas-confetti";

export default function Home() {
  const [currentArchetype, setArchetype] = useState(null);
  const [unlockedIndex, setUnlockedIndex] = useState(0);
  const [selectedStep, setSelectedStep] = useState(null);
  const [currency, setCurrency] = useState(0);
  const [flyingReward, setFlyingReward] = useState(null);
  
  // AUDIO STATE
  const [sfxTrigger, setSfxTrigger] = useState(null); // Used to fire sounds
  const [isMuted, setIsMuted] = useState(false); // Mute toggle

  if (!currentArchetype) {
    return <OnboardingQuiz onComplete={(winner) => setArchetype(winner)} />;
  }

  const theme = themes[currentArchetype];
  const journey = contentLibrary.journey;

  const handleStepClick = (step, index) => {
    if (index <= unlockedIndex) {
      setSelectedStep({ ...step, index });
    }
  };

  const handleCompleteActivity = () => {
    if (selectedStep && selectedStep.index === unlockedIndex) {
      setUnlockedIndex(unlockedIndex + 1);

      const isCheckpoint = selectedStep.is_checkpoint;
      const reward = isCheckpoint ? 10 : 5;

      // 1. TRIGGER VISUALS
      setFlyingReward(reward);
      
// 2. TRIGGER AUDIO (The "Ding")
      if (!isMuted) {
        if (selectedStep.type === 'checkpoint') {
            console.log("Triggering LEVEL UP sound");
            setSfxTrigger("level_up");
        } else {
            console.log("Triggering COIN sound");
            setSfxTrigger("coin_collect");
        }
        setTimeout(() => setSfxTrigger(null), 500); 
      }

      setTimeout(() => {
        setCurrency(prev => prev + reward);
        setFlyingReward(null);
      }, 1000);

      // 3. FIREWORKS
      if (isCheckpoint) {
        var duration = 3 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        var randomInRange = (min, max) => Math.random() * (max - min) + min;

        var interval = setInterval(function() {
          var timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) return clearInterval(interval);
          var particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#fbbf24', '#f59e0b'] });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#fbbf24', '#f59e0b'] });
        }, 250);
      } else {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffffff', theme.id === 'builder' ? '#ea580c' : theme.id === 'explorer' ? '#0ea5e9' : '#059669']
        });
      }
    }
    setSelectedStep(null);
  };

  const getOffset = (index) => {
    const seed = index * 137;
    return Math.sin(seed) * 60;
  };

  return (
    <div className={`min-h-screen relative ${theme.text} ${theme.font} transition-all duration-1000 overflow-x-hidden`}>
      
      {/* --- AUDIO SYSTEM --- */}
      {/* Only render the manager if not muted */}
      {!isMuted && (
        <AudioManager archetype={currentArchetype} triggerSFX={sfxTrigger} />
      )}

      {/* MUTE BUTTON (Top Left) */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="fixed top-6 left-6 z-50 bg-black/40 backdrop-blur-md p-3 rounded-full text-white/70 hover:text-white hover:bg-black/60 border border-white/10 transition-all"
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      {/* FLIGHT ANIMATION CSS */}
      <style jsx>{`
        @keyframes flyToCoin {
          0% { top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1); opacity: 1; }
          20% { transform: translate(-50%, -50%) scale(1.5); }
          100% { top: 24px; left: 90%; transform: translate(-50%, -50%) scale(0.2); opacity: 0; }
        }
        .flying-number { animation: flyToCoin 1s ease-in-out forwards; }
      `}</style>

      {/* BACKGROUND */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('${theme.bg_image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* UI LAYER */}
      <div className="relative z-10">
        <LotusCoin amount={currency} />

        {flyingReward && (
          <div className="fixed z-[100] font-bold text-yellow-400 text-6xl drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] flying-number pointer-events-none">
            +{flyingReward}
          </div>
        )}

        <div className="pt-8 pb-4 bg-gradient-to-b from-black/90 to-transparent">
          <div className="max-w-md mx-auto px-6 text-center">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-black/40 backdrop-blur-md mb-4`}>
              <div className={`w-2 h-2 rounded-full ${theme.primary} animate-pulse shadow-[0_0_10px_currentColor]`}></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                {theme.name}
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-xl mb-2">Kokua</h1>
            <p className="text-sm opacity-80 font-light text-white drop-shadow-md">{theme.vibe}</p>
          </div>
        </div>

        <main className="max-w-lg mx-auto py-12 px-4 relative min-h-[600px]">
          <MeanderingPath steps={journey.length} theme={theme} getOffset={getOffset} />
          <div className="relative z-10">
            {journey.map((step, index) => {
              const skin = step.archetype_skins[currentArchetype];
              const isLocked = index > unlockedIndex;
              const isCompleted = index < unlockedIndex;
              const isActive = index === unlockedIndex;
              const isCheckpoint = step.type === 'checkpoint';
              const xOffset = getOffset(index);
              const isLeft = xOffset < 0; 

              return (
                <div 
                  key={step.id} 
                  className={`flex items-center justify-center h-40 relative transition-all duration-700 ${isLocked ? 'opacity-50 grayscale' : 'opacity-100'}`}
                >
                  <div 
                    onClick={() => handleStepClick(step, index)}
                    className={`
                      absolute w-36 p-3 rounded-xl border transition-all cursor-pointer backdrop-blur-md z-20
                      ${isLeft ? 'left-[55%] ml-10 text-left' : 'right-[55%] mr-10 text-right'}
                      ${isActive ? `bg-white/10 ${theme.accent} shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-105` : 'bg-black/40 border-white/5 hover:bg-black/60'}
                    `}
                    style={{ transform: `translateX(${xOffset * 0.5}px)` }} 
                  >
                    <h3 className="font-bold text-xs mb-1 text-white leading-tight">
                      {isCheckpoint ? "★ " : ""}{skin.title}
                    </h3>
                    <p className="text-[10px] opacity-70 leading-tight text-gray-200 line-clamp-2">{skin.description}</p>
                  </div>

                  <div 
                    onClick={() => handleStepClick(step, index)}
                    className={`
                      rounded-full flex items-center justify-center shadow-2xl cursor-pointer border-[3px] transition-all relative z-30
                      ${isCheckpoint ? 'w-20 h-20 border-yellow-400' : 'w-14 h-14 border-white'}
                      ${isCompleted ? 'bg-black/60 border-green-400 text-green-400' : ''}
                      ${isActive ? `${theme.primary} text-white animate-bounce-slow scale-110 shadow-[0_0_25px_currentColor]` : ''}
                      ${isLocked ? 'bg-black/80 border-white/10 text-white/20' : ''}
                    `}
                    style={{ transform: `translateX(${xOffset}px)` }}
                  >
                    <span className={isCheckpoint ? "text-3xl" : "text-xl"}>
                      {isCompleted ? "✓" : isLocked ? "🔒" : skin.icon}
                    </span>
                    {isCheckpoint && !isLocked && !isCompleted && (
                       <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">
                         +10
                       </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
      
      <ActivityModal 
        isOpen={!!selectedStep}
        step={selectedStep}
        theme={theme}
        onClose={() => setSelectedStep(null)}
        onComplete={handleCompleteActivity}
      />

      <KokuaChat currentTheme={theme} />
    </div>
  );
}

function MeanderingPath({ steps, theme, getOffset }) {
  const ROW_HEIGHT = 160; 
  const CENTER_X = 250;
  let pathD = `M ${CENTER_X + getOffset(0)} ${ROW_HEIGHT / 2}`;
  for (let i = 0; i < steps - 1; i++) {
    const startX = CENTER_X + getOffset(i);
    const endX = CENTER_X + getOffset(i + 1);
    const startY = (i * ROW_HEIGHT) + (ROW_HEIGHT / 2);
    const endY = ((i + 1) * ROW_HEIGHT) + (ROW_HEIGHT / 2);
    const cp1Y = startY + (ROW_HEIGHT / 2);
    const cp2Y = endY - (ROW_HEIGHT / 2);
    pathD += ` C ${startX} ${cp1Y}, ${endX} ${cp2Y}, ${endX} ${endY}`;
  }
  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" viewBox={`0 0 500 ${steps * ROW_HEIGHT}`} preserveAspectRatio="none">
       <path d={pathD} fill="none" stroke={theme.id === 'builder' ? '#ea580c' : theme.id === 'explorer' ? '#0ea5e9' : '#059669'} strokeOpacity="0.5" strokeWidth="4" strokeDasharray="12 12" strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"/>
    </svg>
  );
}