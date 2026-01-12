import { AlertTriangle, BarChart3, BarChartHorizontal } from 'lucide-react';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GroupDisplayInfo, MonthlySummary } from '@/types/budgetGuide';

import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type ExpenseAnalysisStepProps = {
  activeMonths: number;
  isFewData: boolean;
  avgTotal: number;
  monthlyData: MonthlySummary[];
  groupDisplayData: GroupDisplayInfo[];
};

const ExpenseAnalysisStep = ({
  activeMonths,
  isFewData,
  avgTotal,
  monthlyData,
  groupDisplayData,
}: ExpenseAnalysisStepProps) => {
  const maxTotal = Math.max(...monthlyData.map((d) => d.total), 1);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-300">
      <DialogHeader className="space-y-2 break-keep">
        <div className="space-y-1">
          <div className="text-primary font-bold uppercase">
            Step 1. 소비 분석
          </div>

          <DialogTitle className="text-xl leading-tight font-bold">
            최근 {activeMonths}개월간 월 평균{' '}
            <span className="text-primary">
              {Math.floor(avgTotal).toLocaleString()}원
            </span>
            을 지출했어요
          </DialogTitle>
        </div>

        <DialogDescription className="text-sm">
          최근 {activeMonths}개월간의 소비 패턴을 분석해 현재 지출 흐름을
          보여드려요.
        </DialogDescription>
      </DialogHeader>

      {/* 데이터 부족 알림 배너 (1~2개월인 경우에만 표시) */}
      {isFewData && (
        <Card className="flex flex-row items-start gap-2 p-3 text-amber-600">
          <AlertTriangle className="h-4 w-4" />
          <p className="text-xs break-keep">
            데이터가 3개월 미만이라 분석 결과가 정확하지 않을 수 있어요.
            데이터가 쌓일수록 더 정확해져요.
          </p>
        </Card>
      )}

      <Separator />

      {/* 월별 지출 추이 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 font-bold">
            <BarChart3 className="h-5 w-5" />
            월별 지출 추이
          </p>
        </div>

        <div className="flex h-36 items-end justify-between gap-3 px-2">
          {monthlyData.map((m) => {
            const height = (m.total / maxTotal) * 100;

            return (
              <div
                key={m.month}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-muted-foreground text-xs font-bold tracking-tight">
                  {Math.floor(m.total).toLocaleString()}원
                </span>
                <div
                  style={{ height: `${height * 0.8}%` }}
                  className="bg-primary/80 w-full max-w-10 rounded-t-md"
                />
                <span className="text-xs font-medium">
                  {Number(m.month.split('-')[1])}월
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* 그룹별 분석 */}
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <p className="flex items-center gap-2 font-bold">
            <BarChartHorizontal className="h-5 w-5" />
            그룹별 지출 비중
          </p>
          <span className="text-muted-foreground text-xs">
            최근 {activeMonths}개월 평균 기준
          </span>
        </div>

        {/* 비중 바 */}
        <div className="bg-secondary flex h-3 w-full overflow-hidden rounded-full">
          {groupDisplayData.map((g) => (
            <div
              key={g.id}
              style={{ width: `${g.percent}%` }}
              className={cn('transition-all duration-500', g.color)}
            />
          ))}
        </div>

        {/* 상세 리스트 */}
        <div className="space-y-4">
          {groupDisplayData.map((g) => (
            <Card
              key={g.id}
              className="flex flex-row items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <div className={cn('h-2 w-2 rounded-full', g.color)} />
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{g.label}</span>
                  <span className="text-muted-foreground text-xs tracking-tight">
                    {g.description}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">
                  {Math.floor(g.amount).toLocaleString()}원
                </div>
                <div className="text-xs">{g.percent}%</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseAnalysisStep;
