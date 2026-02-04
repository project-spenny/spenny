import { Edit, TriangleAlert } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { THEME_COLOR } from '@/constants/colors';
import { cn } from '@/lib/utils';

type BudgetSummaryProps = {
  totalBudget: number;
  totalAllocated: number;
  onEditTotal?: () => void;
};

const BudgetSummary = ({
  totalBudget,
  totalAllocated,
  onEditTotal,
}: BudgetSummaryProps) => {
  const remaining = totalBudget - totalAllocated;
  const isOverBudget = remaining < 0;
  const progressValue = Math.min((totalAllocated / totalBudget) * 100, 100);

  return (
    <Card
      className={cn(
        'my-2 gap-2 p-4 transition-all md:p-5',
        isOverBudget ? 'bg-destructive/5' : 'bg-card'
      )}
    >
      <div className="flex flex-col items-start gap-2 text-sm md:justify-between md:text-base">
        <div className="flex items-center gap-1">
          <p className="text-muted-foreground text-sm font-medium">총 예산</p>

          <div className="flex items-center gap-1 tracking-tight">
            <span className="font-bold md:text-lg">
              {totalAllocated.toLocaleString()}
            </span>
            <div className="text-muted-foreground flex items-center text-xs md:text-sm">
              /
              <div
                className="hover:text-primary flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 transition-colors hover:underline"
                onClick={onEditTotal}
              >
                {totalBudget.toLocaleString()}원
                <Edit className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <p className="text-muted-foreground text-sm font-medium">남은 예산</p>
          <p
            className={cn(
              'font-bold tracking-tight',
              isOverBudget ? THEME_COLOR.EXPENSE : 'text-brand'
            )}
          >
            {isOverBudget
              ? `-${Math.abs(remaining).toLocaleString()}`
              : remaining.toLocaleString()}
            <span className="text-sm">원</span>
          </p>
        </div>
      </div>

      {/* 프로그레스 바 */}
      <div className="space-y-2">
        <Progress
          value={progressValue}
          className="h-1.5 md:h-2"
          indicatorClassName={isOverBudget ? 'bg-red-400' : 'bg-brand'}
        />

        {isOverBudget && (
          <div
            className={cn(
              'mt-2 flex items-center gap-1 text-[11px] font-medium break-keep md:text-sm',
              THEME_COLOR.EXPENSE
            )}
          >
            <TriangleAlert className="h-3 w-3 shrink-0" />
            설정된 카테고리 예산이 총 예산을 초과했습니다.
          </div>
        )}
      </div>
    </Card>
  );
};

export default BudgetSummary;
