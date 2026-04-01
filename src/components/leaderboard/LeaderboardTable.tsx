'use client';

import { Crown } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';

interface LeaderboardPlayer {
  id: string;
  username: string;
  avatarUrl: string | null;
  totalScore: number;
  totalGamesPlayed: number;
  totalWins: number;
}

interface LeaderboardTableProps {
  players: LeaderboardPlayer[];
  isLoading: boolean;
  page: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
}

const rankColors: Record<number, string> = {
  1: '#FFD700',
  2: '#C0C0C0',
  3: '#CD7F32',
};

export function LeaderboardTable({ players, isLoading, page, hasMore, onPageChange }: LeaderboardTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="text-center py-16 text-[var(--color-text-muted)]">
        <p className="text-lg font-semibold">No players yet</p>
        <p className="text-sm mt-1">Be the first to play!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Table */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--color-surface-alt)] text-left text-sm font-semibold text-[var(--color-text-muted)]">
              <th className="px-4 py-3 w-16">Rank</th>
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3 text-right">Score</th>
              <th className="px-4 py-3 text-right hidden sm:table-cell">Games</th>
              <th className="px-4 py-3 text-right hidden sm:table-cell">Wins</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, i) => {
              const rank = page * 20 + i + 1;
              const crownColor = rankColors[rank];
              return (
                <tr
                  key={player.id}
                  className="border-t border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {crownColor ? (
                        <Crown size={18} style={{ color: crownColor }} />
                      ) : (
                        <span className="font-mono font-bold text-[var(--color-text-muted)] w-5 text-center">
                          {rank}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar username={player.username} src={player.avatarUrl} size="sm" />
                      <span className="font-semibold text-[var(--color-text)]">
                        {player.username}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-[var(--color-primary)]">
                    {player.totalScore.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-[var(--color-text-muted)] hidden sm:table-cell">
                    {player.totalGamesPlayed}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-[var(--color-text-muted)] hidden sm:table-cell">
                    {player.totalWins}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-3 mt-6">
        <Button
          variant="secondary"
          size="sm"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <span className="flex items-center text-sm text-[var(--color-text-muted)]">
          Page {page + 1}
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasMore}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
