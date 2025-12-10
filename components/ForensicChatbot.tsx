
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Cpu } from 'lucide-react';
import { chatWithForensicBot } from '../services/geminiService';
import { ChatMessage } from '../types';

const ForensicChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'AccidentAnalytics AI Online. Ready to assist with forensic queries.', timestamp: new Date() }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Convert internal message format to Gemini history if we were doing multi-turn properly
    // For now we just send the message to the service
    const history = messages.map(m => ({ role: m.role, parts: m.text }));
    
    const responseText = await chatWithForensicBot(history, userMsg.text);

    const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-3rem)] md:w-96 bg-slate-900 border border-brand-700 rounded-lg shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[60vh] md:max-h-[500px] h-[500px]">
          <div className="bg-brand-900 p-3 flex justify-between items-center border-b border-brand-800">
            <div className="flex items-center gap-2">
              <Cpu size={18} className="text-brand-400" />
              <span className="font-semibold text-sm text-white">Forensic Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-brand-300 hover:text-white">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50 forensic-scroll">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-brand-700 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce delay-75" />
                  <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce delay-150" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about liability codes..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-brand-600 hover:bg-brand-500 text-white p-2 rounded transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto bg-brand-600 hover:bg-brand-500 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center"
      >
        <MessageSquare size={24} />
      </button>
    </div>
  );
};

export default ForensicChatbot;
