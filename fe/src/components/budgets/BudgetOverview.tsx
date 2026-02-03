import AnalysisSection from '@/components/analysis/common/AnalysisSection';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { THEME_COLOR } from '@/constants/colors';
import { Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

type BudgetOverviewProps = {
  totalAmount: number;
  totalExpense: number;
  futureFixedAmount: number;
  onEdit: () => void;
  onReset: () => void;
};

const BudgetOverview = ({
  totalAmount,
  totalExpense,
  futureFixedAmount,
  onEdit,
  onReset,
}: BudgetOverviewProps) => {
  const remaining = totalAmount - totalExpense - futureFixedAmount; // 고정비까지 고려
  // (실제 지출 + 지출 예정 합산) 퍼센트
  const totalPercentage = Math.min(
    Math.round(((totalExpense + futureFixedAmount) / totalAmount) * 100),
    100
  );

  return (
    <div className="relative">
      <AnalysisSection title="총 예산" icon={<Wallet className="text-brand" />}>
        <div className="flex flex-col items-center py-2 md:py-4">
          <div className="absolute top-6 right-6 flex gap-1">
            <Button
              variant="ghost"
              className="hover:bg-brand/10 h-8 px-2 text-xs md:text-sm"
              onClick={onEdit}
            >
              수정
            </Button>

            <Button
              variant="ghost"
              className="text-destructive hover:bg-brand/10 hover:text-destructive h-8 px-2 text-xs md:text-sm"
              onClick={onReset}
            >
              초기화
            </Button>
          </div>

          {/* 메인 금액 표시 */}
          <div className="text-center">
            <p className="text-muted-foreground">이번 달 총 예산</p>
            <p className="text-primary text-lg font-bold md:text-2xl">
              {totalAmount.toLocaleString()}원
            </p>
          </div>

          {/* 예산 사용 현황 */}
          <div className="flex w-full max-w-lg flex-col items-center justify-center gap-4 py-4 text-center sm:flex-row md:gap-10">
            <div className="flex-1">
              <p className="text-muted-foreground">현재 지출</p>
              <p className={`font-semibold md:text-lg ${THEME_COLOR.EXPENSE}`}>
                {totalExpense.toLocaleString()}원
              </p>
            </div>

            {futureFixedAmount > 0 && (
              <div className="flex-1">
                <p className="text-muted-foreground">지출 예정</p>
                <p className="text-brand font-semibold md:text-lg">
                  {futureFixedAmount.toLocaleString()}원
                </p>
              </div>
            )}

            <div className="flex-1">
              <p className="text-muted-foreground">남은 예산</p>
              <p
                className={cn(
                  'font-semibold md:text-lg',
                  remaining < 0 ? THEME_COLOR.EXPENSE : THEME_COLOR.INCOME
                )}
              >
                {remaining.toLocaleString()}원
              </p>
            </div>
          </div>

          {/* 바 차트 */}
          <div className="w-full max-w-lg space-y-2">
            <div className="text-muted-foreground flex justify-between text-xs md:text-sm">
              <span>
                예산 사용률
                {futureFixedAmount > 0 && (
                  <span className="rounded pl-1">(지출 예정 포함)</span>
                )}
              </span>
              <span
                className={cn(
                  'font-medium',
                  totalPercentage >= 90
                    ? THEME_COLOR.EXPENSE
                    : 'text-foreground'
                )}
              >
                {totalPercentage}%
              </span>
            </div>

            <Progress
              value={totalPercentage}
              className="h-3 md:h-4"
              indicatorClassName={
                totalPercentage >= 90 ? 'bg-red-400' : 'bg-brand'
              }
            />

            {/* 초과/남음 메시지 로직 */}
            {totalPercentage >= 100 && (
              <p className="mt-4 text-center text-xs font-medium md:text-sm">
                이번 달 예산을{' '}
                <span className={cn('font-semibold', THEME_COLOR.EXPENSE)}>
                  {Math.abs(remaining).toLocaleString()}원 초과
                </span>
                하여 지출하고 있어요!
              </p>
            )}
            {totalPercentage >= 90 && totalPercentage < 100 && (
              <p className="mt-4 text-center text-xs font-medium md:text-sm">
                이번 달 예산이{' '}
                <span className={cn('font-semibold', THEME_COLOR.INCOME)}>
                  {remaining.toLocaleString()}원
                </span>
                밖에 남지 않았습니다.
              </p>
            )}
          </div>
        </div>
      </AnalysisSection>
    </div>
  );
};

export default BudgetOverview;
