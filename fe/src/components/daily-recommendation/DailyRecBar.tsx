'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import ResponsivePanel from '../panel/ResponsivePanel';
import { DailyRecPanel } from './DailyRecPanel';
import { DailyRecChartData, DailyRecResult } from '@/types/dailyRec';
import { useRouter } from 'next/navigation';

type Props = {
  daily: DailyRecResult;
  dailyChartData: DailyRecChartData;
};

export const DailyRecBar = ({ daily, dailyChartData }: Props) => {
  const router = useRouter();
  const hasBudget = (daily?.debug?.varTotal ?? 0) > 0;
  if (!hasBudget) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-orange-100 bg-orange-50/50 p-4">
        <div className="text-sm font-medium text-orange-700">
          이 달 예산을 설정해주세요
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-orange-200 text-orange-700 hover:bg-orange-100"
          onClick={() => router.push(`/budget`)}
        >
          예산 설정하기
        </Button>
      </div>
    );
  }

  return (
    <div className="dark:bg-muted/20 w-full overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm dark:border-white/10">
      <div className="flex items-center justify-between px-5 py-4">
        {/* 왼쪽 정보 영역 */}
        <div className="space-y-1">
          <div className="flex flex-col items-baseline sm:flex-row sm:gap-2">
            <span className="text-brand-strong dark:text-brand-soft text-sm font-semibold">
              오늘 남은 권장 사용액
            </span>

            <span className="text-xl font-bold tracking-tight">
              {daily.amount.toLocaleString()}원
            </span>
          </div>

          <div className="text-muted-foreground text-xs">
            총 권장액{' '}
            <span className="text-foreground/80 font-semibold">
              {(daily.debug.weightedTotalAmount ?? 0).toLocaleString()}원
            </span>
            <span className="text-foreground/20 mx-1">·</span>
            오늘 지출{' '}
            <span className="text-foreground/80 font-semibold">
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
              className="group dark:hover:text-brand-soft hover:text-brand-strong bg-slate-50 px-4 transition-all hover:bg-blue-50 dark:bg-white/5"
            >
              <span className="text-xs font-semibold">상세보기</span>
              <ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Button>
          }
        >
          <DailyRecPanel daily={daily} dailyChartData={dailyChartData} />
        </ResponsivePanel>
      </div>
      <div className="h-0.5 w-full bg-blue-500/10" />
    </div>
  );
};
