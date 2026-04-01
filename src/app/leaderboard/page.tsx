'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Trophy } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { playerApi } from '@/lib/api';

interface LeaderboardPlayer {
  id: string;
  username: string;
  avatarUrl: string | null;
  totalScore: number;
  totalGamesPlayed: number;
  totalWins: number;
}

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  async function fetchLeaderboard(p: number) {
    setIsLoading(true);
    try {
      const res = await playerApi.getLeaderboard(p);
      const data = res.data.data ?? res.data;
      const content = Array.isArray(data) ? data : data.content ?? [];
      const last = Array.isArray(data) ? true : (data.last ?? true);
      setPlayers(content);
      setHasMore(!last);
      setPage(p);
    } catch {
      toast.error('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchLeaderboard(0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Trophy size={28} className="text-[var(--color-accent-yellow)]" />
          <h1 className="text-3xl font-bold font-heading text-[var(--color-text)]">
            Leaderboard
          </h1>
        </div>

        <LeaderboardTable
          players={players}
          isLoading={isLoading}
          page={page}
          hasMore={hasMore}
          onPageChange={fetchLeaderboard}
        />
      </main>
    </div>
  );
}
