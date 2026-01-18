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
        'mt-2 gap-0 p-5 transition-all',
        isOverBudget ? 'bg-destructive/5' : 'bg-primary-foreground'
      )}
    >
      <div className="mb-4 flex items-end justify-between">
        <div className="space-y-1">
          <p className="text-sm font-bold">총 예산</p>

          <div className="flex items-center gap-2 tracking-tight">
            <span className="text-2xl font-bold">
              {totalAllocated.toLocaleString()}
            </span>
            <div className="text-muted-foreground flex items-center text-sm">
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

        <div className="text-right">
          <p className="text-muted-foreground text-xs font-medium">남은 예산</p>
          <p
            className={cn(
              'text-lg font-bold tracking-tight',
              isOverBudget ? THEME_COLOR.EXPENSE : 'text-brand'
            )}
          >
            {isOverBudget
              ? `-${Math.abs(remaining).toLocaleString()}`
              : remaining.toLocaleString()}
            원
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
          <p className={cn('mt-2 text-sm font-medium', THEME_COLOR.EXPENSE)}>
            ⚠️ 설정된 카테고리 예산이 총 예산을 초과했습니다.
          </p>
        )}
      </div>
    </Card>
  );
};

export default BudgetSummary;
