import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  X, 
  Minimize2, 
  Maximize2,
  User,
  Bot,
  Loader2,
  Clock,
  Sparkles,
  MessageCircle,
  ChevronDown,
  Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';

const API_URL = 'https://suportagent.vercel.app';

export default function PayalChat({ isOpen, onClose, onToggle }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize session
  useEffect(() => {
    let sid = localStorage.getItem('payal_session_id');
    if (!sid) {
      sid = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      localStorage.setItem('payal_session_id', sid);
    }
    setSessionId(sid);
    loadHistory(sid);
  }, []);

  // Load chat history
  const loadHistory = async (sid) => {
    try {
      const response = await fetch(`${API_URL}/api/chat/history/${sid}`);
      const data = await response.json();
      if (data.history && data.history.length > 0) {
        const formattedMessages = data.history.map((msg, idx) => ({
          id: msg.timestamp || idx,
          text: msg.message,
          sender: msg.role === 'user' ? 'user' : 'bot',
          timestamp: msg.timestamp || Date.now()
        }));
        setMessages(formattedMessages);
      } else {
        // Welcome message
        setMessages([{
          id: 'welcome',
          text: "👋 Namaste! Main Payal, WhatsApp Business API Solution Expert hun.\n\nAapko kya chahiye?\n• Bulk messaging 📤\n• WhatsApp automation 🤖\n• Bot setup ⚡\n• Platform guide 📚\n• Kuch aur? 😊",
          sender: 'bot',
          timestamp: Date.now()
        }]);
      }
    } catch (error) {
      console.error('Load history error:', error);
    }
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-focus input
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: Date.now()
    }]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId: sessionId
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: data.reply,
          sender: 'bot',
          timestamp: Date.now()
        }]);
      } else {
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: '❌ Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick replies
  const quickReplies = [
    { label: '📱 Platform', message: 'Platform kya hai?' },
    { label: '📤 Bulk', message: 'Bulk message kaise bhejein?' },
    { label: '🤖 Bot', message: 'Bot kaise banayein?' },
    { label: '💰 Price', message: 'Price kya hai?' },
    { label: '🔌 API', message: 'API kaise use karein?' },
  ];

  // Clear chat
  const clearChat = async () => {
    if (sessionId) {
      try {
        await fetch(`${API_URL}/api/chat/history/${sessionId}`, {
          method: 'DELETE'
        });
      } catch (error) {}
    }
    setMessages([{
      id: 'welcome',
      text: "👋 Namaste! Main Payal, WhatsApp Business API Solution Expert hun.\n\nAapko kya chahiye?\n• Bulk messaging 📤\n• WhatsApp automation 🤖\n• Bot setup ⚡\n• Platform guide 📚\n• Kuch aur? 😊",
      sender: 'bot',
      timestamp: Date.now()
    }]);
  };

  // Format time
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render message with line breaks
  const renderMessage = (text) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25 }}
        className={cn(
          "fixed bottom-0 md:bottom-6 left-0 md:left-auto right-0 md:right-6 z-50",
          "w-full md:w-[440px] bg-[#0a0a0f] md:rounded-3xl shadow-2xl border border-white/10 overflow-hidden",
          isMinimized ? "h-[72px]" : "h-[100vh] md:h-[85vh] md:max-h-[700px]"
        )}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-white/5 cursor-pointer"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                Payal
                <span className="flex items-center gap-1.5 text-[8px] font-black text-emerald-400 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </h3>
              <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">
                WhatsApp API Expert
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearChat();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-gray-400 hover:text-white text-[9px] font-black uppercase tracking-wider"
            >
              Clear
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(!isMinimized);
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-gray-400 hover:text-white hidden md:flex"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 transition-all text-gray-400 hover:text-red-400"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-[calc(100%-72px)]"
            >
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0a0a0f]/50">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={msg.id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={cn(
                      "flex items-start gap-2.5",
                      msg.sender === 'user' ? "flex-row-reverse" : ""
                    )}
                  >
                    {/* Avatar */}
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
                      msg.sender === 'user' 
                        ? "bg-gradient-to-r from-cyan-500 to-purple-500" 
                        : "bg-white/10 border border-white/5"
                    )}>
                      {msg.sender === 'user' 
                        ? <User size={14} className="text-white" />
                        : <Bot size={14} className="text-cyan-400" />
                      }
                    </div>

                    {/* Message */}
                    <div className={cn(
                      "max-w-[80%]",
                      msg.sender === 'user' ? "order-1" : ""
                    )}>
                      <div className={cn(
                        "p-3 rounded-2xl text-sm leading-relaxed",
                        msg.sender === 'user'
                          ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-tr-sm"
                          : "bg-white/5 text-gray-200 border border-white/5 rounded-tl-sm"
                      )}>
                        {renderMessage(msg.text)}
                      </div>
                      <div className={cn(
                        "text-[8px] text-gray-600 font-black uppercase tracking-widest mt-1 flex items-center gap-1",
                        msg.sender === 'user' ? "justify-end" : ""
                      )}>
                        <Clock size={10} />
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/5 flex items-center justify-center">
                      <Bot size={14} className="text-cyan-400" />
                    </div>
                    <div className="bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-sm">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              <div className="px-4 py-2 bg-white/5 border-t border-white/5 overflow-x-auto">
                <div className="flex gap-2">
                  {quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInput(reply.message);
                        setTimeout(sendMessage, 150);
                      }}
                      className="flex-shrink-0 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-[10px] font-black text-gray-400 hover:text-white uppercase tracking-wider border border-white/5 hover:border-cyan-500/30 whitespace-nowrap"
                    >
                      {reply.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white/5 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Payal anything..."
                    className="flex-1 p-3 rounded-2xl bg-black/50 border border-white/10 text-white placeholder-gray-600 text-sm outline-none focus:border-cyan-500/50 transition-all"
                    disabled={isLoading}
                  />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className={cn(
                      "p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg transition-all flex-shrink-0",
                      (isLoading || !input.trim()) ? "opacity-50 cursor-not-allowed" : "hover:shadow-cyan-500/25"
                    )}
                  >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  </motion.button>
                </div>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="text-[8px] text-gray-600 uppercase font-black tracking-widest">
                    <Sparkles size={10} className="inline mr-1 text-cyan-400" />
                    AI Powered by MeshAPI
                  </span>
                  <span className="text-[8px] text-gray-600 uppercase font-black tracking-widest truncate max-w-[120px]">
                    ID: {sessionId?.substring(0, 12)}...
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
