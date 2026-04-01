'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Copy, Users, Clock, Layers, Play, Wifi, WifiOff, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWS } from '@/providers/WebSocketProvider';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGameStore } from '@/stores/useGameStore';
import { useCanvasStore } from '@/stores/useCanvasStore';
import { gameApi } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Spinner } from '@/components/ui/Spinner';
import { Canvas } from '@/components/game/Canvas';
import { ToolBar } from '@/components/game/ToolBar';
import { ChatBox } from '@/components/game/ChatBox';
import { PlayerList } from '@/components/game/PlayerList';
import { GameTimer } from '@/components/game/GameTimer';
import { WordHint } from '@/components/game/WordHint';
import { WordPicker } from '@/components/game/WordPicker';
import { DrawerBadge } from '@/components/game/DrawerBadge';
import { RoundScoreboard } from '@/components/game/RoundScoreboard';
import { FinalLeaderboard } from '@/components/game/FinalLeaderboard';

interface RoomPageProps {
  params: Promise<{ roomCode: string }>;
}

// ── Mobile tabs for the PLAYING phase ──
type MobileTab = 'canvas' | 'chat' | 'players';

export default function RoomPage({ params }: RoomPageProps) {
  const { roomCode } = use(params);
  const { isConnected, sendStartGame, sendStroke, sendGuess, sendChooseWord } = useWS();
  const user = useAuthStore((s) => s.user);

  const gameStatus = useGameStore((s) => s.gameStatus);
  const players = useGameStore((s) => s.players);
  const ownerId = useGameStore((s) => s.ownerId);
  const drawerId = useGameStore((s) => s.drawerId);
  const currentRound = useGameStore((s) => s.currentRound);
  const totalRounds = useGameStore((s) => s.totalRounds);
  const setOwnerId = useGameStore((s) => s.setOwnerId);
  const setRoomCode = useGameStore((s) => s.setRoomCode);
  const clearStrokes = useCanvasStore((s) => s.clearStrokes);

  const [roomSettings, setRoomSettings] = useState<{
    maxPlayers: number;
    roundsPerPlayer: number;
    turnTimeSeconds: number;
  } | null>(null);

  const router = useRouter();
  const [mobileTab, setMobileTab] = useState<MobileTab>('canvas');
  const [roomNotFound, setRoomNotFound] = useState(false);
  const [isSpectator, setIsSpectator] = useState(false);

  const isDrawer = user && (user.id === drawerId || user.username === drawerId);

  // Fetch room info on mount
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
      // If game is already playing and user wasn't in the room, they're a spectator
      if (room.status === 'PLAYING') {
        setIsSpectator(true);
      }
    }).catch((err) => {
      if (err.response?.status === 404) {
        setRoomNotFound(true);
        toast.error('Room not found');
      }
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

  function handleClearCanvas() {
    clearStrokes();
  }

  // ── Room not found → redirect ──
  if (roomNotFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
        <h1 className="text-2xl font-bold font-heading text-[var(--color-accent-red)]">Room Not Found</h1>
        <p className="text-[var(--color-text-muted)]">This room doesn&apos;t exist or has been closed.</p>
        <Button onClick={() => router.push('/lobby')}>Back to Lobby</Button>
      </div>
    );
  }

  // ════════════════════════════════════════
  // WAITING PHASE
  // ════════════════════════════════════════
  if (gameStatus === 'WAITING') {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-lg" padding="lg">
          <div className="flex justify-end mb-2">
            <Badge variant={isConnected ? 'success' : 'danger'}>
              {isConnected ? (
                <span className="flex items-center gap-1"><Wifi size={12} /> Connected</span>
              ) : (
                <span className="flex items-center gap-1"><WifiOff size={12} /> Connecting...</span>
              )}
            </Badge>
          </div>

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

          {roomSettings && (
            <div className="flex justify-center gap-6 mb-6 text-sm text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1.5"><Users size={14} /> {roomSettings.maxPlayers} max</span>
              <span className="flex items-center gap-1.5"><Layers size={14} /> {roomSettings.roundsPerPlayer} round{roomSettings.roundsPerPlayer > 1 ? 's' : ''}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> {roomSettings.turnTimeSeconds}s</span>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3">
              Players ({players.length}{roomSettings ? `/${roomSettings.maxPlayers}` : ''})
            </h3>
            {players.length === 0 && isConnected && (
              <div className="flex justify-center py-4"><Spinner size="md" /></div>
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
                  <span className="font-semibold text-[var(--color-text)] flex-1">{player.username}</span>
                  {(player.id === ownerId || player.username === ownerId) && <Badge variant="warning">Host</Badge>}
                  <Badge variant="success">Ready</Badge>
                </motion.div>
              ))}
            </AnimatePresence>
            {players.length < 2 && (
              <p className="text-center text-sm text-[var(--color-text-muted)] mt-3">Waiting for more players to join...</p>
            )}
          </div>

          {isOwner && (
            <Button onClick={sendStartGame} disabled={!canStart} className="w-full" size="lg">
              <Play size={18} />
              {players.length < 2 ? 'Need at least 2 players' : 'Start Game'}
            </Button>
          )}
          {!isOwner && (
            <p className="text-center text-sm text-[var(--color-text-muted)]">Waiting for the host to start the game...</p>
          )}
        </Card>
      </div>
    );
  }

  // ════════════════════════════════════════
  // PLAYING PHASE
  // ════════════════════════════════════════
  if (gameStatus === 'PLAYING') {
    return (
      <div className="min-h-screen flex flex-col touch-none">
        {/* Reconnecting banner */}
        <AnimatePresence>
          {!isConnected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-[var(--color-accent-red)] text-white text-center text-sm font-semibold py-2 flex items-center justify-center gap-2 overflow-hidden"
            >
              <WifiOff size={14} /> Connection lost — reconnecting...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spectator notice */}
        {isSpectator && (
          <div className="bg-[var(--color-accent-blue)] text-white text-center text-sm font-semibold py-2 flex items-center justify-center gap-2">
            <Eye size={14} /> You&apos;re spectating this game
          </div>
        )}

        {/* Word picker overlay (drawer only) */}
        <WordPicker onChoose={sendChooseWord} />

        {/* Round scoreboard overlay */}
        <RoundScoreboard />

        {/* ── Mobile tab bar (< 768px) ── */}
        <div className="md:hidden flex border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          {(['canvas', 'chat', 'players'] as MobileTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors cursor-pointer ${
                mobileTab === tab
                  ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]'
                  : 'text-[var(--color-text-muted)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Desktop / Tablet layout ── */}
        <div className="flex-1 flex flex-col md:flex-row max-w-[1400px] mx-auto w-full">

          {/* LEFT — Player List (desktop only) */}
          <aside className="hidden lg:block w-[220px] shrink-0 p-2">
            <div className="h-[calc(100vh-1rem)] sticky top-2">
              <PlayerList />
            </div>
          </aside>

          {/* CENTER — Canvas area */}
          <main className={`flex-1 flex flex-col items-center p-2 md:p-4 gap-3 min-w-0 ${mobileTab !== 'canvas' ? 'hidden md:flex' : 'flex'}`}>
            {/* Top bar: Timer + Hint + Round */}
            <div className="flex items-center gap-4 w-full max-w-[800px] justify-between">
              <GameTimer />
              <div className="flex-1 flex flex-col items-center">
                <WordHint />
                {isDrawer && <DrawerBadge />}
              </div>
              <div className="text-sm font-semibold text-[var(--color-text-muted)]">
                {currentRound > 0 && totalRounds > 0 && (
                  <span>Round {currentRound}/{totalRounds}</span>
                )}
              </div>
            </div>

            {/* Canvas */}
            <Canvas isDrawer={!!isDrawer} onStrokeSend={sendStroke} />

            {/* Toolbar (drawer only) */}
            {isDrawer && (
              <div className="w-full max-w-[800px]">
                <ToolBar onClear={handleClearCanvas} />
              </div>
            )}
          </main>

          {/* RIGHT — Chat (desktop + tablet) */}
          <aside className={`lg:w-[280px] md:w-[250px] shrink-0 p-2 ${mobileTab !== 'chat' ? 'hidden md:block' : 'block'}`}>
            <div className="h-[calc(100vh-1rem)] md:sticky md:top-2 flex flex-col">
              <ChatBox onSendGuess={sendGuess} />
            </div>
          </aside>
        </div>

        {/* ── Mobile: Players tab ── */}
        <div className={`md:hidden flex-1 p-2 ${mobileTab !== 'players' ? 'hidden' : 'block'}`}>
          <PlayerList />
        </div>

        {/* ── Tablet: Player list below canvas (md only, not lg) ── */}
        <div className="hidden md:block lg:hidden px-4 pb-4">
          <PlayerList />
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════
  // FINISHED PHASE
  // ════════════════════════════════════════
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <FinalLeaderboard />
    </div>
  );
}
