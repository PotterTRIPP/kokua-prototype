"use client";
import { useState } from "react";

export default function KokuaChat({ currentTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [messages, setMessages] = useState([
    { role: "kokua", text: "We are here. How is the path feeling?" }
  ]);

  // This function runs when you press Enter or Click Send
  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Add YOUR message to the list immediately
    const userMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput(""); // Clear the box
    setIsLoading(true); // Turn on "thinking" mode

    try {
      // 2. Send it to our "Brain" (The API Route)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage.text, 
          archetype: currentTheme.id // We tell the brain who we are
        }),
      });

      const data = await response.json();

      // 3. Add KOKUA'S reply to the list
      setMessages(prev => [...prev, { role: "kokua", text: data.reply }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "kokua", text: "We are having trouble connecting." }]);
    } finally {
      setIsLoading(false); // Turn off thinking mode
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {isOpen && (
        <div className="bg-slate-900 border border-slate-700 w-80 h-96 rounded-2xl shadow-2xl mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in">
          
          {/* Header */}
          <div className={`p-4 ${currentTheme.secondary} flex justify-between items-center transition-colors duration-500`}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="font-bold text-white">Kokua</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">✕</button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-slate-800 text-slate-200 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {/* Loading Indicator */}
            {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-slate-800 p-3 rounded-xl rounded-bl-none text-slate-400 text-xs italic">
                   Kokua is thinking...
                 </div>
               </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="w-full bg-slate-900 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {/* THE SEND BUTTON */}
            <button 
              onClick={handleSend}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-500"
            >
              SEND
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
          isOpen ? 'bg-slate-700' : currentTheme.primary
        }`}
      >
        {isOpen ? <span className="text-2xl">✕</span> : <span className="text-2xl">💬</span>}
      </button>
    </div>
  );
}