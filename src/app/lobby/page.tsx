'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { RoomCard } from '@/components/lobby/RoomCard';
import { JoinRoomForm } from '@/components/lobby/JoinRoomForm';
import { CreateRoomModal } from '@/components/lobby/CreateRoomModal';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { gameApi } from '@/lib/api';
import type { RoomInfo } from '@/lib/types';

export default function LobbyPage() {
  useAuth(); // redirect if not logged in

  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  async function fetchRooms(p = 0) {
    setIsLoading(true);
    try {
      const res = await gameApi.listPublicRooms(p);
      const data = res.data.data ?? res.data;
      // Handle both paginated (Spring Page) and plain array responses
      const content = Array.isArray(data) ? data : data.content ?? [];
      const last = Array.isArray(data) ? true : (data.last ?? true);
      setRooms(content);
      setHasMore(!last);
      setPage(p);
    } catch {
      toast.error('Failed to load rooms');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left — Public Rooms (60%) */}
          <section className="lg:w-3/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold font-heading text-[var(--color-text)]">
                Public Rooms
              </h2>
              <Button variant="ghost" size="sm" onClick={() => fetchRooms(page)}>
                <RefreshCw size={16} /> Refresh
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-16">
                <Spinner size="lg" />
              </div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-16 text-[var(--color-text-muted)]">
                <p className="text-lg font-semibold">No rooms available</p>
                <p className="text-sm mt-1">Create one or join with a code!</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-3 mt-6">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => fetchRooms(page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={!hasMore}
                    onClick={() => fetchRooms(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </section>

          {/* Right — Quick Join + Create (40%) */}
          <aside className="lg:w-2/5 flex flex-col gap-6">
            <JoinRoomForm />
            <CreateRoomModal />
          </aside>
        </div>
      </main>
    </div>
  );
}
