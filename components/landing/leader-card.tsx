'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { initialsDataUrl } from '@/lib/initials-placeholder';

interface LeaderCardProps {
  title: string;
  /** Sub-label (mis. "Pimpinan Tertinggi"). */
  role?: string;
  nama?: string;
  /** URL gambar yang sudah di-upload. Kalau kosong, render placeholder inisial. */
  img?: string | null;
  index?: number;
  /** Variant "featured" = lebih besar (mis. Ketua Umum). */
  variant?: 'default' | 'featured';
}

/**
 * LeaderCard — card foto kepemimpinan (pimpinan inti / ketua bidang).
 * Menggunakan next/image untuk optimasi LCP. Bila `img` kosong, gunakan
 * placeholder SVG inisial nama yang ter-encode sebagai data URL.
 */
export function LeaderCard({
  title,
  role,
  nama,
  img,
  index = 0,
  variant = 'default',
}: LeaderCardProps) {
  const src = img && img.trim().length > 0 ? img : initialsDataUrl(nama, { variant: 'portrait' });
  const isLocal = src.startsWith('/') || src.startsWith('data:');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={cn(
        'group glass rounded-2xl overflow-hidden relative',
        variant === 'featured' ? 'aspect-[4/5]' : 'aspect-[4/5]'
      )}
    >
      <Image
        src={src}
        alt={nama || title}
        fill
        sizes={variant === 'featured' ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        unoptimized={src.startsWith('data:')}
        {...(!isLocal ? { referrerPolicy: 'no-referrer' as const } : {})}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, var(--color-card-overlay) 0%, rgba(0,0,0,0.25) 45%, transparent 70%)',
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] mb-1 block text-accent">
          {title}
        </span>
        {nama && (
          <h3
            className={cn(
              'font-bold leading-tight',
              variant === 'featured' ? 'text-xl md:text-2xl' : 'text-base md:text-lg'
            )}
          >
            {nama}
          </h3>
        )}
        {role && <p className="text-xs font-mono text-fg-muted mt-1">{role}</p>}
      </div>
    </motion.div>
  );
}
