'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { Avatar } from '@/components/ui/Avatar';

export function RoundScoreboard() {
  const show = useGameStore((s) => s.showRoundScoreboard);
  const revealedWord = useGameStore((s) => s.revealedWord);
  const roundScores = useGameStore((s) => s.roundScores);
  const currentRound = useGameStore((s) => s.currentRound);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl bg-[var(--color-surface)] p-8"
            style={{ boxShadow: 'var(--shadow-lg)' }}
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          >
            {/* Round number */}
            <p className="text-center text-sm text-[var(--color-text-muted)] mb-1">
              Round {currentRound} — Results
            </p>

            {/* Revealed word */}
            <h2 className="text-center text-3xl font-bold font-heading text-[var(--color-primary)] mb-6">
              {revealedWord}
            </h2>

            {/* Score list */}
            <div className="flex flex-col gap-2">
              {roundScores
                .slice()
                .sort((a, b) => b.pointsEarned - a.pointsEarned)
                .map((entry, i) => (
                  <motion.div
                    key={entry.playerId}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--color-surface-alt)]"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Avatar username={entry.username} size="sm" />
                    <span className="font-semibold text-[var(--color-text)] flex-1">
                      {entry.username}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {entry.role === 'DRAWER' ? 'Drawer' : 'Guesser'}
                    </span>
                    {/* Points earned with floating animation */}
                    <div className="relative">
                      <span className="font-mono font-bold text-[var(--color-accent-green)]">
                        +{entry.pointsEarned}
                      </span>
                      {entry.pointsEarned > 0 && (
                        <motion.span
                          className="absolute -top-1 left-0 font-mono font-bold text-sm text-[var(--color-accent-green)]"
                          initial={{ opacity: 1, y: 0 }}
                          animate={{ opacity: 0, y: -30 }}
                          transition={{ duration: 1.5, ease: 'easeOut', delay: i * 0.1 + 0.3 }}
                        >
                          +{entry.pointsEarned}
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
