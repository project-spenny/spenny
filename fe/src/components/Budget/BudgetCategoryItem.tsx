import { Edit } from 'lucide-react';
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
    <div
      className={cn(
        'border-muted-foreground/30 rounded-2xl border border-dashed p-5 transition-all',
        isOver ? 'bg-destructive/5' : 'bg-card'
      )}
    >
      <div className="mb-4 flex items-end justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <span className="font-bold">{name}</span>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs',
                usagePercentage >= 90
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-primary/10 text-primary'
              )}
            >
              {usagePercentage}%
            </span>
          </div>

          <div className="flex items-center gap-2 tracking-tight">
            <span className="text-2xl font-bold">
              {expense.toLocaleString()}
            </span>
            <div className="text-muted-foreground flex items-center text-sm">
              /
              <div
                className="hover:text-primary flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 transition-colors hover:underline"
                onClick={() => categoryKey && onEdit(categoryKey)}
              >
                {amount.toLocaleString()}원
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
              isOver ? THEME_COLOR.EXPENSE : 'text-primary'
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
          className="h-2"
          indicatorClassName={
            usagePercentage >= 90 ? 'bg-red-400' : 'bg-primary'
          }
        />

        {isOver && (
          <p className={cn('mt-2 text-sm font-medium', THEME_COLOR.EXPENSE)}>
            ⚠️ [{name}] 카테고리 지출이 예산을 초과했습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default BudgetCategoryItem;
