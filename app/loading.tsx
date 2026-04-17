import { Skeleton } from '@/components/ui/skeleton';

/**
 * Route-level loading UI untuk segment app/ (landing).
 * Ditampilkan saat Next.js suspending render halaman.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-bg text-fg px-6 md:px-10 lg:px-16 pt-28 pb-16">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <Skeleton className="h-7 w-44 rounded-full" />
          <div className="space-y-3">
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-16 w-1/2" />
          </div>
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-5/6 max-w-xl" />
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-12 w-44 rounded-full" />
            <Skeleton className="h-12 w-44 rounded-full" />
          </div>
        </div>
        <div className="lg:col-span-5">
          <Skeleton className="aspect-[4/5] w-full max-w-md mx-auto rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
