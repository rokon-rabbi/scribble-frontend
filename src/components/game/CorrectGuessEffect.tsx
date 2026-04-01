'use client';

import { useMemo } from 'react';

const PARTICLE_COUNT = 50;

const COLORS = [
  '#6C5CE7', '#00B894', '#FF6B6B', '#74B9FF',
  '#FDCB6E', '#FD79A8', '#FFEAA7', '#00CEC9',
];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function ConfettiEffect() {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        left: `${randomBetween(0, 100)}%`,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: `${randomBetween(0, 3)}s`,
        duration: `${randomBetween(2, 5)}s`,
        rotation: randomBetween(0, 360),
        size: randomBetween(6, 12),
      })),
    [],
  );

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute -top-3 animate-confetti-fall"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        >
          <div
            style={{
              width: p.size,
              height: p.size * 0.6,
              backgroundColor: p.color,
              borderRadius: 2,
              transform: `rotate(${p.rotation}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
