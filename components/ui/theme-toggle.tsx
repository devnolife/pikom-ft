'use client';

import { useTheme, themeKeys, themeLabels, type ThemeKey } from '@/app/theme-provider';
import { Sun, Moon, SwatchBook } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';

const themeIcons: Record<ThemeKey, typeof Sun> = {
  classic: SwatchBook,
  light: Sun,
  dark: Moon,
};

interface ThemeToggleProps {
  /** "cycle" → klik untuk berganti theme secara berurutan (tanpa menu).
   *  "menu"  → tampilkan dropdown dengan 3 pilihan. */
  variant?: 'cycle' | 'menu';
  className?: string;
  /** Ukuran ikon dalam px. */
  size?: number;
  /** Kelas tambahan untuk tombol trigger. */
  triggerClassName?: string;
}

/**
 * ThemeToggle — tombol ganti tema yang reusable. Mendengar klik di luar
 * untuk menutup menu. Sudah a11y (aria-label, aria-expanded).
 */
export function ThemeToggle({
  variant = 'menu',
  className,
  size = 16,
  triggerClassName,
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const ThemeIcon = themeIcons[theme];

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  if (variant === 'cycle') {
    return (
      <button
        type="button"
        onClick={() => {
          const idx = themeKeys.indexOf(theme);
          setTheme(themeKeys[(idx + 1) % themeKeys.length]);
        }}
        aria-label={`Ganti tema (saat ini: ${themeLabels[theme]})`}
        title={`Tema: ${themeLabels[theme]}`}
        className={cn(
          'glass inline-flex items-center justify-center rounded-full transition-all hover:scale-110 h-9 w-9',
          triggerClassName,
          className
        )}
      >
        <ThemeIcon size={size} />
      </button>
    );
  }

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Ganti tema"
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          'glass inline-flex items-center justify-center rounded-full transition-all hover:scale-110 h-9 w-9',
          triggerClassName
        )}
      >
        <ThemeIcon size={size} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-11 glass-strong rounded-xl overflow-hidden min-w-[148px] shadow-xl shadow-black/20 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {themeKeys.map((key) => {
            const TIcon = themeIcons[key];
            const active = theme === key;
            return (
              <button
                key={key}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setTheme(key);
                  setOpen(false);
                }}
                className={cn(
                  'flex items-center gap-3 w-full px-4 py-2.5 text-[11px] uppercase tracking-wider font-mono transition-colors',
                  active
                    ? 'bg-accent text-[color:var(--color-selection-text)]'
                    : 'text-fg-secondary hover:bg-white/5'
                )}
              >
                <TIcon size={13} />
                {themeLabels[key]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
