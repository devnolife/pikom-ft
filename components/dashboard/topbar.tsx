'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface TopbarProps {
  title?: string;
  crumbs?: string[];
  onOpenSidebar: () => void;
  right?: React.ReactNode;
  className?: string;
  user?: {
    name?: string | null;
    roleLabel?: string | null;
  };
}

const greetingFor = (h: number): string => {
  if (h < 11) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  if (h < 18) return 'Selamat sore';
  return 'Selamat malam';
};

/**
 * Dashboard topbar (modernized):
 *  - Borderless, glass-frosted bar blending into the page canvas
 *  - Left: hamburger (mobile) + breadcrumbs (stacked above a contextual title)
 *  - Right: actions slot, theme toggle, and a compact user chip on mobile
 */
export function Topbar({
  title,
  crumbs,
  onOpenSidebar,
  right,
  className,
  user,
}: TopbarProps) {
  const pathname = usePathname();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Breadcrumb fallback: parse path → title
  const items =
    crumbs ??
    pathname
      .split('/')
      .filter(Boolean)
      .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1));

  // Current page = last crumb, context = second-to-last
  const currentLabel = title ?? items[items.length - 1] ?? 'Dashboard';
  const contextCrumbs = items.slice(0, -1);

  const greeting = now ? greetingFor(now.getHours()) : '';
  const dateLabel = now
    ? now.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
    : '';
  const timeLabel = now
    ? now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : '';

  const firstName = user?.name?.split(' ')[0] || '';
  const initials =
    user?.name
      ?.split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '??';

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex items-center gap-3 px-4 md:px-8 py-4 md:py-5',
        'bg-gradient-to-b from-bg via-bg/95 to-bg/80 backdrop-blur-xl',
        'after:content-[""] after:absolute after:inset-x-4 md:after:inset-x-8 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-border after:to-transparent',
        className,
      )}
    >
      <button
        type="button"
        onClick={onOpenSidebar}
        className="lg:hidden p-2 -ml-1 rounded-md hover:bg-glass-overlay text-fg-secondary transition-colors"
        aria-label="Buka sidebar"
      >
        <Menu size={18} />
      </button>

      {/* Left: greeting + contextual title */}
      <div className="flex-1 min-w-0">
        {/* Tiny crumbs */}
        {contextCrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="hidden sm:flex">
            <ol className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.22em] text-fg-muted/80 min-w-0">
              {contextCrumbs.map((seg, i) => (
                <li key={seg + i} className="flex items-center gap-1 min-w-0">
                  {i > 0 && <ChevronRight size={10} aria-hidden="true" className="opacity-60" />}
                  <span className="truncate">{seg}</span>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Main row: greeting (desktop) OR title (mobile) */}
        <div className="mt-0.5 flex items-center gap-2 md:gap-3 min-w-0">
          <h1 className="hidden md:flex items-baseline gap-2 text-xl lg:text-2xl font-semibold tracking-tight truncate">
            {firstName ? (
              <>
                <span className="text-fg-muted font-normal">{greeting},</span>
                <span className="text-fg">{firstName}</span>
              </>
            ) : (
              <span className="text-fg">{currentLabel}</span>
            )}
          </h1>
          <h1 className="md:hidden text-base font-semibold truncate">{currentLabel}</h1>

          {now && (
            <span className="hidden lg:inline-flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-glass-overlay text-fg-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              {dateLabel} · {timeLabel}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {right}
        <ThemeToggle />
        {user?.name && (
          <div className="md:hidden ml-1">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-[color:var(--color-accent)]/15 text-accent font-bold text-[11px]">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </header>
  );
}
