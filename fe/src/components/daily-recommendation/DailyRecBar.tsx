'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import ResponsivePanel from '../panel/ResponsivePanel';
import { DailyRecPanel } from './DailyRecPanel';
import { DailyRecChartData, DailyRecResult } from '@/types/dailyRec';
import { cn } from '@/lib/utils';

type Props = {
  daily: DailyRecResult;
  dailyChartData: DailyRecChartData;
};

export const DailyRecBar = ({ daily, dailyChartData }: Props) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-md px-4 py-3',
        'bg-brand-subtle dark:bg-muted/40',
        'dark:border-border border border-transparent',
        'border-l-brand border-l-4'
      )}
    >
      {/* 왼쪽 정보 영역 */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-brand-strong text-sm font-medium">
            오늘 남은 권장 사용액
          </span>

          <div className="text-brand-strong text-xl font-semibold tracking-tight">
            {daily.amount.toLocaleString()}원
          </div>
        </div>

        <div className="text-muted-foreground text-xs">
          총 권장액{' '}
          <span className="text-foreground/80 font-medium">
            {(daily.debug.weightedTotalAmount ?? 0).toLocaleString()}원
          </span>
          <span className="text-foreground/20 mx-1">·</span>
          오늘 지출{' '}
          <span className="text-foreground/80 font-medium">
            {(daily.debug.spentVariableToday ?? 0).toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 오른쪽 액션 영역 */}
      <ResponsivePanel
        trigger={
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-brand-soft/40 flex items-center gap-1"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        }
      >
        <DailyRecPanel daily={daily} dailyChartData={dailyChartData} />
      </ResponsivePanel>
    </div>
  );
};
