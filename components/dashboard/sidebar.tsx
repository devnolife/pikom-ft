'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { X, LogOut, Sparkles, ChevronsLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { BrandMark } from '@/components/landing/brand-mark';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export interface SidebarNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Group label (optional). Items with the same group render under one heading. */
  group?: string;
  /** Optional right-side badge text. */
  badge?: string;
}

interface SidebarProps {
  items: SidebarNavItem[];
  user?: {
    name?: string | null;
    nim?: string | null;
    roleLabel?: string | null;
  };
  open: boolean;
  onClose: () => void;
}

/**
 * Dashboard sidebar (modernized):
 *  - Borderless canvas (unified with content)
 *  - Grouped nav with uppercase mono headings
 *  - Active state: left gold bar + glass bg (motion layoutId)
 *  - User chip at bottom with online dot & sign-out action
 */
export function Sidebar({ items, user, open, onClose }: SidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const initials =
    user?.name
      ?.split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '??';

  // Group nav items preserving original order
  const grouped: Array<{ group: string | null; items: SidebarNavItem[] }> = [];
  for (const item of items) {
    const key = item.group ?? null;
    const last = grouped[grouped.length - 1];
    if (last && last.group === key) last.items.push(item);
    else grouped.push({ group: key, items: [item] });
  }

  const panel = (
    <div className="flex flex-col h-full bg-bg-alt relative">
      {/* Decorative gold glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[color:var(--color-accent)]/[0.05] to-transparent"
      />

      {/* Brand */}
      <div className="relative h-16 px-5 flex items-center justify-between">
        <BrandMark size="sm" />
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-md hover:bg-glass-overlay text-fg-muted transition-colors"
          aria-label="Tutup sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav
        className="relative flex-1 px-3 pt-2 pb-4 overflow-y-auto"
        aria-label="Navigasi dashboard"
      >
        {grouped.map((section, idx) => (
          <div key={section.group ?? `section-${idx}`} className={cn(idx > 0 && 'mt-5')}>
            {section.group && (
              <p className="px-3 mb-1.5 text-[10px] font-mono uppercase tracking-[0.22em] text-fg-muted/70">
                {section.group}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'group relative flex items-center gap-3 pl-4 pr-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        active
                          ? 'text-fg'
                          : 'text-fg-secondary hover:text-fg hover:bg-glass-overlay'
                      )}
                      aria-current={active ? 'page' : undefined}
                    >
                      {active && (
                        <motion.span
                          layoutId="sidebar-active-bg"
                          className="absolute inset-0 rounded-lg bg-glass-strong"
                          aria-hidden="true"
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        />
                      )}
                      {active && (
                        <motion.span
                          layoutId="sidebar-active-bar"
                          className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-[color:var(--color-accent)] shadow-[0_0_12px_rgba(255,215,0,0.45)]"
                          aria-hidden="true"
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        />
                      )}
                      <Icon
                        size={16}
                        className={cn(
                          'shrink-0 relative z-10 transition-colors',
                          active ? 'text-accent' : 'text-fg-muted group-hover:text-fg'
                        )}
                        aria-hidden="true"
                      />
                      <span className="relative z-10 flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="relative z-10 px-1.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-[color:var(--color-accent)]/15 text-accent">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User chip + sign out */}
      <div className="relative px-3 pb-4 pt-2">
        <div className="p-3 rounded-xl bg-glass-overlay border border-border/60 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-[color:var(--color-accent)]/12 text-accent font-bold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-bg-alt"
                aria-label="Online"
                title="Online"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate leading-tight">
                {user?.name || '—'}
              </p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-fg-muted truncate mt-0.5">
                {user?.roleLabel || 'User'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/login' })}
              aria-label="Keluar"
              title="Keluar"
              className="p-2 rounded-md text-fg-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>
          {user?.nim && (
            <p className="mt-2 pt-2 border-t border-border/50 text-[10px] font-mono text-fg-muted/80 flex items-center gap-1.5">
              <Sparkles size={10} className="text-accent" />
              <span className="truncate">NIM · {user.nim}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: static borderless sidebar */}
      <aside
        aria-label="Sidebar utama"
        className="hidden lg:block w-60 shrink-0 sticky top-0 h-screen"
      >
        {panel}
      </aside>

      {/* Mobile: drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              key="sidebar-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Sidebar"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden shadow-2xl shadow-black/40"
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup sidebar"
                className="absolute -right-10 top-4 p-2 rounded-md bg-bg-alt/90 backdrop-blur-sm text-fg-muted hover:text-fg"
              >
                <ChevronsLeft size={18} />
              </button>
              {panel}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
