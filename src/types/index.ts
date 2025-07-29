export interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  phone?: string;
  location?: string;
  tags?: string[];
  isContact?: boolean;
  createdAt?: Date;
  lastActivity?: Date;
  totalConversations?: number;
  notes?: string;
  source?: string;
  tenantId: number;
}

export interface Customer {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  position?: string;
  tags: string[];
  notes: string;
  customFields?: any;
  lastMessage?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  timestamp: Date;
  isIncoming: boolean;
  role: "user" | "bot" | "system";
  isRead: boolean;
}

export interface Conversation {
  id: number;
  user: User;
  lastMessage: Message;
  unreadCount: number;
  isActive: boolean;
  channel?: string;
  userPhone?: string;
  agentId?: number;
  customer?: Customer;
  totalMessages: string;
}

export interface Bot {
  id: string;
  name: string;
  isActive: boolean;
  description?: string;
  category?: string;
  features?: string[];
  icon?: string;
}

export interface BotAgent {
  id: string;
  name: string;
  description: string;
  category: string;
  vertical: string;
  features: string[];
  isActive: boolean;
  icon: string;
  color: string;
  isCustom?: boolean;
  pricing: {
    monthly: number;
    currency: string;
    billingType: "per_agent" | "per_conversation" | "flat_rate";
    freeTrialDays?: number;
    setupFee?: number;
  };
  stats?: {
    conversations: number;
    responseTime: string;
    satisfaction: number;
  };
  tags?: string[];
  popularity?: "high" | "medium" | "low";
  complexity?: "basic" | "intermediate" | "advanced";
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  isConnected: boolean;
  category: string;
  features: string[];
  setupRequired?: boolean;
  stats?: {
    messages: number;
    users: number;
    responseRate: number;
  };
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  location?: string;
  company?: string;
  tags: string[];
  isContact: boolean;
  createdAt: Date;
  lastActivity: Date;
  totalConversations: number;
  totalMessages: number;
  averageResponseTime: string;
  satisfaction?: number;
  notes: string;
  source: string;
  status: "active" | "inactive" | "blocked";
  customFields?: Record<string, any>;
}
