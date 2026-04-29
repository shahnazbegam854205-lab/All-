import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { motion } from 'framer-motion';
import { Phone, Lock, Zap, ArrowRight, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data } = await api.post('/api/auth/login', { phone, password });
      localStorage.setItem('apiKey', data.apiKey);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userName', data.name);
      onLogin();
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Check your network.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050505] selection:bg-cyan-500/30">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-12">
          <div className="inline-flex p-5 rounded-[2.5rem] bg-cyan-500/10 mb-6 border border-cyan-500/20 shadow-2xl">
            <Zap className="text-cyan-500" size={48} />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-3 uppercase">
            Happy Own<span className="text-cyan-500"> Service</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">Production Environment Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 bg-[#111] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-2">Secure Phone Entry</label>
            <div className="relative">
              <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-500" size={20} />
              <input
                type="text"
                placeholder="919876543210"
                className="w-full bg-black border border-white/10 rounded-[1.5rem] py-5 pl-14 pr-6 text-white font-bold placeholder:text-gray-800 focus:border-cyan-500/50 outline-none transition-all"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-2">Private Key Access</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-cyan-500" size={20} />
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full bg-black border border-white/10 rounded-[1.5rem] py-5 pl-14 pr-6 text-white font-bold placeholder:text-gray-800 focus:border-cyan-500/50 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="glow-button w-full py-5 flex items-center justify-center gap-3 font-black uppercase tracking-widest disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                Initiate Secure Box <ArrowRight size={24} />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-10 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
          System restricted.{' '}
          <Link to="/signup" className="text-cyan-500 hover:text-cyan-400 ml-1">
            Request Authorization
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
