import React, { useRef, useEffect } from 'react';
import { Send, Bot, User, Copy, Check, Loader2 } from 'lucide-react';
import type { Message } from '../types';
import { useAppStore } from '../store/appStore';

interface ChatAreaProps {
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ onSendMessage, isLoading }) => {
  const { currentConversationId, conversations, selectedModel, models } = useAppStore();
  const [input, setInput] = React.useState('');
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const conversation = conversations.find(c => c.id === currentConversationId);
  const messages = conversation?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    await onSendMessage(input.trim());
    setInput('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const selectedModelData = models.find(m => m.id === selectedModel);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Model indicator */}
      <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Bot size={16} />
          <span className="font-medium">{selectedModelData?.name || 'NexaAI'}</span>
          <span className="text-xs px-2 py-0.5 bg-nexa/10 text-nexa rounded-full">
            {selectedModelData?.tier}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-nexa-light to-nexa-dark flex items-center justify-center">
                <Bot size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 dark:text-slate-200">
                Welcome to NexaAI
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Your intelligent AI assistant powered by advanced language models.
              </p>
              <div className="grid grid-cols-2 gap-3 text-left">
                {[
                  'Explain quantum computing',
                  'Write a Python script',
                  'Summarize this article',
                  'Help me debug code',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="p-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 
                             rounded-lg hover:border-nexa transition-colors text-slate-700 dark:text-slate-300"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto py-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`px-4 py-6 ${
                  message.role === 'assistant' 
                    ? 'bg-slate-50 dark:bg-slate-900/50' 
                    : ''
                }`}
              >
                <div className="flex gap-4 max-w-3xl mx-auto">
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                    ${message.role === 'assistant' 
                      ? 'bg-gradient-to-br from-nexa-light to-nexa-dark text-white' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }
                  `}>
                    {message.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm dark:text-slate-200">
                        {message.role === 'assistant' ? 'NexaAI' : 'You'}
                      </span>
                      {message.role === 'assistant' && (
                        <button
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className="text-slate-400 hover:text-nexa transition-colors"
                          title="Copy response"
                        >
                          {copiedId === message.id ? (
                            <Check size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      )}
                    </div>
                    
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      {message.role === 'assistant' ? (
                        <MarkdownContent content={message.content} />
                      ) : (
                        <p className="whitespace-pre-wrap dark:text-slate-300">{message.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="px-4 py-6 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex gap-4 max-w-3xl mx-auto">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nexa-light to-nexa-dark 
                                flex items-center justify-center shrink-0">
                    <Loader2 size={18} className="text-white animate-spin" />
                  </div>
                  <div className="flex items-center">
                    <span className="text-slate-500 dark:text-slate-400">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-2 bg-slate-100 dark:bg-slate-800 
                        rounded-2xl border border-slate-200 dark:border-slate-700 
                        focus-within:border-nexa focus-within:ring-2 focus-within:ring-nexa/20 
                        transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Message NexaAI..."
              rows={1}
              disabled={isLoading}
              className="flex-1 max-h-[200px] py-4 pl-4 pr-12 bg-transparent border-none 
                       resize-none outline-none text-slate-900 dark:text-slate-100 
                       placeholder-slate-500 dark:placeholder-slate-400"
              style={{ minHeight: '56px' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2 p-2 bg-nexa hover:bg-nexa-dark 
                       disabled:bg-slate-400 disabled:cursor-not-allowed
                       text-white rounded-xl transition-colors"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
          <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2">
            NexaAI can make mistakes. Consider checking important information.
          </p>
        </form>
      </div>
    </div>
  );
};

// Simple markdown-like renderer
const MarkdownContent: React.FC<{ content: string }> = ({ content }) => {
  // Split by code blocks first
  const parts = content.split(/```(\w+)?\n([\s\S]*?)```/g);
  
  return (
    <div className="dark:text-slate-300">
      {parts.map((part, index) => {
        // Code block
        if (index % 3 === 2) {
          const lang = parts[index - 1] || 'text';
          return (
            <CodeBlock key={index} language={lang} code={part} />
          );
        }
        // Regular text (skip language specifiers)
        if (index % 3 !== 1) {
          return (
            <p key={index} className="whitespace-pre-wrap mb-4 last:mb-0">
              {part}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
};

const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden bg-slate-900 dark:bg-slate-950">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 dark:bg-slate-900">
        <span className="text-xs text-slate-400 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="language-{language}">{code.trim()}</code>
      </pre>
    </div>
  );
};

export default ChatArea;
