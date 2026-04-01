'use client';

import { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { PlayerCard } from './PlayerCard';

export function PlayerList() {
  const players = useGameStore((s) => s.players);
  const gameStatus = useGameStore((s) => s.gameStatus);

  const isPlaying = gameStatus === 'PLAYING';

  // Sort: by score descending (during play), otherwise keep join order
  const sorted = useMemo(() => {
    if (!isPlaying) return players;
    return [...players].sort((a, b) => b.score - a.score);
  }, [players, isPlaying]);

  const topScore = sorted.length > 0 ? sorted[0]?.score : 0;

  return (
    <div className="flex flex-col h-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-[var(--color-border)]">
        <h3 className="text-sm font-bold text-[var(--color-text)]">
          Players ({players.length})
        </h3>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        <AnimatePresence mode="popLayout">
          {sorted.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isTopScorer={isPlaying && topScore > 0 && player.score === topScore}
              showScore={isPlaying}
            />
          ))}
        </AnimatePresence>

        {players.length < 2 && !isPlaying && (
          <p className="text-center text-xs text-[var(--color-text-muted)] py-4">
            Waiting for players...
          </p>
        )}
      </div>
    </div>
  );
}
