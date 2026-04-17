'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { X, LogOut, ChevronRight } from 'lucide-react';
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
 * Dashboard sidebar — kiri fixed di desktop, drawer di mobile.
 * Active indicator pakai motion layoutId (slide animation antar item).
 * Semua styling pakai Tailwind + CSS vars (tidak ada inline style theme).
 */
export function Sidebar({ items, user, open, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Scroll lock saat drawer mobile terbuka
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC tutup drawer
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

  const panel = (
    <div className="flex flex-col h-full bg-bg-alt border-r border-border">
      {/* Brand */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-border">
        <BrandMark size="sm" />
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-md hover:bg-glass-overlay text-fg-muted"
          aria-label="Tutup sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* User card */}
      <div className="px-4 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-border-strong">
            <AvatarFallback className="bg-[color:var(--color-accent)]/10 text-accent font-bold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name || '—'}</p>
            <p className="text-[11px] font-mono uppercase tracking-widest text-fg-muted truncate">
              {user?.roleLabel || 'User'}
              {user?.nim && ` · ${user.nim}`}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Navigasi dashboard">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'text-accent'
                  : 'text-fg-secondary hover:text-fg hover:bg-glass-overlay'
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-[color:var(--color-accent)]/10 ring-1 ring-[color:var(--color-accent)]/30"
                  aria-hidden="true"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <Icon size={16} className="shrink-0 relative z-10" aria-hidden="true" />
              <span className="relative z-10 flex-1">{item.label}</span>
              {active && (
                <ChevronRight size={14} className="relative z-10" aria-hidden="true" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-border">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16} />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: static sidebar */}
      <aside
        aria-label="Sidebar utama"
        className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen"
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
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
            >
              {panel}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
