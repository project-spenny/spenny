import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const DailyRecPanelSkeleton = () => {
  return (
    <div className="flex min-h-full flex-col px-6">
      <div className="scrollbar-hide space-y-6 overflow-y-auto pb-24">
        {/* 요약 카드 */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-8 w-44" />
                <Skeleton className="h-4 w-72" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <Skeleton className="h-5 w-1" />
              <Skeleton className="h-5 w-80" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-5 w-1" />
              <Skeleton className="h-5 w-72" />
            </div>
          </CardContent>
        </Card>

        {/* 이번 달 사용 현황 */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-52" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-30 w-30 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 기준 대비 소비 페이스 */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-60" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-52 w-full" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* 권장액 조정 방식 */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3 w-80" />
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 소비 흐름 보정 */}
            <div>
              <Skeleton className="mb-2 h-3 w-20" />
              <div className="flex flex-col gap-2 border p-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            </div>

            {/* 소비 패턴 보정 */}
            <div>
              <Skeleton className="mb-2 h-3 w-20" />
              <div className="flex flex-col gap-2 border p-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
