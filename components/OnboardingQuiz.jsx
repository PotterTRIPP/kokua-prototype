"use client";
import { useState } from "react";

const questions = [
  {
    id: 1,
    text: "What feels most missing from your life right now?",
    options: [
      { text: "Structure and stability", type: "builder" },
      { text: "A sense of direction", type: "explorer" },
      { text: "Peace and growth", type: "gardener" }
    ]
  },
  {
    id: 2,
    text: "How does stress manifest for you?",
    options: [
      { text: "I feel like things are falling apart.", type: "builder" },
      { text: "I feel lost in a fog.", type: "explorer" },
      { text: "I feel drained and wilted.", type: "gardener" }
    ]
  },
  {
    id: 3,
    text: "Pick a visual that calms you:",
    options: [
      { text: "A solid stone fortress.", type: "builder" },
      { text: "A lighthouse in the distance.", type: "explorer" },
      { text: "A quiet, lush forest.", type: "gardener" }
    ]
  }
];

export default function OnboardingQuiz({ onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({ builder: 0, explorer: 0, gardener: 0 });

  const handleAnswer = (type) => {
    // 1. Update Score
    const newScores = { ...scores, [type]: scores[type] + 1 };
    setScores(newScores);

    // 2. Move to next question OR Finish
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // CALCULATION: Find the highest score
      const winner = Object.keys(newScores).reduce((a, b) => newScores[a] > newScores[b] ? a : b);
      onComplete(winner);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-white animate-in fade-in">
      
      <div className="max-w-md w-full space-y-8">
        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-500" 
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Analysis Phase {currentQ + 1}/{questions.length}
          </span>
          <h2 className="text-3xl font-bold">{questions[currentQ].text}</h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {questions[currentQ].options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(opt.type)}
              className="w-full p-4 rounded-xl border border-slate-700 bg-slate-900/50 hover:bg-blue-600/20 hover:border-blue-500 transition-all text-left font-medium"
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}