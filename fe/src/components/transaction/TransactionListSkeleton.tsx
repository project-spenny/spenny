import { Skeleton } from '@/components/ui/skeleton';

interface TransactionListSkeletonProps {
  compact?: boolean;
  count?: number;
}

export function TransactionListSkeleton({
  compact = false,
  count = 5,
}: TransactionListSkeletonProps) {
  const ItemSkeleton = () => (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>

      <Skeleton className="h-5 w-24" />
    </div>
  );

  if (compact) {
    return (
      <div className="flex w-full flex-col items-center space-y-6 p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-xl space-y-4">
          {Array.from({ length: count }).map((_, i) => (
            <ItemSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center space-y-6 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-xl space-y-6">
        <Skeleton className="h-7 w-20" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: count }).map((_, i) => (
            <ItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
