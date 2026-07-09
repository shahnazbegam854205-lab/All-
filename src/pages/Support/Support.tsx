import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Globe, 
  ExternalLink, 
  ChevronRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  MessageSquare,
  Clock,
  Send,
  Loader2,
  User,
  Bot,
  Sparkles,
  Mic,
  Paperclip,
  Smile,
  ArrowLeft,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
  sessionId?: string;
}

export default function Support() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const API_URL = 'https://suportagent.vercel.app/api/chat';

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 500);
  }, []);

  // Welcome message
  useEffect(() => {
    if (showWelcome) {
      const welcomeMsg: Message = {
        id: 'welcome',
        type: 'bot',
        text: "👋 Hello! I'm your WhatsApp API support assistant. How can I help you today?",
        timestamp: new Date()
      };
      setMessages([welcomeMsg]);
      setShowWelcome(false);
    }
  }, []);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    const text = inputMessage.trim();
    if (!text || isLoading) return;

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      text: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: text,
          sessionId: sessionId 
        })
      });

      const data = await response.json();

      if (data.success) {
        // Store session ID for future messages
        if (data.sessionId) {
          setSessionId(data.sessionId);
        }

        // Add bot response with typing effect simulation
        setTimeout(() => {
          const botMsg: Message = {
            id: `bot-${Date.now()}`,
            type: 'bot',
            text: data.reply || "I'm sorry, I didn't understand that. Could you please rephrase?",
            timestamp: new Date(),
            sessionId: data.sessionId
          };
          setMessages(prev => [...prev, botMsg]);
          setIsTyping(false);
        }, 300);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        type: 'bot',
        text: "⚠️ I'm having trouble connecting. Please try again or contact us on WhatsApp.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    const welcomeMsg: Message = {
      id: 'welcome-new',
      type: 'bot',
      text: "👋 Welcome back! How can I help you today?",
      timestamp: new Date()
    };
    setMessages([welcomeMsg]);
    setSessionId(null);
    setInputMessage('');
  };

  // Quick reply suggestions
  const quickReplies = [
    "What is WhatsApp API?",
    "How to send bulk messages?",
    "Webhook setup guide",
    "Pricing plans",
    "Device connection help"
  ];

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col max-w-4xl mx-auto px-3 sm:px-4 pb-4">
      {/* Chat Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 bg-[#111] rounded-2xl border border-white/5 shadow-xl mb-3 shrink-0"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Bot size={20} className="text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#111] animate-pulse" />
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-white text-sm sm:text-base truncate">Support Agent</h3>
            <p className="text-[9px] sm:text-[10px] text-emerald-400 font-black uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={clearChat}
            className="p-2 text-gray-500 hover:text-white transition-colors rounded-xl hover:bg-white/5"
            title="Clear chat"
          >
            <X size={18} />
          </button>
          <a 
            href="https://wa.me/639079249283"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-colors"
            title="WhatsApp Support"
          >
            <MessageCircle size={18} />
          </a>
        </div>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3 sm:p-4 bg-[#0a0a0a] rounded-2xl border border-white/5 custom-scrollbar mb-3">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx === messages.length - 1 ? 0 : 0.05 }}
              className={cn(
                "flex items-start gap-2.5 max-w-[90%] sm:max-w-[80%]",
                msg.type === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              {/* Avatar */}
              <div className={cn(
                "w-8 h-8 rounded-xl shrink-0 flex items-center justify-center",
                msg.type === 'user' 
                  ? "bg-gradient-to-br from-cyan-500 to-blue-500" 
                  : "bg-gradient-to-br from-emerald-500 to-teal-500"
              )}>
                {msg.type === 'user' ? (
                  <User size={14} className="text-white" />
                ) : (
                  <Bot size={14} className="text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={cn(
                "p-3 sm:p-4 rounded-2xl text-sm sm:text-base leading-relaxed relative",
                msg.type === 'user' 
                  ? "bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-tr-none shadow-lg shadow-cyan-500/20" 
                  : "bg-[#1a1a1a] text-gray-200 rounded-tl-none border border-white/5"
              )}>
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                <span className="text-[8px] sm:text-[9px] opacity-40 mt-1 block font-mono">
                  {format(msg.timestamp, 'h:mm a')}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-start gap-2.5 max-w-[90%] sm:max-w-[80%] mr-auto"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                <Bot size={14} className="text-white" />
              </div>
              <div className="bg-[#1a1a1a] p-4 rounded-2xl rounded-tl-none border border-white/5">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies - Mobile Friendly */}
      {messages.length < 3 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 shrink-0 justify-center"
        >
          {quickReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputMessage(reply);
                setTimeout(() => handleSendMessage(), 100);
              }}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#111] border border-white/10 rounded-full text-[8px] sm:text-[10px] font-bold text-gray-400 hover:text-white hover:border-cyan-500/30 transition-all hover:bg-white/5 active:scale-95 whitespace-nowrap"
            >
              {reply}
            </button>
          ))}
        </motion.div>
      )}

      {/* Input Area */}
      <form 
        onSubmit={handleSendMessage}
        className="flex items-end gap-2 p-2 bg-[#111] rounded-2xl border border-white/5 shadow-xl shrink-0"
      >
        <button
          type="button"
          className="p-2 sm:p-3 text-gray-500 hover:text-cyan-400 transition-colors rounded-xl hover:bg-white/5"
        >
          <Paperclip size={18} className="sm:w-5 sm:h-5" />
        </button>
        
        <div className="flex-1 min-w-0">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="w-full bg-transparent py-2 px-1 outline-none text-white placeholder:text-gray-600 text-sm sm:text-base"
            disabled={isLoading}
          />
        </div>
        
        <button
          type="button"
          className="p-2 sm:p-3 text-gray-500 hover:text-cyan-400 transition-colors rounded-xl hover:bg-white/5"
        >
          <Smile size={18} className="sm:w-5 sm:h-5" />
        </button>
        
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className={cn(
            "p-2.5 sm:p-3 rounded-xl transition-all flex items-center justify-center",
            inputMessage.trim() && !isLoading
              ? "bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95"
              : "bg-white/5 text-gray-600 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <Loader2 size={18} className="sm:w-5 sm:h-5 animate-spin" />
          ) : (
            <Send size={18} className="sm:w-5 sm:h-5" />
          )}
        </button>
      </form>

      {/* Support Info Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-between mt-2 px-1 shrink-0"
      >
        <div className="flex items-center gap-2 text-[8px] sm:text-[9px] text-gray-600 font-mono">
          <ShieldCheck size={12} className="text-emerald-500" />
          <span>End-to-end encrypted</span>
        </div>
        <a 
          href="https://wa.me/639079249283"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[8px] sm:text-[9px] text-cyan-500 hover:text-cyan-400 transition-colors font-bold uppercase tracking-widest"
        >
          <MessageCircle size={12} /> WhatsApp
        </a>
      </motion.div>
    </div>
  );
}
