import { Skeleton } from '@/components/ui/skeleton';
import { DailyRecBarSkeleton } from '../daily-recommendation/DailyRecBarSkeleton';

export function CalendarSkeleton() {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex flex-col items-center justify-center py-6 md:py-10">
        <Skeleton className="mb-2 h-4 w-12" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
      <div className="w-full">
        <DailyRecBarSkeleton />
      </div>
      <div className="flex w-full gap-2 p-2 sm:gap-4">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>

      <div className="w-full rounded-md border p-2">
        <div className="mb-2 grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>

        {Array.from({ length: 6 }).map((_, week) => (
          <div key={week} className="mb-1 grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, day) => (
              <Skeleton
                key={day}
                className="h-[60px] w-full rounded-md sm:h-[70px] md:h-[80px]"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
