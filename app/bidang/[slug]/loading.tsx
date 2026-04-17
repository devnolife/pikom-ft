import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="border-b border-border px-6 md:px-10 lg:px-16 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
      <div className="px-6 md:px-10 lg:px-16 pt-16 pb-20 mx-auto max-w-5xl space-y-6">
        <Skeleton className="h-4 w-60" />
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-14 w-3/4" />
        <div className="space-y-2 max-w-3xl">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
      <div className="border-t border-border px-6 md:px-10 lg:px-16 py-16 mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="aspect-[5/4] rounded-2xl" />
        <Skeleton className="aspect-[5/4] rounded-2xl" />
      </div>
    </div>
  );
}
