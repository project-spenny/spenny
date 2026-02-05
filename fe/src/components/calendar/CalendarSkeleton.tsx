import { Skeleton } from '@/components/ui/skeleton';
import { DailyRecBarSkeleton } from '../daily-recommendation/DailyRecBarSkeleton';

export function CalendarSkeleton() {
  return (
    <div className="m-3 flex w-full flex-col gap-3">
      <div className="flex justify-center px-4">
        <Skeleton className="h-9 w-36 rounded-full" />
      </div>

      <div className="flex w-full flex-col items-center space-y-6 p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-xl space-y-6">
          <div className="flex items-center gap-1 px-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <div className="flex flex-col items-center">
              <Skeleton className="mb-1 h-3 w-10" />
              <Skeleton className="h-7 w-12" />
            </div>
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          <DailyRecBarSkeleton />

          <div className="flex gap-2">
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>
          {Array.from({ length: 3 }).map((_, groupIdx) => (
            <div key={groupIdx} className="space-y-3">
              <Skeleton className="h-4 w-28" />
              {Array.from({ length: 3 }).map((_, itemIdx) => (
                <div
                  key={itemIdx}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-20" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
