import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Copy, 
  Globe, 
  Server, 
  Zap,
  Info,
  Download,
  Terminal,
  AlertTriangle,
  Github,
  Rocket
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Webhooks() {
  const [copying, setCopying] = useState<string | null>(null);

  const htaccessCode = `# InfinityFree React SPA Routing
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]`;

  const vercelCode = `{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopying(id);
    setTimeout(() => setCopying(null), 2000);
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-8 pb-32 w-full px-4 text-left">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left pt-10">
        <div className="w-full">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase flex items-center justify-center sm:justify-start gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/10 rounded-2xl sm:rounded-[2rem] flex items-center justify-center shrink-0">
              <Rocket className="text-blue-500" size={32} />
            </div>
            Deployment<span className="text-blue-500">Hub</span>
          </h2>
          <p className="text-gray-500 text-[10px] sm:text-xs uppercase font-black tracking-[0.3em] mt-3 px-1">Host your Happy Own system anywhere</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Vercel Option */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glow-card p-6 sm:p-8 rounded-[2rem] border border-blue-500/20 bg-gradient-to-br from-black to-blue-900/10 relative overflow-hidden"
        >
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black">
              <Github size={20} />
            </div>
            <div>
              <h3 className="text-white font-black uppercase tracking-widest text-sm">Vercel (Best)</h3>
              <p className="text-[9px] text-blue-400 font-bold uppercase">Pro Performance</p>
            </div>
          </div>
          <ul className="space-y-3 text-xs text-gray-400 mb-8">
            <li className="flex items-center gap-2">
              <Check size={14} className="text-blue-500" /> Auto-deploy from GitHub
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} className="text-blue-500" /> Global Edge Network (High Speed)
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} className="text-blue-500" /> Custom Domains + Free SSL
            </li>
          </ul>
          <div className="space-y-3">
             <button 
              onClick={() => handleCopy(vercelCode, 'vercel')}
              className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 active:scale-95 transition-all"
            >
              Copy vercel.json
            </button>
          </div>
        </motion.div>

        {/* InfinityFree Option */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glow-card p-6 sm:p-8 rounded-[2rem] border border-emerald-500/20 bg-gradient-to-br from-black to-emerald-900/10 relative overflow-hidden"
        >
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-black">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="text-white font-black uppercase tracking-widest text-sm">InfinityFree</h3>
              <p className="text-[9px] text-emerald-400 font-bold uppercase">Classic Hosting</p>
            </div>
          </div>
          <ul className="space-y-3 text-xs text-gray-400 mb-8">
            <li className="flex items-center gap-2">
              <Check size={14} className="text-emerald-500" /> Shared Server (CPanel)
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} className="text-emerald-500" /> Requires .htaccess manual setup
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} className="text-emerald-500" /> Free Subdomains
            </li>
          </ul>
          <button 
            onClick={() => handleCopy(htaccessCode, 'htaccess')}
            className="w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 active:scale-95 transition-all"
          >
            Copy .htaccess
          </button>
        </motion.div>
      </div>

      {/* Deployment Steps Summary */}
      <div className="bg-white/5 border border-white/5 p-8 sm:p-12 rounded-[3rem] space-y-8">
        <div>
          <h4 className="text-white font-black uppercase tracking-widest text-lg mb-2">Final Step Protocol</h4>
          <p className="text-gray-500 text-xs uppercase tracking-widest">Follow these to avoid errors</p>
        </div>
        
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white font-bold">1</div>
            <p className="text-white font-black text-[10px] uppercase tracking-widest">Download ZIP</p>
            <p className="text-gray-500 text-xs leading-relaxed">Export project from AI Studio settings menu as a ZIP file.</p>
          </div>
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white font-bold">2</div>
            <p className="text-white font-black text-[10px] uppercase tracking-widest">Build Local</p>
            <p className="text-gray-500 text-xs leading-relaxed">Run <code className="bg-white/10 px-1 rounded text-cyan-400">npm run build</code> to generate the <span className="text-white">dist</span> folder.</p>
          </div>
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white font-bold">3</div>
            <p className="text-white font-black text-[10px] uppercase tracking-widest">Upload Files</p>
            <p className="text-gray-500 text-xs leading-relaxed">Upload everything <span className="text-white italic">inside</span> the dist folder to your server.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
