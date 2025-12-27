'use client';

import { useState, useRef, useEffect } from 'react';

interface InputAreaProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function InputArea({ onSend, disabled }: InputAreaProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="input-area">
      <div className="input-header">
        <span className="input-icon">✏️</span>
        <span className="input-label">Message Input</span>
        <span className="input-hint">(Enter to send / Shift+Enter for newline)</span>
      </div>

      <div className="input-container">
        <textarea
          ref={textareaRef}
          className="message-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          disabled={disabled}
          rows={1}
        />

        <button
          className={`send-button ${disabled ? 'disabled' : ''}`}
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
        >
          <span className="send-icon">▶</span>
          <span className="send-text">Send</span>
          {disabled && <span className="send-loading blink">...</span>}
        </button>
      </div>

      <div className="input-footer">
        <div className="char-count">
          Chars: <span className={input.length > 4000 ? 'warning' : ''}>{input.length}</span>
        </div>
        <div className="input-tips">
          <span className="tip">💡 Tip: Specific questions get better answers!</span>
        </div>
      </div>
    </div>
  );
}
