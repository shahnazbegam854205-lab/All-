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
  X
} from 'lucide-react';
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

  const fetchDevices = async () => {
    try {
      const { data } = await api.get('/api/devices');
      setDevices(data.devices);
    } catch (err) {
      console.error('Fetch devices failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 10000);
    return () => clearInterval(interval);
  }, []);

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
      console.log('Initiating delete for device:', id);
      await api.delete(`/api/devices/${id}`);
      await fetchDevices();
    } catch (err: any) {
      console.error('Delete failed:', err);
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
      console.error('Logout failed:', err);
      const msg = err.response?.data?.error || err.message;
      alert(`LOGOUT ERROR: ${msg}`);
    } finally {
      setLoggingOutId(null);
    }
  };
  
  const handleReconnect = async (device: Device) => {
    // If the device has a specific reconnect API, we call it.
    // Otherwise, we open the add modal with pre-filled name and ask for QR/Pair but reuse the name.
    if (!device.name) return;
    
    setNewDeviceName(device.name);
    setIsAdding(true);
    setConnectType(null); // Force user to choose QR or Pair for the same device name
    setConnectionResult(null);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-3xl font-black text-white tracking-widest uppercase">
          Service<span className="text-cyan-500"> Nodes</span>
        </h2>
        <button 
          onClick={() => {
            setNewDeviceName('');
            setConnectType(null);
            setConnectionResult(null);
            setIsAdding(true);
          }}
          className="glow-button flex items-center gap-2 text-[10px] sm:text-sm py-3 px-6 w-full sm:w-auto justify-center"
        >
          <Plus size={18} /> Add New Node
        </button>
      </div>

      <div className="grid gap-3 sm:gap-4">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-28 bg-white/5 rounded-[2rem] animate-pulse" />)
        ) : devices.length === 0 ? (
          <div className="text-center py-20 glow-card rounded-[2.5rem]">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="text-slate-700" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">No Active Nodes</h3>
            <p className="text-slate-500 mb-6 text-sm">Deploy an API node to begin transmission protocols.</p>
            <button onClick={() => setIsAdding(true)} className="glow-button px-8">Initialize Node</button>
          </div>
        ) : (
          devices.map((device) => (
            <motion.div 
              layout
              key={device.deviceId}
              className="glow-card p-4 sm:p-6 rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center border border-white/5 text-brand-primary">
                    {device.status === 'connected' ? <Smartphone size={24} className="sm:w-7 sm:h-7" /> : <RefreshCcw className="animate-spin text-slate-500" size={20} />}
                  </div>
                  <Circle 
                    size={10} 
                    fill={device.status === 'connected' ? 'var(--color-brand-primary)' : '#64748b'} 
                    className={cn(
                      "absolute -top-1 -right-1",
                      device.status === 'connected' && "glow-text"
                    )}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-base sm:text-lg truncate">{device.name}</h4>
                  <p className="text-[9px] sm:text-[10px] font-mono text-cyan-500/60 font-bold uppercase tracking-widest mt-0.5 truncate">ID: {device.deviceId}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className={cn(
                      "text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                      device.status === 'connected' ? 'bg-cyan-500/10 text-cyan-500' : 'bg-slate-800 text-slate-500'
                    )}>
                      {device.status.replace('_', ' ')}
                    </span>
                    {device.phone && <span className="text-slate-600 font-mono text-[10px] sm:text-xs font-bold tracking-tighter">+{device.phone}</span>}
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
              
              <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-6">
                <Trash2 size={24} />
              </div>

              <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Discard Node?</h4>
              <p className="text-gray-400 text-[10px] leading-relaxed uppercase font-bold tracking-widest opacity-60 mb-8">
                This will permanently dismantle this transmission node and terminate all active sessions. This action is irreversible.
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
                  {deletingId ? "Dismantling..." : "Dismantle"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white"
              >
                <X size={24} />
              </button>

              <h3 className="text-2xl font-bold mb-6 text-center">Connect New Device</h3>

              {!connectionResult ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Device Name</label>
                    <input 
                      type="text" 
                      placeholder="My Business WA"
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 px-5 outline-none focus:border-brand-primary/50 transition-all"
                      value={newDeviceName}
                      onChange={(e) => setNewDeviceName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setConnectType('qr')}
                      className={cn(
                        "p-6 border rounded-3xl flex flex-col items-center gap-3 transition-all",
                        connectType === 'qr' ? "border-brand-primary bg-brand-primary/5" : "border-white/5 bg-slate-900"
                      )}
                    >
                      <QrCode size={32} />
                      <span className="font-bold">QR Code</span>
                    </button>
                    <button 
                      onClick={() => setConnectType('pair')}
                      className={cn(
                        "p-6 border rounded-3xl flex flex-col items-center gap-3 transition-all",
                        connectType === 'pair' ? "border-brand-primary bg-brand-primary/5" : "border-white/5 bg-slate-900"
                      )}
                    >
                      <LinkIcon size={32} />
                      <span className="font-bold">Pairing Code</span>
                    </button>
                  </div>

                  {connectType === 'pair' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number (with code)</label>
                      <input 
                        type="text" 
                        placeholder="919876543210"
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 px-5 outline-none focus:border-brand-primary/50 transition-all"
                        value={pairPhone}
                        onChange={(e) => setPairPhone(e.target.value)}
                      />
                    </motion.div>
                  )}

                  <button 
                    disabled={!newDeviceName || !connectType || (connectType === 'pair' && !pairPhone) || isGenerating}
                    onClick={handleCreateDevice}
                    className="w-full glow-button py-4 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? <Loader2 className="animate-spin" /> : "Start Connection"}
                  </button>
                </div>
              ) : (
                <div className="text-center py-10">
                  {connectionResult.qrCode ? (
                    <div className="space-y-6">
                      <div className="w-64 h-64 mx-auto p-4 bg-white rounded-3xl">
                        <img src={connectionResult.qrCode} alt="QR Code" className="w-full h-full" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Scan this QR in WhatsApp</p>
                        <p className="text-slate-400 text-sm italic mt-2">Settings → Linked Devices → Link a Device</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-slate-950 p-4 sm:p-8 rounded-[2rem] border border-brand-primary/30 w-full max-w-sm mx-auto shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                        <span className="text-3xl sm:text-5xl font-mono font-black tracking-[0.1em] sm:tracking-[0.2em] text-brand-primary glow-text break-all block py-2">
                          {connectionResult.pairingCode}
                        </span>
                      </div>
                      <div className="px-2">
                        <p className="font-black text-xs uppercase tracking-[0.2em] text-white">Enter code in WhatsApp</p>
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-2 bg-white/5 py-2 px-4 rounded-lg inline-block">
                          Settings → Linked Devices → Link with Phone Number
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-10 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-3 text-left">
                    <Loader2 className="animate-spin text-blue-400 shrink-0" />
                    <p className="text-xs text-blue-200">Waiting for device to connect. Don't close this window.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
