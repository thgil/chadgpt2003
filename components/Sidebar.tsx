'use client';

import { useState } from 'react';
import { Conversation } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface SidebarProps {
  conversations: Conversation[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export default function Sidebar({
  conversations,
  currentId,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartEdit = (conv: Conversation) => {
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim()) {
      onRename(editingId, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <span className="sparkle">★</span> History <span className="sparkle">★</span>
        </div>
        <button className="new-chat-btn" onClick={onCreate}>
          <span className="badge badge-new">NEW</span> New Chat
        </button>
      </div>

      <div className="sidebar-decoration">
        ═══════════════
      </div>

      <div className="conversation-list">
        {conversations.length === 0 ? (
          <div className="no-conversations">
            <span className="no-conv-icon">( ´･ω･`)</span>
            <span>No history yet</span>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${currentId === conv.id ? 'active' : ''}`}
              onClick={() => onSelect(conv.id)}
            >
              {editingId === conv.id ? (
                <input
                  type="text"
                  className="edit-title-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={handleSaveEdit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <div className="conv-title" onDoubleClick={() => handleStartEdit(conv)}>
                    {conv.title}
                  </div>
                  <div className="conv-meta">
                    <span className="conv-date">{formatDate(conv.createdAt)}</span>
                    <span className="conv-count">({conv.messages.length})</span>
                  </div>
                  <div className="conv-actions">
                    <button
                      className="conv-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(conv);
                      }}
                      title="Rename"
                    >
                      ✎
                    </button>
                    <button
                      className="conv-action-btn delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this chat?')) {
                          onDelete(conv.id);
                        }
                      }}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-ascii">
          {'　　∧＿∧\n　 ( ･∀･)\n　 (　　　)\n　　│ │ │\n　 (＿)＿)'}
        </div>
        <div className="sidebar-label">Chat History Manager</div>
      </div>
    </aside>
  );
}
