'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigateWithTransition } from '@/lib/view-transition';

interface BidangCardProps {
  name: string;
  desc: string;
  icon: LucideIcon;
  slug: string;
  index: number;
  /** Variant "featured" = lebih besar (col-span-2 row-span-2). */
  variant?: 'default' | 'featured' | 'wide';
}

/**
 * BidangCard — card untuk grid 10 bidang di landing. Variant-aware.
 * Background image dari picsum dengan seed deterministic per bidang.
 */
export function BidangCard({
  name,
  desc,
  icon: Icon,
  slug,
  index,
  variant = 'default',
}: BidangCardProps) {
  const router = useRouter();
  const seed = name.toLowerCase().replace(/\s+/g, '');
  const spanClass =
    variant === 'featured'
      ? 'md:col-span-2 md:row-span-2'
      : variant === 'wide'
        ? 'md:col-span-2'
        : '';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only intercept unmodified left-clicks (let Cmd+Click / middle-click behave normally).
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    e.preventDefault();
    navigateWithTransition(router, `/bidang/${slug}`);
  };

  return (
    <Link
      href={`/bidang/${slug}`}
      onClick={handleClick}
      className={cn('group block', spanClass)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
        style={{ viewTransitionName: `bidang-card-${slug}` }}
        className="relative glass rounded-2xl overflow-hidden gradient-border hover:shadow-[0_12px_40px_-12px_rgba(255,215,0,0.25)] transition-all duration-500 flex flex-col justify-between h-full min-h-[300px]"
      >
        {/* Background image + overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={`https://picsum.photos/seed/${seed}/800/800`}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover opacity-40 group-hover:opacity-55 group-hover:scale-105 transition-all duration-500"
            referrerPolicy="no-referrer"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, var(--color-card-overlay), transparent)',
            }}
          />
        </div>

        {/* Content */}
        <div
          className={cn(
            'relative z-10 p-6 md:p-8 flex flex-col h-full justify-between gap-6',
            variant === 'featured' && 'md:p-10'
          )}
        >
          <div className="flex justify-between items-start">
            <div className="p-3 glass rounded-xl group-hover:bg-accent group-hover:border-accent transition-all duration-300">
              <Icon
                size={variant === 'featured' ? 28 : 22}
                className="text-fg/90 group-hover:text-[color:var(--color-selection-text)] group-hover:rotate-6 transition-all duration-300"
                aria-hidden="true"
              />
            </div>
            <span className="text-label glass px-3 py-1 rounded-full">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <div>
            <h3
              className={cn(
                'font-bold uppercase tracking-tight mb-3',
                variant === 'featured' ? 'text-3xl md:text-4xl' : 'text-2xl md:text-[1.65rem]'
              )}
            >
              {name}
            </h3>
            <p
              className={cn(
                'text-sm font-mono leading-relaxed text-fg-muted transition-all',
                variant === 'featured' ? 'line-clamp-4' : 'line-clamp-3'
              )}
            >
              {desc}
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between text-[10px] uppercase tracking-widest font-mono border-t border-border text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>Bidang {name}</span>
            <span className="flex items-center gap-1">
              Pelajari <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
