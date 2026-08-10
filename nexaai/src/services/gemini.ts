import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { Message, AIProvider } from '../types';

class GeminiService {
  private apiKey: string;
  private api: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    if (apiKey) {
      this.initialize(apiKey);
    }
  }

  initialize(apiKey: string) {
    try {
      this.api = new GoogleGenerativeAI(apiKey);
      this.model = this.api.getGenerativeModel({ model: 'gemini-2.0-flash' });
    } catch (error) {
      console.error('Failed to initialize Gemini:', error);
      throw error;
    }
  }

  async generateContent(prompt: string, history?: Message[]): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini not initialized. Please set API key.');
    }

    try {
      let chatHistory: any[] = [];
      
      if (history && history.length > 0) {
        chatHistory = history.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        }));
      }

      const chat = this.model.startChat({
        history: chatHistory,
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
          topP: 0.9,
        },
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('Gemini API error:', error);
      throw new Error(`AI request failed: ${error.message}`);
    }
  }

  async generateContentWithSources(prompt: string): Promise<{ content: string; sources: any[] }> {
    // For now, return content without sources
    // In production, this would integrate with search APIs
    const content = await this.generateContent(prompt);
    return { content, sources: [] };
  }

  async generateImage(prompt: string): Promise<string> {
    // Note: Gemini doesn't directly support image generation
    // This would need integration with Imagen or another image model
    throw new Error('Image generation not available with current provider');
  }

  async analyzeFile(file: File, prompt: string): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini not initialized');
    }

    try {
      const fileData = await file.arrayBuffer();
      const base64Data = Buffer.from(fileData).toString('base64');
      
      let mimeType = file.type;
      if (!mimeType) {
        mimeType = this.getMimeTypeFromExtension(file.name);
      }

      const result = await this.model.generateContent([
        {
          inlineData: {
            data: base64Data,
            mimeType,
          },
        },
        prompt,
      ]);

      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error('File analysis error:', error);
      throw new Error(`File analysis failed: ${error.message}`);
    }
  }

  private getMimeTypeFromExtension(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      pdf: 'application/pdf',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      txt: 'text/plain',
    };
    return mimeTypes[ext || 'txt'] || 'text/plain';
  }
}

// Singleton instance
let geminiService: GeminiService | null = null;

export function getGeminiService(apiKey?: string): GeminiService {
  if (apiKey && !geminiService) {
    geminiService = new GeminiService(apiKey);
  } else if (!geminiService) {
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (envApiKey) {
      geminiService = new GeminiService(envApiKey);
    } else {
      geminiService = new GeminiService('');
    }
  }
  return geminiService;
}

export default GeminiService;
