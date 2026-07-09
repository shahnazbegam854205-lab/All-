import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  MessageSquare,
  Users,
  Smartphone,
  Copy,
  Check,
  Headphones,
  ChevronRight,
  X,
  Zap,
  ShieldCheck,
  Radio,
  BookOpen,
  Code2,
  Globe,
  Link as LinkIcon,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface ApiSection {
  title: string;
  endpoints: ApiEndpoint[];
}

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  desc: string;
  body?: any;
  params?: any;
  response: any;
}

export default function ApiDocs() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSupportOptions, setShowSupportOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const WHATSAPP_NUMBER = '639079249283';
  const WEB_SUPPORT_URL = 'https://all-wine.vercel.app/#/support';

  const categories = [
    { label: 'Messaging', icon: MessageSquare },
    { label: 'Devices', icon: Smartphone },
    { label: 'Bulk', icon: Users },
    { label: 'Groups & Tools', icon: Users },
    { label: 'System', icon: Terminal },
  ];

  const sections: ApiSection[] = [
    {
      title: 'Real-time Messaging',
      endpoints: [
        {
          method: 'POST',
          path: '/api/send',
          desc: 'Send a standard text message.',
          body: { deviceId: "abc123", number: "919876543210", message: "Hello" },
          response: { success: true, messageId: "false_ABC@c.us_123", ourMessageId: "msg_123" }
        },
        {
          method: 'POST',
          path: '/api/send/image',
          desc: 'Send an image via URL or multipart.',
          body: { deviceId: "abc123", number: "919876543210", imageUrl: "https://example.com/photo.jpg", caption: "Photo" },
          response: { success: true, messageId: "false_ABC@c.us_123" }
        },
        {
          method: 'POST',
          path: '/api/send/document',
          desc: 'Send a document (PDF, HTML, DOCX, etc) via URL.',
          body: { deviceId: "abc123", number: "919876543210", documentUrl: "https://example.com/file.html", filename: "index.html" },
          response: { success: true, messageId: "false_ABC@c.us_123" }
        },
        {
          method: 'POST',
          path: '/api/messages/reply',
          desc: 'Reply to a specific message ID.',
          body: { deviceId: "abc123", chatId: "919876543210@c.us", replyToMessageId: "false_ABC_123", message: "This is reply" },
          response: { success: true, messageId: "false_DEF_456", replyTo: "false_ABC_123" }
        },
        {
          method: 'GET',
          path: '/api/conversations/:deviceId',
          desc: 'Retrieve all chats/conversations for a specific device.',
          response: { conversations: [{ chatId: "919876543210@c.us", lastMessage: "Hello", unreadCount: 2 }] }
        },
        {
          method: 'GET',
          path: '/api/conversations/:deviceId/:chatId',
          desc: 'Fetch message history for a specific chat.',
          response: { chatId: "919876543210@c.us", messages: [{ body: "Hello", timestamp: 1700000000000 }] }
        },
        {
          method: 'POST',
          path: '/api/read/:deviceId/:chatId',
          desc: 'Mark messages in a chat as read.',
          response: { success: true, message: "Marked as read" }
        }
      ]
    },
    {
      title: 'Device Management',
      endpoints: [
        {
          method: 'GET',
          path: '/api/devices',
          desc: 'List all linked WhatsApp instances.',
          response: { devices: [{ deviceId: "abc", name: "My Phone", status: "connected", phone: "919876543210" }] }
        },
        {
          method: 'POST',
          path: '/api/devices/connect/qr',
          desc: 'Initialize a new connection and get QR code base64.',
          body: { deviceName: "My Laptop" },
          response: { success: true, deviceId: "abc123", qrCode: "data:image/png;base64,..." }
        },
        {
          method: 'GET',
          path: '/api/whatsapp/status/:deviceId',
          desc: 'Get live status and info from the connected WhatsApp instance.',
          response: { connected: true, state: "CONNECTED", battery: 85, platform: "android" }
        },
        {
          method: 'POST',
          path: '/api/devices/:deviceId/logout',
          desc: 'Log out from a specific WhatsApp session.',
          response: { success: true, message: "Device logout successful" }
        },
        {
          method: 'DELETE',
          path: '/api/devices/:deviceId',
          desc: 'Remove device from the database and disconnect.',
          response: { success: true, message: "Device deleted" }
        }
      ]
    },
    {
      title: 'Bulk Messaging',
      endpoints: [
        {
          method: 'POST',
          path: '/api/send/bulk',
          desc: 'Initiate a mass text campaign.',
          body: { deviceId: "abc123", numbers: ["919876543210", "919876543211"], message: "Bulk msg" },
          response: { total: 2, sent: 2, failed: 0, results: [] }
        },
        {
          method: 'POST',
          path: '/api/send/bulk-image-url',
          desc: 'Send bulk images with a URL.',
          body: { deviceId: "abc123", numbers: ["919876543210"], imageUrl: "https://...", caption: "Offer" },
          response: { success: true, total: 1, sent: 1 }
        },
        {
          method: 'POST',
          path: '/api/send/bulk-document-url',
          desc: 'Send bulk documents (PDF, HTML, etc) via URL.',
          body: { deviceId: "abc123", numbers: ["919876543210"], documentUrl: "https://...", filename: "offer.pdf" },
          response: { success: true, total: 1, sent: 1 }
        },
        {
          method: 'GET',
          path: '/api/bulk/status/:jobId',
          desc: 'Check progress of a bulk job.',
          response: { jobId: "job123", status: "completed", total: 100, sent: 98 }
        }
      ]
    },
    {
      title: 'Groups & Automation',
      endpoints: [
        {
          method: 'GET',
          path: '/api/groups/:deviceId',
          desc: 'List all groups where the device is a participant.',
          response: { groups: [{ id: "123@g.us", name: "Family Group" }] }
        },
        {
          method: 'POST',
          path: '/api/groups/create',
          desc: 'Create a new WhatsApp group.',
          body: { deviceId: "abc123", name: "New Group", participants: ["919876543210"] },
          response: { success: true, groupId: "123456@g.us" }
        },
        {
          method: 'POST',
          path: '/api/templates/create',
          desc: 'Save a message template for easier bulk sending.',
          body: { name: "Welcome", message: "Hello {{name}}!" },
          response: { success: true, template: { templateId: "t1" } }
        },
        {
          method: 'POST',
          path: '/api/webhook/register',
          desc: 'Register a webhook URL for incoming messages.',
          body: { webhookUrl: "https://yoursite.com/hook", events: ["message"] },
          response: { success: true, message: "Webhook registered" }
        }
      ]
    },
    {
      title: 'System Health',
      endpoints: [
        {
          method: 'GET',
          path: '/health',
          desc: 'General server health check.',
          response: { status: "ok", uptime: "120s", version: "2.0.0" }
        },
        {
          method: 'GET',
          path: '/api/health/detailed',
          desc: 'Detailed status report of the environment.',
          response: { user: { verified: true }, devices: {}, stats: {} }
        }
      ]
    }
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleWhatsAppSupport = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
    setShowSupportOptions(false);
  };

  const handleWebSupport = () => {
    window.open(WEB_SUPPORT_URL, '_blank');
    setShowSupportOptions(false);
  };

  const getCurl = (ep: ApiEndpoint) => {
    let curl = `curl -X ${ep.method} "https://whatsapp-api-salution-production.up.railway.app${ep.path}" \\\n`;
    curl += `  -H "x-api-key: YOUR_API_KEY" \\\n`;
    curl += `  -H "Content-Type: application/json"`;
    if (ep.body) {
      curl += ` \\\n  -d '${JSON.stringify(ep.body, null, 2)}'`;
    }
    return curl;
  };

  // Filter endpoints based on search
  const filteredSections = sections.map(section => ({
    ...section,
    endpoints: section.endpoints.filter(ep => 
      ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.method.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }));

  // Quick Stats
  const totalEndpoints = sections.reduce((acc, section) => acc + section.endpoints.length, 0);

  return (
    <>
      <div className="space-y-8 pb-20">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden p-6 sm:p-10 rounded-[2rem] glow-card bg-gradient-to-br from-[#111] to-[#0a0a0a]"
        >
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase">
                  User<span className="text-cyan-500"> Guide</span> & API
                </h2>
                <p className="text-gray-400 mt-2 font-black uppercase text-[10px] tracking-widest">
                  How to use and integrate our API. 📚
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="flex gap-4">
                <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-center">
                  <p className="text-2xl font-black text-cyan-400">{totalEndpoints}</p>
                  <p className="text-[7px] text-gray-500 font-black uppercase tracking-widest">Endpoints</p>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-center">
                  <p className="text-2xl font-black text-emerald-400">5</p>
                  <p className="text-[7px] text-gray-500 font-black uppercase tracking-widest">Categories</p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mt-4 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <input 
                type="text"
                placeholder="Search endpoints..."
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-cyan-500/50 transition-all text-sm text-white placeholder:text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]" />
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Tester', icon: Code2, path: '/tester', color: 'text-cyan-400' },
            { label: 'Webhooks', icon: Radio, path: '/webhooks', color: 'text-emerald-400' },
            { label: 'Devices', icon: Smartphone, path: '/devices', color: 'text-blue-400' },
            { label: 'Dashboard', icon: ShieldCheck, path: '/dashboard', color: 'text-yellow-400' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="bg-[#111] p-3 rounded-xl border border-white/5 flex flex-col items-center gap-1 hover:border-cyan-500/30 transition-all group"
            >
              <item.icon size={18} className={cn(item.color, "group-hover:scale-110 transition-transform")} />
              <span className="text-[7px] text-gray-500 font-black uppercase tracking-widest">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 p-2 bg-[#111] border border-white/5 rounded-[2rem] overflow-x-auto shadow-2xl">
          {categories.map((cat, idx) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(idx)}
              className={cn(
                "flex items-center gap-2 px-4 sm:px-6 py-3 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
                activeCategory === idx 
                  ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]" 
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              )}
            >
              <cat.icon size={14} />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Endpoints */}
        <div className="space-y-16">
          {filteredSections.slice(activeCategory, activeCategory + 1).map((section) => (
            <div key={section.title} className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-500/60 pb-1">
                  {section.title} <span className="text-gray-600">({section.endpoints.length})</span>
                </h3>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
              </div>

              {section.endpoints.length === 0 ? (
                <div className="text-center py-12 bg-[#111] rounded-[3rem] border border-white/5">
                  <Search size={32} className="text-gray-700 mx-auto mb-3" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">No endpoints found</p>
                </div>
              ) : (
                section.endpoints.map((ep, eIdx) => {
                  const curlId = `curl-${activeCategory}-${eIdx}`;
                  const respId = `resp-${activeCategory}-${eIdx}`;
                  
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: eIdx * 0.05 }}
                      key={ep.path} 
                      className="bg-[#0f0f0f] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl hover:border-cyan-500/20 transition-all"
                    >
                      <div className="p-4 md:p-8 border-b border-white/5 relative bg-gradient-to-br from-white/5 to-transparent">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className={cn(
                                "px-2 py-1 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-lg shrink-0",
                                ep.method === 'GET' ? "bg-blue-500 text-blue-950" :
                                ep.method === 'POST' ? "bg-cyan-500 text-cyan-950" :
                                ep.method === 'DELETE' ? "bg-red-500 text-red-950" : "bg-yellow-500 text-yellow-950"
                              )}>
                                {ep.method}
                              </span>
                              <div className="bg-black/40 px-3 py-1.5 rounded border border-white/5 min-w-0 max-w-full">
                                <code className="text-white font-mono font-bold text-[10px] md:text-sm tracking-tight break-all block">
                                  {ep.path}
                                </code>
                              </div>
                            </div>
                            <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-2xl">{ep.desc}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 md:p-8 grid lg:grid-cols-2 gap-6 md:gap-10 bg-[#0a0a0a]">
                        {/* Request */}
                        <div className="space-y-4 overflow-hidden">
                          <div className="flex items-center justify-between gap-2 px-1">
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                              <Code2 size={12} /> Request
                            </span>
                            <button 
                              onClick={() => handleCopy(getCurl(ep), curlId)}
                              className="flex items-center gap-2 text-[8px] md:text-[9px] font-black uppercase text-cyan-500 bg-cyan-500/5 px-3 py-1.5 rounded-lg border border-cyan-500/10 hover:bg-cyan-500/10 transition-all shrink-0"
                            >
                              {copiedId === curlId ? <Check size={10} /> : <Copy size={10} />}
                              Copy CURL
                            </button>
                          </div>
                          <div className="p-4 md:p-6 bg-black rounded-2xl md:rounded-[2rem] border border-white/5 overflow-x-auto text-[10px] md:text-[11px] leading-relaxed text-cyan-400/80 font-mono scrollbar-hide">
                            <pre className="whitespace-pre-wrap break-all">{getCurl(ep)}</pre>
                          </div>
                        </div>

                        {/* Response */}
                        <div className="space-y-4 overflow-hidden">
                          <div className="flex items-center justify-between gap-2 px-1">
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                              <Globe size={12} /> Response
                            </span>
                            <button 
                              onClick={() => handleCopy(JSON.stringify(ep.response, null, 2), respId)}
                              className="flex items-center gap-2 text-[8px] md:text-[9px] font-black uppercase text-blue-500 bg-blue-500/5 px-3 py-1.5 rounded-lg border border-blue-500/10 hover:bg-blue-500/10 transition-all shrink-0"
                            >
                              {copiedId === respId ? <Check size={10} /> : <Copy size={10} />}
                              Copy JSON
                            </button>
                          </div>
                          <div className="p-4 md:p-6 bg-black rounded-2xl md:rounded-[2rem] border border-white/5 overflow-x-auto text-[10px] md:text-[11px] leading-relaxed text-emerald-400/80 font-mono scrollbar-hide">
                            <pre className="whitespace-pre-wrap">{JSON.stringify(ep.response, null, 2)}</pre>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Floating Support Button */}
      <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3">
        {/* Support Options Popup */}
        <AnimatePresence>
          {showSupportOptions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-[#1a1a1a] backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl shadow-black/50 min-w-[200px] overflow-hidden"
            >
              <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Support Options</span>
                <button 
                  onClick={() => setShowSupportOptions(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              <motion.button
                onClick={handleWhatsAppSupport}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-all duration-200 group"
              >
                <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center shrink-0">
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9uY7cpz03f282ot9udmEc8ech0KPCypmXPpoRVaGlCw&s"
                    alt="WhatsApp"
                    className="w-5 h-5 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] font-bold text-white group-hover:text-[#25D366] transition-colors">WhatsApp Support</p>
                  <p className="text-[7px] text-gray-500 font-mono">Chat on WhatsApp</p>
                </div>
                <ChevronRight size={12} className="text-gray-600 group-hover:text-[#25D366] transition-colors" />
              </motion.button>

              <motion.button
                onClick={handleWebSupport}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-all duration-200 group border-t border-white/5"
              >
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                  <Headphones size={16} className="text-cyan-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] font-bold text-white group-hover:text-cyan-400 transition-colors">Web Support Agent</p>
                  <p className="text-[7px] text-gray-500 font-mono">Chat with Web Agent</p>
                </div>
                <ChevronRight size={12} className="text-gray-600 group-hover:text-cyan-400 transition-colors" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Support Button */}
        <motion.button
          onClick={() => setShowSupportOptions(!showSupportOptions)}
          className="relative flex flex-col items-center justify-center group"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.5
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className={cn(
            "absolute inset-0 rounded-full blur-xl opacity-50 transition-opacity duration-300",
            showSupportOptions ? "bg-cyan-500 opacity-70" : "bg-[#25D366]"
          )} />
          
          <div className={cn(
            "relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
            showSupportOptions 
              ? "bg-cyan-500 shadow-cyan-500/30 group-hover:shadow-cyan-500/40" 
              : "bg-[#25D366] shadow-[#25D366]/30 group-hover:shadow-[#25D366]/40"
          )}>
            {showSupportOptions ? (
              <X size={24} className="text-white" />
            ) : (
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9uY7cpz03f282ot9udmEc8ech0KPCypmXPpoRVaGlCw&s"
                alt="Support"
                className="w-9 h-9 rounded-full object-cover"
              />
            )}
            
            {!showSupportOptions && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black animate-pulse" />
            )}
          </div>
          
          <motion.span 
            className="mt-1.5 text-[8px] font-black uppercase tracking-widest text-white/80 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/5"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {showSupportOptions ? "Close" : "Support"}
          </motion.span>
        </motion.button>
      </div>
    </>
  );
}
