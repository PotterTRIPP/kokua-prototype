export default function LotusCoin({ amount }) {
  return (
    <div className="fixed top-24 right-6 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)] animate-in slide-in-from-right">
      
      {/* THE COIN ICON (SVG) */}
      <div className="relative w-8 h-8">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Gold Coin Body */}
          <circle cx="50" cy="50" r="45" fill="#eab308" stroke="#fef08a" strokeWidth="4" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="#ca8a04" strokeWidth="2" strokeDasharray="4 4" />
          
          {/* Lotus Stamp */}
          <path 
            d="M50 20 C50 20 65 40 65 55 C65 70 50 80 50 80 C50 80 35 70 35 55 C35 40 50 20 50 20 Z" 
            fill="#a16207" 
          />
          <path d="M35 55 Q20 45 30 30" fill="none" stroke="#a16207" strokeWidth="3" strokeLinecap="round" />
          <path d="M65 55 Q80 45 70 30" fill="none" stroke="#a16207" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* THE SCORE */}
      <span className="text-yellow-400 font-bold font-mono text-xl tracking-wider">
        {amount}
      </span>
    </div>
  );
}