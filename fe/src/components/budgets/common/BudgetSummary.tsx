import { Card } from '@/components/ui/card';
import { Edit } from 'lucide-react';
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
        'my-2 gap-2 p-5 transition-all',
        isOverBudget ? 'bg-destructive/5' : 'bg-primary-foreground'
      )}
    >
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-bold">총 예산</p>

          <div className="flex items-center gap-2 tracking-tight">
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

        <div className="md:text-right">
          <p className="text-muted-foreground text-xs font-medium">남은 예산</p>
          <p
            className={cn(
              'font-bold tracking-tight md:text-lg',
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
          className="h-2"
          indicatorClassName={isOverBudget ? 'bg-red-400' : 'bg-brand'}
        />

        {isOverBudget && (
          <p
            className={cn(
              'mt-2 text-xs font-medium md:text-sm',
              THEME_COLOR.EXPENSE
            )}
          >
            ⚠️ 설정된 카테고리 예산이 총 예산을 초과했습니다.
          </p>
        )}
      </div>
    </Card>
  );
};

export default BudgetSummary;
