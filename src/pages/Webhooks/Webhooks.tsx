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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col items-center sm:items-start text-center sm:text-left pt-6 sm:pt-10">
        <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-4">
          <Radio className="text-cyan-500" size={28} />
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
          Webhook<span className="text-cyan-500"> Settings</span>
        </h2>
        <p className="text-gray-500 text-[10px] sm:text-sm uppercase font-bold tracking-widest mt-2 opacity-60">Real-time message notifications</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Configuration Section */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glow-card p-6 sm:p-8 rounded-[2rem] border border-white/5 bg-black/40 backdrop-blur-sm"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 flex items-center gap-2 px-1">
                  <Server size={12} className="text-cyan-500" /> Endpoint URL
                </label>
                <input 
                  type="text" 
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://example.com/webhook.php"
                  className="w-full bg-black border border-white/10 rounded-xl py-4 px-5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 transition-all placeholder:text-gray-900"
                />
              </div>

              <div className="bg-white/[0.02] rounded-2xl p-5 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-white/40 flex items-center gap-2">
                    <Zap size={14} className="text-yellow-500" /> Event Subscriptions
                  </h4>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
                  </div>
                </div>
                
                <div className="space-y-2.5">
                  {[
                    { label: 'Incoming Messages', event: 'messages.upsert' },
                    { label: 'Message Updates', event: 'messages.update' }
                  ].map((item) => (
                    <div key={item.event} className="flex items-center justify-between p-3 bg-black/60 rounded-xl border border-white/5">
                      <div className="flex-1 min-w-0 pr-3">
                        <p className="text-xs font-bold text-gray-200 truncate">{item.label}</p>
                        <p className="text-[9px] font-mono text-gray-600 truncate mt-0.5">{item.event}</p>
                      </div>
                      <span className="shrink-0 text-[8px] font-black tracking-tighter px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                        ACTIVE
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className={cn(
                    "flex-[2] py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2",
                    success ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 scale-[0.98]" : "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                  )}
                >
                  {isSaving ? <Loader2 className="animate-spin" size={16} /> : (success ? <Check size={16} /> : <Save size={16} />)}
                  {isSaving ? "Saving..." : (success ? "Saved" : "Save Changes")}
                </button>
                <button 
                  onClick={handleTest}
                  disabled={isTesting || !webhookUrl}
                  className="flex-1 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                >
                  {isTesting ? <Loader2 className="animate-spin" size={14} /> : <Activity size={14} className="text-cyan-500" />}
                  Test Link
                </button>
              </div>

              <AnimatePresence>
                {testResult && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      "p-4 rounded-xl border flex items-center gap-4",
                      testResult.success ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-red-500/5 border-red-500/20 text-red-500"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner",
                      testResult.success ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
                    )}>
                      {testResult.success ? <Check size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest mb-0.5">{testResult.success ? 'Success' : 'Error'}</p>
                      <p className="text-[11px] font-bold opacity-60 truncate">{testResult.message}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Documentation Section */}
        <div className="space-y-6 min-w-0">
          <div className="glow-card p-0 rounded-2xl overflow-hidden border border-white/5 bg-[#080808]">
            <div className="flex bg-white/[0.02] border-b border-white/5 items-center px-4 py-3">
              <div className="flex items-center gap-2 text-emerald-500 min-w-0">
                <Radio size={14} className="shrink-0" />
                <span className="text-[10px] uppercase font-black tracking-widest truncate">webhook.php</span>
              </div>
              <div className="flex-1" />
              <button 
                onClick={() => handleCopy(phpCode, 'php-code')}
                className="text-gray-500 hover:text-white transition-colors"
              >
                {copying === 'php-code' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>
            <div className="p-4 overflow-x-auto text-[11px] font-mono custom-scrollbar">
              <SyntaxHighlighter 
                language="php" 
                style={atomDark} 
                customStyle={{ background: 'transparent', padding: 0, margin: 0 }}
              >
                {phpCode}
              </SyntaxHighlighter>
            </div>
          </div>

          <div className="glow-card p-0 rounded-2xl overflow-hidden border border-white/5 bg-[#080808]">
            <div className="flex bg-white/[0.02] border-b border-white/5 items-center px-4 py-3">
              <div className="flex items-center gap-2 text-yellow-500 min-w-0">
                <Code2 size={16} className="shrink-0" />
                <span className="text-[10px] uppercase font-black tracking-widest truncate">Payload JSON</span>
              </div>
              <div className="flex-1" />
              <button 
                onClick={() => handleCopy(payloadExample, 'json-code')}
                className="text-gray-500 hover:text-white transition-colors"
              >
                {copying === 'json-code' ? <Check size={16} className="text-yellow-500" /> : <Copy size={16} />}
              </button>
            </div>
            <div className="p-4 overflow-x-auto text-[11px] font-mono custom-scrollbar">
              <SyntaxHighlighter 
                language="json" 
                style={atomDark} 
                customStyle={{ background: 'transparent', padding: 0, margin: 0 }}
              >
                {payloadExample}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
