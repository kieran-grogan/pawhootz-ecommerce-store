
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Dog } from 'lucide-react';
import { ChatMessage, LoadingState, Product } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface GeminiAssistantProps {
  products: Product[];
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Woof! I'm Hootie, your PawHootz personal shopper. Looking for something special for your pup?" }
  ]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setStatus(LoadingState.LOADING);

    try {
      // Pass the live products list to the service
      const responseText = await sendMessageToGemini(input, products);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I got distracted by a squirrel. Can you try that again?", isError: true }]);
      setStatus(LoadingState.ERROR);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-30 bg-paw-purple hover:bg-paw-purple-dark text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 group ${isOpen ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100'}`}
      >
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-paw-orange rounded-full animate-ping" />
        <MessageCircle size={28} />
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-paw-text-primary px-3 py-1 rounded-lg shadow-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Ask Hootie!
        </div>
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-[350px] sm:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden border border-gray-100 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="bg-paw-purple p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Dog size={20} />
            </div>
            <div>
              <h3 className="font-bold">Chat with Hootie</h3>
              <p className="text-xs text-white/80 flex items-center gap-1">
                <Sparkles size={10} /> AI Assistant
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-paw-bg">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-paw-purple text-white rounded-br-none' 
                  : 'bg-white text-paw-text-primary shadow-sm border border-gray-100 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {status === LoadingState.LOADING && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-paw-purple focus-within:ring-1 focus-within:ring-paw-purple transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about treats, toys..."
              className="flex-1 bg-transparent outline-none text-sm text-paw-text-primary"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || status === LoadingState.LOADING}
              className="text-paw-purple hover:text-paw-orange disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
