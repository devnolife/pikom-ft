'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X, Search } from 'lucide-react';
import { BrandMark } from './brand-mark';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { CommandPalette } from './command-palette';
import { cn } from '@/lib/utils';

interface NavLink {
  href: string;
  label: string;
}

interface NavBarProps {
  links: NavLink[];
  /** Tampilkan tombol CTA "Login" di sisi kanan. Default: true. */
  showLogin?: boolean;
  /** ID section untuk scroll-spy indicator. */
  activeSection?: string;
}

/**
 * NavBar — fixed top navigation dengan glass effect saat scrolled.
 * Mobile menu offcanvas dengan body scroll lock.
 */
export function NavBar({ links, showLogin = true, activeSection }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll lock saat mobile menu open.
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          scrolled
            ? 'py-3 px-6 md:px-10 glass-strong shadow-lg shadow-black/10'
            : 'py-5 px-6 md:px-10 bg-transparent'
        )}
        aria-label="Navigasi utama"
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          <BrandMark />

          <div className="hidden md:flex items-center gap-7">
            {links.map((link) => {
              const active = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative py-1 text-[11px] uppercase tracking-[0.2em] font-mono transition-colors',
                    active ? 'text-accent' : 'text-fg-secondary hover:text-fg'
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1.5 left-0 right-0 h-[2px] rounded-full bg-accent"
                    />
                  )}
                </a>
              );
            })}

            {showLogin && (
              <Link
                href="/login"
                className="glass px-5 py-2 uppercase text-[11px] font-bold tracking-[0.15em] transition-all hover:scale-105 rounded-full"
              >
                Login
              </Link>
            )}

            <button
              type="button"
              onClick={() => {
                // Programmatic open via keydown event — CommandPalette listens for ⌘K.
                document.dispatchEvent(
                  new KeyboardEvent('keydown', { key: 'k', metaKey: true })
                );
              }}
              className="glass inline-flex items-center gap-2 px-3 py-2 rounded-full text-[10px] font-mono uppercase tracking-widest text-fg-muted hover:text-fg transition-colors"
              aria-label="Buka command palette (Ctrl+K)"
            >
              <Search size={12} aria-hidden="true" />
              <kbd className="font-mono">⌘K</kbd>
            </button>

            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle variant="cycle" />
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="glass p-2 rounded-full transition-all"
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 backdrop-blur-xl flex flex-col items-center justify-center gap-7 md:hidden"
            style={{ backgroundColor: 'var(--color-mobile-menu-bg)' }}
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-3xl font-bold uppercase tracking-wider hover:text-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
            {showLogin && (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-6 glass px-8 py-3 uppercase tracking-[0.2em] text-sm rounded-full"
              >
                Login
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <CommandPalette />
    </>
  );
}
