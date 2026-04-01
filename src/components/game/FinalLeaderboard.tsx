'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, ArrowLeft } from 'lucide-react';
import { useGameStore } from '@/stores/useGameStore';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ConfettiEffect } from './CorrectGuessEffect';

const crownColors: Record<number, string> = {
  1: '#FFD700', // gold
  2: '#C0C0C0', // silver
  3: '#CD7F32', // bronze
};

const podiumHeights: Record<number, string> = {
  1: 'h-32',
  2: 'h-24',
  3: 'h-20',
};

// Display order for podium: 2nd, 1st, 3rd
const podiumOrder = [1, 0, 2];

export function FinalLeaderboard() {
  const router = useRouter();
  const show = useGameStore((s) => s.showFinalLeaderboard);
  const leaderboard = useGameStore((s) => s.leaderboard);
  const resetGame = useGameStore((s) => s.resetGame);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  function handleBackToLobby() {
    resetGame();
    router.push('/lobby');
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Confetti for winner */}
          <ConfettiEffect />

          <motion.div
            className="w-full max-w-lg rounded-2xl bg-[var(--color-surface)] p-8 relative z-10"
            style={{ boxShadow: 'var(--shadow-lg)' }}
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <h2 className="text-3xl font-bold font-heading text-center text-[var(--color-text)] mb-8">
              Game Over!
            </h2>

            {/* Podium */}
            <div className="flex items-end justify-center gap-4 mb-8">
              {podiumOrder.map((idx, displayIdx) => {
                const entry = top3[idx];
                if (!entry) return null;
                const rank = entry.rank;
                return (
                  <motion.div
                    key={entry.playerId}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: displayIdx * 0.2, type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {/* Crown */}
                    {crownColors[rank] && (
                      <Crown
                        size={rank === 1 ? 32 : 24}
                        style={{ color: crownColors[rank] }}
                        className="mb-1"
                      />
                    )}

                    {/* Avatar */}
                    <Avatar
                      username={entry.username}
                      src={entry.avatarUrl}
                      size={rank === 1 ? 'lg' : 'md'}
                    />

                    {/* Name + score */}
                    <span className="font-bold text-sm text-[var(--color-text)] mt-1">
                      {entry.username}
                    </span>
                    <span className="font-mono font-bold text-[var(--color-primary)] text-sm">
                      {entry.finalScore}
                    </span>

                    {/* Podium block */}
                    <div
                      className={`w-20 ${podiumHeights[rank] ?? 'h-16'} rounded-t-lg mt-2`}
                      style={{
                        backgroundColor: crownColors[rank] ?? 'var(--color-surface-alt)',
                        opacity: 0.3,
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Remaining players */}
            {rest.length > 0 && (
              <div className="flex flex-col gap-2 mb-6">
                {rest.map((entry) => (
                  <div
                    key={entry.playerId}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--color-surface-alt)]"
                  >
                    <span className="w-6 text-center font-mono font-bold text-[var(--color-text-muted)]">
                      {entry.rank}
                    </span>
                    <Avatar username={entry.username} src={entry.avatarUrl} size="sm" />
                    <span className="font-semibold text-[var(--color-text)] flex-1">
                      {entry.username}
                    </span>
                    <span className="font-mono font-bold text-[var(--color-primary)]">
                      {entry.finalScore}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleBackToLobby} className="flex-1">
                <ArrowLeft size={16} /> Back to Lobby
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
