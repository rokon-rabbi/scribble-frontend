import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[var(--color-surface-alt)] text-[var(--color-text)]',
  success: 'bg-[var(--color-accent-green)] text-white',
  warning: 'bg-[var(--color-accent-orange)] text-[var(--color-text)]',
  danger: 'bg-[var(--color-accent-red)] text-white',
  info: 'bg-[var(--color-accent-blue)] text-white',
};

function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export { Badge, type BadgeProps, type BadgeVariant };
