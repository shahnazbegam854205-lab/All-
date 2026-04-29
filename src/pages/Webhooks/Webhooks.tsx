import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Webhook, 
  Settings, 
  Save, 
  Check, 
  Copy, 
  Terminal, 
  Code2, 
  AlertCircle,
  Activity,
  Zap,
  Radio,
  Server,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Webhooks() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copying, setCopying] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const fetchWebhook = async () => {
      try {
        const { data } = await api.get('/api/user/profile');
        if (data && data.user) {
          setWebhookUrl(data.user.webhookUrl || '');
        }
      } catch (err) {
        console.error('Failed to fetch webhook config:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWebhook();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSuccess(false);
    try {
      await api.post('/api/user/update-webhook', { webhookUrl });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update webhook URL');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    if (!webhookUrl) return alert('Enter a URL first');
    setIsTesting(true);
    setTestResult(null);
    try {
      // Simulate/Trigger a ping from the server side if endpoint exists
      // For now we do a client-side check to see if reachable, 
      // but ideally this would be a server-side "api.post('/api/user/test-webhook')"
      const { data } = await api.post('/api/user/test-webhook', { url: webhookUrl });
      setTestResult({ success: true, message: data.message || 'Stream active: 200 OK received' });
    } catch (err: any) {
      setTestResult({ 
        success: false, 
        message: err.response?.data?.error || 'Connection failed: Ensure your server handles POST and has no firewall blocks.' 
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopying(id);
    setTimeout(() => setCopying(null), 2000);
  };

  const serverCode = `const express = require('express');
const app = express();
app.use(express.json());

// BOT CONFIGURATION MAP
const bots = {
  'node_dev_1': { name: 'Support Bot', logic: (msg) => console.log('Support logic...') },
  'node_dev_2': { name: 'Sales Bot', logic: (msg) => console.log('Sales logic...') }
};

app.post('/webhook', (req, res) => {
  const { event, instanceId, data } = req.body;
  
  if (event === 'messages.upsert') {
    const activeBot = bots[instanceId];
    
    if (activeBot) {
      console.log(\`[\${activeBot.name}] Processing message from \${data.from}\`);
      activeBot.logic(data);
    } else {
      console.log(\`[Unknown Node: \${instanceId}] Data received\`);
    }
  }

  res.status(200).send('ACK');
});

app.listen(3000, () => console.log('Matrix Router active on 3000'));`;

  const payloadExample = `{
  "event": "messages.upsert",
  "instanceId": "node_772x_a9", 
  "data": {
    "from": "919876543210@s.whatsapp.net",
    "text": "Hello Multiple Devices!",
    "timestamp": 1714412345
  }
}`;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-cyan-500" size={40} />
        <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">Synchronizing Matrix...</p>
      </div>
    );
  }

  const apiDocs = {
    method: 'POST',
    endpoint: '/api/user/update-webhook',
    body: { webhookUrl: 'https://your-domain.com/hook' },
    description: 'Updates your global webhook endpoint for all connected nodes.'
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-widest uppercase flex items-center gap-3">
            <Radio className="text-cyan-500 animate-pulse" size={24} />
            Data<span className="text-cyan-500"> Webhooks</span>
          </h2>
          <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mt-1">Real-time HTTP integration protocols</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Configuration Section */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glow-card p-8 rounded-[2.5rem] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <Settings size={120} />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 flex items-center gap-2 px-1">
                  <Server size={12} /> Target Endpoint URL
                </label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-server.com/webhook"
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-gray-700"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-cyan-500/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity" />
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <h4 className="text-[10px] uppercase font-black tracking-widest text-white mb-4 flex items-center gap-2">
                  <Zap size={12} className="text-yellow-500" /> Active Streams
                </h4>
                <div className="space-y-3">
                  {[
                    { label: 'Incoming Messages', event: 'messages.upsert', status: 'ACTIVE' },
                    { label: 'Status Updates', event: 'messages.update', status: 'ACTIVE' },
                    { label: 'Connection States', event: 'connection.update', status: 'ACTIVE' },
                    { label: 'Read Receipts', event: 'messages.receipt', status: 'STANDBY' }
                  ].map((item) => (
                    <div key={item.event} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                      <div>
                        <p className="text-xs font-bold text-gray-300">{item.label}</p>
                        <p className="text-[9px] font-mono text-gray-600">{item.event}</p>
                      </div>
                      <span className={cn(
                        "text-[8px] font-black tracking-widest px-2 py-1 rounded",
                        item.status === 'ACTIVE' ? 'bg-cyan-500/10 text-cyan-500' : 'bg-white/5 text-gray-600'
                      )}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 py-4 bg-cyan-500 text-black font-black rounded-2xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : (success ? <Check size={18} /> : <Save size={18} />)}
                  {isSaving ? "Synchronizing..." : (success ? "Link Established" : "Commit Changes")}
                </button>
                <button 
                  onClick={handleTest}
                  disabled={isTesting || !webhookUrl}
                  className="px-6 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all border border-white/5 uppercase tracking-widest text-[10px] disabled:opacity-30"
                >
                  {isTesting ? "Testing..." : "Test Stream"}
                </button>
              </div>

              <AnimatePresence>
                {testResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-4 rounded-xl border flex items-center gap-3",
                      testResult.success ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                    )}
                  >
                    {testResult.success ? <Check size={16} /> : <AlertCircle size={16} />}
                    <p className="text-[10px] font-bold uppercase tracking-wider">{testResult.message}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-[2rem] flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
              <Activity size={20} />
            </div>
            <div>
              <h5 className="text-white font-bold text-sm">Instance Multi-Streaming</h5>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">If you have multiple devices, the webhook sends the <code className="text-cyan-400">instanceId</code> for every event. Your server should use this to distinguish which device the message belongs to.</p>
            </div>
          </div>
        </div>

        {/* Documentation Section */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glow-card p-0 rounded-[2.5rem] overflow-hidden border border-white/5"
          >
            <div className="flex bg-white/5 border-b border-white/5">
              <div className="flex items-center gap-2 px-6 py-4 border-r border-white/5 text-cyan-500">
                <Terminal size={14} />
                <span className="text-[10px] uppercase font-black tracking-widest">Node.js Implementation</span>
              </div>
              <div className="flex-1" />
              <button 
                onClick={() => handleCopy(serverCode, 'node-code')}
                className="px-6 py-4 text-gray-500 hover:text-white transition-colors"
              >
                {copying === 'node-code' ? <Check size={14} className="text-cyan-500" /> : <Copy size={14} />}
              </button>
            </div>
            <div className="p-4 bg-[#0a0a0a] overflow-x-auto custom-scrollbar">
              <SyntaxHighlighter 
                language="javascript" 
                style={atomDark}
                customStyle={{ background: 'transparent', padding: 0, fontSize: '11px', lineHeight: '1.6' }}
              >
                {serverCode}
              </SyntaxHighlighter>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glow-card p-0 rounded-[2.5rem] overflow-hidden border border-white/5"
          >
            <div className="flex bg-white/5 border-b border-white/5">
              <div className="flex items-center gap-2 px-6 py-4 border-r border-white/5 text-yellow-500">
                <Code2 size={14} />
                <span className="text-[10px] uppercase font-black tracking-widest">Sample Payload JSON</span>
              </div>
              <div className="flex-1" />
              <button 
                onClick={() => handleCopy(payloadExample, 'json-code')}
                className="px-6 py-4 text-gray-500 hover:text-white transition-colors"
              >
                {copying === 'json-code' ? <Check size={14} className="text-cyan-500" /> : <Copy size={14} />}
              </button>
            </div>
            <div className="p-4 bg-[#0a0a0a] overflow-x-auto custom-scrollbar">
              <SyntaxHighlighter 
                language="json" 
                style={atomDark}
                customStyle={{ background: 'transparent', padding: 0, fontSize: '11px', lineHeight: '1.6' }}
              >
                {payloadExample}
              </SyntaxHighlighter>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Integration Guide */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Endpoint Security",
            text: "Implement secret token header validation to ensure only our servers can transmit data to your endpoint.",
            icon: <AlertCircle className="text-red-400" size={18} />
          },
          {
            title: "Async Processing",
            text: "Process incoming events asynchronously. Respond 200 OK first, then perform your heavy processing tasks.",
            icon: <Zap className="text-yellow-400" size={18} />
          },
          {
            title: "Retry Mechanism",
            text: "We attempt 3 transmission retries in case of failure. Failed deliveries are logged in our internal buffers.",
            icon: <Activity className="text-cyan-400" size={18} />
          }
        ].map((guide, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-cyan-500/30 transition-colors group">
            <div className="flex items-center gap-3 mb-4">
              {guide.icon}
              <h6 className="text-white font-black text-[10px] uppercase tracking-widest">{guide.title}</h6>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed group-hover:text-gray-400 transition-colors">
              {guide.text}
            </p>
          </div>
        ))}
      </div>

      {/* API Reference Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glow-card p-10 rounded-[3rem] border border-cyan-500/10 bg-gradient-to-br from-black to-slate-900/50"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500">
            <Code2 size={24} />
          </div>
          <div>
            <h4 className="text-xl font-black text-white uppercase tracking-tight">API Reference</h4>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Manage configurations programmatically</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <p className="text-gray-400 text-sm leading-relaxed">
              Integrate the Happy Own protocol directly into your automation scripts. You can update, verify, or disable your data streams without visiting this dashboard.
            </p>
            <div className="flex flex-wrap gap-4 font-mono text-[10px]">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                <span className="text-gray-500">HEADER</span>
                <span className="text-cyan-500">x-api-key</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                <span className="text-gray-500">TIMEOUT</span>
                <span className="text-yellow-500">5000ms</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0a] rounded-3xl p-6 border border-white/5 font-mono text-[11px] space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <span className="bg-cyan-500 text-black px-2 py-0.5 rounded font-black text-[9px]">POST</span>
                <span className="text-gray-300">/api/user/update-webhook</span>
              </div>
              <Terminal size={14} className="text-gray-700" />
            </div>
            <SyntaxHighlighter language="json" style={atomDark} customStyle={{ background: 'transparent', padding: 0 }}>
              {JSON.stringify(apiDocs.body, null, 2)}
            </SyntaxHighlighter>
          </div>
        </div>
      </motion.div>

      {/* FAQs / Doubts Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glow-card p-10 rounded-[3rem] border border-cyan-500/10"
      >
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500">
            <Settings size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Common Doubts & FAQ</h3>
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">Understanding the data transmission layer</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <h5 className="text-cyan-500 font-bold text-sm mb-2 flex items-center gap-2">
                <ChevronRight size={14} /> How to handle Multiple Devices?
              </h5>
              <p className="text-gray-400 text-xs leading-relaxed">
                Your webhook receives events from <strong>all</strong> of your active nodes. Use the <code className="bg-white/5 px-1 rounded text-cyan-400">instanceId</code> field in the JSON payload to filter logic per device.
              </p>
            </div>
            <div>
              <h5 className="text-cyan-500 font-bold text-sm mb-2 flex items-center gap-2">
                <ChevronRight size={14} /> Is Railway Free Trial okay?
              </h5>
              <p className="text-gray-400 text-xs leading-relaxed">
                Yes, but be careful of "Hibernation". If your Railway instance goes to sleep to save credits, our webhook will fail to deliver data. Ensure your instance is set to "Always On" for mission-critical bots.
              </p>
            </div>
            <div>
              <h5 className="text-cyan-500 font-bold text-sm mb-2 flex items-center gap-2">
                <ChevronRight size={14} /> My webhook is not responding?
              </h5>
              <p className="text-gray-400 text-xs leading-relaxed">
                Most common issue: <strong>CORS or Firewall</strong>. Ensure your server allows POST requests from any origin or specifically whitelist our IPs. Use the "Test Stream" button to check real-time availability.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h5 className="text-cyan-500 font-bold text-sm mb-2 flex items-center gap-2">
                <ChevronRight size={14} /> Why Status 200 is Mandatory?
              </h5>
              <p className="text-gray-400 text-xs leading-relaxed">
                Your server must return a <code className="text-emerald-400">200 OK</code> status within 5 seconds. If it takes longer or returns an error, we mark the transmission as failed and try again later.
              </p>
            </div>
            <div>
              <h5 className="text-cyan-500 font-bold text-sm mb-2 flex items-center gap-2">
                <ChevronRight size={14} /> Is my data secure?
              </h5>
              <p className="text-gray-400 text-xs leading-relaxed">
                All transmissions are encrypted via HTTPS. For production, always verify the payload and use a secret header that only you and our system know.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
