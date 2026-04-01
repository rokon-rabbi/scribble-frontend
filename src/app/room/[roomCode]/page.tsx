'use client';

import { use } from 'react';
import { useWS } from '@/providers/WebSocketProvider';
import { useGameStore } from '@/stores/useGameStore';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';

interface RoomPageProps {
  params: Promise<{ roomCode: string }>;
}

export default function RoomPage({ params }: RoomPageProps) {
  const { roomCode } = use(params);
  const { isConnected } = useWS();
  const players = useGameStore((s) => s.players);
  const gameStatus = useGameStore((s) => s.gameStatus);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
      <h1 className="text-3xl font-bold font-heading text-[var(--color-primary)]">
        Room: {roomCode}
      </h1>
      <div className="flex items-center gap-2">
        <Badge variant={isConnected ? 'success' : 'danger'}>
          {isConnected ? 'Connected' : 'Connecting...'}
        </Badge>
        <Badge>{gameStatus}</Badge>
      </div>
      {!isConnected && <Spinner size="lg" />}
      {players.length > 0 && (
        <div className="text-sm text-[var(--color-text-muted)]">
          {players.length} player{players.length !== 1 ? 's' : ''} in room
        </div>
      )}
    </div>
  );
}
