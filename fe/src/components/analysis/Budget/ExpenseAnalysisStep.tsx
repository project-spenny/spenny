import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GroupDisplayInfo, MonthlySummary } from '@/types/budgetGuide';
import { TrendingDown, TrendingUp } from 'lucide-react';

import { cn } from '@/lib/utils';

type ExpenseAnalysisStepProps = {
  activeMonths: number;
  avgTotal: number;
  monthlyData: MonthlySummary[];
  groupDisplayData: GroupDisplayInfo[];
};

const ExpenseAnalysisStep = ({
  activeMonths,
  avgTotal,
  monthlyData,
  groupDisplayData,
}: ExpenseAnalysisStepProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-300">
      <DialogHeader className="space-y-2">
        <div className="font-semibold">소비 패턴 분석</div>

        <DialogTitle className="text-lg font-bold">
          최근 {activeMonths}개월 지출을 그룹별로 분석해봤어요
        </DialogTitle>

        <DialogDescription>
          {activeMonths < 3
            ? '데이터가 쌓일수록 더 정확한 분석이 가능해요.'
            : '가장 정교한 예산 초안을 만들기 위한 데이터입니다.'}
        </DialogDescription>
      </DialogHeader>

      {/* 그룹별 비중 바 차트 */}
      <div className="bg-secondary flex h-4 w-full overflow-hidden rounded-full">
        {groupDisplayData.map((g) => (
          <div
            key={g.id}
            style={{ width: `${g.percent}%` }}
            className={cn('transition-all duration-500', g.color)}
          />
        ))}
      </div>

      {/* 상세 리스트 */}
      <div className="space-y-2 pt-2">
        {groupDisplayData.map((g) => (
          <div
            key={g.id}
            className="flex items-center justify-between rounded-xl border p-4"
          >
            <div className="flex items-center gap-3">
              <div className={cn('h-2 w-2 rounded-full', g.color)} />

              <div className="flex flex-col">
                <span className="text-sm font-bold">{g.label}</span>

                <span className="text-muted-foreground text-xs">
                  {g.description}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-0.5">
              <span className="text-sm font-bold">
                {Math.round(g.amount).toLocaleString()}원
              </span>

              <span className="text-xs font-medium">{g.percent}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* 월별 지출 추이 차트 */}
      <div className="space-y-4 pt-4">
        <p className="flex items-center gap-2 text-sm font-bold">
          <TrendingDown className="text-muted-foreground h-4 w-4" />
          월별 지출 추이
        </p>
        <div className="flex h-24 items-end justify-between gap-2 px-2">
          {/* 월별 바 렌더링 로직 */}
        </div>
      </div>

      {/* 분석 인사이트 카드 */}
      <div className="bg-primary/5 border-primary/10 mt-6 rounded-xl border p-4">
        <div className="flex gap-3">
          <TrendingUp className="text-primary h-5 w-5 shrink-0" />

          <div className="space-y-1">
            <p className="text-primary text-sm font-bold">분석 결과</p>

            <div className="text-muted-foreground text-xs leading-relaxed">
              지난 {activeMonths}개월간 평균적으로{' '}
              <span className="text-foreground font-semibold">
                {Math.round(avgTotal).toLocaleString()}
              </span>
              을 지출하셨어요. 특히{' '}
              <span className="text-foreground font-semibold">
                {groupDisplayData[0].percent > groupDisplayData[1].percent
                  ? 'Essential (필수)'
                  : 'Flexible (유연)'}
              </span>
              의 비중이 더 높습니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseAnalysisStep;
