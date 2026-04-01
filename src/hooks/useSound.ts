'use client';

import { useRef, useCallback, useEffect } from 'react';
import { Howl } from 'howler';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Mute store (persisted) ──
interface SoundSettingsState {
  muted: boolean;
  toggleMute: () => void;
}

export const useSoundSettings = create<SoundSettingsState>()(
  persist(
    (set) => ({
      muted: false,
      toggleMute: () => set((s) => ({ muted: !s.muted })),
    }),
    { name: 'scribble-sound' },
  ),
);

// ── Sound IDs ──
type SoundId = 'correct' | 'wrong' | 'roundStart' | 'tick' | 'gameEnd';

const SOUND_MAP: Record<SoundId, string> = {
  correct: '/sounds/correct.mp3',
  wrong: '/sounds/wrong.mp3',
  roundStart: '/sounds/round-start.mp3',
  tick: '/sounds/tick.mp3',
  gameEnd: '/sounds/game-end.mp3',
};

export function useSound() {
  const soundsRef = useRef<Map<SoundId, Howl>>(new Map());
  const loadedRef = useRef(false);

  // Lazy-load sounds on first call (respects browser autoplay policy)
  const ensureLoaded = useCallback(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    for (const [id, src] of Object.entries(SOUND_MAP)) {
      soundsRef.current.set(id as SoundId, new Howl({
        src: [src],
        preload: true,
        volume: 0.5,
      }));
    }
  }, []);

  const play = useCallback((id: SoundId) => {
    if (useSoundSettings.getState().muted) return;
    ensureLoaded();
    soundsRef.current.get(id)?.play();
  }, [ensureLoaded]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      soundsRef.current.forEach((howl) => howl.unload());
      soundsRef.current.clear();
      loadedRef.current = false;
    };
  }, []);

  return { play };
}
