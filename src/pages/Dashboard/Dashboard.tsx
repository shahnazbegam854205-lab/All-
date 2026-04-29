import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Stats } from '../../types';
import { motion } from 'framer-motion';
import { 
  Send, 
  MessageSquare, 
  Globe, 
  Zap, 
  Activity, 
  ChevronRight, 
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Smartphone,
  Copy,
  Check,
  Radio
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const userName = localStorage.getItem('userName') || 'User';

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/api/user/stats');
        setStats(statsRes.data);
      } catch (err) {
        console.error('Stats fetch error:', err);
      }

      try {
        const devRes = await api.get('/api/devices');
        setDevices(devRes.data.devices || []);
      } catch (err) {
        console.error('Devices fetch error:', err);
      }

      try {
        const activityRes = await api.get('/api/user/activity');
        setActivity(activityRes.data.recentActivity || []);
      } catch (err) {
        console.error('Activity fetch error:', err);
        setActivity([]); // Fallback to empty
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 45000); // Update every 45s
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { label: 'Messages Sent', value: stats?.messagesSent || 0, icon: Send, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { label: 'Messages Received', value: stats?.messagesReceived || 0, icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'API Requests', value: stats?.totalRequests || 0, icon: Globe, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { label: 'Today Usage', value: stats?.requestsToday || 0, icon: Zap, color: 'text-cyan-300', bg: 'bg-cyan-300/10' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-white/5 rounded-3xl" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <section className="relative overflow-hidden p-8 rounded-[2rem] glow-card bg-gradient-to-br from-[#111] to-[#0a0a0a]">
        <div className="relative z-10">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold mb-2 tracking-tight uppercase"
          >
            Happy Own<span className="text-cyan-400"> Service</span> <span className="animate-wave inline-block">👋</span>
          </motion.h2>
          <p className="text-gray-400 mb-8 max-w-md text-sm font-bold uppercase tracking-widest leading-relaxed">Welcome back, {userName}. Your secure WhatsApp automation portal is ready.</p>
          
          <div className="flex flex-wrap gap-4">
            <Link to="/tester" className="glow-button flex items-center gap-3">
              Fire Request <ArrowUpRight size={20} />
            </Link>
          </div>
        </div>
        
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]" />
      </section>

      <div className="grid grid-cols-2 gap-4">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glow-card p-4 rounded-2xl flex flex-col gap-3"
          >
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold font-mono">{stat.value.toLocaleString()}</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
            <Smartphone size={14} className="text-cyan-500" />
            Connected Devices
          </h3>
          <Link to="/devices" className="text-[10px] font-black uppercase tracking-widest text-cyan-500 hover:text-cyan-400">Manage</Link>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {devices.map((device: any, idx: number) => (
            <div 
              key={idx}
              className="p-5 bg-[#111] border border-white/5 rounded-3xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                  <Smartphone size={18} className="text-cyan-500" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{device.name || 'WhatsApp Device'}</h4>
                  <div className="flex items-center gap-2">
                    <p className="text-[9px] font-mono text-gray-600 font-bold uppercase tracking-widest">ID: {device.deviceId}</p>
                    <button 
                      onClick={() => handleCopy(device.deviceId)}
                      className="text-gray-600 hover:text-cyan-500 transition-colors"
                    >
                      {copiedId === device.deviceId ? <Check size={10} /> : <Copy size={10} />}
                    </button>
                  </div>
                </div>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                device.status === 'connected' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
              )}>
                {device.status}
              </div>
            </div>
          ))}

          {devices.length === 0 && (
            <div className="p-8 bg-[#111] border border-white/5 rounded-3xl text-center border-dashed">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-700">No active devices</p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
            <Activity size={14} className="text-cyan-500" />
            Live Activity Stack
          </h3>
          <Link to="/history" className="text-[10px] font-black uppercase tracking-widest text-cyan-500 hover:text-cyan-400">View All</Link>
        </div>

        <div className="space-y-3">
          {activity.slice(0, 3).map((log: any, idx: number) => (
            <div 
              key={idx}
              className="p-5 bg-[#111] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-cyan-500/20 transition-all shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] border",
                  log.method === 'POST' ? "bg-cyan-500/5 border-cyan-500/20 text-cyan-400" : "bg-blue-500/5 border-blue-500/20 text-blue-400"
                )}>
                  {log.method ? log.method[0] : '?'}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm truncate max-w-[120px]">{log.url}</h4>
                  <p className="text-[9px] font-mono text-gray-700 font-bold uppercase tracking-widest">{log.statusCode} • {log.duration}ms</p>
                </div>
              </div>
              <div className="text-[9px] font-mono font-black text-gray-800 uppercase">
                {format(log.timestamp || Date.now(), 'HH:mm:ss')}
              </div>
            </div>
          ))}

          {activity.length === 0 && (
            <div className="p-10 bg-[#111] border border-white/5 rounded-3xl text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-700">No recent transmissions</p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
            <ShieldCheck size={14} className="text-cyan-500" />
            Infrastructure
          </h3>
        </div>
        
        <div className="space-y-4 pb-10">
          {[
            { label: 'Bulk Campaign', desc: 'Secure mass transmission protocol', icon: TrendingUp, path: '/bulk', color: 'text-cyan-400' },
            { label: 'Webhook Setup', desc: 'Real-time data stream config', icon: Radio, path: '/webhooks', color: 'text-emerald-400' },
            { label: 'Developer Docs', desc: 'Encrypted API documentation', icon: Globe, path: '/docs', color: 'text-blue-400' },
          ].map((item) => (
            <Link 
              key={item.label}
              to={item.path}
              className="bg-[#111] p-6 rounded-[2.5rem] border border-white/5 flex items-center justify-between group hover:border-cyan-500/30 transition-all shadow-xl"
            >
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center ${item.color} shadow-inner`}>
                  <item.icon size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg tracking-tight uppercase">{item.label}</h4>
                  <p className="text-xs text-gray-500 font-bold tracking-widest mt-0.5">{item.desc}</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-all">
                <ChevronRight size={20} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
