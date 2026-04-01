'use client';

import { use, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Copy, Users, Clock, Layers, Play, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWS } from '@/providers/WebSocketProvider';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGameStore } from '@/stores/useGameStore';
import { gameApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Spinner } from '@/components/ui/Spinner';

interface RoomPageProps {
  params: Promise<{ roomCode: string }>;
}

export default function RoomPage({ params }: RoomPageProps) {
  const { roomCode } = use(params);
  const { isConnected, sendStartGame } = useWS();
  const user = useAuthStore((s) => s.user);

  const gameStatus = useGameStore((s) => s.gameStatus);
  const players = useGameStore((s) => s.players);
  const ownerId = useGameStore((s) => s.ownerId);
  const setOwnerId = useGameStore((s) => s.setOwnerId);
  const setRoomCode = useGameStore((s) => s.setRoomCode);

  const [roomSettings, setRoomSettings] = useState<{
    maxPlayers: number;
    roundsPerPlayer: number;
    turnTimeSeconds: number;
  } | null>(null);

  // Fetch room info on mount to get owner + settings
  useEffect(() => {
    setRoomCode(roomCode);

    gameApi.getRoomInfo(roomCode).then((res) => {
      const room = res.data.data ?? res.data;
      setOwnerId(room.ownerId ?? room.ownerUsername);
      setRoomSettings({
        maxPlayers: room.maxPlayers,
        roundsPerPlayer: room.roundsPerPlayer,
        turnTimeSeconds: room.turnTimeSeconds,
      });
    }).catch(() => {
      // Room info fetch is best-effort; WebSocket handles the real-time state
    });
  }, [roomCode, setRoomCode, setOwnerId]);

  const isOwner = user && (user.id === ownerId || user.username === ownerId);
  const canStart = isOwner && players.length >= 2;

  function copyRoomCode() {
    navigator.clipboard.writeText(roomCode);
    toast.success('Room code copied!');
  }

  function copyShareLink() {
    navigator.clipboard.writeText(`${window.location.origin}/room/${roomCode}`);
    toast.success('Share link copied!');
  }

  // ── WAITING phase ──
  if (gameStatus === 'WAITING') {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-lg" padding="lg">
          {/* Connection indicator */}
          <div className="flex justify-end mb-2">
            <Badge variant={isConnected ? 'success' : 'danger'}>
              {isConnected ? (
                <span className="flex items-center gap-1"><Wifi size={12} /> Connected</span>
              ) : (
                <span className="flex items-center gap-1"><WifiOff size={12} /> Connecting...</span>
              )}
            </Badge>
          </div>

          {/* Room code */}
          <div className="text-center mb-6">
            <p className="text-sm text-[var(--color-text-muted)] mb-1">Room Code</p>
            <button
              onClick={copyRoomCode}
              className="inline-flex items-center gap-2 text-4xl font-mono font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors cursor-pointer"
            >
              {roomCode}
              <Copy size={20} className="mt-1" />
            </button>
            <div className="mt-2">
              <button
                onClick={copyShareLink}
                className="text-sm text-[var(--color-accent-blue)] hover:underline cursor-pointer"
              >
                Copy invite link
              </button>
            </div>
          </div>

          {/* Room settings */}
          {roomSettings && (
            <div className="flex justify-center gap-6 mb-6 text-sm text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1.5">
                <Users size={14} /> {roomSettings.maxPlayers} max
              </span>
              <span className="flex items-center gap-1.5">
                <Layers size={14} /> {roomSettings.roundsPerPlayer} round{roomSettings.roundsPerPlayer > 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> {roomSettings.turnTimeSeconds}s
              </span>
            </div>
          )}

          {/* Player list */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3">
              Players ({players.length}{roomSettings ? `/${roomSettings.maxPlayers}` : ''})
            </h3>

            {players.length === 0 && isConnected && (
              <div className="flex justify-center py-4">
                <Spinner size="md" />
              </div>
            )}

            <AnimatePresence mode="popLayout">
              {players.map((player) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  layout
                  className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-[var(--color-surface-alt)] transition-colors"
                >
                  <Avatar username={player.username} src={player.avatarUrl} size="sm" />
                  <span className="font-semibold text-[var(--color-text)] flex-1">
                    {player.username}
                  </span>
                  {(player.id === ownerId || player.username === ownerId) && (
                    <Badge variant="warning">Host</Badge>
                  )}
                  <Badge variant="success">Ready</Badge>
                </motion.div>
              ))}
            </AnimatePresence>

            {players.length < 2 && (
              <p className="text-center text-sm text-[var(--color-text-muted)] mt-3">
                Waiting for more players to join...
              </p>
            )}
          </div>

          {/* Start Game button (owner only) */}
          {isOwner && (
            <Button
              onClick={sendStartGame}
              disabled={!canStart}
              className="w-full"
              size="lg"
            >
              <Play size={18} />
              {players.length < 2 ? 'Need at least 2 players' : 'Start Game'}
            </Button>
          )}

          {!isOwner && (
            <p className="text-center text-sm text-[var(--color-text-muted)]">
              Waiting for the host to start the game...
            </p>
          )}
        </Card>
      </div>
    );
  }

  // ── PLAYING phase (placeholder — built in later steps) ──
  if (gameStatus === 'PLAYING') {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <p className="text-xl font-heading font-bold text-[var(--color-primary)]">
          Game in progress...
        </p>
      </div>
    );
  }

  // ── FINISHED phase (placeholder — built in later steps) ──
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <p className="text-xl font-heading font-bold text-[var(--color-primary)]">
        Game finished!
      </p>
    </div>
  );
}
