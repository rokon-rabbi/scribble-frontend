'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import type { StrokeMessage } from '@/lib/types';

interface WebSocketContextValue {
  isConnected: boolean;
  sendStroke: (stroke: StrokeMessage) => void;
  sendGuess: (text: string) => void;
  sendChooseWord: (wordId: string) => void;
  sendStartGame: () => void;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

interface WebSocketProviderProps {
  roomCode: string;
  children: ReactNode;
}

export function WebSocketProvider({ roomCode, children }: WebSocketProviderProps) {
  const ws = useWebSocket(roomCode);

  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWS(): WebSocketContextValue {
  const ctx = useContext(WebSocketContext);
  if (!ctx) {
    throw new Error('useWS must be used within a WebSocketProvider');
  }
  return ctx;
}
