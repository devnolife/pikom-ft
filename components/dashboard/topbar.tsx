'use client';

import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';

interface TopbarProps {
  title?: string;
  crumbs?: string[];
  onOpenSidebar: () => void;
  right?: React.ReactNode;
  className?: string;
}

/**
 * Dashboard topbar — sticky, glass, responsif.
 * Menampilkan breadcrumb turunan dari path + hamburger untuk mobile.
 */
export function Topbar({ title, crumbs, onOpenSidebar, right, className }: TopbarProps) {
  const pathname = usePathname();

  // Breadcrumb fallback: parse path → title
  const items =
    crumbs ??
    pathname
      .split('/')
      .filter(Boolean)
      .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1));

  return (
    <header
      className={cn(
        'sticky top-0 z-30 h-16 flex items-center gap-3 px-4 md:px-8 border-b border-border bg-bg-alt/80 backdrop-blur-xl',
        className
      )}
    >
      <button
        type="button"
        onClick={onOpenSidebar}
        className="lg:hidden p-2 rounded-md hover:bg-glass-overlay text-fg-secondary"
        aria-label="Buka sidebar"
      >
        <Menu size={18} />
      </button>

      <div className="flex-1 min-w-0">
        {title ? (
          <h2 className="text-sm font-semibold truncate">{title}</h2>
        ) : (
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 min-w-0">
            <ol className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-fg-muted min-w-0">
              {items.map((seg, i) => (
                <li key={seg + i} className="flex items-center gap-2 min-w-0">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  <span
                    className={cn(
                      'truncate',
                      i === items.length - 1 && 'text-accent'
                    )}
                  >
                    {seg}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {right}
        <ThemeToggle />
      </div>
    </header>
  );
}
