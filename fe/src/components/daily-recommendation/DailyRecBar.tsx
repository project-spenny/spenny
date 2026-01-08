'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import ResponsivePanel from '../panel/ResponsivePanel';
import { DailyRecPanel } from './DailyRecPanel';
import { DailyRecResult } from '@/services/daily-recommendation/calculate';

type Props = {
  daily: DailyRecResult;
};

export const DailyRecBar = ({ daily }: Props) => {
  return (
    <>
      {/* 안내 바 */}
      <div className="bg-muted/50 flex items-center justify-between rounded-md px-4 py-3">
        {/* 왼쪽 정보 영역 */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">오늘 권장 사용액</span>
            <div className="text-xl font-semibold">
              {daily.amount.toLocaleString()}원
            </div>
          </div>

          <div className="text-muted-foreground text-xs">
            남은 사용 가능 금액 {daily.debug.varRemaining.toLocaleString()}원 ·
            남은 {daily.debug.remainingDays}일
          </div>
        </div>

        {/* 오른쪽 액션 */}
        <ResponsivePanel
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
            >
              자세히
              <ChevronRight className="h-4 w-4" />
            </Button>
          }
        >
          <DailyRecPanel daily={daily} />
        </ResponsivePanel>
      </div>
    </>
  );
};
