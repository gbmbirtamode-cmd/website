import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Message, Conversation, NexaAIModel, BrandingConfig } from '../types';

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Conversations
  conversations: Conversation[];
  currentConversationId: string | null;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  setCurrentConversation: (id: string | null) => void;
  
  // Messages
  addMessage: (conversationId: string, message: Message) => void;
  
  // Models
  models: NexaAIModel[];
  selectedModel: string;
  setModels: (models: NexaAIModel[]) => void;
  setSelectedModel: (modelId: string) => void;
  
  // Branding
  branding: BrandingConfig;
  setBranding: (branding: Partial<BrandingConfig>) => void;
  
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  
  // Credits
  credits: number;
  setCredits: (credits: number) => void;
  addCredits: (amount: number) => void;
  useCredits: (amount: number) => void;
}

const defaultBranding: BrandingConfig = {
  logoUrl: '/logo.svg',
  faviconUrl: '/favicon.svg',
  appName: 'NexaAI',
  primaryColor: '#4f46e5',
  secondaryColor: '#6366f1',
};

const defaultModels: NexaAIModel[] = [
  {
    id: 'nexaai-lite',
    name: 'NexaAI Lite',
    description: 'Fast responses for everyday questions',
    tier: 'FREE',
    costPerRequest: 2,
    enabled: true,
  },
  {
    id: 'nexaai-pro',
    name: 'NexaAI Pro',
    description: 'Advanced reasoning and better answers',
    tier: 'PRO',
    costPerRequest: 8,
    enabled: true,
  },
  {
    id: 'nexaai-intelligence',
    name: 'NexaAI Intelligence',
    description: 'Professional workflows and team usage',
    tier: 'BUSINESS',
    costPerRequest: 15,
    enabled: true,
  },
  {
    id: 'nexaai-ultra',
    name: 'NexaAI Ultra',
    description: 'Maximum capability for enterprise',
    tier: 'ENTERPRISE',
    costPerRequest: 25,
    enabled: true,
  },
  {
    id: 'nexaai-code',
    name: 'NexaAI Code',
    description: 'Programming and code assistance',
    tier: 'PRO',
    costPerRequest: 8,
    enabled: true,
  },
  {
    id: 'nexaai-vision',
    name: 'NexaAI Vision',
    description: 'Image understanding and generation',
    tier: 'PRO',
    costPerRequest: 50,
    enabled: true,
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      
      // Conversations
      conversations: [],
      currentConversationId: null,
      addConversation: (conversation) =>
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          currentConversationId: conversation.id,
        })),
      updateConversation: (id, updates) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, ...updates } : conv
          ),
        })),
      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((conv) => conv.id !== id),
          currentConversationId: state.currentConversationId === id ? null : state.currentConversationId,
        })),
      setCurrentConversation: (id) => set({ currentConversationId: id }),
      
      // Messages
      addMessage: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, message],
                  updatedAt: new Date(),
                  title: conv.messages.length === 0 ? message.content.slice(0, 50) : conv.title,
                }
              : conv
          ),
        })),
      
      // Models
      models: defaultModels,
      selectedModel: 'nexaai-lite',
      setModels: (models) => set({ models }),
      setSelectedModel: (modelId) => set({ selectedModel: modelId }),
      
      // Branding
      branding: defaultBranding,
      setBranding: (branding) =>
        set((state) => ({
          branding: { ...state.branding, ...branding },
        })),
      
      // UI State
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      // Credits
      credits: 1000,
      setCredits: (credits) => set({ credits }),
      addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
      useCredits: (amount) => set((state) => ({ credits: Math.max(0, state.credits - amount) })),
    }),
    {
      name: 'nexaai-storage',
      partialize: (state) => ({
        user: state.user,
        conversations: state.conversations,
        selectedModel: state.selectedModel,
        branding: state.branding,
        darkMode: state.darkMode,
        credits: state.credits,
      }),
    }
  )
);
