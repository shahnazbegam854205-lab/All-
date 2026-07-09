import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Device } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, 
  Plus, 
  Trash2, 
  LogOut, 
  RefreshCcw, 
  QrCode, 
  Link as LinkIcon,
  Circle,
  Loader2,
  X,
  Headphones,
  ChevronRight,
  Zap,
  ShieldCheck,
  Radio,
  MessageCircle,
  TrendingUp,
  Users,
  Clock,
  Check,
  Copy
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [connectType, setConnectType] = useState<'qr' | 'pair' | null>(null);
  const [pairPhone, setPairPhone] = useState('');
  const [connectionResult, setConnectionResult] = useState<{ qrCode?: string; pairingCode?: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loggingOutId, setLoggingOutId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showSupportOptions, setShowSupportOptions] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const WHATSAPP_NUMBER = '639079249283';
  const WEB_SUPPORT_URL = 'https://all-wine.vercel.app/#/support';

  const fetchDevices = async () => {
    try {
      const [devicesRes, statsRes] = await Promise.all([
        api.get('/api/devices'),
        api.get('/api/user/stats')
      ]);
      setDevices(devicesRes.data.devices || []);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 10000);
    return () => clearInterval(interval);
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

  const handleCreateDevice = async () => {
    if (!newDeviceName || !connectType) return;
    setIsGenerating(true);
    try {
      if (connectType === 'qr') {
        const { data } = await api.post('/api/devices/connect/qr', { deviceName: newDeviceName });
        setConnectionResult({ qrCode: data.qrCode });
      } else {
        const { data } = await api.post('/api/devices/connect/pair', { 
          deviceName: newDeviceName, 
          phoneNumber: pairPhone 
        });
        setConnectionResult({ pairingCode: data.pairingCode });
      }
      fetchDevices();
    } catch (err) {
      alert('Failed to initialize device');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async () => {
    const id = confirmDeleteId;
    if (!id) return;
    
    try {
      setDeletingId(id);
      setConfirmDeleteId(null);
      await api.delete(`/api/devices/${id}`);
      await fetchDevices();
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message;
      alert(`DELETE ERROR: ${msg}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async (id: string) => {
    if (!id) return;
    try {
      setLoggingOutId(id);
      await api.post(`/api/devices/${id}/logout`);
      await fetchDevices();
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message;
      alert(`LOGOUT ERROR: ${msg}`);
    } finally {
      setLoggingOutId(null);
    }
  };
  
  const handleReconnect = async (device: Device) => {
    setNewDeviceName(device.name || '');
    setIsAdding(true);
    setConnectType(null);
    setConnectionResult(null);
  };

  // Quick Stats
  const quickStats = [
    { label: 'Total Devices', value: devices.length, icon: Smartphone, color: 'text-cyan-400' },
    { label: 'Connected', value: devices.filter(d => d.status === 'connected').length, icon: Circle, color: 'text-emerald-400' },
    { label: 'Today\'s Usage', value: stats?.requestsToday || 0, icon: Zap, color: 'text-yellow-400' },
  ];

  return (
    <>
      <div className="space-y-6 pb-20">
        {/* Header with Stats */}
        <div className="relative overflow-hidden p-6 sm:p-10 rounded-[2rem] glow-card bg-gradient-to-br from-[#111] to-[#0a0a0a]">
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-widest uppercase">
                  My<span className="text-cyan-500"> Devices</span>
                </h2>
                <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">
                  Manage your WhatsApp devices and connections
                </p>
              </div>
              <button 
                onClick={() => {
                  setNewDeviceName('');
                  setConnectType(null);
                  setConnectionResult(null);
                  setIsAdding(true);
                }}
                className="glow-button flex items-center gap-2 text-[10px] sm:text-sm py-3 px-6 w-full sm:w-auto justify-center"
              >
                <Plus size={18} /> Add Device
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {quickStats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-black/40 p-3 rounded-xl border border-white/5"
                >
                  <div className="flex items-center gap-2">
                    <stat.icon size={14} className={stat.color} />
                    <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <p className="text-xl font-black text-white mt-0.5">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]" />
        </div>

        {/* Quick Actions */}
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

        {/* Devices List */}
        <div className="grid gap-3 sm:gap-4">
          {isLoading ? (
            [1, 2, 3].map(i => <div key={i} className="h-28 bg-white/5 rounded-[2rem] animate-pulse" />)
          ) : devices.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 glow-card rounded-[2.5rem]"
            >
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="text-slate-700" size={40} />
              </div>
              <h3 className="text-2xl font-black mb-2 text-white">No Devices Added</h3>
              <p className="text-slate-500 mb-6 text-sm font-bold uppercase tracking-widest">Connect a WhatsApp device to start sending messages.</p>
              <button onClick={() => setIsAdding(true)} className="glow-button px-8 py-3 text-sm">
                <Plus size={18} className="mr-2" /> Connect Device
              </button>
            </motion.div>
          ) : (
            devices.map((device, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={device.deviceId}
                className="glow-card p-4 sm:p-6 rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-cyan-500/20 transition-all"
              >
                <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
                  <div className="relative shrink-0">
                    <div className={cn(
                      "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border",
                      device.status === 'connected' 
                        ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" 
                        : "bg-slate-800/50 border-white/5 text-slate-500"
                    )}>
                      {device.status === 'connected' ? (
                        <Smartphone size={24} className="sm:w-7 sm:h-7" />
                      ) : (
                        <RefreshCcw className="animate-spin" size={20} />
                      )}
                    </div>
                    <div className={cn(
                      "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-black",
                      device.status === 'connected' ? "bg-emerald-500 animate-pulse" : "bg-slate-600"
                    )} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-base sm:text-lg text-white truncate">{device.name || 'Unnamed Device'}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[9px] sm:text-[10px] font-mono text-cyan-500/60 font-bold uppercase tracking-widest truncate max-w-[120px]">
                        ID: {device.deviceId}
                      </p>
                      <button 
                        onClick={() => handleCopy(device.deviceId)}
                        className="text-gray-600 hover:text-cyan-500 transition-colors"
                      >
                        {copiedId === device.deviceId ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={cn(
                        "text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                        device.status === 'connected' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-slate-800 text-slate-500'
                      )}>
                        {device.status.replace('_', ' ')}
                      </span>
                      {device.phone && (
                        <span className="text-slate-600 font-mono text-[10px] sm:text-xs font-bold tracking-tighter">
                          +{device.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t border-white/5 sm:border-0 pt-3 sm:pt-0">
                  <div className="flex gap-2">
                    {(device.status === 'disconnected' || device.status === 'auth_failed') && (
                      <button 
                        onClick={() => handleReconnect(device)}
                        className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl hover:bg-cyan-500/20 transition-colors"
                        title="Reconnect"
                      >
                        <RefreshCcw size={18} />
                      </button>
                    )}
                    {device.status === 'connected' && (
                      <button 
                        disabled={!!loggingOutId || !!deletingId}
                        onClick={() => handleLogout(device.deviceId)}
                        className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        title="Logout"
                      >
                        {loggingOutId === device.deviceId ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
                      </button>
                    )}
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      disabled={!!loggingOutId || !!deletingId}
                      onClick={() => setConfirmDeleteId(device.deviceId)}
                      className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50 relative z-10"
                      title="Delete Device"
                    >
                      {deletingId === device.deviceId ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDeleteId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-transparent" />
              
              <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-6">
                <Trash2 size={28} />
              </div>

              <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Remove Device?</h4>
              <p className="text-gray-400 text-[10px] leading-relaxed uppercase font-bold tracking-widest opacity-60 mb-8">
                This will permanently delete this device and logout from all active sessions. This action cannot be undone.
              </p>

              <div className="flex gap-4">
                <button 
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </button>
                <button 
                  disabled={!!deletingId}
                  onClick={handleDelete}
                  className="flex-1 py-4 bg-red-500 text-white font-black rounded-2xl hover:bg-red-600 transition-all uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                >
                  {deletingId && <Loader2 size={12} className="animate-spin" />}
                  {deletingId ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Device Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg glow-card p-8 rounded-[2.5rem] relative"
            >
              <button 
                onClick={() => { setIsAdding(false); setConnectionResult(null); }}
                className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h3 className="text-2xl font-bold mb-6 text-center text-white">Connect New Device</h3>

              {!connectionResult ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Device Name</label>
                    <input 
                      type="text" 
                      placeholder="My Business WA"
                      className="w-full bg-black border border-white/10 rounded-2xl py-4 px-5 outline-none focus:border-cyan-500/50 transition-all text-white font-medium"
                      value={newDeviceName}
                      onChange={(e) => setNewDeviceName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setConnectType('qr')}
                      className={cn(
                        "p-6 border rounded-3xl flex flex-col items-center gap-3 transition-all",
                        connectType === 'qr' ? "border-cyan-500 bg-cyan-500/10" : "border-white/5 bg-black/40 hover:bg-white/5"
                      )}
                    >
                      <QrCode size={32} className={connectType === 'qr' ? "text-cyan-400" : "text-slate-500"} />
                      <span className="font-bold text-sm">QR Code</span>
                    </button>
                    <button 
                      onClick={() => setConnectType('pair')}
                      className={cn(
                        "p-6 border rounded-3xl flex flex-col items-center gap-3 transition-all",
                        connectType === 'pair' ? "border-cyan-500 bg-cyan-500/10" : "border-white/5 bg-black/40 hover:bg-white/5"
                      )}
                    >
                      <LinkIcon size={32} className={connectType === 'pair' ? "text-cyan-400" : "text-slate-500"} />
                      <span className="font-bold text-sm">Pairing Code</span>
                    </button>
                  </div>

                  {connectType === 'pair' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number (with code)</label>
                      <input 
                        type="text" 
                        placeholder="919876543210"
                        className="w-full bg-black border border-white/10 rounded-2xl py-4 px-5 outline-none focus:border-cyan-500/50 transition-all text-white font-medium"
                        value={pairPhone}
                        onChange={(e) => setPairPhone(e.target.value)}
                      />
                    </motion.div>
                  )}

                  <button 
                    disabled={!newDeviceName || !connectType || (connectType === 'pair' && !pairPhone) || isGenerating}
                    onClick={handleCreateDevice}
                    className="w-full glow-button py-4 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {isGenerating ? <Loader2 className="animate-spin" /> : "Start Connection"}
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  {connectionResult.qrCode ? (
                    <div className="space-y-6">
                      <div className="w-64 h-64 mx-auto p-4 bg-white rounded-3xl shadow-2xl">
                        <img src={connectionResult.qrCode} alt="QR Code" className="w-full h-full" />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-white">Scan this QR in WhatsApp</p>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
                          Settings → Linked Devices → Link a Device
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-black p-6 rounded-[2rem] border border-cyan-500/30 w-full max-w-sm mx-auto shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                        <span className="text-3xl sm:text-4xl font-mono font-black tracking-[0.2em] text-cyan-400 glow-text break-all block py-2">
                          {connectionResult.pairingCode}
                        </span>
                      </div>
                      <div>
                        <p className="font-black text-xs uppercase tracking-[0.2em] text-white">Enter code in WhatsApp</p>
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-2 bg-white/5 py-2 px-4 rounded-lg inline-block">
                          Settings → Linked Devices → Link with Phone Number
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-3 text-left">
                    <Loader2 className="animate-spin text-blue-400 shrink-0" />
                    <p className="text-xs text-blue-200 font-medium">Waiting for device to connect. Don't close this window.</p>
                  </div>
                </div>
              )}
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
