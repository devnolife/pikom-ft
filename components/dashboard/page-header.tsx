import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * PageHeader — header konsisten untuk halaman dashboard.
 * Eyebrow mono uppercase accent → Title tracking-tight → Description muted.
 * Area `actions` tampil di kanan pada layar md+ dan di bawah pada mobile.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8 md:mb-10',
        className
      )}
    >
      <div className="space-y-2.5 min-w-0">
        {eyebrow && <p className="text-eyebrow">{eyebrow}</p>}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase leading-[1.05]">
          {title}
        </h1>
        {description && (
          <p className="text-sm md:text-[15px] font-mono leading-relaxed text-fg-muted max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>
      )}
    </header>
  );
}
