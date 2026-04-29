import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, CheckCircle2, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await api.post('/api/auth/forgot-password', { phone });
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data } = await api.post('/api/auth/verify-reset-otp', { phone, otp });
      // Assuming server returns resetToken in the data
      setResetToken(data.resetToken);
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/api/auth/reset-password', { phone, resetToken, newPassword });
      setStep(4);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 bg-grid">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2 uppercase">
            Reset<span className="text-cyan-500"> Password</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">Back to your account</p>
        </div>

        <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
          {step === 4 ? (
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="text-emerald-500" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Updated!</h3>
                <p className="text-gray-500 text-xs mt-2 font-medium leading-relaxed">Your password has been reset successfully.</p>
              </div>
              <Link 
                to="/login" 
                className="glow-button block w-full py-4 text-center font-black uppercase tracking-widest text-sm"
              >
                Go to Login
              </Link>
            </div>
          ) : step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <p className="text-gray-400 text-xs text-center leading-relaxed px-4 font-medium">
                Enter your registered phone number to receive a verification code.
              </p>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500" size={18} />
                  <input
                    type="text"
                    placeholder="91xxxxxxxxxx"
                    className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-6 text-white font-medium focus:border-cyan-500/50 outline-none transition-all"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="glow-button w-full py-4 flex items-center justify-center gap-2 font-black uppercase tracking-widest disabled:opacity-50 text-sm"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Send OTP"}
              </button>
            </form>
          ) : step === 2 ? (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-cyan-500/20">
                  <CheckCircle2 className="text-cyan-500" size={24} />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Verify Code</h3>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Sent to {phone}</p>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  className="w-full bg-black border border-white/10 rounded-xl py-4 text-center text-4xl font-black font-mono tracking-[0.3em] text-cyan-500 focus:border-cyan-500 outline-none transition-all shadow-inner"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="glow-button w-full py-4 flex items-center justify-center gap-2 font-black uppercase tracking-widest disabled:opacity-50 text-sm"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Verify Code"}
              </button>

              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-[9px] font-black text-gray-700 uppercase tracking-widest hover:text-cyan-500 transition-colors"
              >
                Edit Number
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">New Password</h3>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Setup secured access</p>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-2">Choose Password</label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  className="w-full bg-black border border-white/10 rounded-xl py-4 px-6 text-white font-medium focus:border-cyan-500/50 outline-none transition-all"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="glow-button w-full py-4 flex items-center justify-center gap-2 font-black uppercase tracking-widest disabled:opacity-50 text-sm"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Reset Password"}
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-cyan-500 font-bold uppercase tracking-widest text-[10px] transition-colors">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
