import { cn } from '@/lib/utils';

/**
 * Skeleton — placeholder animasi shimmer untuk loading state.
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn('skeleton rounded-md', className)}
      {...props}
    />
  );
}
