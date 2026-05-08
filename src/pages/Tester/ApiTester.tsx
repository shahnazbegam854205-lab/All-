import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Device } from '../../types';
import { motion } from 'framer-motion';
import { 
  Play, 
  Send, 
  Database, 
  Code2, 
  CheckCircle2, 
  AlertCircle,
  Smartphone,
  ChevronDown,
  Loader2,
  Terminal,
  Image,
  FileText,
  Music,
  Users
} from 'lucide-react';
import { cn } from '../../lib/utils';

const YOUR_API_URL = 'https://whatsapp-api-salution-production.up.railway.app';

export default function ApiTester() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [activeEndpoint, setActiveEndpoint] = useState(0);
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // API Endpoints as per your server
  const testEndpoints = [
    { method: 'POST', path: '/api/send', label: 'Send Text', default: { number: '919876543210', message: 'Hello from API Tester!' } },
    { method: 'POST', path: '/api/send/bulk', label: 'Bulk Text', default: { numbers: ["919876543210", "919876543211"], message: 'Bulk message test' } },
    { method: 'POST', path: '/api/send/image', label: 'Send Image', default: { number: '919876543210', caption: 'Test Image' } },
    { method: 'POST', path: '/api/send/bulk-image', label: 'Bulk Image', default: { numbers: ["919876543210", "919876543211"], caption: 'Bulk Image Test' } },
    { method: 'POST', path: '/api/send/bulk-image-url', label: 'Bulk Image URL', default: { numbers: ["919876543210", "919876543211"], imageUrl: 'https://picsum.photos/500', caption: 'Bulk Image from URL' } },
    { method: 'POST', path: '/api/send/video', label: 'Send Video', default: { number: '919876543210', caption: 'Test Video' } },
    { method: 'POST', path: '/api/send/audio', label: 'Send Audio', default: { number: '919876543210' } },
    { method: 'POST', path: '/api/send/document', label: 'Send Document', default: { number: '919876543210', filename: 'document.pdf' } },
    { method: 'POST', path: '/api/messages/reply', label: 'Reply to Message', default: { chatId: '919876543210@c.us', replyToMessageId: 'msg_123', message: 'This is a reply!' } },
    { method: 'POST', path: '/api/messages/forward', label: 'Forward Message', default: { fromChatId: '919876543210@c.us', toChatId: '919876543211@c.us', messageId: 'msg_123' } },
    { method: 'DELETE', path: '/api/messages/:messageId', label: 'Delete Message', default: { deviceId: '', chatId: '919876543210@c.us', forEveryone: false } },
    { method: 'POST', path: '/api/send/template', label: 'Send Template', default: { number: '919876543210', templateId: 'tmpl_welcome', variables: { name: 'Raj' } } },
    { method: 'GET', path: '/api/devices', label: 'List Devices', default: {} },
    { method: 'GET', path: '/api/conversations/:deviceId', label: 'Get Conversations', default: {} },
    { method: 'GET', path: '/api/messages/unread', label: 'Unread Messages', default: {} },
    { method: 'GET', path: '/api/groups/:deviceId', label: 'List Groups', default: {} },
    { method: 'POST', path: '/api/groups/create', label: 'Create Group', default: { name: 'Test Group', participants: ["919876543210", "919876543211"] } },
    { method: 'POST', path: '/api/groups/send', label: 'Send to Group', default: { groupId: '123456789@g.us', message: 'Hello Group!' } },
    { method: 'GET', path: '/api/templates', label: 'List Templates', default: {} },
    { method: 'POST', path: '/api/templates/create', label: 'Create Template', default: { name: 'Welcome Template', message: 'Hello {{name}}, welcome!', variables: ['name'], category: 'greeting' } },
    { method: 'GET', path: '/api/webhook/status', label: 'Webhook Status', default: {} },
    { method: 'POST', path: '/api/webhook/register', label: 'Register Webhook', default: { webhookUrl: 'https://your-server.com/webhook', events: ['message'] } },
    { method: 'GET', path: '/api/contacts/:deviceId', label: 'List Contacts', default: {} },
    { method: 'GET', path: '/api/user/profile', label: 'User Profile', default: {} },
    { method: 'GET', path: '/api/user/stats', label: 'User Stats', default: {} },
    { method: 'POST', path: '/api/typing/:deviceId/:number', label: 'Typing Indicator', default: { number: '919876543210', isTyping: true } },
    { method: 'POST', path: '/api/read/:deviceId/:chatId', label: 'Mark as Read', default: { chatId: '919876543210@c.us' } },
    { method: 'GET', path: '/api/whatsapp/status/:deviceId', label: 'WhatsApp Status', default: {} },
    { method: 'GET', path: '/health', label: 'Health Check', default: {} },
  ];

  useEffect(() => {
    const defaultPayload = testEndpoints[activeEndpoint].default;
    let payloadStr = JSON.stringify(defaultPayload, null, 2);
    
    // Remove deviceId placeholder if present
    if (payloadStr.includes('"deviceId": ""')) {
      const withoutDeviceId = { ...defaultPayload };
      delete withoutDeviceId.deviceId;
      payloadStr = JSON.stringify(withoutDeviceId, null, 2);
    }
    
    setPayload(payloadStr);
    setSelectedFile(null);
  }, [activeEndpoint]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const apiKey = localStorage.getItem('apiKey');
        if (!apiKey) return;
        
        const response = await fetch(`${YOUR_API_URL}/api/devices`, {
          headers: { 'x-api-key': apiKey }
        });
        const data = await response.json();
        const active = data.devices || [];
        setDevices(active);
        if (active.length > 0) setSelectedDevice(active[0].deviceId);
      } catch (error) {
        console.error('Failed to fetch devices:', error);
      }
    };
    
    fetchDevices();
  }, []);

  const handleTest = async () => {
    if (!selectedDevice && testEndpoints[activeEndpoint].method !== 'GET') {
      setResponse({ error: "Please select a device first." });
      return;
    }

    setIsLoading(true);
    setResponse(null);
    
    try {
      const ep = testEndpoints[activeEndpoint];
      const apiKey = localStorage.getItem('apiKey');
      
      if (!apiKey) {
        throw new Error('API key not found. Please login again.');
      }
      
      let url = `${YOUR_API_URL}${ep.path}`;
      let options: any = {
        method: ep.method,
        headers: {
          'x-api-key': apiKey
        }
      };
      
      // Handle path parameters
      if (url.includes(':deviceId') && selectedDevice) {
        url = url.replace(':deviceId', selectedDevice);
      }
      if (url.includes(':chatId') && payload) {
        try {
          const payloadObj = JSON.parse(payload);
          if (payloadObj.chatId) {
            url = url.replace(':chatId', encodeURIComponent(payloadObj.chatId));
          }
        } catch(e) {}
      }
      if (url.includes(':number') && payload) {
        try {
          const payloadObj = JSON.parse(payload);
          if (payloadObj.number) {
            url = url.replace(':number', payloadObj.number);
          }
        } catch(e) {}
      }
      if (url.includes(':messageId') && payload) {
        try {
          const payloadObj = JSON.parse(payload);
          if (payloadObj.messageId) {
            url = url.replace(':messageId', payloadObj.messageId);
          }
        } catch(e) {}
      }
      
      if (ep.method === 'GET') {
        options.headers['Content-Type'] = 'application/json';
        const response = await fetch(url, options);
        const data = await response.json();
        setResponse(data);
      } 
      else if (selectedFile) {
        // File upload
        const formData = new FormData();
        formData.append('deviceId', selectedDevice);
        
        let payloadObj = {};
        try {
          payloadObj = JSON.parse(payload);
        } catch(e) {}
        
        Object.keys(payloadObj).forEach(key => {
          if (key === 'numbers' && Array.isArray(payloadObj[key])) {
            formData.append(key, JSON.stringify(payloadObj[key]));
          } else if (key === 'recipients' && Array.isArray(payloadObj[key])) {
            formData.append(key, JSON.stringify(payloadObj[key]));
          } else if (key !== 'deviceId') {
            formData.append(key, String(payloadObj[key]));
          }
        });
        
        // Determine file field name
        let fileField = 'image';
        if (ep.path.includes('audio')) fileField = 'audio';
        else if (ep.path.includes('document')) fileField = 'document';
        else if (ep.path.includes('video')) fileField = 'video';
        
        formData.append(fileField, selectedFile);
        
        options.body = formData;
        delete options.headers['Content-Type'];
        
        const response = await fetch(url, options);
        const data = await response.json();
        setResponse(data);
      }
      else {
        // JSON request
        options.headers['Content-Type'] = 'application/json';
        let payloadObj = {};
        try {
          payloadObj = JSON.parse(payload);
        } catch(e: any) {
          throw new Error(`Invalid JSON: ${e.message}`);
        }
        
        // Add deviceId to payload if not a GET request and deviceId not already present
        if (selectedDevice && !payloadObj.deviceId && ep.method !== 'GET') {
          payloadObj.deviceId = selectedDevice;
        }
        
        options.body = JSON.stringify(payloadObj);
        
        const response = await fetch(url, options);
        const data = await response.json();
        setResponse(data);
      }
      
    } catch (err: any) {
      setResponse({ error: err.message || 'Request failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const isUploadable = testEndpoints[activeEndpoint].path.includes('image') || 
                      testEndpoints[activeEndpoint].path.includes('document') ||
                      testEndpoints[activeEndpoint].path.includes('audio') ||
                      testEndpoints[activeEndpoint].path.includes('video');

  const getEndpointIcon = (path: string) => {
    if (path.includes('image')) return <Image size={12} />;
    if (path.includes('document')) return <FileText size={12} />;
    if (path.includes('audio')) return <Music size={12} />;
    if (path.includes('group')) return <Users size={12} />;
    return <Send size={12} />;
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-widest uppercase">API<span className="text-cyan-500"> TESTER</span></h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">
            Base URL: {YOUR_API_URL}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 p-1.5 bg-[#111] border border-white/5 rounded-2xl max-h-48 overflow-y-auto custom-scrollbar">
          {testEndpoints.map((ep, idx) => (
            <button
              key={ep.label}
              onClick={() => setActiveEndpoint(idx)}
              className={cn(
                "px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5",
                activeEndpoint === idx ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" : "text-gray-500 hover:text-white hover:bg-white/5"
              )}
            >
              <span className={cn("opacity-60", activeEndpoint === idx && "opacity-100")}>
                {getEndpointIcon(ep.path)}
              </span>
              {ep.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="space-y-6">
          <div className="bg-[#111] p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
            
            {/* Device Selection - Hide for endpoints that don't need device */}
            {testEndpoints[activeEndpoint].method !== 'GET' && 
             !testEndpoints[activeEndpoint].path.includes('/health') && (
              <div className="space-y-3 sm:px-2">
                <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em]">Select Device</label>
                <div className="relative">
                  <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500" size={18} />
                  <select 
                    className="w-full bg-black border border-white/10 rounded-2xl py-5 pl-14 pr-10 outline-none focus:border-cyan-500 appearance-none font-bold text-white transition-all shadow-inner text-sm"
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                  >
                    <option value="">Choose a device...</option>
                    {devices.map(d => (
                      <option key={d.deviceId} value={d.deviceId}>{d.name} ({d.phone || 'Not connected'})</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" size={18} />
                </div>
                {devices.length === 0 && (
                  <p className="text-[9px] text-yellow-500/70 px-2">
                    ⚠️ No devices found. Please connect a device first.
                  </p>
                )}
              </div>
            )}

            {/* File Upload */}
            {isUploadable && (
              <div className="space-y-3 sm:px-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em]">Upload File</label>
                  {selectedFile && (
                    <button 
                      onClick={() => setSelectedFile(null)}
                      className="text-[9px] font-black uppercase text-red-500 hover:text-red-400 flex items-center gap-1"
                    >
                      <AlertCircle size={10} /> Clear
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <input 
                    type="file" 
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden" 
                    id="file-upload"
                    accept={
                      testEndpoints[activeEndpoint].path.includes('image') ? 'image/*' :
                      testEndpoints[activeEndpoint].path.includes('video') ? 'video/*' :
                      testEndpoints[activeEndpoint].path.includes('audio') ? 'audio/*' :
                      '.pdf,.doc,.docx,.txt'
                    }
                  />
                  <label 
                    htmlFor="file-upload"
                    className={cn(
                      "flex items-center justify-between w-full border rounded-2xl p-5 cursor-pointer transition-all font-bold text-xs ring-offset-black focus-within:ring-2 focus-within:ring-cyan-500",
                      selectedFile ? "border-cyan-500 bg-cyan-500/5 text-cyan-400" : "border-white/10 bg-black hover:border-white/20 text-gray-400"
                    )}
                  >
                    <span className="truncate pr-4">
                      {selectedFile ? selectedFile.name : "Select a file to upload..."}
                    </span>
                    <Play size={14} className="text-cyan-500 rotate-90 shrink-0" />
                  </label>
                </div>
                <p className="text-[8px] text-gray-600 px-2">
                  Supported: {testEndpoints[activeEndpoint].path.includes('image') ? 'JPG, PNG, GIF, WEBP' :
                              testEndpoints[activeEndpoint].path.includes('video') ? 'MP4, MOV, AVI' :
                              testEndpoints[activeEndpoint].path.includes('audio') ? 'MP3, OGG, M4A' :
                              'PDF, DOC, DOCX, TXT'}
                </p>
              </div>
            )}

            {/* JSON Payload */}
            <div className="space-y-3 sm:px-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em]">Request JSON</label>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      try {
                        const obj = JSON.parse(payload);
                        setPayload(JSON.stringify(obj, null, 2));
                      } catch (e: any) {
                        alert(`JSON Error: ${e.message}`);
                      }
                    }}
                    className="hidden sm:block text-[9px] font-black uppercase text-cyan-500 hover:text-cyan-400 font-mono"
                  >
                    Format
                  </button>
                  <span className="text-[9px] font-black text-cyan-500/50 bg-cyan-500/5 px-2 py-1 rounded">
                    {testEndpoints[activeEndpoint].method}
                  </span>
                </div>
              </div>
              <div className="border border-white/5 rounded-3xl overflow-hidden bg-black shadow-inner">
                <textarea 
                  className="w-full bg-transparent p-5 sm:p-6 h-48 sm:h-56 outline-none font-mono text-[10px] sm:text-[11px] leading-relaxed text-cyan-400 custom-scrollbar resize-none"
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Test Button */}
            <button 
              disabled={isLoading || (devices.length === 0 && testEndpoints[activeEndpoint].method !== 'GET')}
              onClick={handleTest}
              className="glow-button w-full py-6 text-sm font-black uppercase tracking-[0.3em] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin mx-auto text-black" size={24} /> : (
                <span className="flex items-center justify-center gap-2">
                  <Play size={16} className="fill-black" /> Test {testEndpoints[activeEndpoint].label}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Response Panel */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Terminal size={14} className="text-cyan-500" />
              Response Output
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black text-emerald-400 uppercase tracking-wider">
                {YOUR_API_URL}
              </span>
            </div>
          </div>

          <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col h-[400px] sm:h-[520px] shadow-inner">
            <div className="flex-1 overflow-auto p-5 font-mono text-[10px] sm:text-[11px] leading-relaxed custom-scrollbar text-cyan-400">
              {response ? (
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(response, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-800 space-y-4">
                  <Database size={48} className="opacity-10" />
                  <p className="font-bold tracking-widest uppercase text-xs">Click Test API to see response</p>
                  <p className="text-[9px] text-gray-700">Endpoint: {testEndpoints[activeEndpoint].path}</p>
                </div>
              )}
            </div>
            {response && (
              <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
                <span className={cn(
                  "text-[10px] font-bold uppercase",
                  response.error ? "text-red-500" : "text-emerald-500"
                )}>
                  {response.error ? '❌ Error Response' : '✅ Success Response'}
                </span>
                <button 
                  onClick={() => setResponse(null)} 
                  className="text-[10px] font-bold text-cyan-500 hover:text-cyan-400 uppercase transition-colors"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          
          {/* Quick Tip */}
          <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-4">
            <p className="text-[9px] text-cyan-400/70 font-mono">
              💡 <span className="font-bold">Tip:</span> Replace phone numbers with real WhatsApp numbers that have previously messaged your bot.
              For LID support, the system automatically resolves @lid to @c.us format.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
