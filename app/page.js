"use client";

import { useState, useEffect } from "react";
import { contentLibrary } from "../data/content";
import { themes } from "../data/themes"; 
import KokuaChat from "../components/KokuaChat";
import ActivityModal from "../components/ActivityModal";
import OnboardingQuiz from "../components/OnboardingQuiz";
import LotusCoin from "../components/LotusCoin"; 
import AudioManager from "../components/AudioManager";

export default function Home() {
  const [currentArchetype, setArchetype] = useState(null);
  const [unlockedIndex, setUnlockedIndex] = useState(0);
  const [selectedStep, setSelectedStep] = useState(null);
  const [currency, setCurrency] = useState(0);
  const [flyingReward, setFlyingReward] = useState(null);
  const [sfxTrigger, setSfxTrigger] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (!currentArchetype) {
    return <OnboardingQuiz onComplete={(winner) => setArchetype(winner)} />;
  }

  const journey = contentLibrary.journey;
  const theme = themes[currentArchetype];

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

      setFlyingReward(reward);
      if (!isMuted) {
         setSfxTrigger(isCheckpoint ? "level_up" : "coin_collect");
         setTimeout(() => setSfxTrigger(null), 500);
      }
      setTimeout(() => {
        setCurrency(prev => prev + reward);
        setFlyingReward(null);
      }, 1000);
    }
    setSelectedStep(null);
  };

  const getOffset = (index) => Math.sin(index * 137) * 60;

  return (
    <div className="min-h-screen bg-[#100529] text-white font-sans overflow-x-hidden selection:bg-[#C2F042] selection:text-[#100529]">
      
      {/* 1. BACKGROUND: Natural Archetype Photo (No Purple Overlay) */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url('${theme.bg_image}')` }}
      />
      
      {/* 2. AUDIO MANAGER */}
      {!isMuted && <AudioManager archetype={currentArchetype} triggerSFX={sfxTrigger} />}

      {/* 3. TOP NAV (With a small gradient fade so icons are readable against bright skies) */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 pt-12 pb-4 flex justify-between items-center bg-gradient-to-b from-[#100529]/80 to-transparent">
         {/* Logo Icon */}
         <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg">
            <span className="text-xl">🧘</span>
         </div>

         {/* Notifications & Profile */}
         <div className="flex gap-4">
             <button onClick={() => setIsMuted(!isMuted)} className="relative p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors backdrop-blur-sm">
                 <span className="text-xl">{isMuted ? "🔇" : "🔔"}</span>
                 <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#100529]"></div>
             </button>
             <div className="w-10 h-10 rounded-full bg-gray-600 border-2 border-white/20 overflow-hidden shadow-lg">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" />
             </div>
         </div>
      </header>

      {/* 4. MAIN SCROLLABLE CONTENT */}
      <div className="relative z-10 pt-32 pb-32 px-4 max-w-lg mx-auto">
        
        {/* HERO SECTION */}
        {/* Added a text shadow so white text reads well on bright backgrounds */}
        <div className="text-center mb-10 animate-fade-in drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <h1 className="text-2xl font-bold mb-2 text-white">Welcome back, Traveler</h1>
            <p className="text-white/90 text-sm mb-8 font-medium tracking-wide">Your {theme.name} journey continues.</p>

            {/* SOLID NEON BUTTON */}
            <button 
              onClick={() => setIsChatOpen(true)}
              className="w-full py-4 rounded-full bg-[#C2F042] text-[#100529] font-bold text-lg shadow-[0_0_25px_rgba(194,240,66,0.6)] hover:scale-[1.02] transition-transform active:scale-95 opacity-100 border-none"
            >
              Connect to Kōkua
            </button>
            <p className="text-xs text-white/80 mt-4 underline decoration-white/40 hover:text-white cursor-pointer transition-colors font-semibold">What is Kōkua?</p>
        </div>

        {/* JOURNEY MAP CARD - Keeps the Purple/Green TRIPP aesthetic */}
        <div className="bg-[#2A1B6E]/95 backdrop-blur-md border border-white/10 rounded-[32px] p-6 relative overflow-hidden min-h-[600px] shadow-2xl">
            
            {/* Card Header */}
            <div className="flex justify-between items-end mb-8 relative z-20">
                <div>
                    <h2 className="text-xl font-bold text-white">Your Path</h2>
                    <p className="text-xs text-white/70">Complete steps for Aura</p>
                </div>
                {/* Aura Counter */}
                <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
                    <span className="text-[#C2F042] font-bold">{currency}</span>
                    <span className="text-[10px] uppercase tracking-wider text-white/80">Aura</span>
                </div>
            </div>

            {/* Path Visuals */}
            <div className="relative py-8">
                 <MeanderingPath steps={journey.length} getOffset={getOffset} />
                 
                 {journey.map((step, index) => {
                    const skin = step.archetype_skins[currentArchetype];
                    const isLocked = index > unlockedIndex;
                    const isCompleted = index < unlockedIndex;
                    const isActive = index === unlockedIndex;
                    const xOffset = getOffset(index);
                    const isLeft = xOffset < 0;

                    return (
                        <div key={step.id} className="relative h-32 flex items-center justify-center">
                            
                            {/* TEXT BUBBLE */}
                            <div 
                                onClick={() => handleStepClick(step, index)}
                                className={`
                                    absolute w-32 p-3 rounded-2xl border transition-all cursor-pointer z-20 shadow-lg
                                    ${isLeft ? 'left-[55%] ml-6 text-left' : 'right-[55%] mr-6 text-right'}
                                    ${isActive 
                                        ? 'bg-[#1e1438] border-[#C2F042] shadow-[0_0_15px_rgba(194,240,66,0.3)]' 
                                        : 'bg-gray-900/95 border-white/10 hover:bg-gray-800'}
                                    ${isLocked ? 'opacity-40 grayscale' : 'opacity-100'}
                                `}
                                style={{ transform: `translateX(${xOffset * 0.5}px)` }}
                            >
                                <h3 className={`font-bold text-xs mb-1 ${isActive ? 'text-[#C2F042]' : 'text-white'}`}>{skin.title}</h3>
                            </div>

                            {/* Node Orb */}
                            <div 
                                onClick={() => handleStepClick(step, index)}
                                className={`
                                    w-12 h-12 rounded-full flex items-center justify-center text-lg shadow-2xl cursor-pointer transition-all relative z-30
                                    ${isActive 
                                        ? 'bg-white text-[#100529] scale-125 shadow-[0_0_30px_rgba(255,255,255,0.8)] animate-pulse' 
                                        : 'bg-[#2A1B6E] border-2 border-white/20 text-white/40'}
                                    ${isCompleted ? 'bg-[#C2F042] text-[#100529] border-transparent' : ''}
                                `}
                                style={{ transform: `translateX(${xOffset}px)` }}
                            >
                                {isCompleted ? "✓" : isActive ? "★" : skin.icon}
                            </div>
                        </div>
                    );
                 })}
            </div>
        </div>

      </div>

      {/* 5. BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0B041C] border-t border-white/10 py-4 px-6 flex justify-between items-center z-50 text-[10px] font-bold text-white/40 uppercase tracking-widest">
          <div className="flex flex-col items-center gap-1 hover:text-white transition-colors cursor-pointer">
              <span className="text-xl">🏠</span>
              <span>Home</span>
          </div>
          <div className="flex flex-col items-center gap-1 hover:text-white transition-colors cursor-pointer">
              <span className="text-xl">🔍</span>
              <span>Browse</span>
          </div>
          <div className="flex flex-col items-center gap-1 relative text-[#C2F042] cursor-pointer">
              <span className="text-xl">📊</span>
              <span>Activity</span>
              <div className="absolute -bottom-2 w-1 h-1 bg-[#C2F042] rounded-full shadow-[0_0_5px_currentColor]"></div>
          </div>
          <div className="flex flex-col items-center gap-1 hover:text-white transition-colors cursor-pointer">
              <span className="text-xl">👤</span>
              <span>Profile</span>
          </div>
      </nav>

      {/* Flying Number */}
      {flyingReward && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] font-bold text-[#C2F042] text-6xl drop-shadow-[0_0_30px_rgba(194,240,66,0.9)] animate-bounce">
            +{flyingReward}
          </div>
      )}

      <ActivityModal 
        isOpen={!!selectedStep}
        step={selectedStep}
        theme={theme}
        onClose={() => setSelectedStep(null)}
        onComplete={handleCompleteActivity}
      />

      {isChatOpen && (
          <div className="fixed inset-0 z-[60] bg-[#100529]/95 backdrop-blur-xl flex flex-col animate-in slide-in-from-bottom duration-300">
              <div className="p-4 flex justify-end">
                  <button onClick={() => setIsChatOpen(false)} className="text-white/60 hover:text-white text-sm uppercase font-bold tracking-widest px-4 py-2 border border-white/10 rounded-full">Close</button>
              </div>
              <div className="flex-1 overflow-hidden">
                  <KokuaChat currentTheme={theme} />
              </div>
          </div>
      )}

    </div>
  );
}

// SVG Path
function MeanderingPath({ steps, getOffset }) {
  const ROW_HEIGHT = 128;
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
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox={`0 0 500 ${steps * ROW_HEIGHT}`} preserveAspectRatio="none">
       <path d={pathD} fill="none" stroke="#C2F042" strokeOpacity="0.2" strokeWidth="12" strokeLinecap="round" className="blur-md"/>
       <path d={pathD} fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 8"/>
    </svg>
  );
}