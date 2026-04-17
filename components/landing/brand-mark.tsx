'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BrandMarkProps {
  /** Ukuran tinggi logo dalam rem (default: h-8). */
  className?: string;
  /** Jika true, render tanpa link (untuk footer atau halaman brand). */
  noLink?: boolean;
  /** Ukuran wordmark. */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * BrandMark — logo tricolor bar + wordmark "PIKOM FT".
 * Warnanya menggunakan brand PIKOM (hitam / gold / accent).
 */
export function BrandMark({ className, noLink, size = 'md' }: BrandMarkProps) {
  const wordmarkClass =
    size === 'sm'
      ? 'text-base'
      : size === 'lg'
        ? 'text-2xl md:text-3xl'
        : 'text-xl';

  const content = (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <span
        aria-hidden="true"
        className="flex h-8 w-6 rounded-b-md overflow-hidden shadow-lg border border-border"
      >
        <span className="w-1/3 h-full bg-black" />
        <span className="w-1/3 h-full bg-accent-secondary" />
        <span className="w-1/3 h-full bg-accent" />
      </span>
      <span className={cn('font-bold tracking-tighter uppercase', wordmarkClass)}>
        PIKOM<span className="text-gradient">FT</span>
      </span>
    </span>
  );

  if (noLink) return content;
  return (
    <Link href="/" aria-label="PIKOM FT — Beranda" className="inline-flex">
      {content}
    </Link>
  );
}
