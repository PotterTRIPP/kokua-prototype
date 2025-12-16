"use client";

export default function ActivityModal({ isOpen, onClose, step, theme, onComplete }) {
  if (!isOpen || !step) return null;

  const skin = step.archetype_skins[theme.id];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      
      {/* THE CARD */}
      <div className={`w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10`}>
        
        {/* Header Image / Icon Area */}
        <div className={`h-32 ${theme.secondary} flex items-center justify-center relative`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/40"
          >
            ✕
          </button>
          <span className="text-6xl animate-pulse">{skin.icon}</span>
        </div>

        {/* Content Body */}
        <div className="p-6 text-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{skin.title}</h2>
            <p className="text-slate-400">{skin.description}</p>
          </div>

          {/* DYNAMIC CONTENT based on Type */}
          {step.type === 'audio' && (
            <div className="bg-slate-800 rounded-xl p-4 flex items-center gap-4">
              <button className={`w-12 h-12 rounded-full ${theme.primary} flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform`}>
                ▶
              </button>
              <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className={`w-1/3 h-full ${theme.primary}`}></div>
              </div>
              <span className="text-xs text-slate-500 font-mono">05:00</span>
            </div>
          )}

          {step.type === 'task' && (
            <div className="bg-slate-800 rounded-xl p-4 text-left border-l-4 border-yellow-500">
              <p className="text-xs font-bold text-yellow-500 mb-1 uppercase">Today's Mission</p>
              <p className="text-sm text-slate-200">{skin.challenge}</p>
            </div>
          )}

          {/* THE "I DID IT" BUTTON */}
          <button 
            onClick={() => {
              onComplete();
              onClose();
            }}
            className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95 ${theme.primary}`}
          >
            Complete Session
          </button>
        </div>

      </div>
    </div>
  );
}