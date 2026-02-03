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
        'gap-0 px-4 py-3 md:px-5 md:py-4',
        isOver ? 'bg-destructive/5' : 'bg-background'
      )}
    >
      <div className="mb-2 flex items-end justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2 text-sm md:text-base">
            <span className="font-bold">{name}</span>
            <PercentageBadge percentage={usagePercentage} />
          </div>

          <div className="flex items-center tracking-tight">
            <span className="tight text-sm font-bold md:text-base">
              {expense.toLocaleString()}
            </span>
            <div className="text-muted-foreground flex items-center text-[10px] md:text-xs">
              <span className="px-1">/</span>
              <div
                className="hover:text-primary flex cursor-pointer items-center gap-1 rounded-lg py-1 text-xs break-keep transition-colors hover:underline md:text-sm"
                onClick={() => categoryKey && onEdit(categoryKey)}
              >
                {amount.toLocaleString()}원
                <Edit className="h-3 w-3 shrink-0 md:h-3.5 md:w-3.5" />
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 text-right whitespace-nowrap">
          <p className="text-muted-foreground text-[11px] md:text-xs">
            남은 예산
          </p>
          <p
            className={cn(
              'text-sm font-bold tracking-tight md:text-base',
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
          indicatorClassName={usagePercentage >= 90 ? 'bg-red-400' : 'bg-brand'}
        />

        {isOver && (
          <div
            className={cn(
              'mt-2 flex items-center gap-1 text-[11px] font-medium break-keep md:text-sm',
              THEME_COLOR.EXPENSE
            )}
          >
            <TriangleAlert className="h-3 w-3 shrink-0" />
            <p>[{name}] 카테고리 지출이 예산을 초과했습니다.</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BudgetCategoryItem;
