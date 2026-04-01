'use client';

import { useRouter } from 'next/navigation';
import { Users, Clock, Layers } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { RoomInfo } from '@/lib/types';

interface RoomCardProps {
  room: RoomInfo;
}

export function RoomCard({ room }: RoomCardProps) {
  const router = useRouter();

  const isFull = room.currentPlayerCount >= room.maxPlayers;

  return (
    <Card padding="md" className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono font-bold text-lg text-[var(--color-primary)]">
          {room.roomCode}
        </span>
        <Badge variant={isFull ? 'danger' : 'success'}>
          {isFull ? 'Full' : 'Open'}
        </Badge>
      </div>

      <div className="flex flex-col gap-1.5 text-sm text-[var(--color-text-muted)]">
        <div className="flex items-center gap-2">
          <Users size={14} />
          <span>{room.currentPlayerCount}/{room.maxPlayers} players</span>
        </div>
        <div className="flex items-center gap-2">
          <Layers size={14} />
          <span>{room.roundsPerPlayer} round{room.roundsPerPlayer > 1 ? 's' : ''}/player</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} />
          <span>{room.turnTimeSeconds}s per turn</span>
        </div>
      </div>

      <div className="text-xs text-[var(--color-text-muted)]">
        Host: <span className="font-semibold text-[var(--color-text)]">{room.ownerUsername}</span>
      </div>

      <Button
        size="sm"
        disabled={isFull}
        onClick={() => router.push(`/room/${room.roomCode}`)}
        className="w-full mt-auto"
      >
        {isFull ? 'Room Full' : 'Join'}
      </Button>
    </Card>
  );
}
