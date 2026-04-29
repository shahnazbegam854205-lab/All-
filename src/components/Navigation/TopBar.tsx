import { useState } from 'react';
import { Menu, X, Bell, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export const TopBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';

  const menuItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'WhatsApp Chat', path: '/chat' },
    { label: 'Bulk Messaging', path: '/bulk' },
    { label: 'API Documentation', path: '/docs' },
    { label: 'API Tester', path: '/tester' },
    { label: 'Device Manager', path: '/devices' },
    { label: 'Webhook Config', path: '/webhooks' },
    { label: 'User History', path: '/history' },
    { label: 'Profile Settings', path: '/profile' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
    <header className="sticky top-0 w-full bg-[#0a0a0a] border-b border-cyan-900/30 px-6 h-16 flex items-center justify-between z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsOpen(true)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-cyan-400"
          >
            <Menu size={24} />
          </button>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white select-none">
              Happy Own<span className="text-cyan-500"> Service</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-tighter">KEY: ACTIVE</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 border-2 border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-cyan-500/20">
            {userName[0]}
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-[#050505] border-r border-white/10 z-[70] p-10 flex flex-col shadow-[20px_0_100px_rgba(0,255,255,0.1)]"
            >
              <div className="flex items-start justify-between mb-12">
                <div className="flex flex-col">
                  <span className="font-black text-3xl text-white tracking-tighter uppercase leading-none">Happy Own<br/><span className="text-cyan-500">Service</span></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 mt-2">Control Interface</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-cyan-500 shadow-inner hover:scale-105 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                {menuItems.map((item, idx) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-6 py-5 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[9px] text-gray-700 font-bold">0{idx + 1}</span>
                      <span className="font-black uppercase tracking-widest text-[11px] group-hover:text-cyan-400 transition-colors">{item.label}</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-800 group-hover:bg-cyan-500 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all" />
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-6">
                <button 
                  onClick={handleLogout}
                  className="w-full text-center py-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/20"
                >
                  Terminate Session
                </button>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-1 h-1 bg-gray-800 rounded-full" />
                  <div className="w-1 h-1 bg-gray-800 rounded-full" />
                  <div className="w-1 h-1 bg-gray-800 rounded-full" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
