/*
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                    HYPER CHAT 2003                               ║
 * ║         A ChatGPT-like app with 2000s Japanese web aesthetics    ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  SETUP INSTRUCTIONS:                                             ║
 * ║  1. Copy .env.local.example to .env.local                        ║
 * ║  2. Add your OpenAI API key to .env.local:                       ║
 * ║     OPENAI_API_KEY=sk-your-api-key-here                          ║
 * ║  3. Optionally set OPENAI_BASE_URL for custom endpoints          ║
 * ║  4. Run: npm install && npm run dev                              ║
 * ║  5. Open http://localhost:3000                                   ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Message, Conversation, ChatSettings, DEFAULT_SETTINGS } from '@/lib/types';
import {
  getConversations,
  createConversation,
  updateConversation,
  deleteConversation,
  renameConversation,
  clearAllData,
  generateId,
  getSettings,
  saveSettings,
} from '@/lib/storage';
import SystemControls from '@/components/SystemControls';
import SlotMachineSelector from '@/components/SlotMachineSelector';
import EntryFlow from '@/components/EntryFlow';

// Fake chatbot responses and suggestions
interface ChatbotResponse {
  keywords: string[];
  response: string;
  suggestions: string[];
}

const chatbotResponses: ChatbotResponse[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon'],
    response: "Hello! Welcome to HYPER CHAT Enterprise Support System v2003. I'm CHAD-BOT, your virtual assistant. How can I help you today?\n\nPlease select an option below or type your question.",
    suggestions: ['What can you help me with?', 'I have a technical problem', 'Tell me about this system', 'I need account support']
  },
  {
    keywords: ['help', 'what can you', 'options', 'menu', 'assist'],
    response: "I can assist you with the following:\n\n• Account & Login Issues\n• Technical Support\n• System Information\n• General Inquiries\n• Password Reset\n• Report a Bug\n\nPlease select a topic or describe your issue.",
    suggestions: ['Account issues', 'Technical support', 'System information', 'How do I reset my password?']
  },
  {
    keywords: ['account', 'login', 'sign in', 'cannot access', 'locked'],
    response: "I understand you're having account issues. Here are some common solutions:\n\n1. Make sure CAPS LOCK is off\n2. Clear your browser cache and cookies\n3. Try a different browser\n4. Wait 15 minutes if locked out\n\nIf the problem persists, please contact your system administrator at ext. 4567.",
    suggestions: ['My account is locked', 'I forgot my password', 'Create new account', 'Talk to human agent']
  },
  {
    keywords: ['password', 'forgot', 'reset', 'change password'],
    response: "To reset your password:\n\n1. Click 'Forgot Password' on the login page\n2. Enter your employee ID\n3. Check your company email for reset link\n4. Link expires in 24 hours\n\n⚠️ Note: Passwords must be 8+ characters with uppercase, lowercase, and numbers.\n\nNeed further assistance?",
    suggestions: ['I didn\'t receive the email', 'My employee ID doesn\'t work', 'What are password requirements?', 'Back to main menu']
  },
  {
    keywords: ['technical', 'problem', 'issue', 'error', 'bug', 'not working', 'broken'],
    response: "I'm sorry to hear you're experiencing technical difficulties. To help diagnose the issue:\n\n• What error message are you seeing?\n• When did the problem start?\n• Have you tried restarting your browser?\n\nCommon fixes: Clear cache, disable extensions, try incognito mode.",
    suggestions: ['Page won\'t load', 'Getting error message', 'Feature not working', 'It\'s very slow']
  },
  {
    keywords: ['slow', 'loading', 'performance', 'speed', 'takes forever'],
    response: "Performance issues can be caused by:\n\n• High server load (check status panel)\n• Network connectivity issues\n• Browser cache overflow\n• Too many open tabs\n\nRecommended: Clear browser cache and restart. Current server status: ✓ ONLINE\n\nDid this help resolve your issue?",
    suggestions: ['Yes, it\'s working now', 'Still having problems', 'Check server status', 'Contact IT support']
  },
  {
    keywords: ['error', 'message', '404', '500', 'failed'],
    response: "Error messages indicate something went wrong. Common errors:\n\n• 404: Page not found - check URL\n• 500: Server error - try again later\n• 403: Access denied - check permissions\n• Timeout: Network issue - refresh page\n\nPlease describe the exact error you're seeing.",
    suggestions: ['I see error 404', 'Server error 500', 'Access denied', 'Connection timeout']
  },
  {
    keywords: ['system', 'information', 'about', 'version', 'what is this'],
    response: "HYPER CHAT Enterprise v2003.12.25\n\n━━━━━━━━━━━━━━━━━━━━━━━\n• Platform: Enterprise AI Assistant\n• Version: 2003.12.25.rev.4521\n• Server: APAC-TOKYO-03\n• Status: Operational\n• Uptime: 99.7%\n━━━━━━━━━━━━━━━━━━━━━━━\n\n© 2003 HYPER CHAT Corporation",
    suggestions: ['What features are available?', 'System requirements', 'Privacy policy', 'Back to main menu']
  },
  {
    keywords: ['feature', 'features', 'what can', 'capabilities', 'do you do'],
    response: "HYPER CHAT Enterprise Features:\n\n✓ AI-Powered Conversations\n✓ Multi-language Support\n✓ Conversation History\n✓ Secure Encryption\n✓ 24/7 Availability\n✓ Enterprise Integration\n\nNote: Some features may require additional licensing.",
    suggestions: ['How do I use AI chat?', 'Is my data secure?', 'Pricing information', 'Request demo']
  },
  {
    keywords: ['secure', 'security', 'privacy', 'data', 'safe', 'encrypted'],
    response: "Security Information:\n\n🔒 All connections are TLS 1.3 encrypted\n🔒 Data stored in ISO 27001 certified facilities\n🔒 SOC 2 Type II compliant\n🔒 GDPR compliant\n🔒 Sessions auto-expire after 30 minutes\n\nYour privacy is our priority.",
    suggestions: ['Where is my data stored?', 'Can I delete my data?', 'View privacy policy', 'Security certifications']
  },
  {
    keywords: ['human', 'agent', 'person', 'real', 'operator', 'talk to someone', 'support'],
    response: "I understand you'd like to speak with a human agent.\n\n📞 Phone Support: 0120-XXX-XXXX (9:00-18:00 JST)\n📧 Email: support@hyper-chat.local\n💬 Live Chat: Currently unavailable\n\nExpected wait time: ~15 minutes\n\nWould you like me to try to help first?",
    suggestions: ['Yes, I\'ll try chatbot first', 'Schedule a callback', 'Send email instead', 'View support hours']
  },
  {
    keywords: ['thank', 'thanks', 'resolved', 'working', 'fixed', 'great', 'awesome'],
    response: "You're welcome! I'm glad I could help! 🎉\n\nBefore you go:\n• Rate this conversation (optional)\n• Bookmark our FAQ page\n• Check out new features\n\nIs there anything else I can assist you with today?",
    suggestions: ['No, that\'s all', 'I have another question', 'Rate this chat', 'View FAQ']
  },
  {
    keywords: ['bye', 'goodbye', 'exit', 'close', 'done', 'no thanks', 'that\'s all'],
    response: "Thank you for using HYPER CHAT Enterprise Support!\n\n━━━━━━━━━━━━━━━━━━━━━━━\nSession Summary:\n• Chat ID: HC-" + Math.random().toString(36).substring(2, 8).toUpperCase() + "\n• Duration: This session\n• Status: Resolved\n━━━━━━━━━━━━━━━━━━━━━━━\n\nHave a great day! またのご利用をお待ちしております。",
    suggestions: ['Start new conversation', 'Rate this chat', 'View chat history', 'Return to dashboard']
  },
  {
    keywords: ['pricing', 'cost', 'price', 'subscription', 'license', 'buy', 'purchase'],
    response: "HYPER CHAT Enterprise Pricing:\n\n📦 Basic: ¥9,800/month\n   - 5 users, 10k messages\n\n📦 Professional: ¥29,800/month\n   - 25 users, unlimited messages\n\n📦 Enterprise: Contact sales\n   - Unlimited everything\n\nAll plans include 14-day free trial.",
    suggestions: ['Start free trial', 'Contact sales', 'Compare plans', 'Back to main menu']
  },
  {
    keywords: ['weather', 'time', 'date', 'joke', 'fun'],
    response: "Ha! While I appreciate the casual conversation, I'm primarily designed for enterprise support. 😄\n\nBut since you asked... \n🌤️ Weather: Check your local forecast\n🕐 Time: Look at your taskbar\n😂 Joke: Why did the chatbot go to therapy? Too many mixed messages!\n\nNow, how can I really help you?",
    suggestions: ['Tell me another joke', 'Okay, I need real help', 'What can you actually do?', 'Back to main menu']
  }
];

const defaultResponse: ChatbotResponse = {
  keywords: [],
  response: "I'm not quite sure I understand your question. Let me try to help!\n\nCould you please:\n• Rephrase your question\n• Select from the options below\n• Or type 'help' to see what I can assist with\n\nI'm still learning, so your patience is appreciated! 🤖",
  suggestions: ['Show me the main menu', 'I need technical help', 'Talk to human agent', 'What can you help with?']
};

const getRandomTypingDelay = () => Math.floor(Math.random() * 1500) + 1000;

const findBestResponse = (input: string): ChatbotResponse => {
  const lowerInput = input.toLowerCase();

  for (const response of chatbotResponses) {
    if (response.keywords.some(keyword => lowerInput.includes(keyword))) {
      return response;
    }
  }

  return defaultResponse;
};

// Popup component
function JRPopup({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="jr-popup-overlay" onClick={onClose}>
      <div className="jr-popup" onClick={(e) => e.stopPropagation()}>
        <div className="jr-popup-header">
          <span className="jr-popup-title">{title}</span>
          <button className="jr-popup-close" onClick={onClose}>✕</button>
        </div>
        <div className="jr-popup-content">
          {children}
        </div>
        <div className="jr-popup-footer">
          <button className="jr-btn primary" onClick={onClose}>OK / 閉じる</button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [mounted, setMounted] = useState(false);
  const [entryComplete, setEntryComplete] = useState(false);
  const [showFirstChatPopup, setShowFirstChatPopup] = useState(false);
  const [hasShownFirstChat, setHasShownFirstChat] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [showPasswordSaver, setShowPasswordSaver] = useState(true);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([
    'Hello!', 'I need help', 'What can you do?', 'Technical support'
  ]);

  // Load data from localStorage on mount
  useEffect(() => {
    setMounted(true);

    // Always start with entry flow on refresh
    setEntryComplete(false);

    const savedConversations = getConversations();
    const savedSettings = getSettings();
    setConversations(savedConversations);
    setSettings(savedSettings);

    if (savedConversations.length > 0) {
      setCurrentConversationId(savedConversations[0].id);
    }
  }, []);

  const currentConversation = conversations.find((c) => c.id === currentConversationId) || null;

  const handleCreateConversation = useCallback(() => {
    const newConv = createConversation();
    setConversations((prev) => [newConv, ...prev]);
    setCurrentConversationId(newConv.id);
  }, []);

  const handleSelectConversation = useCallback((id: string) => {
    setCurrentConversationId(id);
  }, []);

  const handleRenameConversation = useCallback((id: string, title: string) => {
    renameConversation(id, title);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c))
    );
  }, []);

  const handleDeleteConversation = useCallback((id: string) => {
    deleteConversation(id);
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (currentConversationId === id) {
        setCurrentConversationId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  }, [currentConversationId]);

  const handleSettingsChange = useCallback((newSettings: ChatSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  }, []);

  const handleClearCache = useCallback(() => {
    if (confirm('Delete all chat history and settings?\n\nThis cannot be undone.')) {
      clearAllData();
      setConversations([]);
      setCurrentConversationId(null);
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isGenerating) return;

    // Show first chat popup if this is the first message ever
    if (!hasShownFirstChat) {
      setShowFirstChatPopup(true);
      setHasShownFirstChat(true);
    }

    let convId = currentConversationId;
    let conv = currentConversation;

    // Create new conversation if none exists
    if (!convId || !conv) {
      const newConv = createConversation();
      conv = newConv;
      convId = newConv.id;
      setConversations((prev) => [newConv, ...prev]);
      setCurrentConversationId(convId);
    }

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    const updatedConv: Conversation = {
      ...conv,
      messages: [...conv.messages, userMessage],
      // Auto-title based on first message
      title: conv.messages.length === 0 ? content.slice(0, 30) + (content.length > 30 ? '...' : '') : conv.title,
    };

    updateConversation(updatedConv);
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? updatedConv : c))
    );

    // Start "generating" (fake typing delay)
    setIsGenerating(true);
    setStreamingContent('');

    // Get chatbot response
    const chatbotResponse = findBestResponse(content);

    // Simulate typing with streaming effect
    const typingDelay = getRandomTypingDelay();
    const responseText = chatbotResponse.response;

    // Show typing indicator first
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate character-by-character streaming
    let currentText = '';
    const charsPerTick = 3;
    const tickDelay = 30;

    for (let i = 0; i < responseText.length; i += charsPerTick) {
      currentText = responseText.slice(0, i + charsPerTick);
      setStreamingContent(currentText);
      await new Promise(resolve => setTimeout(resolve, tickDelay));
    }

    // Small delay before finalizing
    await new Promise(resolve => setTimeout(resolve, 200));

    // Add assistant message
    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: responseText,
      timestamp: Date.now(),
    };

    const finalConv: Conversation = {
      ...updatedConv,
      messages: [...updatedConv.messages, assistantMessage],
    };

    updateConversation(finalConv);
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? finalConv : c))
    );

    // Update suggestions
    setCurrentSuggestions(chatbotResponse.suggestions);

    setIsGenerating(false);
    setStreamingContent('');
  }, [currentConversationId, currentConversation, isGenerating, hasShownFirstChat]);

  // Don't render until mounted (to avoid hydration mismatch with localStorage)
  if (!mounted) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-title rainbow-text">HYPER CHAT 2003</div>
          <div className="loading-spinner">
            <span className="spinner-dot">●</span>
            <span className="spinner-dot">●</span>
            <span className="spinner-dot">●</span>
          </div>
          <div className="loading-text">Loading...</div>
        </div>
      </div>
    );
  }

  // Show entry flow if not completed
  if (!entryComplete) {
    return <EntryFlow onComplete={() => setEntryComplete(true)} />;
  }

  return (
    <div className="jr-app-container">
      <header className="jr-app-header">
        <div className="jr-app-header-top">
          <div className="jr-app-logo">
            <span className="jr-app-logo-mark">HC</span>
            <span className="jr-app-logo-text">HYPER CHAT</span>
            <span className="jr-app-logo-sub">Enterprise AI Platform v2003</span>
          </div>
          <div className="jr-app-header-nav">
            <a href="#" onClick={(e) => e.preventDefault()}>ダッシュボード</a>
            <span className="jr-nav-sep">|</span>
            <a href="#" onClick={(e) => e.preventDefault()}>マニュアル</a>
            <span className="jr-nav-sep">|</span>
            <a href="#" onClick={(e) => e.preventDefault()}>サポート</a>
            <span className="jr-nav-sep">|</span>
            <a href="#" onClick={(e) => e.preventDefault()}>設定</a>
            <span className="jr-nav-sep">|</span>
            <a href="#" onClick={(e) => e.preventDefault()}>ログアウト</a>
          </div>
        </div>
        <div className="jr-app-header-ticker">
          <marquee scrollamount={2}>
            【お知らせ】年末年始の運用について　●　【メンテナンス】1月15日 02:00-06:00 定期メンテナンス予定　●　【新機能】AI応答速度が向上しました　●　【セキュリティ】パスワードの定期変更をお願いします　●　HYPER CHAT Enterprise - 次世代AIコミュニケーションプラットフォーム
          </marquee>
        </div>
        <div className="jr-app-header-tabs">
          <div className="jr-app-tab active">
            <span className="jr-app-tab-icon">💬</span>
            チャット
          </div>
          <div className="jr-app-tab disabled">
            <span className="jr-app-tab-icon">📊</span>
            分析
          </div>
          <div className="jr-app-tab disabled">
            <span className="jr-app-tab-icon">📁</span>
            ファイル
          </div>
          <div className="jr-app-tab disabled">
            <span className="jr-app-tab-icon">⚙️</span>
            管理
          </div>
        </div>
      </header>

      <main className="jr-app-main">
        <aside className="jr-app-sidebar">
          <div className="jr-sidebar-header">
            <div className="jr-sidebar-title">チャット履歴</div>
            <button className="jr-new-chat-btn" onClick={handleCreateConversation}>
              ＋ 新規作成
            </button>
          </div>

          <div className="jr-sidebar-info">
            <table className="jr-mini-table">
              <tbody>
                <tr><th>ユーザー</th><td>claude</td></tr>
                <tr><th>セッション</th><td className="status-ok">● 有効</td></tr>
                <tr><th>履歴数</th><td>{conversations.length}件</td></tr>
              </tbody>
            </table>
          </div>

          <div className="jr-sidebar-list">
            {conversations.length === 0 ? (
              <div className="jr-no-history">
                <div className="jr-no-history-icon">📭</div>
                <div>履歴がありません</div>
                <div className="jr-no-history-hint">新規作成からチャットを開始してください</div>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`jr-history-item ${currentConversationId === conv.id ? 'active' : ''}`}
                  onClick={() => handleSelectConversation(conv.id)}
                >
                  <div className="jr-history-title">{conv.title}</div>
                  <div className="jr-history-meta">
                    <span>{new Date(conv.createdAt).toLocaleDateString('ja-JP')}</span>
                    <span>{conv.messages.length}件</span>
                  </div>
                  <div className="jr-history-actions">
                    <button onClick={(e) => { e.stopPropagation(); const title = prompt('新しいタイトル:', conv.title); if (title) handleRenameConversation(conv.id, title); }}>✎</button>
                    <button className="delete" onClick={(e) => { e.stopPropagation(); if (confirm('削除しますか？')) handleDeleteConversation(conv.id); }}>✕</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="jr-sidebar-footer">
            <div className="jr-sidebar-links">
              <a href="#" onClick={(e) => e.preventDefault()}>ヘルプ</a>
              <a href="#" onClick={(e) => e.preventDefault()}>FAQ</a>
              <a href="#" onClick={(e) => e.preventDefault()}>お問い合わせ</a>
            </div>
          </div>
        </aside>

        <div className="jr-app-center">
          <div className="jr-breadcrumb">
            トップ &gt; エンタープライズポータル &gt; AIチャット &gt; ワークスペース
          </div>

          <div className="jr-chat-panel">
            <div className="jr-chat-panel-header">
              <span className="jr-panel-icon">●</span>
              AIチャット / AI Chat
              <span className="jr-panel-badge">Enterprise Edition</span>
              {isGenerating && <span className="jr-generating-badge">● 生成中...</span>}
            </div>
            <div className="jr-chat-messages">
              {(currentConversation?.messages || []).length === 0 && !isGenerating ? (
                <div className="jr-empty-chat">
                  <div className="jr-empty-icon">💬</div>
                  <div className="jr-empty-title">AIチャットへようこそ</div>
                  <div className="jr-empty-desc">
                    下のテキストボックスにメッセージを入力してEnterキーで送信してください。
                  </div>
                  <div className="jr-empty-hints">
                    <div className="jr-hint-header">ご利用ガイド</div>
                    <ul>
                      <li>Enter: メッセージを送信</li>
                      <li>Shift+Enter: 改行</li>
                      <li>左パネル: 履歴の管理</li>
                      <li>右パネル: 設定・情報</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  {(currentConversation?.messages || []).map((message) => (
                    <div key={message.id} className={`jr-message ${message.role}`}>
                      <div className="jr-message-header">
                        <span className="jr-message-role">
                          {message.role === 'user' ? '👤 あなた' : '🤖 AI'}
                        </span>
                        <span className="jr-message-time">
                          {new Date(message.timestamp).toLocaleTimeString('ja-JP')}
                        </span>
                      </div>
                      <div className="jr-message-content">
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isGenerating && streamingContent && (
                    <div className="jr-message assistant streaming">
                      <div className="jr-message-header">
                        <span className="jr-message-role">🤖 AI</span>
                        <span className="jr-message-time generating">生成中...</span>
                      </div>
                      <div className="jr-message-content">
                        {streamingContent}<span className="jr-cursor">▌</span>
                      </div>
                    </div>
                  )}
                  {isGenerating && !streamingContent && (
                    <div className="jr-loading-message">
                      <span className="jr-loading-dot">●</span>
                      <span className="jr-loading-dot">●</span>
                      <span className="jr-loading-dot">●</span>
                      <span className="jr-loading-text">AIが応答を生成中...</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Suggestion Buttons - Old School Chatbot Style */}
          {currentSuggestions.length > 0 && !isGenerating && (
            <div className="jr-suggestions-panel">
              <div className="jr-suggestions-header">
                <span className="jr-suggestions-icon">💡</span>
                Quick Options / クイック選択
                <span className="jr-suggestions-hint">(Click to send)</span>
              </div>
              <div className="jr-suggestions-buttons">
                {currentSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="jr-suggestion-btn"
                    onClick={() => handleSendMessage(suggestion)}
                  >
                    <span className="jr-suggestion-number">{index + 1}</span>
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="jr-input-panel">
            <div className="jr-input-panel-header small">
              メッセージ入力 / Message Input
              <span className="jr-input-panel-badge">リアルタイム通信</span>
            </div>
            <div className="jr-input-area-wrapper">
              <div className="jr-slot-inline">
                <SlotMachineSelector
                  value={settings.model}
                  onChange={(model) => handleSettingsChange({ ...settings, model })}
                />
              </div>
              <div className="jr-input-main">
                <textarea
                  className="jr-chat-input"
                  placeholder="メッセージを入力してください... / Enter your message..."
                  disabled={isGenerating}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      const target = e.target as HTMLTextAreaElement;
                      if (target.value.trim()) {
                        handleSendMessage(target.value);
                        target.value = '';
                      }
                    }
                  }}
                />
                <div className="jr-input-actions">
                  <button
                    className="jr-send-btn"
                    disabled={isGenerating}
                    onClick={() => {
                      const textarea = document.querySelector('.jr-chat-input') as HTMLTextAreaElement;
                      if (textarea && textarea.value.trim()) {
                        handleSendMessage(textarea.value);
                        textarea.value = '';
                      }
                    }}
                  >
                    送信 / Send
                  </button>
                </div>
              </div>
            </div>
            <div className="jr-input-footer">
              <span>Temperature: {settings.temperature.toFixed(1)}</span>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => handleSettingsChange({ ...settings, temperature: parseFloat(e.target.value) })}
                className="jr-temp-slider"
              />
              <span className="jr-temp-labels">精密 ← → 創造的</span>
            </div>
          </div>
        </div>

        <aside className="jr-app-right">
          <div className="jr-right-box">
            <div className="jr-right-box-header green">セッション情報</div>
            <div className="jr-right-box-content">
              <table className="jr-mini-table">
                <tbody>
                  <tr><th>ユーザー</th><td>claude</td></tr>
                  <tr><th>ログイン</th><td>{new Date().toLocaleTimeString('ja-JP')}</td></tr>
                  <tr><th>セッションID</th><td style={{fontSize: '8px'}}>hc-{Math.random().toString(36).substring(2, 8)}</td></tr>
                  <tr><th>権限</th><td className="status-ok">● 標準ユーザー</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="jr-right-box">
            <div className="jr-right-box-header blue">接続情報</div>
            <div className="jr-right-box-content">
              <table className="jr-mini-table">
                <tbody>
                  <tr><th>API</th><td className="status-ok">● 接続中</td></tr>
                  <tr><th>Region</th><td>APAC-TOKYO-03</td></tr>
                  <tr><th>Latency</th><td className="status-ok">42ms</td></tr>
                  <tr><th>Version</th><td>v2003.12.25</td></tr>
                  <tr><th>Protocol</th><td>HTTPS/2 TLS1.3</td></tr>
                  <tr><th>Endpoint</th><td style={{fontSize: '8px'}}>api.hc.local</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="jr-right-box">
            <div className="jr-right-box-header orange">ご注意・免責事項</div>
            <div className="jr-right-box-content warning">
              <ul className="jr-warning-list">
                <li>機密情報は入力しないでください</li>
                <li>30分で自動ログアウトします</li>
                <li>会話内容は監査・記録対象です</li>
                <li>商用利用には別途契約が必要です</li>
                <li>AI応答は参考情報であり、正確性を保証しません</li>
                <li>本サービスは予告なく変更される場合があります</li>
              </ul>
            </div>
          </div>

          <div className="jr-right-box">
            <div className="jr-right-box-header">利用ガイドライン</div>
            <div className="jr-right-box-content">
              <div className="jr-guidelines">
                <p><strong>【推奨される利用方法】</strong></p>
                <ul>
                  <li>業務に関する質問・相談</li>
                  <li>文書作成の補助</li>
                  <li>アイデアのブレインストーミング</li>
                  <li>コードレビュー・デバッグ</li>
                </ul>
                <p><strong>【禁止事項】</strong></p>
                <ul>
                  <li>個人情報の入力</li>
                  <li>機密情報の共有</li>
                  <li>不適切なコンテンツの生成</li>
                  <li>自動化スクリプトの使用</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="jr-right-box">
            <div className="jr-right-box-header">クイックリンク</div>
            <div className="jr-right-box-content">
              <ul className="jr-quick-links">
                <li><a href="#" onClick={(e) => e.preventDefault()}>📖 利用マニュアル</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>🔧 トラブルシューティング</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>📞 ヘルプデスク (内線: 4567)</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>📊 利用統計レポート</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>⚙️ アカウント設定</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>🔐 パスワード変更</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>📋 利用規約</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>🛡️ セキュリティポリシー</a></li>
              </ul>
            </div>
          </div>

          <div className="jr-right-box">
            <div className="jr-right-box-header">サーバー状況</div>
            <div className="jr-right-box-content">
              <table className="jr-mini-table">
                <tbody>
                  <tr><th>Web</th><td className="status-ok">● 正常</td></tr>
                  <tr><th>API</th><td className="status-ok">● 正常</td></tr>
                  <tr><th>DB</th><td className="status-ok">● 正常</td></tr>
                  <tr><th>Cache</th><td className="status-ok">● 正常</td></tr>
                  <tr><th>AI Engine</th><td className="status-ok">● 稼働中</td></tr>
                  <tr><th>Queue</th><td className="status-ok">● 0件待機</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="jr-right-box">
            <div className="jr-right-box-header">お知らせ</div>
            <div className="jr-right-box-content">
              <ul className="jr-news-list">
                <li><span className="jr-news-date">12/25</span> <span className="jr-badge-new">NEW</span> 年末年始の運用について</li>
                <li><span className="jr-news-date">12/20</span> AI応答速度が向上しました</li>
                <li><span className="jr-news-date">12/15</span> セキュリティアップデート適用</li>
                <li><span className="jr-news-date">12/10</span> 新モデル追加のお知らせ</li>
              </ul>
            </div>
          </div>

          <div className="jr-right-box">
            <div className="jr-right-box-header">システム管理</div>
            <div className="jr-right-box-content">
              <button className="jr-admin-btn" onClick={handleClearCache}>
                🗑️ キャッシュクリア
              </button>
              <div className="jr-admin-warning">
                ※ すべての履歴が削除されます
              </div>
            </div>
          </div>
        </aside>
      </main>

      <footer className="jr-app-footer">
        <div className="jr-app-footer-links">
          <a href="#">利用規約</a>
          <span>|</span>
          <a href="#">プライバシーポリシー</a>
          <span>|</span>
          <a href="#">セキュリティポリシー</a>
          <span>|</span>
          <a href="#">お問い合わせ</a>
          <span>|</span>
          <a href="#">サイトマップ</a>
        </div>
        <div className="jr-app-footer-info">
          <span>運営: Hyper Chat Corporation</span>
          <span>|</span>
          <span>Build: 2003.12.25.rev.4521</span>
          <span>|</span>
          <span>Region: APAC-JP-TOKYO</span>
        </div>
        <div className="jr-app-footer-copyright">
          © 2003-2024 HYPER CHAT CORPORATION. All Rights Reserved.
        </div>
        <div className="jr-app-footer-badges">
          <span className="jr-footer-badge">ISO 27001</span>
          <span className="jr-footer-badge">SOC 2 Type II</span>
          <span className="jr-footer-badge">GDPR</span>
          <span className="jr-footer-badge">ISMS認証</span>
        </div>
      </footer>

      {/* First Chat Popup */}
      {showFirstChatPopup && (
        <JRPopup
          title="ご利用にあたって / Before You Begin"
          onClose={() => setShowFirstChatPopup(false)}
        >
          <div className="jr-popup-notice">
            <p><strong>【重要なお知らせ】</strong></p>
            <p>HYPER CHAT Enterprise をご利用いただきありがとうございます。</p>
            <p>初回ご利用にあたり、以下の点にご注意ください：</p>
            <ul>
              <li>本サービスはAIによる自動応答システムです</li>
              <li>応答内容の正確性は保証されません</li>
              <li>機密情報・個人情報は入力しないでください</li>
              <li>すべての会話は記録・監査対象となります</li>
              <li>30分間操作がない場合、自動ログアウトされます</li>
            </ul>
            <p className="jr-popup-small">
              ※ 本サービスの利用により発生した損害について、当社は一切の責任を負いません。<br />
              ※ 利用規約に同意の上、ご利用ください。
            </p>
          </div>
        </JRPopup>
      )}

      {/* Cookie Banner */}
      {showCookieBanner && (
        <div className="jr-cookie-banner">
          <div className="jr-cookie-content">
            <div className="jr-cookie-icon">🍪</div>
            <div className="jr-cookie-text">
              <strong>Cookie使用のお知らせ / Cookie Notice</strong>
              <p>
                当サイトでは、サービス向上およびユーザー体験の最適化のためにCookieを使用しています。
                Cookieにはセッション管理、ユーザー設定の保存、アクセス解析などの目的で使用される情報が含まれます。
                本サイトのご利用を継続されることで、当社のCookieポリシーに同意いただいたものとみなされます。
              </p>
              <p className="jr-cookie-small">
                詳細は<a href="#" onClick={(e) => e.preventDefault()}>プライバシーポリシー</a>および
                <a href="#" onClick={(e) => e.preventDefault()}>Cookie設定</a>をご確認ください。
              </p>
            </div>
            <div className="jr-cookie-actions">
              <button className="jr-cookie-btn primary" onClick={() => setShowCookieBanner(false)}>
                すべて許可
              </button>
              <button className="jr-cookie-btn secondary" onClick={() => setShowCookieBanner(false)}>
                必須のみ
              </button>
              <button className="jr-cookie-btn link" onClick={() => alert('Cookie設定画面は準備中です。')}>
                詳細設定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Saver Panel */}
      {showPasswordSaver && (
        <div className="jr-password-saver">
          <div className="jr-password-saver-header">
            <span className="jr-password-saver-icon">🔐</span>
            <span className="jr-password-saver-title">パスワードを保存しますか？</span>
            <button className="jr-password-saver-close" onClick={() => setShowPasswordSaver(false)}>✕</button>
          </div>
          <div className="jr-password-saver-content">
            <div className="jr-password-saver-site">
              <div className="jr-password-saver-favicon">HC</div>
              <div className="jr-password-saver-details">
                <div className="jr-password-saver-url">hyper-chat.local</div>
                <div className="jr-password-saver-user">claude</div>
              </div>
            </div>
            <div className="jr-password-saver-info">
              <p>このサイトのログイン情報をブラウザに保存しますか？</p>
              <p className="jr-password-saver-note">
                ※ 保存されたパスワードはブラウザのパスワードマネージャーで管理されます
              </p>
            </div>
            <div className="jr-password-saver-actions">
              <button className="jr-password-saver-btn primary" onClick={() => { alert('パスワードを保存しました（デモ）'); setShowPasswordSaver(false); }}>
                保存する
              </button>
              <button className="jr-password-saver-btn secondary" onClick={() => setShowPasswordSaver(false)}>
                保存しない
              </button>
            </div>
            <div className="jr-password-saver-footer">
              <label className="jr-password-saver-checkbox">
                <input type="checkbox" />
                <span>このサイトでは今後表示しない</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
