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
  Settings,
  Globe,
  Link,
  MessageCircle // Added for WhatsApp icon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Webhooks() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copying, setCopying] = useState(null);
  const [webhookStatus, setWebhookStatus] = useState(null);
  const [events, setEvents] = useState(['message']);
  const [apiKey, setApiKey] = useState('');

  const YOUR_API_URL = 'https://whatsapp-api-salution-production.up.railway.app';
  const WHATSAPP_NUMBER = '639079249283'; // Without + sign

  // Load webhook status on mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('apiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      fetchWebhookStatus(storedApiKey);
    }
  }, []);

  const fetchWebhookStatus = async (key) => {
    try {
      const response = await fetch(`${YOUR_API_URL}/api/webhook/status`, {
        headers: { 'x-api-key': key }
      });
      const data = await response.json();
      if (data.registered) {
        setWebhookUrl(data.url);
        setEvents(data.events || ['message']);
        setWebhookStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch webhook status:', error);
    }
  };

  const handleSave = async () => {
    if (!webhookUrl) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`${YOUR_API_URL}/api/webhook/register`, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          webhookUrl: webhookUrl,
          events: events,
          secret: null
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setTestResult({ success: false, message: data.error || 'Registration failed' });
      }
    } catch (error) {
      setTestResult({ success: false, message: error.message });
    }
    setIsSaving(false);
  };

  const handleTest = async () => {
    if (!webhookUrl) return;
    
    setIsTesting(true);
    setTestResult(null);
    
    try {
      // Send test payload to your webhook
      const testPayload = {
        event: 'test',
        message: 'Webhook test from WhatsApp API Platform',
        timestamp: Date.now()
      };
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
      });
      
      if (response.ok) {
        setTestResult({
          success: true,
          message: "Webhook test successful! Your server responded with 200 OK."
        });
      } else {
        setTestResult({
          success: false,
          message: `Server responded with status ${response.status}. Please check your endpoint.`
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Cannot reach your server: ${error.message}. Make sure your endpoint is public.`
      });
    }
    setIsTesting(false);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopying(id);
    setTimeout(() => setCopying(null), 2000);
  };

  const handleWhatsAppSupport = () => {
    // Format: https://wa.me/639079249283
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
  };

  // Node.js Webhook Receiver Code
  const nodejsCode = `const express = require('express');
const app = express();
app.use(express.json());

// Your webhook endpoint
app.post('/webhook', async (req, res) => {
    const { event, deviceId, from, body, timestamp } = req.body;
    
    console.log(\`📩 Message from: \${from}\`);
    console.log(\`💬 Content: \${body}\`);
    
    // 🔥 YOUR LOGIC HERE
    let reply = null;
    
    if (body?.toLowerCase().includes('hi')) {
        reply = "Hello! 👋 How can I help you?";
    } else if (body?.toLowerCase().includes('price')) {
        reply = "💰 Price: ₹999 only!";
    } else if (body?.toLowerCase().includes('help')) {
        reply = "Commands: PRICE, CONTACT, ABOUT";
    }
    
    // Send reply back via API
    if (reply) 
        await fetch('https://whatsapp-api-salution-production.up.railway.app/api/send', {
            method: 'POST',
            headers: {
                'x-api-key': 'YOUR_API_KEY_HERE',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                deviceId: deviceId,
                number: from,
                message: reply
            })
        });
    }
    
    res.json({ received: true });
});

app.listen(3000, () => {
    console.log('🚀 Webhook server running on port 3000');
});`;

  // Python Webhook Receiver Code
  const pythonCode = `from flask import Flask, request, jsonify
import requests
import json

app = Flask(__name__)

YOUR_API_URL = "https://whatsapp-api-salution-production.up.railway.app/api/send"
API_KEY = "YOUR_API_KEY_HERE"

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.json
    device_id = data.get('deviceId')
    from_number = data.get('from')
    body = data.get('body', '')
    
    print(f"📩 Message from: {from_number}")
    print(f"💬 Content: {body}")
    
    # 🔥 YOUR LOGIC HERE
    reply = None
    
    if 'hi' in body.lower():
        reply = "Hello! 👋 How can I help you?"
    elif 'price' in body.lower():
        reply = "💰 Price: ₹999 only!"
    elif 'help' in body.lower():
        reply = "Commands: PRICE, CONTACT, ABOUT"
    
    # Send reply back
    if reply:
        requests.post(YOUR_API_URL, 
            headers={'x-api-key': API_KEY, 'Content-Type': 'application/json'},
            json={'deviceId': device_id, 'number': from_number, 'message': reply}
        )
    
    return jsonify({"received": True})

if __name__ == '__main__':
    app.run(port=3000)`;

  // PHP Webhook Receiver Code
  const phpCode = `<?php
// webhook.php - Your server endpoint

$data = json_decode(file_get_contents('php://input'), true);

$deviceId = $data['deviceId'] ?? '';
$from = $data['from'] ?? '';
$body = $data['body'] ?? '';

// Log received message
file_put_contents('webhook.log', date('Y-m-d H:i:s') . " - From: $from - Msg: $body\\n", FILE_APPEND);

// 🔥 YOUR LOGIC HERE
$reply = null;

if (stripos($body, 'hi') !== false) {
    $reply = "Hello! 👋 How can I help you?";
} elseif (stripos($body, 'price') !== false) {
    $reply = "💰 Price: ₹999 only!";
} elseif (stripos($body, 'help') !== false) {
    $reply = "Commands: PRICE, CONTACT, ABOUT";
}

// Send reply back
if ($reply) {
    $apiUrl = "https://whatsapp-api-salution-production.up.railway.app/api/send";
    $apiKey = "YOUR_API_KEY_HERE";
    
    $payload = json_encode([
        'deviceId' => $deviceId,
        'number' => $from,
        'message' => $reply
    ]);
    
    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'x-api-key: ' . $apiKey,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_exec($ch);
    curl_close($ch);
}

http_response_code(200);
echo json_encode(['received' => true]);
?>`;

  // Webhook Payload Example
  const payloadExample = `{
  "event": "message",
  "deviceId": "dev_abc123",
  "from": "919876543210@c.us",
  "to": "918888888888@c.us",
  "body": "Hi, price kya hai?",
  "timestamp": 1700000000000,
  "messageId": "msg_123456789",
  "isGroup": false,
  "isLidConverted": false
}`;

  // CURL Command for Registration
  const curlCommand = `curl -X POST ${YOUR_API_URL}/api/webhook/register \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "webhookUrl": "https://your-server.com/webhook",
    "events": ["message"]
  }'`;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center sm:items-start text-center sm:text-left pt-6 sm:pt-10 relative">
        <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-4">
          <Radio className="text-cyan-500" size={28} />
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
          Webhook<span className="text-cyan-500"> Settings</span>
        </h2>
        <p className="text-gray-500 text-[10px] sm:text-sm uppercase font-bold tracking-widest mt-2">
          Real-time message notifications to your server
        </p>
        
        {/* WhatsApp Support Button - Floating position */}
        <motion.button
          onClick={handleWhatsAppSupport}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#1da851] rounded-xl shadow-lg shadow-[#25D366]/20 transition-all duration-300"
        >
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9uY7cpz03f282ot9udmEc8ech0KPCypmXPpoRVaGlCw&s"
            alt="WhatsApp Support"
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">
            Support
          </span>
        </motion.button>
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
              {/* Webhook URL Input */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 flex items-center gap-2 px-1">
                  <Link size={12} className="text-cyan-500" /> Your Webhook Endpoint URL
                </label>
                <input 
                  type="text" 
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-server.com/webhook"
                  className="w-full bg-black border border-white/10 rounded-xl py-4 px-5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 transition-all placeholder:text-gray-900"
                />
                <p className="text-[9px] text-gray-600 px-1">
                  Your server endpoint that will receive WhatsApp messages
                </p>
              </div>

              {/* Event Subscriptions */}
              <div className="bg-white/[0.02] rounded-2xl p-5 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-white/40 flex items-center gap-2">
                    <Zap size={14} className="text-yellow-500" /> Events to Receive
                  </h4>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
                  </div>
                </div>
                
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 bg-black/60 rounded-xl border border-white/5">
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="text-xs font-bold text-gray-200 truncate">Incoming Messages</p>
                      <p className="text-[9px] font-mono text-gray-600 truncate">message</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[8px] font-black tracking-tighter px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                        AUTO
                      </span>
                    </div>
                  </div>
                  <p className="text-[9px] text-gray-600 px-2">
                    ✅ Message events are automatically sent to your webhook URL
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleSave}
                  disabled={isSaving || !webhookUrl}
                  className={cn(
                    "flex-[2] py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2",
                    success ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 scale-[0.98]" : "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 hover:scale-[0.98] transition-transform"
                  )}
                >
                  {isSaving ? <Loader2 className="animate-spin" size={16} /> : (success ? <Check size={16} /> : <Save size={16} />)}
                  {isSaving ? "Registering..." : (success ? "Registered!" : "Register Webhook")}
                </button>
                <button 
                  onClick={handleTest}
                  disabled={isTesting || !webhookUrl}
                  className="flex-1 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                >
                  {isTesting ? <Loader2 className="animate-spin" size={14} /> : <Activity size={14} className="text-cyan-500" />}
                  Test Webhook
                </button>
              </div>

              {/* Test Result */}
              <AnimatePresence>
                {testResult && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      "p-4 rounded-xl border flex items-center gap-4",
                      testResult.success ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-red-500/5 border-red-500/20 text-red-400"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      testResult.success ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                    )}>
                      {testResult.success ? <Check size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest mb-0.5">{testResult.success ? 'Success' : 'Error'}</p>
                      <p className="text-[11px] font-bold opacity-60 break-words">{testResult.message}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Webhook Status */}
              {webhookStatus && webhookStatus.registered && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Webhook Active</p>
                  </div>
                  <p className="text-[10px] font-mono text-gray-400 mt-2 break-all">{webhookStatus.url}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Documentation Section */}
        <div className="space-y-6 min-w-0">
          {/* Node.js */}
          <div className="glow-card p-0 rounded-2xl overflow-hidden border border-white/5 bg-[#080808]">
            <div className="flex bg-white/[0.02] border-b border-white/5 items-center px-4 py-3">
              <div className="flex items-center gap-2 text-green-500 min-w-0">
                <Terminal size={14} className="shrink-0" />
                <span className="text-[10px] uppercase font-black tracking-widest truncate">Node.js Webhook Receiver</span>
              </div>
              <div className="flex-1" />
              <button 
                onClick={() => handleCopy(nodejsCode, 'nodejs-code')}
                className="text-gray-500 hover:text-white transition-colors"
              >
                {copying === 'nodejs-code' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
              </button>
            </div>
            <div className="p-4 overflow-x-auto text-[11px] font-mono custom-scrollbar max-h-80">
              <SyntaxHighlighter 
                language="javascript" 
                style={atomDark} 
                customStyle={{ background: 'transparent', padding: 0, margin: 0 }}
              >
                {nodejsCode}
              </SyntaxHighlighter>
            </div>
          </div>

          {/* Python */}
          <div className="glow-card p-0 rounded-2xl overflow-hidden border border-white/5 bg-[#080808]">
            <div className="flex bg-white/[0.02] border-b border-white/5 items-center px-4 py-3">
              <div className="flex items-center gap-2 text-blue-500 min-w-0">
                <Terminal size={14} className="shrink-0" />
                <span className="text-[10px] uppercase font-black tracking-widest truncate">Python Webhook Receiver</span>
              </div>
              <div className="flex-1" />
              <button 
                onClick={() => handleCopy(pythonCode, 'python-code')}
                className="text-gray-500 hover:text-white transition-colors"
              >
                {copying === 'python-code' ? <Check size={16} className="text-blue-400" /> : <Copy size={16} />}
              </button>
            </div>
            <div className="p-4 overflow-x-auto text-[11px] font-mono custom-scrollbar max-h-80">
              <SyntaxHighlighter 
                language="python" 
                style={atomDark} 
                customStyle={{ background: 'transparent', padding: 0, margin: 0 }}
              >
                {pythonCode}
              </SyntaxHighlighter>
            </div>
          </div>

          {/* PHP */}
          <div className="glow-card p-0 rounded-2xl overflow-hidden border border-white/5 bg-[#080808]">
            <div className="flex bg-white/[0.02] border-b border-white/5 items-center px-4 py-3">
              <div className="flex items-center gap-2 text-purple-500 min-w-0">
                <Terminal size={14} className="shrink-0" />
                <span className="text-[10px] uppercase font-black tracking-widest truncate">PHP Webhook Receiver</span>
              </div>
              <div className="flex-1" />
              <button 
                onClick={() => handleCopy(phpCode, 'php-code')}
                className="text-gray-500 hover:text-white transition-colors"
              >
                {copying === 'php-code' ? <Check size={16} className="text-purple-400" /> : <Copy size={16} />}
              </button>
            </div>
            <div className="p-4 overflow-x-auto text-[11px] font-mono custom-scrollbar max-h-80">
              <SyntaxHighlighter 
                language="php" 
                style={atomDark} 
                customStyle={{ background: 'transparent', padding: 0, margin: 0 }}
              >
                {phpCode}
              </SyntaxHighlighter>
            </div>
          </div>

          {/* Payload Example */}
          <div className="glow-card p-0 rounded-2xl overflow-hidden border border-white/5 bg-[#080808]">
            <div className="flex bg-white/[0.02] border-b border-white/5 items-center px-4 py-3">
              <div className="flex items-center gap-2 text-yellow-500 min-w-0">
                <Code2 size={16} className="shrink-0" />
                <span className="text-[10px] uppercase font-black tracking-widest truncate">Webhook Payload (What you'll receive)</span>
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

          {/* CURL Command */}
          <div className="glow-card p-0 rounded-2xl overflow-hidden border border-white/5 bg-[#080808]">
            <div className="flex bg-white/[0.02] border-b border-white/5 items-center px-4 py-3">
              <div className="flex items-center gap-2 text-cyan-500 min-w-0">
                <Globe size={14} className="shrink-0" />
                <span className="text-[10px] uppercase font-black tracking-widest truncate">Register via CURL</span>
              </div>
              <div className="flex-1" />
              <button 
                onClick={() => handleCopy(curlCommand, 'curl-code')}
                className="text-gray-500 hover:text-white transition-colors"
              >
                {copying === 'curl-code' ? <Check size={16} className="text-cyan-400" /> : <Copy size={16} />}
              </button>
            </div>
            <div className="p-4 overflow-x-auto text-[11px] font-mono custom-scrollbar">
              <SyntaxHighlighter 
                language="bash" 
                style={atomDark} 
                customStyle={{ background: 'transparent', padding: 0, margin: 0 }}
              >
                {curlCommand}
              </SyntaxHighlighter>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="glow-card p-5 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <Settings size={14} className="text-cyan-500" />
              <h3 className="text-[10px] uppercase font-black tracking-widest text-white/60">Quick Setup Guide</h3>
            </div>
            <ol className="space-y-3 text-[10px] font-mono text-gray-400">
              <li className="flex gap-3">
                <span className="text-cyan-500 font-bold">1.</span>
                <span>Copy the webhook receiver code above for your language</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-500 font-bold">2.</span>
                <span>Deploy it on your server (VPS, Render, Railway, etc.)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-500 font-bold">3.</span>
                <span>Replace <code className="bg-black/50 px-1 py-0.5 rounded">YOUR_API_KEY</code> with your actual API key</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-500 font-bold">4.</span>
                <span>Enter your public webhook URL above and click Register</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-500 font-bold">5.</span>
                <span>Click Test to verify your webhook is working</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
