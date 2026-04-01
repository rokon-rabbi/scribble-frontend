import { create } from 'zustand';
import type { ChatMessage } from '@/lib/types';

interface ChatState {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  addSystemMessage: (text: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  messages: [],

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages.slice(-200), msg],
    })),

  addSystemMessage: (text) =>
    set((state) => ({
      messages: [
        ...state.messages.slice(-200),
        {
          id: crypto.randomUUID(),
          username: 'System',
          text,
          type: 'system' as const,
          timestamp: Date.now(),
        },
      ],
    })),

  clearMessages: () => set({ messages: [] }),
}));
