import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Globe, 
  ExternalLink, 
  ChevronRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  MessageSquare,
  Clock
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Support() {
  const supportChannels = [
    {
      title: "Real-time Support",
      platform: "WhatsApp",
      handle: "+63 907 924 9283",
      url: "https://wa.me/639079249283",
      color: "bg-emerald-500",
      icon: <MessageCircle size={24} />
    }
  ];

  return (
    <div className="space-y-12 pb-32 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="text-center space-y-4 pt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-500 text-[10px] font-black uppercase tracking-widest mb-4"
        >
          <ShieldCheck size={12} /> 24/7 Priority Support
        </motion.div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase">
          Get<span className="text-cyan-500"> Help</span>
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Need help with your account or API? Contact us via the channels below.
        </p>
      </div>

      {/* Main Support Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {supportChannels.map((channel, idx) => (
          <motion.a
            key={idx}
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glow-card p-10 rounded-[3rem] group relative overflow-hidden flex flex-col items-center text-center border border-white/5 hover:border-cyan-500/30 active:scale-[0.98] transition-all"
          >
            <div className={cn(
              "w-20 h-20 rounded-[2rem] flex items-center justify-center text-white mb-6 shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-6",
              channel.color
            )}>
              {channel.icon}
            </div>
            <h3 className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-2">{channel.title}</h3>
            <p className="text-2xl font-black text-white mb-2">{channel.platform}</p>
            <p className="text-xs font-mono text-cyan-500/70">{channel.handle}</p>
            
            <div className="mt-8 flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Open Link <ExternalLink size={14} />
            </div>
          </motion.a>
        ))}
      </div>

      {/* Trust Blocks */}
      <div className="grid sm:grid-cols-3 gap-6">
        {[
          { icon: <Clock size={18} />, title: "30m Response", desc: "Average reply time" },
          { icon: <Zap size={18} />, title: "Live Help", desc: "Real-time support" },
          { icon: <Globe size={18} />, title: "Global Support", desc: "All countries supported" }
        ].map((item, i) => (
          <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] flex flex-col items-center text-center">
            <div className="text-cyan-500 mb-3">{item.icon}</div>
            <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-1">{item.title}</h4>
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest opacity-60">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Guide Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="glow-card p-10 rounded-[3rem] border border-cyan-500/10 overflow-hidden relative"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400">
            <HelpCircle size={24} />
          </div>
          <div>
            <h4 className="text-xl font-black text-white uppercase tracking-tight">Need specific help?</h4>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Pre-session checklist for faster resolution</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            "Have your numeric Account ID ready",
            "Copy the specific Error from your logs",
            "Verify your server status in the Webhooks panel",
            "Check if your device is Connected"
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-white/5">
              <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
              <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
