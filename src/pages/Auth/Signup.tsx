import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { motion } from 'framer-motion';
import { User, Phone, Lock, Zap, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export default function Signup() {
  const [step, setStep] = useState(1); // 1: Signup, 2: Verification
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/api/auth/signup', formData);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data } = await api.post('/api/auth/verify-otp', { phone: formData.phone, otp });
      localStorage.setItem('apiKey', data.apiKey);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userName', formData.name);
      navigate('/');
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed.');
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
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">Create your account</p>
        </div>

        <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center mb-6">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500" size={18} />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-6 text-white font-medium focus:border-cyan-500/50 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500" size={18} />
                  <input
                    type="text"
                    placeholder="91xxxxxxxxxx"
                    className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-6 text-white font-medium focus:border-cyan-500/50 outline-none transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-2">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500" size={18} />
                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-6 text-white font-medium focus:border-cyan-500/50 outline-none transition-all"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="glow-button w-full py-4 flex items-center justify-center gap-2 font-black uppercase tracking-widest group disabled:opacity-50 text-sm"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>Continue <ArrowRight size={18} /></>
                )}
              </button>
            </form>
          ) : (
            <motion.form 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleVerify} 
              className="space-y-8"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
                  <CheckCircle2 className="text-cyan-500" size={32} />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tighter">Verify Account</h3>
                <p className="text-gray-500 text-sm mt-1">Enter the activation code sent to you.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest text-center block">OTP Code</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  className="w-full bg-black border border-white/10 rounded-[1.5rem] py-5 text-center text-5xl font-black font-mono tracking-[0.4em] text-cyan-500 focus:border-cyan-500 outline-none transition-all shadow-inner"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="glow-button w-full py-4 font-black uppercase tracking-widest disabled:opacity-50 text-sm"
              >
                {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Confirm Account'}
              </button>

              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-[10px] font-black text-gray-700 uppercase tracking-widest hover:text-cyan-500 transition-colors"
              >
                Back to Signup
              </button>
            </motion.form>
          )}
        </div>

        <p className="text-center mt-8 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
          Existing member?{' '}
          <Link to="/login" className="text-cyan-500 hover:text-cyan-400">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
