import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  MessageSquare,
  Users,
  Smartphone,
  Copy,
  Check
} from 'lucide-react';
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

  const getCurl = (ep: ApiEndpoint) => {
    let curl = `curl -X ${ep.method} "https://whatsapp-api-salution-production.up.railway.app${ep.path}" \\\n`;
    curl += `  -H "x-api-key: YOUR_API_KEY" \\\n`;
    curl += `  -H "Content-Type: application/json"`;
    if (ep.body) {
      curl += ` \\\n  -d '${JSON.stringify(ep.body, null, 2)}'`;
    }
    return curl;
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">
            User<span className="text-cyan-500"> Guide</span> & API
          </h2>
          <p className="text-gray-400 mt-2 font-black uppercase text-[10px] tracking-widest">How to use and integrate our API.</p>
        </div>
        <div className="flex gap-2 p-2 bg-[#111] border border-white/5 rounded-[2rem] overflow-x-auto shadow-2xl">
          {categories.map((cat, idx) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(idx)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
                activeCategory === idx ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]" : "text-gray-500 hover:text-white hover:bg-white/5"
              )}
            >
              <cat.icon size={14} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-16">
        {sections.slice(activeCategory, activeCategory + 1).map((section) => (
          <div key={section.title} className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-cyan-500/60 pb-1">
                {section.title}
              </h3>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
            </div>

            {section.endpoints.map((ep, eIdx) => {
              const curlId = `curl-${activeCategory}-${eIdx}`;
              const respId = `resp-${activeCategory}-${eIdx}`;
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  key={ep.path} 
                  className="bg-[#0f0f0f] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl"
                >
                  <div className="p-4 md:p-10 border-b border-white/5 relative bg-gradient-to-br from-white/5 to-transparent">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={cn(
                            "px-2 py-1 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-lg shrink-0",
                            ep.method === 'GET' ? "bg-blue-500 text-blue-950" :
                            ep.method === 'POST' ? "bg-cyan-500 text-cyan-950" :
                            ep.method === 'DELETE' ? "bg-red-500 text-red-950" : "bg-yellow-500 text-yellow-950"
                          )}>
                            {ep.method}
                          </span>
                          <div className="bg-black/40 px-2 py-1 rounded border border-white/5 min-w-0 max-w-full">
                            <code className="text-white font-mono font-bold text-[10px] md:text-lg tracking-tight break-all block">{ep.path}</code>
                          </div>
                        </div>
                        <p className="text-gray-400 text-xs md:text-lg leading-relaxed max-w-2xl">{ep.desc}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 md:p-10 grid lg:grid-cols-2 gap-6 md:gap-10 bg-[#0a0a0a]">
                    {/* Execution */}
                    <div className="space-y-4 overflow-hidden">
                      <div className="flex items-center justify-between gap-2 px-1">
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                          Request
                        </span>
                        <button 
                          onClick={() => handleCopy(getCurl(ep), curlId)}
                          className="flex items-center gap-2 text-[8px] md:text-[9px] font-black uppercase text-cyan-500 bg-cyan-500/5 px-3 py-1.5 rounded-lg border border-cyan-500/10 hover:bg-cyan-500/10 transition-all shrink-0"
                        >
                          {copiedId === curlId ? <Check size={10} /> : <Copy size={10} />}
                          Copy CURL
                        </button>
                      </div>
                      <div className="p-5 md:p-8 bg-black rounded-2xl md:rounded-[2rem] border border-white/5 overflow-x-auto text-[10px] md:text-[11px] leading-relaxed text-cyan-400/80 font-mono scrollbar-hide">
                        <code>{getCurl(ep)}</code>
                      </div>
                    </div>

                    {/* Response */}
                    <div className="space-y-4 overflow-hidden">
                      <div className="flex items-center justify-between gap-2 px-1">
                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                          Response
                        </span>
                        <button 
                          onClick={() => handleCopy(JSON.stringify(ep.response, null, 2), respId)}
                          className="flex items-center gap-2 text-[8px] md:text-[9px] font-black uppercase text-blue-500 bg-blue-500/5 px-3 py-1.5 rounded-lg border border-blue-500/10 hover:bg-blue-500/10 transition-all shrink-0"
                        >
                          {copiedId === respId ? <Check size={10} /> : <Copy size={10} />}
                          Copy JSON
                        </button>
                      </div>
                      <div className="p-5 md:p-8 bg-black rounded-2xl md:rounded-[2rem] border border-white/5 overflow-x-auto text-[10px] md:text-[11px] leading-relaxed text-emerald-400/80 font-mono scrollbar-hide">
                        <code>{JSON.stringify(ep.response, null, 2)}</code>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
