'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import {
  Search,
  Home,
  LogIn,
  Sun,
  Moon,
  Palette,
  Network, Users, FlaskConical, Flower2, Landmark,
  BookOpen, TrendingUp, HeartHandshake, Radio,
  Paintbrush,
} from 'lucide-react';
import { navigateWithTransition } from '@/lib/view-transition';
import { useTheme } from '@/app/theme-provider';

// Peta slug → icon untuk item bidang
const bidangItems = [
  { slug: 'organisasi', name: 'Organisasi', icon: Network },
  { slug: 'kader', name: 'Kader', icon: Users },
  { slug: 'riset-pengembangan', name: 'Riset & Pengembangan', icon: FlaskConical },
  { slug: 'immawati', name: 'Immawati', icon: Flower2 },
  { slug: 'hikmah', name: 'Hikmah', icon: Landmark },
  { slug: 'tabligh', name: 'Tabligh', icon: BookOpen },
  { slug: 'ekonomi-kewirausahaan', name: 'Ekonomi & Kewirausahaan', icon: TrendingUp },
  { slug: 'spm', name: 'SPM', icon: HeartHandshake },
  { slug: 'sbo', name: 'SBO', icon: Paintbrush },
  { slug: 'media-komunikasi', name: 'Media & Komunikasi', icon: Radio },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  // ⌘K / Ctrl+K toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    navigateWithTransition(router, href);
  };

  const applyTheme = (t: 'classic' | 'light' | 'dark') => {
    setOpen(false);
    setTheme(t);
  };

  return (
    <>
      {/* Overlay + dialog */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Tutup command palette"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <Command
            label="Command palette"
            className="relative w-full max-w-xl rounded-2xl glass-strong overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]"
            loop
          >
            <div className="flex items-center gap-3 px-4 border-b border-border">
              <Search size={16} className="text-fg-muted shrink-0" aria-hidden="true" />
              <Command.Input
                autoFocus
                placeholder="Cari bidang, halaman, atau tema…"
                className="flex-1 bg-transparent py-4 outline-none text-[15px] font-mono placeholder:text-fg-muted"
              />
              <kbd className="hidden md:inline-flex text-[10px] font-mono uppercase tracking-widest text-fg-muted border border-border rounded px-1.5 py-0.5">
                ESC
              </kbd>
            </div>

            <Command.List className="max-h-[60vh] overflow-y-auto p-2">
              <Command.Empty className="py-10 text-center text-sm font-mono text-fg-muted">
                Tidak ada hasil.
              </Command.Empty>

              <Command.Group
                heading="Navigasi"
                className="[&_[cmdk-group-heading]]:text-eyebrow [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2"
              >
                <PaletteItem
                  icon={Home}
                  label="Beranda"
                  hint="/"
                  onSelect={() => go('/')}
                />
                <PaletteItem
                  icon={LogIn}
                  label="Dashboard"
                  hint="Login"
                  onSelect={() => go('/login')}
                />
              </Command.Group>

              <Command.Group
                heading="Bidang"
                className="[&_[cmdk-group-heading]]:text-eyebrow [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2"
              >
                {bidangItems.map((b) => (
                  <PaletteItem
                    key={b.slug}
                    icon={b.icon}
                    label={`Bidang ${b.name}`}
                    hint={b.slug}
                    onSelect={() => go(`/bidang/${b.slug}`)}
                  />
                ))}
              </Command.Group>

              <Command.Group
                heading="Tema"
                className="[&_[cmdk-group-heading]]:text-eyebrow [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2"
              >
                <PaletteItem
                  icon={Palette}
                  label="Tema Classic (Maroon + Gold)"
                  hint="classic"
                  onSelect={() => applyTheme('classic')}
                />
                <PaletteItem
                  icon={Sun}
                  label="Tema Light"
                  hint="light"
                  onSelect={() => applyTheme('light')}
                />
                <PaletteItem
                  icon={Moon}
                  label="Tema Dark"
                  hint="dark"
                  onSelect={() => applyTheme('dark')}
                />
              </Command.Group>
            </Command.List>

            <div className="border-t border-border px-4 py-2.5 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-fg-muted">
              <span>PIKOM · Command</span>
              <span className="flex items-center gap-2">
                <kbd className="border border-border rounded px-1.5 py-0.5">↑↓</kbd>
                navigasi
                <kbd className="border border-border rounded px-1.5 py-0.5 ml-2">↵</kbd>
                pilih
              </span>
            </div>
          </Command>
        </div>
      )}
    </>
  );
}

interface PaletteItemProps {
  icon: React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>;
  label: string;
  hint?: string;
  onSelect: () => void;
}

function PaletteItem({ icon: Icon, label, hint, onSelect }: PaletteItemProps) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-mono aria-selected:bg-accent/10 aria-selected:text-accent transition-colors"
    >
      <Icon size={15} className="text-fg-muted" aria-hidden />
      <span className="flex-1">{label}</span>
      {hint && (
        <span className="text-[10px] uppercase tracking-widest text-fg-muted">{hint}</span>
      )}
    </Command.Item>
  );
}
