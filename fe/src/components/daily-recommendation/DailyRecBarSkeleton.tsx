import { Skeleton } from '@/components/ui/skeleton';

export const DailyRecBarSkeleton = () => {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-7 w-24" />
        </div>

        <Skeleton className="h-4 w-72" />
      </div>

      <Skeleton className="h-8 w-8" />
    </div>
  );
};
