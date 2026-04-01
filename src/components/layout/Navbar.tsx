'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/useAuthStore';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  function handleLogout() {
    logout();
    toast.success('Logged out');
    router.push('/');
  }

  return (
    <nav
      className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold font-heading text-[var(--color-primary)]">
          Scribble
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link href="/leaderboard">
            <Button variant="ghost" size="sm">
              <Trophy size={16} /> Leaderboard
            </Button>
          </Link>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Avatar username={user.username} src={user.avatarUrl} size="sm" />
                <span className="text-sm font-semibold text-[var(--color-text)] hidden sm:inline">
                  {user.username}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut size={16} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
