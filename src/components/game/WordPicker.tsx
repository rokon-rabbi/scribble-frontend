'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { Badge } from '@/components/ui/Badge';
import type { BadgeVariant } from '@/components/ui/Badge';

interface WordPickerProps {
  onChoose: (wordId: string) => void;
}

const difficultyBadge: Record<string, { label: string; variant: BadgeVariant }> = {
  EASY: { label: 'Easy', variant: 'success' },
  MEDIUM: { label: 'Medium', variant: 'warning' },
  HARD: { label: 'Hard', variant: 'danger' },
};

export function WordPicker({ onChoose }: WordPickerProps) {
  const isPickingWord = useGameStore((s) => s.isPickingWord);
  const wordChoices = useGameStore((s) => s.wordChoices);

  return (
    <AnimatePresence>
      {isPickingWord && wordChoices.length > 0 && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex flex-col items-center gap-6">
            <motion.h2
              className="text-3xl font-bold font-heading text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Pick a word!
            </motion.h2>

            <div className="flex gap-4">
              {wordChoices.map((word, index) => {
                const badge = difficultyBadge[word.difficulty] ?? difficultyBadge.EASY;
                return (
                  <motion.button
                    key={word.id}
                    onClick={() => onChoose(word.id)}
                    className="flex flex-col items-center gap-3 px-8 py-6 rounded-2xl bg-[var(--color-surface)] cursor-pointer transition-shadow hover:shadow-lg"
                    style={{ boxShadow: 'var(--shadow-md)' }}
                    variants={{
                      hidden: { opacity: 0, y: 50 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { delay: index * 0.15, type: 'spring', stiffness: 300, damping: 20 },
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="text-2xl font-bold font-heading text-[var(--color-text)]">
                      {word.word}
                    </span>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
