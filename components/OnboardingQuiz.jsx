"use client";
import { useState } from "react";

export default function OnboardingQuiz({ onComplete }) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({ builder: 0, explorer: 0, gardener: 0 });

  const questions = [
    {
      // CHANGED: More positive, growth-oriented phrasing
      text: "What aspect of life are you most excited about working on?",
      options: [
        { text: "Building a strong foundation and habits", type: "builder" },
        { text: "Discovering new perspectives and ideas", type: "explorer" },
        { text: "Nurturing my inner peace and balance", type: "gardener" },
      ],
    },
    {
      text: "How do you usually handle stress?",
      options: [
        { text: "I make a plan to fix it.", type: "builder" },
        { text: "I look for a distraction or escape.", type: "explorer" },
        { text: "I retreat and wait for it to pass.", type: "gardener" },
      ],
    },
    {
      text: "Pick a visual that calls to you:",
      options: [
        { text: "🏙️ A clear, organized city skyline", type: "builder" },
        { text: "🌊 An open, endless ocean", type: "explorer" },
        { text: "🌿 A quiet, sunlit forest", type: "gardener" },
      ],
    },
  ];

  const handleAnswer = (type) => {
    const newScores = { ...scores, [type]: scores[type] + 1 };
    setScores(newScores);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate winner
      const winner = Object.keys(newScores).reduce((a, b) => 
        newScores[a] > newScores[b] ? a : b
      );
      onComplete(winner);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#100529] text-white px-4 font-sans">
      <div className="max-w-md w-full bg-[#2A1B6E]/90 backdrop-blur-md p-8 rounded-[32px] border border-white/10 shadow-2xl animate-fade-in">
        
        {/* Progress Bar */}
        <div className="w-full bg-black/40 h-2 rounded-full mb-8 overflow-hidden">
          <div 
            className="bg-[#C2F042] h-full transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <h2 className="text-2xl font-bold mb-8 text-center leading-relaxed drop-shadow-md">
          {questions[step].text}
        </h2>

        {/* Options */}
        <div className="space-y-4">
          {questions[step].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option.type)}
              className="w-full p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-[#C2F042] hover:text-[#100529] hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(194,240,66,0.4)] transition-all duration-300 text-left font-semibold text-sm tracking-wide"
            >
              {option.text}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}