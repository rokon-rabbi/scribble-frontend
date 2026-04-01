import { cn } from '@/lib/utils';

interface TimerProps {
  seconds: number;
  className?: string;
}

function Timer({ seconds, className }: TimerProps) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = minutes > 0
    ? `${minutes}:${secs.toString().padStart(2, '0')}`
    : `${secs}`;

  const color =
    seconds > 30
      ? 'text-[var(--color-accent-green)]'
      : seconds > 10
        ? 'text-[var(--color-accent-orange)]'
        : 'text-[var(--color-accent-red)]';

  return (
    <span className={cn('font-mono font-bold tabular-nums', color, className)}>
      {display}
    </span>
  );
}

export { Timer, type TimerProps };
