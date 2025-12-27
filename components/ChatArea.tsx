'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/lib/types';
import MessageBubble from './MessageBubble';

interface ChatAreaProps {
  messages: Message[];
  isGenerating: boolean;
  streamingContent: string;
}

export default function ChatArea({ messages, isGenerating, streamingContent }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  return (
    <div className="chat-area">
      <div className="chat-header">
        <span className="chat-header-icon">💬</span>
        <span className="chat-header-title">Chat Area</span>
        <span className="badge badge-live blink">LIVE</span>
      </div>

      <div className="chat-decoration-top">
        ╔══════════════════════════════════════╗
      </div>

      <div className="messages-container">
        {messages.length === 0 && !isGenerating ? (
          <div className="empty-chat">
            <div className="empty-chat-ascii">
              {'　　　 ∧＿∧\n　　　(　・∀・) ＜ Say something!\n　　　(　　　　)\n　　　 │ │ │\n　　　(＿)＿)'}
            </div>
            <div className="empty-chat-hints">
              <div className="hint-title">★ HOW TO USE ★</div>
              <ul className="hint-list">
                <li>Ask me anything!</li>
                <li>Enter to send, Shift+Enter for newline</li>
                <li>Manage history in left sidebar</li>
                <li>Set model & temperature below</li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isGenerating && streamingContent && (
              <div className="message-wrapper assistant streaming">
                <div className="message-avatar">
                  <span className="avatar-icon bot-avatar">🤖</span>
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-role">AI</span>
                    <span className="generating-indicator blink">Generating...</span>
                  </div>
                  <div
                    className="message-text"
                    dangerouslySetInnerHTML={{
                      __html: streamingContent + '<span class="cursor blink">▌</span>',
                    }}
                  />
                </div>
              </div>
            )}

            {isGenerating && !streamingContent && (
              <div className="loading-indicator">
                <span className="loading-dots">
                  <span className="dot">●</span>
                  <span className="dot">●</span>
                  <span className="dot">●</span>
                </span>
                <span className="loading-text">AI is thinking...</span>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-decoration-bottom">
        ╚══════════════════════════════════════╝
      </div>
    </div>
  );
}
