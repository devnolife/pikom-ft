import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * EmptyState — placeholder konsisten untuk kondisi data kosong.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'glass rounded-2xl px-6 py-12 text-center flex flex-col items-center gap-3',
        className
      )}
    >
      {Icon && (
        <div className="p-3 rounded-full glass-strong mb-2">
          <Icon size={24} aria-hidden="true" className="text-fg-muted" />
        </div>
      )}
      <h3 className="font-bold uppercase tracking-tight text-lg">{title}</h3>
      {description && (
        <p className="text-sm font-mono text-fg-muted max-w-sm">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
