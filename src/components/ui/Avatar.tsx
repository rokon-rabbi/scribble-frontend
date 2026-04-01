import Image from 'next/image';
import { cn } from '@/lib/utils';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  src?: string | null;
  username: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string; px: number }> = {
  sm: { container: 'w-8 h-8', text: 'text-xs', px: 32 },
  md: { container: 'w-10 h-10', text: 'text-sm', px: 40 },
  lg: { container: 'w-14 h-14', text: 'text-lg', px: 56 },
};

function getInitials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    '#6C5CE7', '#00B894', '#FF6B6B', '#74B9FF',
    '#FDCB6E', '#FD79A8', '#00CEC9', '#E17055',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function Avatar({ src, username, size = 'md', className }: AvatarProps) {
  const s = sizeStyles[size];

  if (src) {
    return (
      <div className={cn('relative rounded-full overflow-hidden shrink-0', s.container, className)}>
        <Image
          src={src}
          alt={username}
          width={s.px}
          height={s.px}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-full shrink-0 flex items-center justify-center font-bold text-white select-none',
        s.container,
        s.text,
        className,
      )}
      style={{ backgroundColor: getAvatarColor(username) }}
    >
      {getInitials(username)}
    </div>
  );
}

export { Avatar, type AvatarProps };
