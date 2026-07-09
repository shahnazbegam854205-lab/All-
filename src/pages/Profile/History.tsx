import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History as HistoryIcon,
  Search,
  Globe,
  Smartphone,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Filter,
  Headphones,
  ChevronRight,
  X,
  Zap,
  Activity,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Calendar,
  Download,
  RefreshCcw
} from 'lucide-react';
import { format, subDays, isToday, isYesterday } from 'date-fns';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

export default function History() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showSupportOptions, setShowSupportOptions] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const WHATSAPP_NUMBER = '639079249283';
  const WEB_SUPPORT_URL = 'https://all-wine.vercel.app/#/support';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, statsRes] = await Promise.all([
          api.get('/api/user/activity'),
          api.get('/api/user/stats')
        ]);
        setLogs(historyRes.data.recentActivity || []);
        setStats(statsRes.data);
      } catch (err) {
        console.error('History fetch error:', err);
        setLogs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleWhatsAppSupport = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
    setShowSupportOptions(false);
  };

  const handleWebSupport = () => {
    window.open(WEB_SUPPORT_URL, '_blank');
    setShowSupportOptions(false);
  };

  const filteredLogs = logs.filter(log => {
    // Filter by type
    if (filter === 'error') return log.statusCode >= 400;
    if (filter === 'success') return log.statusCode < 400;
    if (filter === 'today') {
      return isToday(new Date(log.timestamp));
    }
    if (filter === 'week') {
      const weekAgo = subDays(new Date(), 7);
      return new Date(log.timestamp) >= weekAgo;
    }
    // Search filter
    if (searchQuery) {
      return log.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
             log.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
             (log.ip || '').includes(searchQuery);
    }
    return true;
  });

  // Stats for quick view
  const totalRequests = logs.length;
  const successRate = logs.length > 0 
    ? Math.round((logs.filter(l => l.statusCode < 400).length / logs.length) * 100)
    : 0;
  const avgResponseTime = logs.length > 0
    ? Math.round(logs.reduce((acc, l) => acc + (l.duration || 0), 0) / logs.length)
    : 0;

  const quickStats = [
    { label: 'Total Requests', value: totalRequests, icon: Activity, color: 'text-cyan-400' },
    { label: 'Success Rate', value: `${successRate}%`, icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Avg Response', value: `${avgResponseTime}ms`, icon: Clock, color: 'text-blue-400' },
  ];

  return (
    <>
      <div className="space-y-8 pb-24">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden p-6 sm:p-10 rounded-[2rem] glow-card bg-gradient-to-br from-[#111] to-[#0a0a0a]"
        >
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
                    <HistoryIcon size={20} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tighter uppercase">
                    Activity<span className="text-cyan-500">Log</span>
                  </h2>
                </div>
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1 ml-1">
                  Deep packet inspection records 📊
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-3">
                {quickStats.map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-black/40 p-3 rounded-xl border border-white/5 text-center min-w-[80px]"
                  >
                    <stat.icon size={14} className={cn(stat.color, "mx-auto")} />
                    <p className="text-sm font-black text-white mt-0.5">{stat.value}</p>
                    <p className="text-[6px] text-gray-500 font-black uppercase tracking-widest">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mt-4 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <input 
                type="text"
                placeholder="Search by URL, method, or IP..."
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-cyan-500/50 transition-all text-sm text-white placeholder:text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]" />
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Dashboard', icon: BarChart3, path: '/dashboard', color: 'text-cyan-400' },
            { label: 'Devices', icon: Smartphone, path: '/devices', color: 'text-emerald-400' },
            { label: 'Bulk', icon: Zap, path: '/bulk', color: 'text-yellow-400' },
            { label: 'Webhooks', icon: Activity, path: '/webhooks', color: 'text-blue-400' },
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

        {/* Filters */}
        <div className="flex flex-wrap gap-2 px-1">
          <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar flex-1">
            {['all', 'success', 'error', 'today', 'week'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] transition-all border whitespace-nowrap",
                  filter === f 
                    ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]" 
                    : "bg-[#111] border-white/5 text-gray-500 hover:text-white hover:border-white/10"
                )}
              >
                {f === 'all' ? 'All' : 
                 f === 'success' ? '✅ Success' : 
                 f === 'error' ? '❌ Errors' : 
                 f === 'today' ? '📅 Today' : '📆 Week'}
              </button>
            ))}
          </div>
          <button className="px-4 py-2.5 bg-[#111] border border-white/5 rounded-xl text-gray-500 hover:text-white transition-colors">
            <RefreshCcw size={16} />
          </button>
        </div>

        {/* Logs List */}
        <div className="space-y-3 px-1">
          {isLoading ? (
            [1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-24 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />
            ))
          ) : filteredLogs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-24 flex flex-col items-center justify-center bg-[#111] rounded-[3rem] border border-white/5 gap-4"
            >
              <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center border border-white/10 text-gray-800">
                <Search size={40} />
              </div>
              <p className="font-black text-gray-600 uppercase tracking-widest text-[10px]">Zero records in stack</p>
              <p className="text-[8px] text-gray-700 font-bold uppercase tracking-widest">No activity found matching your filters</p>
            </motion.div>
          ) : (
            filteredLogs.map((log, idx) => {
              const isError = log.statusCode >= 400;
              const date = new Date(log.timestamp || Date.now());
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  key={idx} 
                  className="bg-[#111] p-4 sm:p-6 rounded-2xl border border-white/5 flex flex-col gap-3 shadow-xl hover:border-cyan-500/20 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4 overflow-hidden flex-1">
                      <div className={cn(
                        "w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center font-black text-[10px] sm:text-xs border shadow-inner",
                        log.method === 'GET' ? "bg-blue-500/5 border-blue-500/20 text-blue-400" :
                        log.method === 'POST' ? "bg-cyan-500/5 border-cyan-500/20 text-cyan-400" :
                        log.method === 'DELETE' ? "bg-red-500/5 border-red-500/20 text-red-400" :
                        "bg-yellow-500/5 border-yellow-500/20 text-yellow-500"
                      )}>
                        {log.method ? log.method[0] : '?'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-white text-xs sm:text-sm tracking-tight truncate">{log.url}</h4>
                          {isError ? (
                            <XCircle size={14} className="text-red-400 shrink-0" />
                          ) : (
                            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-0.5">
                          <p className="text-[9px] font-mono font-bold text-gray-700 tracking-widest">{log.ip || 'N/A'}</p>
                          <span className="text-[8px] text-gray-700">•</span>
                          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                            {format(date, 'MMM d, HH:mm:ss')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={cn(
                      "px-3 py-1.5 shrink-0 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5",
                      isError ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    )}>
                      {log.statusCode}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.02]">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-600 uppercase tracking-widest">
                        <Clock size={10} className="text-gray-800" /> 
                        {log.duration || 0}ms
                      </div>
                      {isError && (
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-red-500/50 uppercase tracking-widest">
                          <AlertCircle size={10} /> Error
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {isToday(date) && (
                        <span className="text-[8px] font-black text-cyan-500/50 uppercase tracking-widest bg-cyan-500/5 px-2 py-0.5 rounded">Today</span>
                      )}
                      {isYesterday(date) && (
                        <span className="text-[8px] font-black text-gray-500/50 uppercase tracking-widest bg-gray-500/5 px-2 py-0.5 rounded">Yesterday</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Export Section */}
        {logs.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-[#111] rounded-2xl border border-white/5 flex items-center justify-between"
          >
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">
              Total: {filteredLogs.length} records
            </span>
            <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-cyan-500 hover:text-cyan-400 transition-colors">
              <Download size={14} /> Export CSV
            </button>
          </motion.div>
        )}
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
