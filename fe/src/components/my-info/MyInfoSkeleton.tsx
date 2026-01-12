'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function MyInfoSkeleton() {
  return (
    <div className="flex h-full flex-col p-4">
      {/* 사용자 정보 영역 */}
      <div className="flex flex-col gap-6 p-4">
        <section className="flex gap-4">
          {/* 왼쪽: 프로필 이미지 */}
          <div className="shrink-0">
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>

          {/* 오른쪽: 정보 */}
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex flex-col gap-1">
              {/* 닉네임 */}
              <Skeleton className="h-5 w-28" />

              {/* 생년월일 / 성별 */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-4 w-10" />
                </div>
              </div>
            </div>

            {/* 수정 버튼 */}
            <div className="flex justify-end">
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </section>
      </div>

      <Separator />

      {/* 로그아웃 */}
      <div className="mt-auto ml-auto p-4">
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
