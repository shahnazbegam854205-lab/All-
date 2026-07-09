import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import { Conversation, Message, Device } from '../../types';
import { cn } from '../../lib/utils';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { 
  Search, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  FileText, 
  Check, 
  CheckCheck,
  ChevronLeft,
  MoreVertical,
  Circle,
  Clock,
  User as UserIcon,
  Smile,
  Loader2,
  MessageSquare,
  Smartphone,
  X,
  Headphones,
  ChevronRight,
  Zap,
  Users,
  TrendingUp,
  Radio,
  ArrowUpRight
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Chat() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSupportOptions, setShowSupportOptions] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const WHATSAPP_NUMBER = '639079249283';
  const WEB_SUPPORT_URL = 'https://all-wine.vercel.app/#/support';

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch devices first
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [devicesRes, statsRes] = await Promise.all([
          api.get('/api/devices'),
          api.get('/api/user/stats')
        ]);
        const active = devicesRes.data.devices || [];
        setDevices(active);
        if (active.length > 0) setSelectedDeviceId(active[0].deviceId);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };
    fetchData();
  }, []);

  // Fetch conversations when device changes
  useEffect(() => {
    if (!selectedDeviceId) return;
    const fetchConvs = async () => {
      try {
        const { data } = await api.get(`/api/conversations/${selectedDeviceId}`);
        setConversations(data.conversations || []);
      } catch (e) {
        setConversations([]);
      }
    };
    fetchConvs();
    const interval = setInterval(fetchConvs, 15000);
    return () => clearInterval(interval);
  }, [selectedDeviceId]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (!selectedDeviceId || !selectedConversation) return;
    const fetchMsgs = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(`/api/conversations/${selectedDeviceId}/${encodeURIComponent(selectedConversation.chatId)}`);
        setMessages(data.messages || []);
        setTimeout(scrollToBottom, 200);
      } catch (e) {
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMsgs();
  }, [selectedDeviceId, selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage(prev => prev + emojiData.emoji);
  };

  const handleWhatsAppSupport = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
    setShowSupportOptions(false);
  };

  const handleWebSupport = () => {
    window.open(WEB_SUPPORT_URL, '_blank');
    setShowSupportOptions(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedDeviceId || !selectedConversation) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const isImage = file.type.startsWith('image/');
        const endpoint = isImage ? '/api/send/image' : '/api/send/document';
        const payload: any = {
          deviceId: selectedDeviceId,
          number: selectedConversation.chatId.split('@')[0],
        };

        if (isImage) {
          payload.imageUrl = base64;
          payload.caption = `File: ${file.name}`;
        } else {
          payload.documentUrl = base64;
          payload.filename = file.name;
        }

        await api.post(endpoint, payload);
        
        const optimisticMsg: Message = {
          messageId: 'temp-' + Date.now(),
          ourMessageId: 'temp-' + Date.now(),
          deviceId: selectedDeviceId,
          chatId: selectedConversation.chatId,
          from: 'me',
          to: selectedConversation.chatId,
          body: file.name,
          direction: 'outgoing',
          timestamp: Date.now(),
          status: 'sent',
          type: isImage ? 'image' : 'document',
          hasMedia: true,
          mediaUrl: isImage ? base64 : undefined,
          fileName: !isImage ? file.name : undefined
        };
        setMessages(prev => [...prev, optimisticMsg]);
        setTimeout(scrollToBottom, 100);
      } catch (err) {
        alert('Media Transmission Failed');
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedDeviceId || !selectedConversation) return;

    const msgBody = newMessage;
    const replyId = replyTo?.messageId;
    setNewMessage('');
    setReplyTo(null);
    setShowEmojiPicker(false);
    
    try {
      await api.post('/api/send', {
        deviceId: selectedDeviceId,
        number: selectedConversation.chatId.split('@')[0],
        message: msgBody,
        quoted: replyId
      });
      
      const optimisticMsg: Message = {
        messageId: 'temp-' + Date.now(),
        ourMessageId: 'temp-' + Date.now(),
        deviceId: selectedDeviceId,
        chatId: selectedConversation.chatId,
        from: 'me',
        to: selectedConversation.chatId,
        body: msgBody,
        direction: 'outgoing',
        timestamp: Date.now(),
        status: 'sent',
        type: 'text'
      };
      setMessages(prev => [...prev, optimisticMsg]);
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      alert('Transmission Failed');
    }
  };

  const filteredConversations = conversations.filter(c => 
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.chatId.includes(searchQuery)
  );

  // Quick Stats
  const quickStats = [
    { label: 'Total Sent', value: stats?.messagesSent || 0, icon: Send, color: 'text-cyan-400' },
    { label: 'Conversations', value: conversations.length, icon: Users, color: 'text-blue-400' },
    { label: 'Today\'s Usage', value: stats?.requestsToday || 0, icon: Zap, color: 'text-yellow-400' },
  ];

  return (
    <>
      <div className="h-[calc(100vh-160px)] flex flex-col md:flex-row gap-4 relative">
        {/* Sidebar - Conversations */}
        <div className={cn(
          "w-full md:w-80 lg:w-96 flex flex-col bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl",
          selectedConversation ? "hidden md:flex" : "flex"
        )}>
          <div className="p-6 border-b border-white/5 space-y-5 bg-gradient-to-br from-[#111] to-transparent">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-xl text-white tracking-tighter uppercase flex items-center gap-2">
                MESSAGES<span className="text-cyan-500">.</span>
                <span className="text-[8px] text-gray-600 font-mono bg-black/50 px-2 py-1 rounded-full">
                  {conversations.length}
                </span>
              </h2>
              <select 
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="bg-black text-[9px] border border-white/10 rounded-full px-3 py-2 outline-none text-cyan-500 font-black uppercase tracking-widest shadow-inner shadow-cyan-500/10 max-w-[120px] truncate"
              >
                {devices.map(d => <option key={d.deviceId} value={d.deviceId}>{d.name || 'Device'}</option>)}
              </select>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2">
              {quickStats.map((stat, idx) => (
                <div key={idx} className="bg-black/50 p-2 rounded-xl border border-white/5">
                  <stat.icon size={12} className={stat.color} />
                  <p className="text-[10px] font-black text-white mt-0.5">{stat.value}</p>
                  <p className="text-[6px] text-gray-600 font-black uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-cyan-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search conversations..."
                className="w-full bg-black border border-white/5 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-cyan-500/30 transition-all text-sm font-medium text-white shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {filteredConversations.map((conv) => (
              <motion.button
                key={conv.chatId}
                onClick={() => setSelectedConversation(conv)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-2xl transition-all relative group border border-transparent",
                  selectedConversation?.chatId === conv.chatId 
                    ? "bg-cyan-500/5 border-cyan-500/20 shadow-lg shadow-cyan-500/5" 
                    : "hover:bg-white/5 hover:border-white/5"
                )}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center text-gray-700 group-hover:text-cyan-400 transition-colors shadow-inner">
                    <UserIcon size={24} />
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-cyan-500 text-black text-[9px] font-black rounded-full flex items-center justify-center border-2 border-black shadow-lg animate-pulse">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className="font-black text-white text-sm truncate tracking-tight">{conv.name || conv.chatId.split('@')[0]}</h4>
                    <span className="text-[9px] text-gray-700 font-mono font-bold">
                      {conv.lastMessageTime ? format(conv.lastMessageTime, 'HH:mm') : ''}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate leading-relaxed">{conv.lastMessage || 'No messages'}</p>
                </div>
              </motion.button>
            ))}

            {filteredConversations.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <MessageSquare size={32} className="text-gray-700 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-700">No conversations</p>
              </div>
            )}
          </div>

          {/* Quick Actions in Sidebar */}
          <div className="p-4 border-t border-white/5 bg-gradient-to-t from-[#111] to-transparent">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Webhooks', icon: Radio, path: '/webhooks', color: 'text-emerald-400' },
                { label: 'Bulk', icon: Users, path: '/bulk', color: 'text-cyan-400' },
                { label: 'History', icon: Clock, path: '/history', color: 'text-blue-400' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="flex flex-col items-center p-2 rounded-xl hover:bg-white/5 transition-all group"
                >
                  <item.icon size={16} className={cn(item.color, "group-hover:scale-110 transition-transform")} />
                  <span className="text-[6px] text-gray-600 font-black uppercase tracking-widest mt-1">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Window */}
        <div className={cn(
          "flex-1 flex flex-col bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl transition-all",
          !selectedConversation ? "hidden md:flex items-center justify-center bg-black/40" : "flex"
        )}>
          {!selectedDeviceId ? (
            <div className="flex flex-col items-center justify-center p-12 text-center opacity-40">
              <Smartphone size={60} className="text-gray-500 mb-6" />
              <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">No Device Connected</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest max-w-[200px]">Link a WhatsApp device to start chatting.</p>
            </div>
          ) : !selectedConversation ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center mb-6">
                <MessageSquare size={48} className="text-cyan-500/40" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Select a chat</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest max-w-[200px]">Choose a person to start messaging.</p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-br from-[#111] to-transparent z-10">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl text-cyan-400 border border-white/5"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="w-12 h-12 rounded-xl bg-black border border-cyan-500/20 flex items-center justify-center text-cyan-500 shadow-inner shadow-cyan-500/5">
                    <UserIcon size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg tracking-tighter">{selectedConversation.name || selectedConversation.chatId.split('@')[0]}</h3>
                    <div className="text-[9px] text-emerald-500 flex items-center gap-1.5 font-black uppercase tracking-[0.2em] mt-0.5">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" /> 
                      Online
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-cyan-400 transition-all bg-white/5 border border-white/5 rounded-xl">
                    <Search size={18} />
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-cyan-400 transition-all bg-white/5 border border-white/5 rounded-xl">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#050505] custom-scrollbar selection:bg-cyan-500/30">
                {isLoading && messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center flex-col gap-4 opacity-20">
                    <Loader2 className="animate-spin text-cyan-500" size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Loading messages...</span>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMe = msg.direction === 'outgoing' || msg.from === 'me';
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 10, x: isMe ? 20 : -20 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={msg.messageId || idx}
                        className={cn(
                          "flex flex-col max-w-[85%] md:max-w-[70%] group",
                          isMe ? "ml-auto items-end" : "mr-auto items-start"
                        )}
                      >
                        <div className={cn(
                          "p-4 rounded-2xl text-sm relative shadow-2xl transition-all hover:scale-[1.01]",
                          isMe 
                            ? "bg-gradient-to-br from-cyan-600 to-blue-700 text-white font-medium rounded-tr-none border border-cyan-400/30" 
                            : "bg-[#111] text-gray-200 rounded-tl-none border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                        )}>
                          {/* Media display */}
                          {msg.hasMedia && (msg.type === 'image' || msg.type === 'video') && (
                            <div className="rounded-xl overflow-hidden mb-3 border border-white/20 shadow-2xl bg-black">
                              <img src={msg.mediaUrl} className="max-h-64 w-full object-cover transition-transform hover:scale-110 duration-700" alt="Transmission Asset" />
                            </div>
                          )}
                          {msg.hasMedia && msg.type === 'document' && (
                            <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl mb-3 border border-white/10">
                              <FileText className="text-cyan-500" size={16} />
                              <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-bold truncate">{msg.fileName || 'Attachment'}</p>
                                <p className="text-[8px] text-gray-500 uppercase tracking-widest">File Attachment</p>
                              </div>
                              <button className="text-cyan-500 p-1.5 hover:bg-cyan-500/10 rounded-lg">
                                <Send size={12} className="rotate-90" />
                              </button>
                            </div>
                          )}
                          <p className="whitespace-pre-wrap leading-relaxed text-sm font-medium tracking-tight">{msg.body}</p>
                          
                          <div className="flex items-center justify-between gap-3 mt-2">
                            <button 
                              onClick={() => setReplyTo(msg)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-black uppercase tracking-widest text-cyan-400/60 hover:text-cyan-400"
                            >
                              Reply
                            </button>
                            <div className={cn(
                              "flex items-center gap-1.5 text-[9px] font-black tracking-widest font-mono",
                              isMe ? "text-cyan-100/40" : "text-gray-700"
                            )}>
                              <span>{format(msg.timestamp || Date.now(), 'HH:mm')}</span>
                              {isMe && (
                                msg.status === 'read' ? <CheckCheck size={12} className="text-cyan-300" /> : <Check size={12} />
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="p-6 bg-[#0a0a0a] border-t border-white/5 space-y-3">
                <AnimatePresence>
                  {replyTo && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col gap-1 p-3 bg-cyan-500/5 border-l-4 border-cyan-500 rounded-xl"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-cyan-500">Replying to</span>
                        <button onClick={() => setReplyTo(null)} className="text-gray-500 hover:text-white">
                          <X size={14} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 truncate">{replyTo.body}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSendMessage} className="flex items-center gap-3 max-w-6xl mx-auto relative">
                  <div className="relative" ref={emojiPickerRef}>
                    <button 
                      type="button" 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={cn(
                        "w-12 h-12 flex items-center justify-center transition-all bg-white/5 border border-white/5 rounded-xl",
                        showEmojiPicker ? "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" : "text-gray-600 hover:text-cyan-400"
                      )}
                    >
                      <Smile size={20} />
                    </button>
                    <AnimatePresence>
                      {showEmojiPicker && (
                        <motion.div 
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="absolute bottom-full left-0 mb-3 z-50 overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
                        >
                          <EmojiPicker 
                            theme={Theme.DARK}
                            onEmojiClick={handleEmojiClick}
                            lazyLoadEmojis={true}
                            width={300}
                            height={350}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="relative">
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileUpload} 
                    />
                    <button 
                      type="button" 
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "w-12 h-12 flex items-center justify-center transition-all bg-white/5 border border-white/5 rounded-xl",
                        isUploading ? "text-cyan-400" : "text-gray-600 hover:text-cyan-400"
                      )}
                    >
                      {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Paperclip size={20} />}
                    </button>
                  </div>

                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="flex-1 bg-black border border-white/10 rounded-xl py-4 px-6 outline-none focus:border-cyan-500/50 text-white placeholder:text-gray-800 font-bold shadow-inner text-sm"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onFocus={() => setShowEmojiPicker(false)}
                  />
                  <button 
                    type="submit" 
                    disabled={!newMessage.trim() || isUploading}
                    className="w-12 h-12 bg-cyan-500 text-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-cyan-500/30 font-black disabled:opacity-20 disabled:grayscale disabled:scale-100 flex items-center justify-center"
                  >
                    <Send size={20} fill="currentColor" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Floating Support Button */}
      <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3">
        {/* Support Options Popup */}
        <AnimatePresence>
          {showSupportOptions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-[#1a1a1a] backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl shadow-black/50 min-w-[200px] overflow-hidden"
            >
              {/* Header */}
              <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Support Options</span>
                <button 
                  onClick={() => setShowSupportOptions(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* WhatsApp Option */}
              <motion.button
                onClick={handleWhatsAppSupport}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-all duration-200 group"
              >
                <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center shrink-0">
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9uY7cpz03f282ot9udmEc8ech0KPCypmXPpoRVaGlCw&s"
                    alt="WhatsApp"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] font-bold text-white group-hover:text-[#25D366] transition-colors">WhatsApp Support</p>
                  <p className="text-[7px] text-gray-500 font-mono">Chat on WhatsApp</p>
                </div>
                <ChevronRight size={12} className="text-gray-600 group-hover:text-[#25D366] transition-colors" />
              </motion.button>

              {/* Web Support Option */}
              <motion.button
                onClick={handleWebSupport}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-all duration-200 group border-t border-white/5"
              >
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                  <Headphones size={16} className="text-cyan-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] font-bold text-white group-hover:text-cyan-400 transition-colors">Web Support Agent</p>
                  <p className="text-[7px] text-gray-500 font-mono">Chat with Web Agent</p>
                </div>
                <ChevronRight size={12} className="text-gray-600 group-hover:text-cyan-400 transition-colors" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Support Button */}
        <motion.button
          onClick={() => setShowSupportOptions(!showSupportOptions)}
          className="relative flex flex-col items-center justify-center group"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.5
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Glow Effect */}
          <div className={cn(
            "absolute inset-0 rounded-full blur-xl opacity-50 transition-opacity duration-300",
            showSupportOptions ? "bg-cyan-500 opacity-70" : "bg-[#25D366]"
          )} />
          
          {/* Icon Container */}
          <div className={cn(
            "relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
            showSupportOptions 
              ? "bg-cyan-500 shadow-cyan-500/30 group-hover:shadow-cyan-500/40" 
              : "bg-[#25D366] shadow-[#25D366]/30 group-hover:shadow-[#25D366]/40"
          )}>
            {showSupportOptions ? (
              <X size={24} className="text-white" />
            ) : (
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9uY7cpz03f282ot9udmEc8ech0KPCypmXPpoRVaGlCw&s"
                alt="Support"
                className="w-9 h-9 rounded-full object-cover"
              />
            )}
            
            {/* Notification Dot */}
            {!showSupportOptions && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black animate-pulse" />
            )}
          </div>
          
          {/* Support Text */}
          <motion.span 
            className="mt-1.5 text-[8px] font-black uppercase tracking-widest text-white/80 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/5"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {showSupportOptions ? "Close" : "Support"}
          </motion.span>
        </motion.button>
      </div>
    </>
  );
}
