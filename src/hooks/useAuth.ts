'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export function useAuth(redirectTo = '/login') {
  const router = useRouter();
  const { isAuthenticated, user, token } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  return { isAuthenticated, user, token };
}
