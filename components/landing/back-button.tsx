'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigateWithTransition } from '@/lib/view-transition';

interface BackButtonProps {
  href: string;
  label?: string;
  className?: string;
}

/**
 * BackButton — link navigasi "kembali" dengan ikon panah + view transition.
 */
export function BackButton({ href, label = 'Kembali', className }: BackButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
    ) return;
    e.preventDefault();
    navigateWithTransition(router, href);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-2 text-sm font-mono text-fg-secondary hover:text-accent transition-colors group',
        className
      )}
    >
      <ArrowLeft
        size={16}
        className="group-hover:-translate-x-1 transition-transform"
        aria-hidden="true"
      />
      <span>{label}</span>
    </Link>
  );
}
