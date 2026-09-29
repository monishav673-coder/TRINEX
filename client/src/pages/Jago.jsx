import React, { useState, useEffect, useRef } from 'react';
import { jagoService } from '../services/jagoService';
import { useAuth } from '../context/AuthContext';
import {
  Bot,
  Sparkles,
  Send,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Award,
  FolderLock,
  CreditCard,
  ExternalLink
} from 'lucide-react';

export const Jago = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      sender: 'jago',
      text: `Hello ${user?.fullName || 'Ananya'}! I am **JAGO AI**, your specialized scholarship guide on TRINEX.\n\nI have direct access to your profile, submitted applications, DigiVault certificates, and official Ministry of Tribal Affairs guidelines. How can I help you today?`,
      suggestions: [
        'What documents are missing?',
        'Why is my application pending?',
        'Am I eligible?',
        'Where is my application?',
        'How do I correct a mismatch?',
        'When was my application submitted?'
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
            suggestions: res.suggestions || [],
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
            suggestions: ['Am I eligible?', 'What documents do I need?'],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'jago',
          text: "I'm experiencing connectivity issues with the TRINEX knowledge engine. Please try again shortly.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-400/30 px-2.5 py-0.5 rounded-full font-bold">
              AI Scholarship Assistant
            </span>
            <span className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded">
              Controlled Scheme Knowledge Base
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            JAGO AI
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 max-w-xl mt-1 leading-relaxed">
            "Your Scholarship Guide" — Personalized, context-aware assistance for tribal scholarship discovery, document troubleshooting, and scrutiny tracking.
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/40 text-purple-200 flex items-center justify-center shrink-0">
          <Bot className="w-7 h-7" />
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle flex flex-col h-[600px] overflow-hidden">
        {/* Messages Feed */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-primary-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed text-xs sm:text-sm">
                  {m.text}
                </div>

                {m.references && m.references.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>Reference: {m.references.join(' • ')}</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-2">{m.timestamp}</span>

              {/* Suggestions */}
              {m.suggestions && m.suggestions.length > 0 && idx === messages.length - 1 && (
                <div className="mt-3 flex flex-wrap gap-2 max-w-full">
                  {m.suggestions.map((s, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleSend(s)}
                      disabled={loading}
                      className="bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-full px-3 py-1.5 text-xs font-semibold transition-all hover:scale-102"
                    >
                      💡 {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs p-3">
              <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
              <span>JAGO AI is analyzing your application context...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Ask JAGO anything (e.g. 'Why is my application pending?', 'Am I eligible for NFST?')..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
              className="flex-1 bg-slate-50 focus:bg-white border border-slate-200 focus:border-purple-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 text-center mt-2">
            Responses use strictly controlled Ministry of Tribal Affairs guidelines and your authorized application records.
          </p>
        </div>
      </div>
    </div>
  );
};
