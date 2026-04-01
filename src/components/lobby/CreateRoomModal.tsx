'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { gameApi } from '@/lib/api';
import {
  MAX_PLAYERS_MIN, MAX_PLAYERS_MAX,
  ROUNDS_PER_PLAYER_MIN, ROUNDS_PER_PLAYER_MAX,
  TURN_TIME_OPTIONS,
} from '@/lib/constants';

export function CreateRoomModal() {
  const router = useRouter();

  const [maxPlayers, setMaxPlayers] = useState(8);
  const [roundsPerPlayer, setRoundsPerPlayer] = useState(2);
  const [turnTimeSeconds, setTurnTimeSeconds] = useState<number>(80);
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreate() {
    setIsLoading(true);
    try {
      const res = await gameApi.createRoom({ maxPlayers, roundsPerPlayer, turnTimeSeconds });
      const room = res.data.data ?? res.data;
      toast.success('Room created!');
      router.push(`/room/${room.roomCode}`);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create room';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card padding="md">
      <h3 className="text-lg font-bold font-heading text-[var(--color-text)] mb-4">
        Create Room
      </h3>

      <div className="flex flex-col gap-5">
        {/* Max players slider */}
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-semibold text-[var(--color-text)]">Max Players</span>
            <span className="font-mono font-bold text-[var(--color-primary)]">{maxPlayers}</span>
          </div>
          <input
            type="range"
            min={MAX_PLAYERS_MIN}
            max={MAX_PLAYERS_MAX}
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(Number(e.target.value))}
            className="w-full accent-[var(--color-primary)] cursor-pointer"
          />
          <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
            <span>{MAX_PLAYERS_MIN}</span>
            <span>{MAX_PLAYERS_MAX}</span>
          </div>
        </div>

        {/* Rounds per player */}
        <div>
          <span className="text-sm font-semibold text-[var(--color-text)] block mb-1.5">
            Rounds per Player
          </span>
          <div className="flex gap-2">
            {Array.from(
              { length: ROUNDS_PER_PLAYER_MAX - ROUNDS_PER_PLAYER_MIN + 1 },
              (_, i) => i + ROUNDS_PER_PLAYER_MIN,
            ).map((n) => (
              <button
                key={n}
                onClick={() => setRoundsPerPlayer(n)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                  roundsPerPlayer === n
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-surface-alt)] text-[var(--color-text)] hover:bg-[var(--color-primary-light)] hover:text-white'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Turn time */}
        <div>
          <span className="text-sm font-semibold text-[var(--color-text)] block mb-1.5">
            Turn Time (seconds)
          </span>
          <div className="flex gap-2">
            {TURN_TIME_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setTurnTimeSeconds(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                  turnTimeSeconds === t
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-surface-alt)] text-[var(--color-text)] hover:bg-[var(--color-primary-light)] hover:text-white'
                }`}
              >
                {t}s
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handleCreate} isLoading={isLoading} className="w-full">
          Create Room
        </Button>
      </div>
    </Card>
  );
}
