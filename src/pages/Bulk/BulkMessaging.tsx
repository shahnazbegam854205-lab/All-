import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Device } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Send, 
  Image as ImageIcon, 
  Clock, 
  FileText, 
  AlertTriangle,
  Loader2,
  CheckCircle2,
  ListRestart,
  ChevronLeft,
  Smartphone,
  TrendingUp,
  Zap,
  ShieldCheck,
  Radio,
  MessageCircle,
  Headphones,
  X,
  ChevronRight,
  ArrowUpRight,
  Copy,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function BulkMessaging() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [numbersText, setNumbersText] = useState('');
  const [message, setMessage] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mode, setMode] = useState<'text' | 'image' | 'document'>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showSupportOptions, setShowSupportOptions] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  const WHATSAPP_NUMBER = '639079249283';
  const WEB_SUPPORT_URL = 'https://all-wine.vercel.app/#/support';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [devicesRes, statsRes] = await Promise.all([
          api.get('/api/devices'),
          api.get('/api/user/stats')
        ]);
        
        const active = devicesRes.data.devices || [];
        setDevices(active);
        if (active.length > 0) setSelectedDevice(active[0].deviceId);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };
    fetchData();
  }, []);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleWhatsAppSupport = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
    setShowSupportOptions(false);
  };

  const handleWebSupport = () => {
    window.open(WEB_SUPPORT_URL, '_blank');
    setShowSupportOptions(false);
  };

  const handleBulkSend = async () => {
    if (!selectedDevice || !numbersText) return;
    
    const numbers = numbersText.split('\n').map(n => n.trim()).filter(n => n.length > 0);
    setIsLoading(true);
    setResult(null);

    try {
      let endpoint = '/api/send/bulk';
      let payload: any = { deviceId: selectedDevice, numbers, message };

      if (mode === 'image') {
        endpoint = '/api/send/bulk-image-url';
        payload = { ...payload, imageUrl: mediaUrl, caption: message };
      } else if (mode === 'document') {
        endpoint = '/api/send/bulk-document';
        payload = { ...payload, documentUrl: mediaUrl, filename: 'Attachment' };
      }

      const { data } = await api.post(endpoint, payload);
      setResult(data);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Campaign initiation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Stats
  const quickStats = [
    { label: 'Total Sent', value: stats?.messagesSent || 0, icon: Send, color: 'text-cyan-400' },
    { label: 'Today\'s Usage', value: stats?.requestsToday || 0, icon: Zap, color: 'text-yellow-400' },
    { label: 'Connected Devices', value: devices.length, icon: Smartphone, color: 'text-emerald-400' },
  ];

  return (
    <>
      <div className="space-y-8 pb-20">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden p-6 sm:p-10 rounded-[2rem] glow-card bg-gradient-to-br from-[#111] to-[#0a0a0a]"
        >
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black text-white tracking-widest uppercase">
                  Bulk<span className="text-cyan-500"> Messages</span>
                </h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
                  Send messages to many people at once. 🚀
                </p>
              </div>
              
              <div className="flex bg-[#111] border border-white/5 p-1.5 rounded-2xl shadow-xl overflow-x-auto scroller-hide">
                {[
                  { id: 'text', label: 'Plain Text', icon: FileText },
                  { id: 'image', label: 'Send Images', icon: ImageIcon },
                  { id: 'document', label: 'Send Files', icon: Send }
                ].map((m) => (
                  <button 
                    key={m.id}
                    onClick={() => setMode(m.id as any)}
                    className={cn(
                      "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap",
                      mode === m.id ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" : "text-gray-500 hover:text-white"
                    )}
                  >
                    <m.icon size={12} />
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]" />
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          {quickStats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glow-card p-4 rounded-2xl flex items-center gap-4"
            >
              <div className={`w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-xl font-bold font-mono text-white">{stat.value}</p>
                <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#111] p-6 sm:p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8"
            >
              {/* Device Selection */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] flex items-center gap-2">
                    <Smartphone size={14} className="text-cyan-500" /> Select Device
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500" size={18} />
                    <select 
                      className="w-full bg-black border border-white/10 rounded-2xl py-5 pl-14 pr-10 outline-none focus:border-cyan-500 appearance-none font-bold text-white transition-all shadow-inner text-sm"
                      value={selectedDevice}
                      onChange={(e) => setSelectedDevice(e.target.value)}
                    >
                      {devices.map(d => (
                        <option key={d.deviceId} value={d.deviceId}>{d.name} ({d.phone})</option>
                      ))}
                    </select>
                    <ChevronLeft className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none rotate-270" size={18} />
                  </div>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] flex items-center gap-2">
                    <Users size={14} className="text-cyan-500" /> Phone Numbers
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-cyan-500/50 uppercase tracking-widest">One per line</span>
                    <div className="w-1.5 h-1.5 bg-cyan-500/50 rounded-full animate-pulse" />
                  </div>
                </div>
                <textarea 
                  placeholder="919876543210&#10;919876543211&#10;919876543212"
                  className="w-full bg-black border border-white/5 rounded-[2rem] p-6 h-48 outline-none focus:border-cyan-500/50 text-sm font-mono leading-relaxed custom-scrollbar resize-none text-cyan-400 placeholder:text-gray-800 shadow-inner"
                  value={numbersText}
                  onChange={(e) => setNumbersText(e.target.value)}
                />
                <p className="text-[8px] text-gray-600 px-2">
                  {numbersText.split('\n').filter(n => n.trim()).length} numbers added
                </p>
              </div>

              {/* Media URL */}
              {mode !== 'text' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="space-y-3"
                >
                  <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] flex items-center gap-2">
                    {mode === 'image' ? <ImageIcon size={14} className="text-cyan-500" /> : <FileText size={14} className="text-cyan-500" />}
                    Media URL
                  </label>
                  <input 
                    type="text" 
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-black border border-white/10 rounded-2xl py-5 px-8 outline-none focus:border-cyan-500/50 text-sm text-white font-bold transition-all shadow-inner placeholder:text-gray-800"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                  />
                </motion.div>
              )}

              {/* Message Content */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] flex items-center gap-2">
                  <FileText size={14} className="text-cyan-500" /> Message Content
                </label>
                <textarea 
                  placeholder="Type your message here..."
                  className="w-full bg-black border border-white/5 rounded-[2rem] p-6 h-40 outline-none focus:border-cyan-500/50 text-sm leading-relaxed custom-scrollbar resize-none text-white font-medium shadow-inner placeholder:text-gray-800"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <p className="text-[8px] text-gray-600 px-2 text-right">
                  {message.length} characters
                </p>
              </div>

              {/* Send Button */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading || !selectedDevice}
                onClick={handleBulkSend}
                className="glow-button w-full py-6 text-sm font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Sending Campaign...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Start Sending
                  </>
                )}
              </motion.button>

              {/* Result */}
              <AnimatePresence>
                {result && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[2rem] shadow-2xl"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle2 className="text-emerald-500" size={20} />
                      <h3 className="font-black uppercase text-xs tracking-widest text-emerald-400">Campaign Started Successfully!</h3>
                    </div>
                    <pre className="text-[10px] font-mono text-emerald-500/70 overflow-x-auto bg-black/30 p-4 rounded-xl">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <AlertTriangle size={80} />
              </div>
              <h3 className="font-black text-xs uppercase tracking-widest text-cyan-500 mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-cyan-500" /> Pro Tips
              </h3>
              <ul className="space-y-6">
                {[
                  { title: 'Sending Limit', desc: 'Avoid sending more than 500 messages at once.' },
                  { title: 'Message Variety', desc: 'Use different text templates to avoid being blocked.' },
                  { title: 'Safe Sending', desc: 'Space out your messages for better results.' }
                ].map((tip, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 group/item"
                  >
                    <div className="font-mono text-[10px] text-cyan-500/30 font-black">0{idx + 1}</div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-white tracking-widest mb-1 group-hover/item:text-cyan-400 transition-colors">{tip.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{tip.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#111] p-6 rounded-[2.5rem] border border-white/5"
            >
              <h3 className="font-black text-[10px] uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                <Zap size={14} className="text-yellow-500" /> Quick Actions
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'View History', icon: Clock, path: '/history', color: 'text-blue-400' },
                  { label: 'Webhooks', icon: Radio, path: '/webhooks', color: 'text-emerald-400' },
                  { label: 'Devices', icon: Smartphone, path: '/devices', color: 'text-cyan-400' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={16} className={item.color} />
                      <span className="text-[10px] font-bold text-white group-hover:text-cyan-400 transition-colors">{item.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-gray-600 group-hover:text-cyan-400 transition-colors" />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Usage Stats */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#111] p-6 rounded-[2.5rem] border border-white/5"
            >
              <h3 className="font-black text-[10px] uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                <TrendingUp size={14} className="text-cyan-500" /> Today's Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-black/50 rounded-xl">
                  <span className="text-[9px] font-bold text-gray-400">Messages Sent</span>
                  <span className="text-sm font-black text-cyan-400">{stats?.messagesSent || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/50 rounded-xl">
                  <span className="text-[9px] font-bold text-gray-400">API Requests</span>
                  <span className="text-sm font-black text-blue-400">{stats?.totalRequests || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/50 rounded-xl">
                  <span className="text-[9px] font-bold text-gray-400">Active Devices</span>
                  <span className="text-sm font-black text-emerald-400">{devices.length}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Support Button - Same as Dashboard */}
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
