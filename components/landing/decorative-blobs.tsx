'use client';

import { cn } from '@/lib/utils';

interface DecorativeBlobsProps {
  /** Jumlah & posisi preset. Default: "hero". */
  variant?: 'hero' | 'minimal' | 'footer';
  className?: string;
}

/**
 * DecorativeBlobs — gradient blob background dekoratif.
 * Pakai var(--color-accent) dan var(--color-accent-secondary) agar ikut theme.
 */
export function DecorativeBlobs({ variant = 'hero', className }: DecorativeBlobsProps) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {variant === 'hero' && (
        <>
          <div
            className="absolute -top-32 -right-20 w-[32rem] h-[32rem] rounded-full blur-[120px] opacity-25 animate-blob"
            style={{
              background:
                'radial-gradient(circle at 30% 30%, var(--color-accent), transparent 65%)',
            }}
          />
          <div
            className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] rounded-full blur-[120px] opacity-20 animate-blob"
            style={{
              background:
                'radial-gradient(circle at 70% 70%, var(--color-accent-secondary), transparent 65%)',
              animationDelay: '2s',
            }}
          />
        </>
      )}
      {variant === 'minimal' && (
        <div
          className="absolute top-1/4 right-10 w-72 h-72 rounded-full blur-[100px] opacity-15"
          style={{
            background:
              'linear-gradient(135deg, var(--color-accent), var(--color-accent-secondary))',
          }}
        />
      )}
      {variant === 'footer' && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] rounded-full blur-[140px] opacity-20"
          style={{
            background:
              'radial-gradient(circle, var(--color-accent) 0%, transparent 60%)',
          }}
        />
      )}
    </div>
  );
}
