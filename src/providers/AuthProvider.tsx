'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Zustand persist rehydrates automatically, but we need to wait for it
    // before rendering auth-dependent UI to avoid flash
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    // If already hydrated (e.g. no persisted state), set immediately
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return unsub;
  }, []);

  if (!hydrated) {
    return null;
  }

  return <>{children}</>;
}
