'use client';

import { Item, ItemContent } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  count?: number;
};

const FixedCostItemSkeleton = () => (
  <Item variant="outline" className="relative">
    <ItemContent className="flex flex-col gap-2">
      {/* 상단: 기간/상태 뱃지 영역 */}
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-5 w-28 rounded-md" />
      </div>

      <div className="flex flex-row items-center">
        {/* 좌측: 주기 + 금액 */}
        <div className="flex w-32 flex-col gap-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>

        {/* 중앙: 카테고리 + 제목 */}
        <div className="min-w-0 flex-1 gap-2 pl-2">
          <div className="text-sm">
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="mt-1">
            <Skeleton className="h-5 w-2/3" />
          </div>
        </div>
      </div>
    </ItemContent>
    {/* 우측: chevron 자리 */}
    <div className="absolute top-1/2 right-3 -translate-y-1/2">
      <Skeleton className="h-5 w-5" />
    </div>
  </Item>
);

export default function FixedCostsListSkeleton({ count = 5 }: Props) {
  return (
    <div className="flex w-full flex-col items-center space-y-6 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-xl space-y-6">
        {Array.from({ length: count }).map((_, i) => (
          <FixedCostItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
