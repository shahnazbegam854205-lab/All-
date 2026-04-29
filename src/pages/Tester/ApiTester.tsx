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
  Terminal
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ApiTester() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [activeEndpoint, setActiveEndpoint] = useState(0);
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const testEndpoints = [
    { method: 'POST', path: '/api/send', label: 'Send Text', default: { number: '919876543210', message: 'Hello from Tester!' } },
    { method: 'POST', path: '/api/send/image', label: 'Image (URL)', default: { number: '919876543210', imageUrl: 'https://example.com/image.jpg', caption: 'Image Test' } },
    { method: 'POST', path: '/api/send/image', label: 'Image (Upload)', default: { number: '919876543210', caption: 'Upload Test' } },
    { method: 'POST', path: '/api/send/bulk-image', label: 'Bulk Image (URL)', default: { numbers: ["919876543210", "919876543211"], imageUrl: 'https://example.com/image.jpg', caption: 'Bulk Test' } },
    { method: 'POST', path: '/api/send/bulk-image', label: 'Bulk Image (Upload)', default: { numbers: ["919876543210", "919876543211"], caption: 'Bulk Upload Test' } },
    { method: 'POST', path: '/api/send/document', label: 'Doc (URL)', default: { number: '919876543210', documentUrl: 'https://example.com/file.pdf', filename: 'test.pdf' } },
    { method: 'POST', path: '/api/send/document', label: 'Doc (Upload)', default: { number: '919876543210', filename: 'test.pdf' } },
    { method: 'POST', path: '/api/send/bulk-document', label: 'Bulk Doc (URL)', default: { numbers: ["919876543210", "919876543211"], documentUrl: 'https://example.com/file.pdf', filename: 'test.pdf' } },
    { method: 'POST', path: '/api/send/bulk-document', label: 'Bulk Doc (Upload)', default: { numbers: ["919876543210", "919876543211"], filename: 'test.pdf' } },
    { method: 'POST', path: '/api/send/bulk', label: 'Bulk Text', default: { numbers: ["919876543210", "919876543211"], message: 'Bulk Text Test' } },
    { method: 'POST', path: '/api/send/audio', label: 'Send Audio (URL)', default: { number: '919876543210', audioUrl: 'https://example.com/audio.mp3' } },
    { method: 'GET', path: '/api/devices', label: 'List Devices', default: {} }
  ];

  useEffect(() => {
    setPayload(JSON.stringify(testEndpoints[activeEndpoint].default, null, 2));
    setSelectedFile(null);
  }, [activeEndpoint]);

  useEffect(() => {
    api.get('/api/devices').then(({ data }) => {
      const active = data.devices || [];
      setDevices(active);
      if (active.length > 0) setSelectedDevice(active[0].deviceId);
    }).catch(() => {
      // Fallback if production server not reachable during initial load
    });
  }, []);

  const handleTest = async () => {
    if (!selectedDevice) {
      setResponse({ error: "Please select an active node/device first." });
      return;
    }

    setIsLoading(true);
    setResponse(null);
    try {
      const ep = testEndpoints[activeEndpoint];
      let config: any = {
        method: ep.method,
        url: ep.path,
      };

      if (ep.method !== 'GET') {
        let parsedPayload;
        try {
          // Remove comments or trailing commas before parsing if needed? No, standard JSON.
          parsedPayload = JSON.parse(payload);
        } catch (e: any) {
          throw new Error(`JSON_FORMAT_ERROR: ${e.message}`);
        }
        
        if (selectedFile) {
          const formData = new FormData();
          formData.append('deviceId', selectedDevice);
          
          Object.keys(parsedPayload).forEach(key => {
            if (key === 'numbers' && Array.isArray(parsedPayload[key])) {
              formData.append(key, JSON.stringify(parsedPayload[key]));
            } else if (key === 'number') {
              formData.append(key, String(parsedPayload[key]));
            } else if (!['imageUrl', 'documentUrl', 'audioUrl', 'mediaUrl', 'deviceId'].includes(key)) {
              // Append other metadata like caption or filename
              formData.append(key, String(parsedPayload[key]));
            }
          });
          
          const fileKey = ep.path.includes('image') ? 'image' : 
                          ep.path.includes('audio') ? 'audio' : 
                          'document';
          formData.append(fileKey, selectedFile);

          // Force correct endpoint for file upload if user hits a -url endpoint with a physical file
          let finalUrl = ep.path;
          if (finalUrl.endsWith('-url')) {
            finalUrl = finalUrl.replace('-url', '');
          }
          
          config.url = finalUrl;
          config.data = formData;
          config.headers = { 'Content-Type': 'multipart/form-data' };
        } else {
          config.data = { ...parsedPayload, deviceId: selectedDevice };
        }
      }

      const { data } = await api(config);
      setResponse(data);
    } catch (err: any) {
      let errorMessage = err.response?.data || err.message;
      if (typeof errorMessage === 'object' && (errorMessage.error || errorMessage.message)) {
        errorMessage = errorMessage.error || errorMessage.message;
      }
      setResponse({ error: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const isUploadable = testEndpoints[activeEndpoint].path.includes('image') || 
                      testEndpoints[activeEndpoint].path.includes('document') ||
                      testEndpoints[activeEndpoint].path.includes('audio');

  return (
    <div className="space-y-6 sm:space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-widest uppercase">API<span className="text-cyan-500"> TEST</span></h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Test your messaging APIs here.</p>
        </div>
        <div className="flex gap-2 p-1.5 bg-[#111] border border-white/5 rounded-2xl overflow-x-auto custom-scrollbar-hidden">
          {testEndpoints.map((ep, idx) => (
            <button
              key={ep.label}
              onClick={() => setActiveEndpoint(idx)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                activeEndpoint === idx ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" : "text-gray-500 hover:text-white hover:bg-white/5"
              )}
            >
              {ep.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="space-y-6">
          <div className="bg-[#111] p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
            <div className="space-y-3 sm:px-2">
              <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em]">Selected Device</label>
              <div className="relative">
                <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500" size={18} />
                <select 
                  className="w-full bg-black border border-white/10 rounded-2xl py-5 pl-14 pr-10 outline-none focus:border-cyan-500 appearance-none font-bold text-white transition-all shadow-inner text-sm"
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                >
                  <option value="">Choose a device...</option>
                  {devices.map(d => (
                    <option key={d.deviceId} value={d.deviceId}>{d.name} ({d.phone})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" size={18} />
              </div>
            </div>

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
                  />
                  <label 
                    htmlFor="file-upload"
                    className={cn(
                      "flex items-center justify-between w-full border rounded-2xl p-5 cursor-pointer transition-all font-bold text-xs ring-offset-black focus-within:ring-2 focus-within:ring-cyan-500",
                      selectedFile ? "border-cyan-500 bg-cyan-500/5 text-cyan-400" : "border-white/10 bg-black hover:border-white/20 text-gray-400"
                    )}
                  >
                    <span className="truncate pr-4">
                      {selectedFile ? selectedFile.name : "Select a local file..."}
                    </span>
                    <Play size={14} className="text-cyan-500 rotate-90 shrink-0" />
                  </label>
                </div>
              </div>
            )}

            <div className="space-y-3 sm:px-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em]">Message JSON</label>
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
                  <span className="text-[9px] font-black text-cyan-500/50 bg-cyan-500/5 px-2 py-1 rounded">JSON</span>
                </div>
              </div>
              <div className="border border-white/5 rounded-3xl overflow-hidden bg-black shadow-inner">
                <textarea 
                  className="w-full bg-transparent p-6 sm:p-8 h-48 sm:h-64 outline-none font-mono text-[10px] sm:text-[11px] leading-relaxed text-cyan-400 custom-scrollbar resize-none"
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  spellCheck={false}
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              onClick={handleTest}
              className="glow-button w-full py-6 text-sm font-black uppercase tracking-[0.3em] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin mx-auto text-black" /> : "Test API"}
            </button>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Terminal size={14} className="text-cyan-500" />
              Output Result
            </h3>
            <span className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-full border border-green-500/20 uppercase">
              Server Active
            </span>
          </div>

          <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col h-[400px] sm:h-[520px] shadow-inner">
            <div className="flex-1 overflow-auto p-6 font-mono text-[10px] sm:text-[11px] leading-relaxed custom-scrollbar text-cyan-400">
              {response ? (
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(response, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-800 space-y-4">
                  <Database size={48} className="opacity-10" />
                  <p className="font-bold tracking-widest uppercase text-xs">Waiting for test...</p>
                </div>
              )}
            </div>
            {response && (
              <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Status Code: {response.error ? '400 ERR' : '200 OK'}</span>
                <button onClick={() => setResponse(null)} className="text-[10px] font-bold text-cyan-500 hover:text-cyan-400 uppercase">Clear Window</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
