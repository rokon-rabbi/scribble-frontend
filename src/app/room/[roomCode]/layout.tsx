'use client';

import { use, type ReactNode } from 'react';
import { WebSocketProvider } from '@/providers/WebSocketProvider';
import { useAuth } from '@/hooks/useAuth';

interface RoomLayoutProps {
  children: ReactNode;
  params: Promise<{ roomCode: string }>;
}

export default function RoomLayout({ children, params }: RoomLayoutProps) {
  const { roomCode } = use(params);
  useAuth(); // redirect if not logged in

  return (
    <WebSocketProvider roomCode={roomCode}>
      {children}
    </WebSocketProvider>
  );
}
