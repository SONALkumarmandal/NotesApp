import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AIProcessingState } from '../types';
import { streamChat } from '../services/geminiService';
import { IconSend, IconX, IconSparkles, IconMessage } from './Icons';

interface AssistantProps {
  noteContent: string;
  onClose: () => void;
  onApplyContent: (content: string) => void;
}

const Assistant: React.FC<AssistantProps> = ({ noteContent, onClose, onApplyContent }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'yo! i\'m here to help you cook. what\'s the move?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const modelMsgId = crypto.randomUUID();
    setMessages(prev => [...prev, {
      id: modelMsgId,
      role: 'model',
      text: '',
      timestamp: Date.now()
    }]);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const generator = streamChat(history, userMsg.text, noteContent);
      
      let fullText = '';
      
      for await (const chunk of generator) {
        if (chunk) {
          fullText += chunk;
          setMessages(prev => prev.map(m => 
            m.id === modelMsgId ? { ...m, text: fullText } : m
          ));
        }
      }
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full md:w-[400px] bg-surface border-l border-subtle flex flex-col h-full absolute right-0 top-0 z-20 shadow-2xl md:static md:shadow-none">
      <div className="p-5 border-b border-subtle flex justify-between items-center bg-surface">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span className="font-display font-bold text-lg text-white tracking-tight">bestie<span className="text-secondary">.ai</span></span>
        </div>
        <button onClick={onClose} className="p-1 hover:text-white text-zinc-500 transition-colors">
          <IconX className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-3xl px-5 py-3 text-sm font-medium leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-primary to-lime-600 text-black rounded-tr-none shadow-[0_0_15px_rgba(163,230,53,0.2)]'
                  : 'bg-surface border border-subtle text-zinc-300 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              {msg.role === 'model' && msg.text.length > 0 && !isTyping && (
                  <div className="mt-3 pt-2 border-t border-zinc-700/50 flex gap-2">
                     <button 
                       onClick={() => onApplyContent(msg.text)}
                       className="text-[10px] uppercase tracking-wider text-secondary hover:text-fuchsia-300 font-bold flex items-center gap-1.5"
                     >
                        <IconSend className="w-3 h-3 rotate-180" /> insert
                     </button>
                  </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-surface border border-subtle px-4 py-3 rounded-full rounded-tl-none flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-subtle bg-surface">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ask me anything..."
            className="w-full bg-dark text-zinc-200 pl-4 pr-12 py-3.5 rounded-2xl border border-subtle focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-none h-[60px] max-h-[120px] text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 p-2 bg-primary text-black rounded-xl hover:bg-lime-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <IconSend className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;