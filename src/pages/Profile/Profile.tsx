import { useState, useEffect } from 'react';
import axios from 'axios';
import { api, BASE_URL } from '../../services/api';
import { User } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User as UserIcon, 
  Key, 
  Shield, 
  Trash2, 
  LogOut, 
  Copy, 
  Check, 
  Layout, 
  RefreshCcw,
  Smartphone,
  ChevronRight,
  ShieldAlert,
  Loader2,
  Eye,
  EyeOff,
  AlertTriangle,
  X,
  Headphones,
  Zap,
  MessageCircle,
  Radio,
  Users,
  Clock,
  Globe,
  Link as LinkIcon,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRevokeConfirmOpen, setIsRevokeConfirmOpen] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [showSupportOptions, setShowSupportOptions] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const WHATSAPP_NUMBER = '639079249283';
  const WEB_SUPPORT_URL = 'https://all-wine.vercel.app/#/support';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          api.get('/api/user/profile'),
          api.get('/api/user/stats')
        ]);
        setUser(profileRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCopyKey = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppSupport = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
    setShowSupportOptions(false);
  };

  const handleWebSupport = () => {
    window.open(WEB_SUPPORT_URL, '_blank');
    setShowSupportOptions(false);
  };

  const handleRevokeKey = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    
    try {
      setIsRevoking(true);
      const currentApiKey = localStorage.getItem('apiKey');
      
      const { data } = await axios.post(`${BASE_URL}/api/auth/revoke-api-key`, {}, {
        headers: { 
          'x-api-key': currentApiKey,
          'Content-Type': 'application/json'
        }
      });
      
      const newKey = data.newApiKey || data.apiKey || data.key || data.api_key || data.data?.newApiKey || data.data?.apiKey;
      
      if (newKey) {
        localStorage.setItem('apiKey', newKey);
        setUser(prev => prev ? { ...prev, apiKey: newKey } : null);
        setSuccessMessage('Access token successfully rotated.');
        setIsRevokeConfirmOpen(false);
        
        setTimeout(async () => {
          try {
            const profileRes = await api.get('/api/user/profile');
            setUser(profileRes.data);
          } catch (e) {
            console.error('Silent refresh failed:', e);
          }
        }, 1000);
      } else {
        throw new Error('Key rotation completed but no new key was returned.');
      }
    } catch (err: any) {
      console.error('Revoke failure:', err);
      const msg = err.response?.data?.error || err.response?.data?.message || err.message || 'Transmission failed';
      setErrorMessage(`Rotation Failed: ${msg}`);
    } finally {
      setIsRevoking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-cyan-500" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Loading profile...</p>
      </div>
    );
  }

  // Quick Stats
  const quickStats = [
    { label: 'Messages Sent', value: stats?.messagesSent || 0, icon: MessageCircle, color: 'text-cyan-400' },
    { label: 'Connected Devices', value: stats?.connectedDevices || 0, icon: Smartphone, color: 'text-emerald-400' },
    { label: 'API Requests', value: stats?.totalRequests || 0, icon: Activity, color: 'text-blue-400' },
    { label: 'Today\'s Usage', value: stats?.requestsToday || 0, icon: Zap, color: 'text-yellow-400' },
  ];

  return (
    <>
      <div className="space-y-8 pb-24">
        {/* Header with Profile */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden p-6 sm:p-10 rounded-[2rem] glow-card bg-gradient-to-br from-[#111] to-[#0a0a0a]"
        >
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-gradient-to-br from-cyan-500 to-blue-600 p-[3px] shadow-2xl shadow-cyan-500/20">
                  <div className="w-full h-full rounded-[1.8rem] bg-[#0a0a0a] flex items-center justify-center text-4xl md:text-5xl font-black text-white">
                    {user?.name?.[0] || 'U'}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter">
                    {user?.name || 'User'}
                  </h2>
                  <span className="text-[9px] font-black text-cyan-500 bg-cyan-500/10 px-3 py-1 rounded-full uppercase tracking-[0.2em] border border-cyan-500/20">
                    {user?.role || 'Developer'}
                  </span>
                </div>
                <p className="text-cyan-500/60 font-mono text-sm tracking-widest font-bold">
                  +{user?.phone || 'N/A'}
                </p>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">
                  Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Link
                  to="/tester"
                  className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl hover:bg-cyan-500/20 transition-all border border-cyan-500/20"
                >
                  <MessageCircle size={20} />
                </Link>
                <Link
                  to="/devices"
                  className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
                >
                  <Smartphone size={20} />
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {quickStats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-black/40 p-3 rounded-xl border border-white/5"
                >
                  <div className="flex items-center gap-2">
                    <stat.icon size={14} className={stat.color} />
                    <span className="text-[7px] text-gray-500 font-black uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <p className="text-lg font-black text-white mt-0.5">{stat.value.toLocaleString()}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]" />
        </motion.div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Send Message', icon: MessageCircle, path: '/tester', color: 'text-cyan-400' },
            { label: 'Bulk', icon: Users, path: '/bulk', color: 'text-blue-400' },
            { label: 'Webhooks', icon: Radio, path: '/webhooks', color: 'text-emerald-400' },
            { label: 'History', icon: Clock, path: '/history', color: 'text-yellow-400' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="bg-[#111] p-3 rounded-xl border border-white/5 flex flex-col items-center gap-1 hover:border-cyan-500/30 transition-all group"
            >
              <item.icon size={18} className={cn(item.color, "group-hover:scale-110 transition-transform")} />
              <span className="text-[7px] text-gray-500 font-black uppercase tracking-widest">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* API Credentials */}
        <div className="space-y-4">
          <h3 className="font-black text-xs uppercase tracking-[0.3em] text-gray-500 px-2 flex items-center gap-2">
            <Key size={14} className="text-cyan-500" /> API Credentials
          </h3>
          <div className="bg-[#0f0f0f] p-6 md:p-8 rounded-[2.5rem] border border-white/5 space-y-6 shadow-2xl">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2">
                <Shield size={14} className="text-cyan-500" /> Your Private Access Token
              </label>
              <div className="relative group">
                <input 
                  type={showKey ? "text" : "password"} 
                  readOnly 
                  value={user?.apiKey || 'No API Key'}
                  className="w-full bg-black border border-white/10 rounded-2xl py-4 md:py-5 pl-4 md:pl-6 pr-32 font-mono text-xs text-cyan-400 outline-none focus:border-cyan-500/30 transition-all"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button 
                    onClick={() => setShowKey(!showKey)}
                    className="p-2 md:p-3 text-gray-500 hover:text-white bg-white/5 rounded-xl transition-all"
                    title={showKey ? "Hide Secret" : "Show Secret"}
                  >
                    {showKey ? <EyeOff size={18} className="md:w-5 md:h-5" /> : <Eye size={18} className="md:w-5 md:h-5" />}
                  </button>
                  <button 
                    onClick={handleCopyKey}
                    className="p-2 md:p-3 text-cyan-500 hover:text-white bg-cyan-500/10 rounded-xl transition-all"
                  >
                    {copied ? <Check size={18} className="md:w-5 md:h-5" /> : <Copy size={18} className="md:w-5 md:h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
              {successMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-emerald-500 text-[10px] uppercase font-black tracking-widest flex items-center gap-3"
                >
                  <Check size={14} /> {successMessage}
                </motion.div>
              )}
              {errorMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-500 text-[10px] uppercase font-black tracking-widest flex items-center gap-3"
                >
                  <ShieldAlert size={14} /> {errorMessage}
                </motion.div>
              )}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-white font-bold text-sm tracking-tight">Regenerate Key</p>
                  <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mt-0.5">If your key is compromised, revoke it immediately.</p>
                </div>
                <button 
                  disabled={isRevoking || isLoading}
                  onClick={() => setIsRevokeConfirmOpen(true)}
                  className="py-3 px-6 bg-black border border-red-500/30 text-red-500 font-bold rounded-2xl hover:bg-red-500/10 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] shadow-lg disabled:opacity-50"
                >
                  {isRevoking ? <Loader2 size={14} className="animate-spin" /> : <ShieldAlert size={14} />}
                  {isRevoking ? "Rotating..." : "Rotate Access Key"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Preferences */}
        <div className="space-y-4">
          <h3 className="font-black text-xs uppercase tracking-[0.3em] text-gray-500 px-2 flex items-center gap-2">
            <Layout size={14} className="text-cyan-500" /> System Preferences
          </h3>
          <div className="grid gap-3">
            {[
              { label: 'Security & Access', icon: Shield, color: 'text-blue-400', path: '/security' },
              { label: 'Cloud Distribution', icon: Smartphone, color: 'text-purple-400', path: '/devices' },
              { label: 'Activity Streams', icon: RefreshCcw, color: 'text-cyan-400', path: '/history' },
              { label: 'API Documentation', icon: Globe, color: 'text-emerald-400', path: '/docs' },
            ].map(item => (
              <Link
                key={item.label}
                to={item.path}
                className="bg-[#111] p-4 md:p-6 rounded-[2rem] border border-white/5 flex items-center justify-between group transition-all hover:bg-white/[0.02] hover:border-cyan-500/20"
              >
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-2xl flex items-center justify-center", item.color)}>
                    <item.icon size={20} className="md:w-6 md:h-6" />
                  </div>
                  <span className="font-bold text-white text-sm md:text-lg tracking-tight">{item.label}</span>
                </div>
                <ChevronRight size={18} className="md:w-5 md:h-5 text-gray-700 group-hover:text-cyan-500 transition-all translate-x-0 group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-6 px-2 space-y-3">
          <div className="border-t border-red-500/10 pt-4">
            <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-red-500/50 mb-3 flex items-center gap-2">
              <AlertTriangle size={12} /> Danger Zone
            </h4>
            <button 
              onClick={() => { localStorage.clear(); window.location.href='/login'; }}
              className="w-full py-4 bg-[#111] border border-red-500/20 text-red-400 font-bold rounded-[2rem] hover:bg-red-500/5 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] shadow-xl"
            >
              <LogOut size={18} /> Terminate Sessions
            </button>
            <button 
              onClick={() => { if(confirm('Are you sure? This will delete all your data.')) { localStorage.clear(); window.location.href='/login'; } }}
              className="w-full py-3 text-gray-600 font-black text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:text-red-500 transition-colors mt-2"
            >
              <Trash2 size={14} /> Wipe Infrastructure
            </button>
          </div>
        </div>
      </div>

      {/* Revoke Confirmation Modal */}
      <AnimatePresence>
        {isRevokeConfirmOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isRevoking && setIsRevokeConfirmOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-transparent" />
              
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                  <AlertTriangle size={28} />
                </div>
                <button 
                  disabled={isRevoking}
                  onClick={() => setIsRevokeConfirmOpen(false)}
                  className="p-2 text-gray-500 hover:text-white transition-colors disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Cycle Security Token?</h4>
              <p className="text-gray-400 text-xs leading-relaxed uppercase font-bold tracking-widest opacity-60 mb-8">
                Your current API Key will be instantly terminated. All connected applications using this key will experience sudden disconnection.
              </p>

              {errorMessage && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] uppercase font-black tracking-widest">
                  {errorMessage}
                </div>
              )}

              <div className="flex gap-4">
                <button 
                  disabled={isRevoking}
                  onClick={() => setIsRevokeConfirmOpen(false)}
                  className="flex-1 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-[10px]"
                >
                  Abort
                </button>
                <button 
                  disabled={isRevoking}
                  onClick={handleRevokeKey}
                  className="flex-1 py-4 bg-red-500 text-white font-black rounded-2xl hover:bg-red-600 transition-all uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                >
                  {isRevoking && <Loader2 size={12} className="animate-spin" />}
                  Confirm Cycle
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Support Options</span>
                <button 
                  onClick={() => setShowSupportOptions(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

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
          <div className={cn(
            "absolute inset-0 rounded-full blur-xl opacity-50 transition-opacity duration-300",
            showSupportOptions ? "bg-cyan-500 opacity-70" : "bg-[#25D366]"
          )} />
          
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
            
            {!showSupportOptions && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black animate-pulse" />
            )}
          </div>
          
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
