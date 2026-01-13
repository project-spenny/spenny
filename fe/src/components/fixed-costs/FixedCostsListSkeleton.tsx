'use client';

import { Item, ItemContent, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  count?: number;
};

const FixedCostItemSkeleton = () => (
  <Item variant="outline">
    <ItemContent className="flex flex-row items-center">
      {/* 좌측: 주기 + 금액 */}
      <div className="flex w-32 flex-col gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>

      {/* 중앙: 카테고리 + 제목 */}
      <div className="pl-2">
        <ItemTitle className="pl-2">
          <Skeleton className="h-3 w-24" />
        </ItemTitle>
        <ItemTitle className="p-2">
          <Skeleton className="h-4 w-40" />
        </ItemTitle>
      </div>

      {/* 우측: chevron 자리 */}
      <div className="ml-auto">
        <Skeleton className="h-8 w-8" />
      </div>
    </ItemContent>
  </Item>
);

export default function FixedCostsListSkeleton({ count = 5 }: Props) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <FixedCostItemSkeleton key={i} />
      ))}
    </div>
  );
}
