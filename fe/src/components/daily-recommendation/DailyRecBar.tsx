'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import ResponsivePanel from '../panel/ResponsivePanel';
import { DailyRecPanel } from './DailyRecPanel';
import { DailyRecChartData, DailyRecResult } from '@/types/dailyRec';

type Props = {
  daily: DailyRecResult;
  dailyChartData: DailyRecChartData;
};

export const DailyRecBar = ({ daily, dailyChartData }: Props) => {
  return (
    <>
      {/* 안내 바 */}
      <div className="bg-muted/50 flex items-center justify-between rounded-md px-4 py-3">
        {/* 왼쪽 정보 영역 */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium">오늘 남은 권장 사용액</span>
            <div className="text-xl font-semibold">
              {daily.amount.toLocaleString()}원
            </div>
          </div>

          <div className="text-muted-foreground text-xs">
            총 권장액 {(daily.debug.weightedTotalAmount ?? 0).toLocaleString()}
            원 · 오늘 지출{' '}
            {(daily.debug.spentVariableToday ?? 0).toLocaleString()}원
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
          <DailyRecPanel daily={daily} dailyChartData={dailyChartData} />
        </ResponsivePanel>
      </div>
    </>
  );
};
