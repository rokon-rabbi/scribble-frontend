'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/useGameStore';

export function useTimer() {
  const timeRemaining = useGameStore((s) => s.timeRemaining);
  const roundStatus = useGameStore((s) => s.roundStatus);
  const setTimeRemaining = useGameStore((s) => s.setTimeRemaining);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Local interpolation between server TIMER_TICK events
  useEffect(() => {
    if (roundStatus !== 'DRAWING') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      const current = useGameStore.getState().timeRemaining;
      if (current > 0) {
        setTimeRemaining(current - 1);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [roundStatus, setTimeRemaining]);

  return { timeRemaining };
}
