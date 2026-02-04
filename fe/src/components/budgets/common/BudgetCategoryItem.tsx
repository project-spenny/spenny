import { Edit, TriangleAlert } from 'lucide-react';

import { Card } from '@/components/ui/card';
import PercentageBadge from '@/components/budgets/common/PercentageBadge';
import { Progress } from '@/components/ui/progress';
import { THEME_COLOR } from '@/constants/colors';
import { cn } from '@/lib/utils';

type BudgetCategoryItemProps = {
  name: string;
  categoryKey?: string;
  amount: number;
  expense: number;
  onEdit: (key: string) => void;
};

const BudgetCategoryItem = ({
  name,
  categoryKey,
  amount,
  expense,
  onEdit,
}: BudgetCategoryItemProps) => {
  const isOver = expense > amount;
  const diff = Math.abs(amount - expense);
  const usagePercentage = amount > 0 ? Math.round((expense / amount) * 100) : 0;

  return (
    <Card
      className={cn(
        'border-border/50 h-fit justify-center gap-0 px-4 py-3',
        isOver ? 'bg-destructive/5' : 'bg-background'
      )}
    >
      <div className="mb-2 space-y-2 text-xs md:text-sm">
        <div className="flex items-center gap-2">
          <span className="font-bold">{name}</span>
          <PercentageBadge percentage={usagePercentage} />
        </div>

        <div>
          <div className="flex items-center gap-1 tracking-tight">
            <p className="text-muted-foreground text-[11px] font-medium whitespace-nowrap md:text-xs">
              현재 지출
            </p>

            <div className="flex items-center">
              <span className="font-bold">{expense.toLocaleString()}</span>
              <div className="text-muted-foreground flex items-center text-[10px] md:text-xs">
                <span className="px-1">/</span>
                <div
                  className="hover:text-primary flex cursor-pointer items-center gap-1 rounded-lg py-1 break-keep transition-colors hover:underline"
                  onClick={() => categoryKey && onEdit(categoryKey)}
                >
                  {amount.toLocaleString()}원
                  <Edit className="h-3 w-3 shrink-0 md:h-3.5 md:w-3.5" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 text-right tracking-tight">
            <p className="text-muted-foreground text-[11px] font-medium whitespace-nowrap md:text-xs">
              남은 예산
            </p>
            <p
              className={cn(
                'font-bold tracking-tight',
                isOver ? THEME_COLOR.EXPENSE : 'text-brand'
              )}
            >
              {isOver
                ? `-${Math.abs(diff).toLocaleString()}`
                : diff.toLocaleString()}
              원
            </p>
          </div>
        </div>

        {/* 프로그레스 바 */}
        <div className="space-y-2">
          <Progress
            value={Math.min(usagePercentage, 100)}
            className="h-1.5 md:h-2"
            indicatorClassName={
              usagePercentage >= 90 ? 'bg-red-400' : 'bg-brand'
            }
          />

          {isOver && (
            <div
              className={cn(
                'mt-2 flex items-center gap-1 text-[10px] font-medium break-keep md:text-xs',
                THEME_COLOR.EXPENSE
              )}
            >
              <TriangleAlert className="h-3 w-3 shrink-0" />
              <p>[{name}] 카테고리 지출이 예산을 초과했습니다.</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BudgetCategoryItem;
