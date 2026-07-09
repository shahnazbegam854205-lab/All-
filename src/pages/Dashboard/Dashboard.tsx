import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Stats } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
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
  Radio,
  MessageCircle,
  Headphones,
  X,
  Users,
  Clock,
  Calendar,
  BarChart3,
  Sparkles,
  Menu,
  Home,
  Settings,
  Bell,
  Sun,
  Moon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { format, formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSupportOptions, setShowSupportOptions] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const userName = localStorage.getItem('userName') || 'User';
  const WHATSAPP_NUMBER = '639079249283';
  const WEB_SUPPORT_URL = 'https://all-wine.vercel.app/#/support';

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Set greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning 🌅');
    else if (hour < 17) setGreeting('Good Afternoon ☀️');
    else if (hour < 21) setGreeting('Good Evening 🌆');
    else setGreeting('Good Night 🌙');
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, devRes, activityRes] = await Promise.all([
          api.get('/api/user/stats'),
          api.get('/api/devices'),
          api.get('/api/user/activity')
        ]);
        
        setStats(statsRes.data);
        setDevices(devRes.data.devices || []);
        setActivity(activityRes.data.recentActivity || []);
      } catch (err) {
        console.error('Fetch error:', err);
        setActivity([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 45000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { label: 'Messages Sent', value: stats?.messagesSent || 0, icon: Send, color: 'text-cyan-400', bg: 'bg-cyan-400/10', gradient: 'from-cyan-500/20 to-transparent' },
    { label: 'Messages Received', value: stats?.messagesReceived || 0, icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-400/10', gradient: 'from-blue-500/20 to-transparent' },
    { label: 'API Requests', value: stats?.totalRequests || 0, icon: Globe, color: 'text-indigo-400', bg: 'bg-indigo-400/10', gradient: 'from-indigo-500/20 to-transparent' },
    { label: 'Today Usage', value: stats?.requestsToday || 0, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10', gradient: 'from-yellow-500/20 to-transparent' },
  ];

  // Recent activity with icons
  const getActivityIcon = (method: string) => {
    switch(method) {
      case 'POST': return Send;
      case 'GET': return Globe;
      default: return Activity;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse px-4">
        <div className="h-48 bg-white/5 rounded-3xl" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 pb-24 px-3 sm:px-0">
        {/* Welcome Section - Mobile Optimized */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden p-5 sm:p-8 rounded-3xl glow-card bg-gradient-to-br from-[#111] to-[#0a0a0a]"
        >
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl sm:text-3xl">{greeting.split(' ')[0] === 'Good' ? '👋' : '🌙'}</span>
                  <h2 className="text-lg sm:text-2xl font-black text-white truncate">
                    {greeting}
                  </h2>
                </div>
                <p className="text-white/90 font-bold text-base sm:text-xl truncate">
                  {userName} <span className="text-cyan-400">✨</span>
                </p>
                <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-0.5 flex items-center gap-2">
                  <Clock size={12} className="text-cyan-500/50" />
                  {format(currentTime, 'EEEE, MMM d • h:mm a')}
                </p>
              </div>
              
              {/* Quick Status */}
              <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Online</span>
                </div>
                <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest">
                  {devices.length} Devices
                </div>
              </div>
            </div>
          </div>
          
          {/* Animated Background */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/5 rounded-full blur-[80px]" />
        </motion.div>

        {/* Quick Actions - Mobile Friendly Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {[
            { label: 'Send', icon: Send, path: '/tester', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
            { label: 'Bulk', icon: Users, path: '/bulk', color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Chat', icon: MessageCircle, path: '/chat', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Devices', icon: Smartphone, path: '/devices', color: 'text-purple-400', bg: 'bg-purple-500/10' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex flex-col items-center gap-1.5 p-3 sm:p-4 bg-[#111] rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all group active:scale-95"
            >
              <div className={cn("p-2 rounded-xl", item.bg)}>
                <item.icon size={18} className={cn(item.color, "group-hover:scale-110 transition-transform")} />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Stats Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((stat, idx) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="glow-card p-4 rounded-2xl border border-white/5 bg-gradient-to-br relative overflow-hidden group"
            >
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                stat.gradient
              )} />
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                    <stat.icon size={16} className={stat.color} />
                  </div>
                  <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">
                    {stat.label.split(' ').pop()}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-xl sm:text-2xl font-black text-white font-mono">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-[8px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Devices Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
              <Smartphone size={14} className="text-cyan-500" />
              My Devices
              <span className="text-[8px] text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">
                {devices.length}
              </span>
            </h3>
            <Link to="/devices" className="text-[9px] font-black uppercase tracking-widest text-cyan-500 hover:text-cyan-400 transition-colors flex items-center gap-1">
              Manage <ChevronRight size={12} />
            </Link>
          </div>

          <div className="space-y-2">
            {devices.slice(0, 3).map((device: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 bg-[#111] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-cyan-500/20 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    device.status === 'connected' ? "bg-cyan-500/10" : "bg-slate-800/50"
                  )}>
                    <Smartphone size={16} className={device.status === 'connected' ? "text-cyan-500" : "text-slate-500"} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-sm truncate">{device.name || 'WhatsApp Device'}</h4>
                    <div className="flex items-center gap-2">
                      <p className="text-[8px] font-mono text-gray-600 font-bold uppercase tracking-widest truncate max-w-[80px]">
                        {device.deviceId?.slice(0, 8)}...
                      </p>
                      <button 
                        onClick={() => handleCopy(device.deviceId)}
                        className="text-gray-600 hover:text-cyan-500 transition-colors"
                      >
                        {copiedId === device.deviceId ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className={cn(
                  "px-2.5 py-1 rounded-full text-[7px] font-black uppercase tracking-widest shrink-0",
                  device.status === 'connected' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                )}>
                  {device.status === 'connected' ? '● Online' : device.status}
                </div>
              </motion.div>
            ))}

            {devices.length === 0 && (
              <div className="p-6 bg-[#111] border border-white/5 rounded-2xl text-center border-dashed">
                <Smartphone size={24} className="text-gray-700 mx-auto mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-700">No devices connected</p>
                <Link to="/devices" className="text-[8px] text-cyan-500 font-bold uppercase tracking-widest mt-1 inline-block hover:text-cyan-400">
                  Connect one now →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
              <Activity size={14} className="text-cyan-500" />
              Recent Activity
              <span className="text-[8px] text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">
                {activity.length}
              </span>
            </h3>
            <Link to="/history" className="text-[9px] font-black uppercase tracking-widest text-cyan-500 hover:text-cyan-400 transition-colors flex items-center gap-1">
              View All <ChevronRight size={12} />
            </Link>
          </div>

          <div className="space-y-2">
            {activity.slice(0, 3).map((log: any, idx: number) => {
              const Icon = getActivityIcon(log.method);
              const isError = log.statusCode >= 400;
              
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 bg-[#111] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-cyan-500/20 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                      isError ? "bg-red-500/10" : "bg-cyan-500/10"
                    )}>
                      <Icon size={14} className={isError ? "text-red-400" : "text-cyan-400"} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-xs truncate">{log.url}</h4>
                        <span className={cn(
                          "text-[7px] font-black px-1.5 py-0.5 rounded",
                          isError ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"
                        )}>
                          {log.statusCode}
                        </span>
                      </div>
                      <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-2">
                        <span>{log.method}</span>
                        <span>•</span>
                        <span>{log.duration}ms</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(log.timestamp || Date.now(), { addSuffix: true })}</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {activity.length === 0 && (
              <div className="p-8 bg-[#111] border border-white/5 rounded-2xl text-center">
                <Activity size={24} className="text-gray-700 mx-auto mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-700">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Tools & Documentation - Mobile Optimized */}
        <div className="space-y-3">
          <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-500 px-2 flex items-center gap-2">
            <ShieldCheck size={14} className="text-cyan-500" />
            Quick Tools
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Bulk Campaign', icon: TrendingUp, path: '/bulk', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
              { label: 'Webhooks', icon: Radio, path: '/webhooks', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: 'Help Center', icon: MessageCircle, path: '/support', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              { label: 'API Docs', icon: Globe, path: '/docs', color: 'text-purple-400', bg: 'bg-purple-500/10' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="bg-[#111] p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-2 group hover:border-cyan-500/30 transition-all active:scale-95"
              >
                <div className={cn("p-2.5 rounded-xl", item.bg)}>
                  <item.icon size={18} className={cn(item.color, "group-hover:scale-110 transition-transform")} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs tracking-tight uppercase">{item.label}</h4>
                  <p className="text-[7px] text-gray-600 font-bold tracking-widest mt-0.5">
                    {item.label === 'Bulk Campaign' ? 'Mass Messaging' :
                     item.label === 'Webhooks' ? 'Real-time' :
                     item.label === 'Help Center' ? 'Support' : 'Guide'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Support Button */}
      <div className="fixed bottom-20 right-4 sm:right-6 z-50 flex flex-col items-end gap-3">
        {/* Support Options Popup */}
        <AnimatePresence>
          {showSupportOptions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-[#1a1a1a] backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl shadow-black/50 min-w-[180px] sm:min-w-[200px] overflow-hidden"
            >
              <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Support</span>
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
                  <p className="text-[10px] font-bold text-white group-hover:text-[#25D366] transition-colors">WhatsApp</p>
                  <p className="text-[7px] text-gray-500 font-mono">Chat Now</p>
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
                  <p className="text-[10px] font-bold text-white group-hover:text-cyan-400 transition-colors">Web Agent</p>
                  <p className="text-[7px] text-gray-500 font-mono">Live Chat</p>
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
            "relative w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
            showSupportOptions 
              ? "bg-cyan-500 shadow-cyan-500/30 group-hover:shadow-cyan-500/40" 
              : "bg-[#25D366] shadow-[#25D366]/30 group-hover:shadow-[#25D366]/40"
          )}>
            {showSupportOptions ? (
              <X size={20} className="sm:w-6 sm:h-6 text-white" />
            ) : (
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9uY7cpz03f282ot9udmEc8ech0KPCypmXPpoRVaGlCw&s"
                alt="Support"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover"
              />
            )}
            
            {!showSupportOptions && (
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-red-500 rounded-full border-2 border-black animate-pulse" />
            )}
          </div>
          
          <motion.span 
            className="mt-1 text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-white/80 bg-black/60 backdrop-blur-sm px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/5"
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
