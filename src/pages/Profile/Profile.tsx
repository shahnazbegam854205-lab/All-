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
  X
} from 'lucide-react';
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

  const [showKey, setShowKey] = useState(false);

  const handleCopyKey = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        
        // Refresh profile data silently
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

  if (isLoading) return <div className="h-64 flex items-center justify-center"><RefreshCcw className="animate-spin text-brand-primary" /></div>;

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col items-center justify-center p-12 bg-[#111] rounded-[3rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-6 right-6">
          <span className="text-[10px] font-black text-cyan-500 bg-cyan-500/10 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-cyan-500/20">
            {user?.role || 'Developer'}
          </span>
        </div>
        
        <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-cyan-500 to-blue-600 p-[3px] mb-6 shadow-2xl shadow-cyan-500/20">
          <div className="w-full h-full rounded-[2.4rem] bg-[#0a0a0a] flex items-center justify-center text-5xl font-black text-white">
            {user?.name[0]}
          </div>
        </div>
        <h2 className="text-3xl font-black text-white tracking-tighter">{user?.name}</h2>
        <p className="text-cyan-500/60 font-mono text-sm mt-1 tracking-widest font-bold">+{user?.phone}</p>
        
        <div className="grid grid-cols-3 gap-12 mt-12 w-full max-w-md border-t border-white/5 pt-10">
          <div className="text-center">
            <p className="text-2xl font-black text-white tracking-tighter">{stats?.connectedDevices || 0}</p>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Nodes</p>
          </div>
          <div className="text-center border-x border-white/5">
            <p className="text-2xl font-black text-white tracking-tighter">{stats?.messagesSent || 0}</p>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Traffic</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-emerald-400 tracking-tighter">Spark</p>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">Status</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="font-black text-xs uppercase tracking-[0.3em] text-gray-500 px-4">
          API Credentials
        </h3>
        <div className="bg-[#0f0f0f] p-8 rounded-[2.5rem] border border-white/5 space-y-8 shadow-2xl">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Your Private Access Token</label>
            <div className="relative group">
              <input 
                type={showKey ? "text" : "password"} 
                readOnly 
                value={user?.apiKey}
                className="w-full bg-black border border-white/10 rounded-2xl py-5 pl-6 pr-32 font-mono text-xs text-cyan-400 outline-none focus:border-cyan-500/30 transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button 
                  onClick={() => setShowKey(!showKey)}
                  className="p-3 text-gray-500 hover:text-white bg-white/5 rounded-xl transition-all"
                  title={showKey ? "Hide Secret" : "Show Secret"}
                >
                  {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <button 
                  onClick={handleCopyKey}
                  className="p-3 text-cyan-500 hover:text-white bg-cyan-500/10 rounded-xl transition-all"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-4">
            {successMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-emerald-500 text-[10px] uppercase font-black tracking-widest flex items-center gap-3">
                <Check size={14} /> {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-500 text-[10px] uppercase font-black tracking-widest flex items-center gap-3">
                <ShieldAlert size={14} /> {errorMessage}
              </div>
            )}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-white font-bold text-sm tracking-tight">Regenerate Key</p>
                <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mt-1">If your key is compromised, revoke it immediately.</p>
              </div>
              <button 
                disabled={isRevoking || isLoading}
                onClick={() => setIsRevokeConfirmOpen(true)}
                className="py-3 px-8 bg-black border border-red-500/30 text-red-500 font-bold rounded-2xl hover:bg-red-500/10 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] shadow-lg disabled:opacity-50"
              >
                {isRevoking ? <Loader2 size={14} className="animate-spin" /> : <ShieldAlert size={14} />}
                {isRevoking ? "Rotating..." : "Rotate Access Key"}
              </button>
            </div>
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
                <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                  <AlertTriangle size={24} />
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

      <div className="space-y-6">
        <h3 className="font-black text-xs uppercase tracking-[0.3em] text-gray-500 px-4">
          System Preferences
        </h3>
        <div className="grid gap-4">
          {[
            { label: 'Security & Access', icon: Shield, color: 'text-blue-400', path: '/security' },
            { label: 'Cloud Distribution', icon: Smartphone, color: 'text-purple-400', path: '/devices' },
            { label: 'Activity Streams', icon: RefreshCcw, color: 'text-cyan-400', path: '/history' },
          ].map(item => (
            <button 
              key={item.label}
              className="bg-[#111] p-6 rounded-[2rem] border border-white/5 flex items-center justify-between group transition-all hover:bg-white/[0.02]"
            >
              <div className="flex items-center gap-5">
                <div className={cn("w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-bold", item.color)}>
                  <item.icon size={24} />
                </div>
                <span className="font-bold text-white text-lg tracking-tight">{item.label}</span>
              </div>
              <ChevronRight size={20} className="text-gray-700 group-hover:text-cyan-500 transition-all translate-x-0 group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </div>

      <div className="pt-10 px-4 space-y-4">
        <button 
          onClick={() => { localStorage.clear(); window.location.href='/login'; }}
          className="w-full py-5 bg-[#111] border border-red-500/20 text-red-500 font-bold rounded-[2rem] hover:bg-red-500/5 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs shadow-xl"
        >
          <LogOut size={20} /> Terminate Sessions
        </button>
        <button className="w-full py-4 text-gray-700 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:text-red-900 transition-colors">
          <Trash2 size={14} /> Wipe Infrastructure
        </button>
      </div>
    </div>
  );
}
