export interface User {
  userId: string;
  name: string;
  phone: string;
  apiKey: string;
  verified: boolean;
  role: string;
  createdAt: number;
}

export interface Device {
  deviceId: string;
  name: string;
  status: 'initializing' | 'pending_qr' | 'pending_pairing' | 'connected' | 'disconnected' | 'auth_failed';
  phone?: string;
  pushname?: string;
  qrCode?: string;
  pairingCode?: string;
  isOnline: boolean;
  connectedAt?: number;
}

export interface Message {
  messageId: string;
  ourMessageId: string;
  deviceId: string;
  chatId: string;
  from: string;
  to: string;
  body: string;
  type: string;
  timestamp: number;
  direction: 'incoming' | 'outgoing';
  status: 'sent' | 'received' | 'delivered' | 'read';
  hasMedia?: boolean;
  mediaUrl?: string;
  mediaData?: any;
  fileName?: string;
}

export interface Conversation {
  chatId: string;
  safeChatId: string;
  name: string;
  isGroup: boolean;
  lastMessage: string;
  lastMessageTime: number;
  lastMessageDirection: 'incoming' | 'outgoing';
  unreadCount: number;
}

export interface Stats {
  totalRequests: number;
  requestsToday: number;
  messagesSent: number;
  messagesReceived: number;
  connectedDevices: number;
}
