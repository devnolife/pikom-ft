import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tone = 'default' | 'accent' | 'gold' | 'green' | 'red' | 'muted';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  hint?: React.ReactNode;
  tone?: Tone;
  className?: string;
}

const toneStyles: Record<Tone, { icon: string; value: string; ring: string }> = {
  default: {
    icon: 'text-fg',
    value: 'text-fg',
    ring: 'bg-glass-overlay',
  },
  accent: {
    icon: 'text-accent',
    value: 'text-fg',
    ring: 'bg-[color:var(--color-accent)]/10',
  },
  gold: {
    icon: 'text-gold',
    value: 'text-gold',
    ring: 'bg-[color:var(--color-accent-secondary)]/10',
  },
  green: {
    icon: 'text-green-500',
    value: 'text-green-500',
    ring: 'bg-green-500/10',
  },
  red: {
    icon: 'text-red-500',
    value: 'text-red-500',
    ring: 'bg-red-500/10',
  },
  muted: {
    icon: 'text-fg-muted',
    value: 'text-fg-muted',
    ring: 'bg-glass-overlay',
  },
};

/**
 * StatCard — kartu angka/stat untuk dashboard. Reusable di semua role.
 * Pakai Tailwind class (tidak ada inline style, aware theme via CSS vars).
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = 'default',
  className,
}: StatCardProps) {
  const styles = toneStyles[tone];
  return (
    <div
      className={cn(
        'glass rounded-2xl p-5 md:p-6 flex flex-col gap-4 relative overflow-hidden',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-label">{label}</p>
        {Icon && (
          <span className={cn('p-2 rounded-lg', styles.ring)}>
            <Icon size={16} className={styles.icon} aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p
          className={cn(
            'text-3xl md:text-4xl font-black tabular-nums leading-none',
            styles.value
          )}
        >
          {value}
        </p>
        {hint && (
          <p className="text-xs font-mono text-fg-muted">{hint}</p>
        )}
      </div>
    </div>
  );
}
