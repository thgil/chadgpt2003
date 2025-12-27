'use client';

import { Message } from '@/lib/types';
import { parseMarkdown, formatTime } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isError = message.isError;

  return (
    <div className={`message-wrapper ${isUser ? 'user' : 'assistant'} ${isError ? 'error' : ''}`}>
      <div className="message-avatar">
        {isUser ? (
          <span className="avatar-icon user-avatar">👤</span>
        ) : isError ? (
          <span className="avatar-icon error-avatar">⚠</span>
        ) : (
          <span className="avatar-icon bot-avatar">🤖</span>
        )}
      </div>
      <div className="message-content">
        <div className="message-header">
          <span className="message-role">
            {isUser ? 'You' : isError ? 'Error' : 'AI'}
          </span>
          <span className="message-time">{formatTime(message.timestamp)}</span>
          {!isUser && !isError && <span className="badge badge-ai">AI生成</span>}
        </div>
        <div
          className="message-text"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
        />
        <div className="message-footer">
          {isUser && <span className="message-badge">Sent ✓</span>}
        </div>
      </div>
    </div>
  );
}
