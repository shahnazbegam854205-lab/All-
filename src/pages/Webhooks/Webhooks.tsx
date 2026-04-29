import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Activity, 
  Check, 
  Copy, 
  Terminal, 
  Code2, 
  AlertCircle,
  Radio,
  Server,
  ChevronRight,
  Loader2,
  Zap,
  Settings
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Webhooks() {
  const [webhookUrl, setWebhookUrl] = useState('https://your-server.com/webhook');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copying, setCopying] = useState<string | null>(null);

  const phpCode = `<?php
// webhook.php
$data = json_decode(file_get_contents('php://input'), true);

if ($data['event'] === 'messages.upsert') {
    $message = $data['payload']['message'];
    $from = $data['payload']['pushName'];
    
    // Your logic here
    file_put_contents('log.txt', "New msg from $from: $message\\n", FILE_APPEND);
}

http_response_code(200);
echo json_encode(['status' => 'received']);`;

  const payloadExample = `{
  "event": "messages.upsert",
  "instanceId": "instance_9281",
  "payload": {
    "key": { "remoteJid": "123456789@s.whatsapp.net" },
    "message": "Hello from Happy Own!",
    "pushName": "John Doe",
    "timestamp": 1714421685
  }
}`;

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    // Simulate Test
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsTesting(false);
    setTestResult({
      success: true,
      message: "Webhook successfully handshaked with 200 OK"
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopying(id);
    setTimeout(() => setCopying(null), 2000);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-4 sm:space-y-6 pb-32 w-full px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 px-2 text-center sm:text-left pt-6">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
              <Radio className="text-cyan-500" size={24} />
            </div>
            Webhook<span className="text-cyan-500"> Settings</span>
          </h2>
          <p className="text-gray-500 text-[9px] sm:text-[10px] uppercase font-black tracking-widest mt-2">Manage your message notifications</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Configuration Section */}
        <div className="space-y-4 sm:space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glow-card p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] relative overflow-hidden bg-gradient-to-br from-black to-slate-900/40 border border-white/5"
          >
            <div className="absolute -top-10 -right-10 p-6 opacity-5 pointer-events-none rotate-12">
              <Settings size={140} />
            </div>

            <div className="relative z-10 space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] uppercase font-black tracking-[0.2em] text-cyan-500/60 flex items-center gap-2 px-1 text-left">
                  <Server size={10} /> Webhook URL
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-site.com/hook.php"
                    className="w-full bg-black/60 border border-white/10 rounded-xl sm:rounded-2xl py-3 px-5 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-all placeholder:text-gray-800"
                  />
                </div>
              </div>

              <div className="bg-white/5 rounded-[1rem] p-4 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[9px] uppercase font-black tracking-widest text-white flex items-center gap-2">
                    <Zap size={12} className="text-yellow-500" /> Event Status
                  </h4>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  {[
                    { label: 'Incoming Messages', event: 'messages.upsert' },
                    { label: 'Status Updates', event: 'messages.update' }
                  ].map((item) => (
                    <div key={item.event} className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border border-white/5">
                      <div className="max-w-[70%] text-left">
                        <p className="text-[10px] font-black text-gray-200 truncate">{item.label}</p>
                        <p className="text-[8px] font-mono text-gray-600 truncate uppercase mt-0.5">{item.event}</p>
                      </div>
                      <span className="text-[7px] font-black tracking-tighter px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                        ACTIVE
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className={cn(
                    "flex-[2] py-3.5 sm:py-4 font-black rounded-xl sm:rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.1em] text-[10px] shadow-xl disabled:opacity-50",
                    success ? "bg-emerald-500 text-black shadow-emerald-500/20" : "bg-cyan-500 text-black shadow-cyan-500/20"
                  )}
                >
                  {isSaving ? <Loader2 className="animate-spin" size={16} /> : (success ? <Check size={16} /> : <Save size={16} />)}
                  {isSaving ? "Saving..." : (success ? "Saved" : "Save Settings")}
                </button>
                <button 
                  onClick={handleTest}
                  disabled={isTesting || !webhookUrl}
                  className="flex-1 py-3.5 sm:py-4 bg-white/5 text-white font-black rounded-xl sm:rounded-2xl hover:bg-white/10 transition-all border border-white/10 uppercase tracking-widest text-[9px] disabled:opacity-30 flex items-center justify-center gap-2"
                >
                  {isTesting ? <Loader2 className="animate-spin" size={14} /> : <Activity size={14} />}
                  Test URL
                </button>
              </div>

              <AnimatePresence>
                {testResult && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn(
                      "p-4 rounded-xl border flex items-center gap-4 mt-2",
                      testResult.success ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-500"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      testResult.success ? "bg-emerald-500/20" : "bg-red-500/20"
                    )}>
                      {testResult.success ? <Check size={16} /> : <AlertCircle size={16} />}
                    </div>
                    <div className="flex-1 overflow-hidden text-left">
                      <p className="text-[9px] font-black uppercase tracking-widest mb-0.5">{testResult.success ? 'Success' : 'Failed'}</p>
                      <p className="text-[10px] font-bold opacity-70 truncate">{testResult.message}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Documentation Section */}
        <div className="space-y-4 sm:space-y-6">
          {/* PHP Example */}
          <div className="glow-card p-0 rounded-2xl overflow-hidden border border-white/5 bg-[#080808]">
            <div className="flex bg-white/5 border-b border-white/5 items-center">
              <div className="flex items-center gap-2 px-4 py-3 border-r border-white/5 text-emerald-500">
                <Radio size={14} />
                <span className="text-[9px] uppercase font-black tracking-widest">hook.php (Receiver)</span>
              </div>
              <div className="flex-1" />
              <button 
                onClick={() => handleCopy(phpCode, 'php-code')}
                className="px-4 py-3 text-gray-500 hover:text-white transition-colors"
                title="Copy PHP"
              >
                {copying === 'php-code' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
            <div className="p-4 overflow-x-auto text-[10px] leading-relaxed custom-scrollbar text-left scroll-smooth">
              <SyntaxHighlighter language="php" style={atomDark} customStyle={{ background: 'transparent', padding: 0 }}>
                {phpCode}
              </SyntaxHighlighter>
            </div>
          </div>

          <div className="glow-card p-0 rounded-2xl overflow-hidden border border-white/5 shadow-2xl border-yellow-500/10">
            <div className="flex bg-white/5 border-b border-white/5 items-center">
              <div className="flex items-center gap-3 px-6 py-4 border-r border-white/5 text-yellow-500">
                <Code2 size={16} />
                <span className="text-[10px] uppercase font-black tracking-widest">Payload Schema</span>
              </div>
              <div className="flex-1" />
              <button 
                onClick={() => handleCopy(payloadExample, 'json-code')}
                className="px-6 py-4 text-gray-500 hover:text-white transition-colors"
                title="Copy JSON"
              >
                {copying === 'json-code' ? <Check size={16} className="text-cyan-500" /> : <Copy size={16} />}
              </button>
            </div>
            <div className="p-4 bg-[#080808] overflow-x-auto text-[10px] leading-relaxed custom-scrollbar text-left">
              <SyntaxHighlighter language="json" style={atomDark} customStyle={{ background: 'transparent', padding: 0 }}>
                {payloadExample}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
