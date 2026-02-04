import { AlertTriangle, BarChart3, BarChartHorizontal } from 'lucide-react';
import { GroupDisplayInfo, MonthlySummary } from '@/types/budgetGuide';

import { Card } from '@/components/ui/card';
import DialogStepHeader from '@/components/budgets/steps/DialogStepHeader';
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
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-300 md:space-y-8">
      <DialogStepHeader
        step={1}
        subTitle="소비 분석"
        title={
          <>
            최근 {activeMonths}개월간 월 평균{' '}
            <span className="text-brand">
              {Math.round(avgTotal).toLocaleString()}원
            </span>
            을 지출했어요
          </>
        }
        description={`최근 ${activeMonths}개월간의 소비 패턴을 분석해 현재 지출 흐름을 보여드려요.`}
      />

      {/* 데이터 부족 알림 배너 (1~2개월인 경우에만 표시) */}
      {isFewData && (
        <Card className="border-border/50 flex flex-row items-center gap-1 px-3 py-2 text-amber-600">
          <AlertTriangle className="h-3 w-3 shrink-0" />
          <p className="text-[11px] break-keep md:text-xs">
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
            <BarChart3 className="text-brand h-4 w-4 md:h-5 md:w-5" />
            <span className="text-sm md:text-base">월별 지출 추이</span>
          </p>
        </div>

        <div className="flex h-32 items-end justify-between gap-2 md:h-36 md:px-2">
          {monthlyData.map((m) => {
            const height = (m.total / maxTotal) * 100;

            return (
              <div
                key={m.month}
                className="flex h-full flex-1 flex-col items-center justify-end gap-1"
              >
                <span className="text-[11px] font-semibold tracking-tight md:text-xs">
                  {Math.round(m.total).toLocaleString()}원
                </span>
                <div
                  style={{ height: `${height * 0.8}%` }}
                  className="bg-brand w-8 rounded-t-md md:w-10"
                />
                <span className="text-[11px] font-semibold md:text-xs">
                  {Number(m.month.split('-')[1])}월
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* 그룹별 분석 */}
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <p className="flex items-center gap-2 font-bold">
            <BarChartHorizontal className="text-brand h-4 w-4 md:h-5 md:w-5" />
            <span className="text-sm md:text-base">그룹별 지출 비중</span>
          </p>
          <span className="text-muted-foreground text-[11px] md:text-xs">
            최근 {activeMonths}개월 평균 기준
          </span>
        </div>

        {/* 비중 바 */}
        <div className="bg-secondary flex h-2 w-full overflow-hidden rounded-full md:h-2.5">
          {groupDisplayData.map((g) => (
            <div
              key={g.id}
              style={{ width: `${g.percent}%` }}
              className={cn('transition-all duration-500', g.color)}
            />
          ))}
        </div>

        {/* 상세 리스트 */}
        <div className="space-y-2">
          {groupDisplayData.map((g) => (
            <Card
              key={g.id}
              className="border-border/50 flex flex-row items-center justify-between gap-2 p-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'h-1.5 w-1.5 shrink-0 rounded-full md:h-2 md:w-2',
                    g.color
                  )}
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold md:text-sm">
                    {g.label}
                  </span>
                  <span className="text-muted-foreground text-[11px] tracking-tight md:text-xs">
                    {g.description}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold whitespace-nowrap md:text-sm">
                  {Math.round(g.amount).toLocaleString()}원
                </div>
                <div className="text-[11px] md:text-xs">{g.percent}%</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseAnalysisStep;
