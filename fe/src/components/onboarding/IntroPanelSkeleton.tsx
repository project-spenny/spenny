import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function IntroPanelSkeleton({ stepsCount }: { stepsCount: number }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative flex min-h-dvh items-center justify-center p-4">
        <div className="w-full max-w-lg md:max-w-3xl">
          <Card className="max-h-[90dvh] overflow-hidden">
            <CardHeader className="relative space-y-2">
              {/* 건너뛰기 버튼 */}
              <div className="absolute -top-3 right-2">
                <Skeleton className="h-9 w-20" />
              </div>

              {/* title/desc */}
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>

            <CardContent className="max-h-[70dvh] overflow-y-auto">
              <div className="space-y-6">
                {/* media */}
                <div className="flex gap-3 overflow-hidden">
                  <div className="relative h-75 w-full md:h-90">
                    <Skeleton className="h-full w-full" />
                  </div>
                </div>

                {/* 하단 컨트롤 */}
                <div className="grid grid-cols-3 items-center">
                  {/* 이전 버튼 */}
                  <div className="justify-self-start">
                    <Skeleton className="h-10 w-20" />
                  </div>

                  {/* 중앙 인디케이터 */}
                  <div className="justify-self-center">
                    <div className="flex items-center justify-center gap-3">
                      {Array.from({ length: stepsCount }).map((_, i) => (
                        <Skeleton key={i} className="h-2 w-2 rounded-full" />
                      ))}
                    </div>
                  </div>

                  {/* 다음 버튼 */}
                  <div className="justify-self-end">
                    <Skeleton className="h-10 w-20" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
