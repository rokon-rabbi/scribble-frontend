'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Hash } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function JoinRoomForm() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const code = roomCode.trim().toUpperCase();
    if (!code) {
      toast.error('Please enter a room code');
      return;
    }
    router.push(`/room/${code}`);
  }

  return (
    <Card padding="md">
      <h3 className="text-lg font-bold font-heading text-[var(--color-text)] mb-3">
        Quick Join
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          placeholder="Enter room code"
          icon={<Hash size={18} />}
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          maxLength={10}
        />
        <Button type="submit" className="w-full">
          Join Room
        </Button>
      </form>
    </Card>
  );
}
