import { Conversation, ChatSettings, DEFAULT_SETTINGS } from './types';

const STORAGE_KEY = 'hyper-chat-2003-conversations';
const SETTINGS_KEY = 'hyper-chat-2003-settings';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function getConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch (e) {
    console.error('Failed to save conversations:', e);
  }
}

export function getConversation(id: string): Conversation | null {
  const conversations = getConversations();
  return conversations.find(c => c.id === id) || null;
}

export function createConversation(): Conversation {
  const conversation: Conversation = {
    id: generateId(),
    title: 'New Chat',
    createdAt: Date.now(),
    messages: [],
  };
  const conversations = getConversations();
  conversations.unshift(conversation);
  saveConversations(conversations);
  return conversation;
}

export function updateConversation(conversation: Conversation): void {
  const conversations = getConversations();
  const index = conversations.findIndex(c => c.id === conversation.id);
  if (index !== -1) {
    conversations[index] = conversation;
    saveConversations(conversations);
  }
}

export function deleteConversation(id: string): void {
  const conversations = getConversations();
  const filtered = conversations.filter(c => c.id !== id);
  saveConversations(filtered);
}

export function renameConversation(id: string, title: string): void {
  const conversations = getConversations();
  const conversation = conversations.find(c => c.id === id);
  if (conversation) {
    conversation.title = title;
    saveConversations(conversations);
  }
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SETTINGS_KEY);
}

export function getSettings(): ChatSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: ChatSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}
