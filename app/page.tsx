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

  // Load data from localStorage on mount
  useEffect(() => {
    setMounted(true);

    // Check if already logged in this session
    const isLoggedIn = sessionStorage.getItem('hyper-chat-logged-in') === 'true';
    setEntryComplete(isLoggedIn);

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

    // Start generating
    setIsGenerating(true);
    setStreamingContent('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedConv.messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          model: settings.model,
          temperature: settings.temperature,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullContent += parsed.content;
                setStreamingContent(fullContent);
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: fullContent,
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
    } catch (error) {
      // Add error message
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: `エラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now(),
        isError: true,
      };

      const errorConv: Conversation = {
        ...updatedConv,
        messages: [...updatedConv.messages, errorMessage],
      };

      updateConversation(errorConv);
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? errorConv : c))
      );
    } finally {
      setIsGenerating(false);
      setStreamingContent('');
    }
  }, [currentConversationId, currentConversation, isGenerating, settings]);

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
    </div>
  );
}
