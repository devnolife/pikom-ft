import { cn } from '@/lib/utils';

interface SectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Optional eyebrow label (small uppercase text above the title). */
  eyebrow?: string;
  /** Optional title heading — will render as <h2>. */
  title?: React.ReactNode;
  /** Optional lead paragraph below the title. */
  description?: React.ReactNode;
  /** Max width class for inner container. Default: max-w-7xl */
  container?: string;
  /** If true, skips default padding-y. */
  noPadding?: boolean;
  /** Align header content (default: left). */
  align?: 'left' | 'center';
  /** Content placed in the top-right of the header row (e.g., CTA). */
  headerActions?: React.ReactNode;
}

/**
 * Section — wrapper standar untuk blok halaman landing / bidang.
 * Memastikan padding, container width, dan header konsisten.
 */
export function Section({
  eyebrow,
  title,
  description,
  container = 'max-w-7xl',
  noPadding,
  align = 'left',
  headerActions,
  className,
  children,
  ...props
}: SectionProps) {
  const hasHeader = eyebrow || title || description || headerActions;
  return (
    <section
      className={cn('px-6 md:px-10 lg:px-16', !noPadding && 'py-20 md:py-28', className)}
      {...props}
    >
      <div className={cn('mx-auto w-full', container)}>
        {hasHeader && (
          <div
            className={cn(
              'mb-12 md:mb-16 flex flex-col gap-4',
              align === 'center' && 'items-center text-center',
              headerActions && 'md:flex-row md:items-end md:justify-between'
            )}
          >
            <div className="max-w-2xl space-y-4">
              {eyebrow && <span className="text-eyebrow">{eyebrow}</span>}
              {title && (
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight uppercase leading-[1.05]">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm md:text-base font-mono leading-relaxed text-fg-secondary">
                  {description}
                </p>
              )}
            </div>
            {headerActions && <div className="shrink-0">{headerActions}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
