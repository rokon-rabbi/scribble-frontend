'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { useTimer } from '@/hooks/useTimer';

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function GameTimer() {
  const { timeRemaining } = useTimer();
  const timeLimit = useGameStore((s) => s.timeLimit);

  const progress = timeLimit > 0 ? timeRemaining / timeLimit : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const color =
    timeRemaining > 30
      ? 'var(--color-accent-green)'
      : timeRemaining > 10
        ? 'var(--color-accent-orange)'
        : 'var(--color-accent-red)';

  const isPulsing = timeRemaining <= 10 && timeRemaining > 0;

  return (
    <motion.div
      className="relative flex items-center justify-center"
      animate={isPulsing ? { scale: [1, 1.1, 1] } : { scale: 1 }}
      transition={isPulsing ? { repeat: Infinity, duration: 1 } : undefined}
    >
      <svg width={96} height={96} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={48}
          cy={48}
          r={RADIUS}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={6}
        />
        {/* Progress circle */}
        <circle
          cx={48}
          cy={48}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.5s linear, stroke 0.3s ease' }}
        />
      </svg>
      {/* Center number */}
      <span
        className="absolute font-mono font-bold text-2xl"
        style={{ color }}
      >
        {timeRemaining}
      </span>
    </motion.div>
  );
}
