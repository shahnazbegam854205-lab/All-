import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Device } from '../../types';
import { motion } from 'framer-motion';
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
  Smartphone
} from 'lucide-react';
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

  useEffect(() => {
    api.get('/api/devices').then(({ data }) => {
      const active = data.devices || [];
      setDevices(active);
      if (active.length > 0) setSelectedDevice(active[0].deviceId);
    });
  }, []);

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
        endpoint = '/api/send/document'; // Fallback for bulk document if needed, or stick to bulk text
        // Note: The provided list doesn't show a bulk-document URL endpoint specifically, 
        // but we'll follow the pattern or use standard send if it's one by one or as the API allows.
        // For now, aligning with the primary bulk endpoints.
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

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-widest uppercase">Happy Own<span className="text-cyan-500"> Service</span> Broadcast</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Mass distribution control center.</p>
        </div>
        <div className="flex bg-[#111] border border-white/5 p-1.5 rounded-2xl shadow-xl overflow-x-auto scroller-hide">
          {[
            { id: 'text', label: 'Plain Text', icon: FileText },
            { id: 'image', label: 'Image Burst', icon: ImageIcon },
            { id: 'document', label: 'Docs/PDF', icon: Send }
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

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#111] p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em]">source node</label>
                <div className="relative">
                  <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500" size={18} />
                  <select 
                    className="w-full bg-black border border-white/10 rounded-2xl py-5 pl-14 pr-10 outline-none focus:border-cyan-500 appearance-none font-bold text-white transition-all shadow-inner"
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

            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em]">recipients payload</label>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-cyan-500/50 uppercase tracking-widest">EOL Limited</span>
                  <div className="w-1.5 h-1.5 bg-cyan-500/50 rounded-full animate-pulse" />
                </div>
              </div>
              <textarea 
                placeholder="919876543210&#10;919876543211"
                className="w-full bg-black border border-white/5 rounded-[2rem] p-8 h-48 outline-none focus:border-cyan-500/50 text-sm font-mono leading-relaxed custom-scrollbar resize-none text-cyan-400 placeholder:text-gray-800 shadow-inner"
                value={numbersText}
                onChange={(e) => setNumbersText(e.target.value)}
              />
            </div>

            {mode !== 'text' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em]">Media Asset Resource (URL)</label>
                <input 
                  type="text" 
                  placeholder="https://content.delivery/asset.jpg"
                  className="w-full bg-black border border-white/10 rounded-2xl py-5 px-8 outline-none focus:border-cyan-500/50 text-sm text-white font-bold transition-all shadow-inner"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                />
              </motion.div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em]">Transmission content</label>
              <textarea 
                placeholder="Initialize message sequence..."
                className="w-full bg-black border border-white/5 rounded-[2rem] p-8 h-40 outline-none focus:border-cyan-500/50 text-sm leading-relaxed custom-scrollbar resize-none text-white font-medium shadow-inner"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button 
              disabled={isLoading || !selectedDevice}
              onClick={handleBulkSend}
              className="glow-button w-full py-6 text-sm font-black uppercase tracking-[0.3em]"
            >
              {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Initiate Campaign Evolution"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <AlertTriangle size={80} />
            </div>
            <h3 className="font-black text-xs uppercase tracking-widest text-cyan-500 mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-cyan-500" /> Protocol Constraints
            </h3>
            <ul className="space-y-6">
              {[
                { title: 'Volumetric Limit', desc: 'Avoid exceeding 500 nodes per cycle.' },
                { title: 'Semantic Variation', desc: 'Use dynamic templates to bypass filters.' },
                { title: 'Opt-Out Logic', desc: 'Always include termination commands.' }
              ].map((tip, idx) => (
                <li key={idx} className="flex gap-4">
                  <div className="font-mono text-[10px] text-gray-700 font-black">0{idx + 1}</div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-white tracking-widest mb-1">{tip.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{tip.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {result && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2.5rem] shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="text-emerald-500" />
                <h3 className="font-black uppercase text-xs tracking-widest text-emerald-400">Campaign Activated</h3>
              </div>
              <pre className="text-[10px] font-mono text-emerald-500/70 overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
