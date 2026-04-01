'use client';

import { Pencil, Check, Crown, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { RoomPlayer } from '@/lib/types';

interface PlayerCardProps {
  player: RoomPlayer;
  isTopScorer: boolean;
  showScore: boolean;
}

export function PlayerCard({ player, isTopScorer, showScore }: PlayerCardProps) {
  const { username, avatarUrl, score, isConnected, isDrawing, hasGuessedCorrectly } = player;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        'flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors',
        !isConnected && 'opacity-50',
        isDrawing && 'bg-[var(--color-accent-orange)]/10',
      )}
    >
      {/* Avatar */}
      <div className="relative">
        <Avatar username={username} src={avatarUrl} size="sm" />
        {isTopScorer && showScore && (
          <Crown
            size={14}
            className="absolute -top-2 -right-1"
            style={{ color: '#FFD700' }}
          />
        )}
      </div>

      {/* Name + status */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm text-[var(--color-text)] truncate">
            {username}
          </span>
          {isDrawing && <Pencil size={12} className="text-[var(--color-accent-orange)] shrink-0" />}
          {hasGuessedCorrectly && <Check size={14} className="text-[var(--color-accent-green)] shrink-0" />}
        </div>
        {!isConnected && (
          <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
            <WifiOff size={10} /> Reconnecting...
          </div>
        )}
      </div>

      {/* Score / badges */}
      <div className="shrink-0">
        {showScore ? (
          <span className="font-mono font-bold text-sm text-[var(--color-primary)]">
            {score}
          </span>
        ) : (
          <Badge variant="success">Ready</Badge>
        )}
        {isDrawing && showScore && (
          <Badge variant="warning" className="ml-1">Drawing</Badge>
        )}
      </div>
    </motion.div>
  );
}
