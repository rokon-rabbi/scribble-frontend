'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Check, Send } from 'lucide-react';
import { useChatStore } from '@/stores/useChatStore';
import { useGameStore } from '@/stores/useGameStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { MAX_CHAT_MESSAGE_LENGTH } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/lib/types';

interface ChatBoxProps {
  onSendGuess: (text: string) => void;
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  if (msg.type === 'system') {
    return (
      <div className="text-center text-xs italic text-[var(--color-text-muted)] py-1">
        {msg.text}
      </div>
    );
  }

  if (msg.type === 'correct') {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-accent-green)]/15 text-[var(--color-accent-green)] font-bold text-sm">
        <Check size={14} />
        {msg.text}
      </div>
    );
  }

  // 'guess' or 'chat'
  return (
    <div className="px-3 py-1.5 text-sm">
      <span className="font-bold text-[var(--color-text)]">{msg.username}: </span>
      <span className="text-[var(--color-text-muted)]">{msg.text}</span>
    </div>
  );
}

export function ChatBox({ onSendGuess }: ChatBoxProps) {
  const messages = useChatStore((s) => s.messages);
  const user = useAuthStore((s) => s.user);
  const drawerId = useGameStore((s) => s.drawerId);
  const players = useGameStore((s) => s.players);

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isDrawer = user && (user.id === drawerId || user.username === drawerId);
  const currentPlayer = players.find(
    (p) => p.id === user?.id || p.username === user?.username,
  );
  const hasGuessedCorrectly = currentPlayer?.hasGuessedCorrectly ?? false;

  const isDisabled = !!isDrawer || hasGuessedCorrectly;

  const placeholder = isDrawer
    ? 'You are drawing!'
    : hasGuessedCorrectly
      ? 'You guessed it!'
      : 'Type your guess...';

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isDisabled) return;
    onSendGuess(text);
    setInput('');
  }

  return (
    <div className="flex flex-col h-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 min-h-0">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-[var(--color-border)] p-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={isDisabled}
          maxLength={MAX_CHAT_MESSAGE_LENGTH}
          className={cn(
            'flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm outline-none transition-colors',
            'focus:border-[var(--color-primary)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        />
        <button
          type="submit"
          disabled={isDisabled || !input.trim()}
          className="p-2 rounded-lg bg-[var(--color-primary)] text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors hover:bg-[var(--color-primary-light)]"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
