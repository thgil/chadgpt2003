export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isError?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
}

export interface ChatSettings {
  model: string;
  temperature: number;
}

export interface ChatRequest {
  messages: { role: string; content: string }[];
  model: string;
  temperature: number;
}

export const AVAILABLE_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o (Recommended)' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
] as const;

export const DEFAULT_SETTINGS: ChatSettings = {
  model: 'gpt-4o-mini',
  temperature: 0.7,
};
