'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { useAuthStore } from '@/stores/useAuthStore';

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const letter = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function WordHint() {
  const wordHint = useGameStore((s) => s.wordHint);
  const drawerId = useGameStore((s) => s.drawerId);
  const user = useAuthStore((s) => s.user);

  const isDrawer = user && (user.id === drawerId || user.username === drawerId);

  if (!wordHint) return null;

  // Drawer sees the actual word (wordHint is the full word for the drawer, underscores for guessers)
  // The server sends different hints based on role, so we just display what we receive
  const chars = wordHint.split('');

  return (
    <motion.div
      className="flex items-center justify-center gap-1"
      variants={container}
      initial="hidden"
      animate="visible"
      key={wordHint} // re-animate on word change
    >
      {chars.map((char, i) => (
        <motion.span
          key={`${i}-${char}`}
          variants={letter}
          className={
            char === '_'
              ? 'w-5 h-7 border-b-2 border-[var(--color-text)] inline-block mx-0.5'
              : char === ' '
                ? 'w-3 inline-block'
                : isDrawer
                  ? 'text-2xl font-bold font-heading text-[var(--color-primary)]'
                  : 'text-2xl font-bold font-heading text-[var(--color-text)]'
          }
        >
          {char !== '_' && char !== ' ' ? char : ''}
        </motion.span>
      ))}
    </motion.div>
  );
}
