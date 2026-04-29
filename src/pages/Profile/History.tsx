import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { motion } from 'framer-motion';
import { 
  History as HistoryIcon,
  Search,
  Globe,
  Smartphone,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

export default function History() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/api/user/activity');
        setLogs(data.recentActivity || []);
      } catch (err) {
        console.error('History fetch error:', err);
        setLogs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'error') return log.statusCode >= 400;
    if (filter === 'success') return log.statusCode < 400;
    return true;
  });

  return (
    <div className="space-y-10 pb-24">
      <div className="flex flex-col gap-2 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
            <HistoryIcon size={20} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Activity<span className="text-cyan-500">Log</span></h2>
        </div>
        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] px-1">Deep packet inspection records</p>
      </div>

      <div className="flex overflow-x-auto gap-3 px-4 pb-2 no-scrollbar">
        {['all', 'success', 'error'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border whitespace-nowrap",
              filter === f 
                ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]" 
                : "bg-[#111] border-white/5 text-gray-500 hover:text-white"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4 px-4">
        {isLoading ? (
          [1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-28 bg-white/[0.02] border border-white/5 rounded-[2rem] animate-pulse" />
          ))
        ) : filteredLogs.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center bg-[#111] rounded-[3rem] border border-white/5 gap-4">
            <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center border border-white/10 text-gray-800">
              <Search size={40} />
            </div>
            <p className="font-black text-gray-600 uppercase tracking-widest text-[10px]">Zero records in stack</p>
          </div>
        ) : (
          filteredLogs.map((log, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={idx} 
              className="bg-[#111] p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] border border-white/5 flex flex-col gap-3 sm:gap-4 shadow-xl hover:border-cyan-500/20 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                  <div className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-[10px] sm:text-xs border shadow-inner",
                    log.method === 'GET' ? "bg-blue-500/5 border-blue-500/20 text-blue-400" :
                    log.method === 'POST' ? "bg-cyan-500/5 border-cyan-500/20 text-cyan-400" :
                    "bg-yellow-500/5 border-yellow-500/20 text-yellow-500"
                  )}>
                    {log.method}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-black text-white text-xs sm:text-sm tracking-tight truncate">{log.url}</h4>
                    <p className="text-[9px] sm:text-[10px] font-mono font-bold text-gray-700 mt-0.5 tracking-widest truncate">{log.ip}</p>
                  </div>
                </div>
                <div className={cn(
                  "px-2 sm:px-4 py-1.5 sm:py-2 shrink-0 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                  log.statusCode < 400 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                )}>
                  {log.statusCode}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/[0.02]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-gray-600 uppercase tracking-widest">
                    <Clock size={10} className="text-gray-800" /> {log.duration}ms
                  </div>
                </div>
                <div className="text-[9px] sm:text-[10px] font-mono font-black text-gray-500 uppercase tracking-widest">
                  {format(log.timestamp || Date.now(), 'MMM d, HH:mm:ss')}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
