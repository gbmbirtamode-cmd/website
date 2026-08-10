export interface User {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
  plan: 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';
  credits: number;
  createdAt: Date;
  expiresAt?: Date;
  isGuest: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model: string;
  timestamp: Date;
  sources?: Source[];
  attachments?: Attachment[];
}

export interface Source {
  title: string;
  url: string;
  snippet: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'pdf' | 'audio' | 'video' | 'document';
  name: string;
  size: number;
  url: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  model: string;
}

export interface NexaAIModel {
  id: string;
  name: string;
  description: string;
  tier: 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';
  costPerRequest: number;
  enabled: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'usage' | 'purchase' | 'reward' | 'referral';
  description: string;
  timestamp: Date;
}

export interface BrandingConfig {
  logoUrl: string;
  faviconUrl: string;
  appName: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface AIProvider {
  id: string;
  name: 'gemini' | 'openai' | 'anthropic';
  apiKey: string;
  enabled: boolean;
  priority: number;
}

export interface RateLimit {
  limit: number;
  remaining: number;
  resetAt: Date;
}
