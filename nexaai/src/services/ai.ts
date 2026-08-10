import { Message, NexaAIModel } from '../types';
import { getGeminiService } from './gemini';

export interface ChatRequest {
  prompt: string;
  modelId: string;
  conversationHistory?: Message[];
  attachments?: File[];
}

export interface ChatResponse {
  content: string;
  model: string;
  sources?: Array<{ title: string; url: string; snippet: string }>;
  usage?: {
    tokens: number;
    cost: number;
  };
}

class AIService {
  private modelMapping: Record<string, string> = {
    'nexaai-lite': 'gemini-2.0-flash',
    'nexaai-pro': 'gemini-2.0-flash',
    'nexaai-intelligence': 'gemini-2.0-flash',
    'nexaai-ultra': 'gemini-2.0-flash',
    'nexaai-code': 'gemini-2.0-flash',
    'nexaai-vision': 'gemini-2.0-flash',
  };

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const geminiService = getGeminiService();
    
    try {
      // Check if API key is configured
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        return {
          content: "⚠️ **API Key Not Configured**\n\nTo use NexaAI, please set your Gemini API key:\n\n1. Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)\n2. Create a `.env` file in the project root\n3. Add: `VITE_GEMINI_API_KEY=your_api_key_here`\n4. Restart the development server",
          model: request.modelId,
          sources: [],
        };
      }

      let response: string;

      if (request.attachments && request.attachments.length > 0) {
        // Handle file analysis
        const file = request.attachments[0];
        response = await geminiService.analyzeFile(file, request.prompt);
      } else {
        // Regular chat
        response = await geminiService.generateContent(
          request.prompt,
          request.conversationHistory
        );
      }

      // Calculate credit cost based on model
      const creditCost = this.getCreditCost(request.modelId);

      return {
        content: response,
        model: request.modelId,
        sources: [],
        usage: {
          tokens: response.length,
          cost: creditCost,
        },
      };
    } catch (error: any) {
      console.error('AI Service error:', error);
      
      // Fallback response for errors
      return {
        content: `I apologize, but I encountered an error: ${error.message}\n\nPlease try again or contact support if the issue persists.`,
        model: request.modelId,
        sources: [],
      };
    }
  }

  async generateImage(prompt: string): Promise<string> {
    // Placeholder - would integrate with image generation API
    throw new Error('Image generation coming soon');
  }

  async summarizeFile(file: File): Promise<string> {
    const geminiService = getGeminiService();
    return geminiService.analyzeFile(file, 'Please summarize this document.');
  }

  private getCreditCost(modelId: string): number {
    const costs: Record<string, number> = {
      'nexaai-lite': 2,
      'nexaai-pro': 8,
      'nexaai-intelligence': 15,
      'nexaai-ultra': 25,
      'nexaai-code': 8,
      'nexaai-vision': 50,
    };
    return costs[modelId] || 2;
  }

  getModelById(modelId: string): NexaAIModel | undefined {
    const models: NexaAIModel[] = [
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

    return models.find(m => m.id === modelId);
  }
}

export const aiService = new AIService();
export default aiService;
