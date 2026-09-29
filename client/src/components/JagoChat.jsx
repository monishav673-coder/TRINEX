import React, { useState, useEffect, useRef } from 'react';
import { jagoService } from '../services/jagoService';
import { useAuth } from '../context/AuthContext';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Minimize2,
  Maximize2,
  RefreshCw,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const JagoChat = () => {
  const { user, isStudent } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const defaultSuggestions = [
    'What documents are missing?',
    'Why is my application pending?',
    'Am I eligible?',
    'Where is my application?',
    'How do I correct a mismatch?',
    'When was my application submitted?'
  ];

  const [messages, setMessages] = useState([
    {
      sender: 'jago',
      text: `Namaste${user?.fullName ? ' ' + user.fullName : ''}! I am **JAGO AI**, your dedicated Tribal Scholarship Guide. How can I assist you with your applications, DigiVault documents, or DBT payments today?`,
      suggestions: defaultSuggestions,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText) => {
    const text = queryText || inputMessage;
    if (!text || !text.trim() || loading) return;

    const userMsg = {
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await jagoService.sendMessage(text.trim());
      if (res.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'jago',
            text: res.answer,
            suggestions: res.suggestions && res.suggestions.length > 0 ? res.suggestions : defaultSuggestions.slice(0, 3),
            references: res.references || [],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'jago',
            text: "I don't have enough information to determine that right now.",
            suggestions: defaultSuggestions.slice(0, 3),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'jago',
          text: "I'm having trouble connecting to the TRINEX knowledge engine. Please check your network and try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Only render on student views or public if authenticated
  if (!user || !isStudent) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 text-white font-bold px-4 py-3 rounded-full shadow-glow-jago hover:scale-105 active:scale-95 transition-all duration-300 animate-jago"
          title="Open JAGO AI Assistant"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs tracking-wide">🤖 Ask JAGO</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5" />
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className={`bg-white rounded-2xl shadow-2xl border border-purple-200 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized
              ? 'w-80 h-14'
              : 'w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-navy-900 text-white p-3.5 flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/30 border border-purple-400/40 flex items-center justify-center text-white shadow-inner">
                <Bot className="w-5 h-5 text-purple-200" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-wide">JAGO AI</h3>
                  <span className="text-[10px] bg-purple-400/20 text-purple-200 px-1.5 py-0.2 rounded font-semibold border border-purple-400/30">
                    Scholarship Guide
                  </span>
                </div>
                <p className="text-[10px] text-purple-300 font-medium">Context-Aware • MoTA Verified Knowledge</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 rounded-lg text-purple-300 hover:text-white hover:bg-white/10 transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-purple-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          {!isMinimized && (
            <>
              {/* Messages Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/70 text-xs">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                        m.sender === 'user'
                          ? 'bg-primary-600 text-white rounded-br-none'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                      }`}
                    >
                      <div className="whitespace-pre-line leading-relaxed">
                        {m.text}
                      </div>

                      {/* Reference sources if any */}
                      {m.references && m.references.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-purple-500 shrink-0" />
                          <span className="truncate">Source: {m.references[0]}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>

                    {/* Quick suggestion chips */}
                    {m.suggestions && m.suggestions.length > 0 && idx === messages.length - 1 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-full">
                        {m.suggestions.map((s, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSend(s)}
                            disabled={loading}
                            className="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200/80 rounded-full px-2.5 py-1 text-[11px] font-medium text-left transition-all hover:scale-102 active:scale-98"
                          >
                            💡 {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600" />
                    <span>JAGO is checking your application records & scheme guidelines...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-slate-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Ask about schemes, missing docs, pending status..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={loading}
                    className="flex-1 bg-slate-100 focus:bg-white border border-slate-200 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || loading}
                    className="w-9 h-9 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-sm transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1">
                  <span>TRINEX Knowledge Engine</span>
                  <span>Responses based on official scheme rules</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
