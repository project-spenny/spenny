import { Calculator, ListPlus } from 'lucide-react';

import AnalysisEmpty from '@/components/analysis/common/AnalysisEmpty';
import AnalysisLoading from '@/components/analysis/common/AnalysisLoading';
import AnalysisSection from '@/components/analysis/common/AnalysisSection';
import BudgetSetupDialog from '@/components/analysis/BudgetSetupDialog';
import { Button } from '@/components/ui/button';
import CategoryBudgetSetting from '@/components/analysis/CategoryBudgetSetting';
import ConfirmDialog from '@/components/analysis/common/ConfirmDialog';
import { Progress } from '@/components/ui/progress';
import ResponsivePanel from '@/components/panel/ResponsivePanel';
import { THEME_COLOR } from '@/constants/colors';
import { cn } from '@/lib/utils';
import { useAnalysisData } from '@/hooks/useAnalysisData';
import useBudgetData from '@/hooks/useBudgetData';
import { useState } from 'react';

const BudgetView = ({ selectedDate }: { selectedDate: Date }) => {
  const {
    totalBudget,
    categoryBudgets,
    removeBudget,
    isLoading: isBudgetLoading,
    isDeleting,
  } = useBudgetData(selectedDate);

  const { totalAmount: totalExpense, isLoading: isExpenseLoading } =
    useAnalysisData(selectedDate, 'expense');

  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const isLoading = isBudgetLoading || isExpenseLoading;

  const budgetAmount = totalBudget?.amount || 0;
  const remaining = budgetAmount - totalExpense;
  const percentage = Math.min(
    Math.round((totalExpense / budgetAmount) * 100),
    100
  );

  if (isLoading)
    return (
      <div className="py-20">
        <AnalysisLoading />
      </div>
    );

  return (
    <div className="space-y-4">
      {/* 예산이 없을 때 보여줄 화면 */}
      {!totalBudget ? (
        <div className="py-20">
          <AnalysisEmpty
            title="이번 달 예산을 설정해 주세요"
            description="지출을 관리하기 위해 먼저 한 달 총 예산을 정해볼까요?"
            icon={Calculator}
          >
            <Button
              variant="secondary"
              className="bg-primary/5 hover:bg-primary/10 mt-2 cursor-pointer"
              onClick={() => setIsDialogOpen(true)}
            >
              이번 달 예산 설정하기
            </Button>
          </AnalysisEmpty>
        </div>
      ) : (
        <>
          <div className="relative">
            {/* 예산이 있을 때 보여줄 화면  */}
            <AnalysisSection title={'총 예산'}>
              <div className="flex flex-col items-center py-6">
                <div className="absolute top-8 right-8 flex gap-1">
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground h-8 cursor-pointer px-2"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-destructive hover:text-destructive h-8 cursor-pointer px-2"
                    onClick={() => setIsConfirmOpen(true)}
                  >
                    초기화
                  </Button>
                </div>

                {/* 메인 콘텐츠 */}
                <div className="text-center">
                  <p className="text-muted-foreground text-base font-medium">
                    이번 달 총 예산
                  </p>
                  <p className="text-primary text-3xl font-bold tracking-tight">
                    {totalBudget.amount.toLocaleString()}
                    <span className="text-foreground text-lg font-normal">
                      {' '}
                      원
                    </span>
                  </p>
                </div>

                {/* 예산 사용 현황 */}
                <div className="flex w-full items-center justify-center gap-10 py-4 text-center">
                  <div>
                    <p className="text-muted-foreground">현재 지출</p>
                    <p
                      className={`text-lg font-semibold ${THEME_COLOR.EXPENSE}`}
                    >
                      {totalExpense.toLocaleString()}원
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">남은 예산</p>
                    <p
                      className={cn(
                        'text-lg font-semibold',
                        remaining < 0 ? THEME_COLOR.EXPENSE : THEME_COLOR.INCOME
                      )}
                    >
                      {remaining.toLocaleString()}원
                    </p>
                  </div>
                </div>

                {/* 바 차트 */}
                <div className="w-full max-w-md space-y-2">
                  <div className="text-muted-foreground flex justify-between text-sm">
                    <span>예산 사용률</span>
                    <span
                      className={cn(
                        'font-medium',
                        percentage >= 90
                          ? THEME_COLOR.EXPENSE
                          : 'text-foreground'
                      )}
                    >
                      {percentage}%
                    </span>
                  </div>
                  <Progress
                    value={percentage}
                    className="h-4"
                    indicatorClassName={
                      percentage >= 90 ? 'bg-red-400' : 'bg-primary'
                    }
                  />
                </div>
              </div>
            </AnalysisSection>
          </div>

          <div className="relative">
            {/* 카테고리별 예산 */}
            <AnalysisSection title={'카테고리별 예산'}>
              {categoryBudgets.length === 0 ? (
                <AnalysisEmpty
                  title="카테고리별 예산을 설정해주세요"
                  description="식비, 교통비 등 항목별로 예산을 나누면 더 체계적으로 관리할 수 있어요."
                  icon={ListPlus}
                >
                  <ResponsivePanel
                    trigger={
                      <Button
                        variant="ghost"
                        className="bg-primary/5 hover:bg-primary/10 mt-2 cursor-pointer"
                      >
                        카테고리 예산 설정하기
                      </Button>
                    }
                    isOpen={isCategoryPanelOpen}
                    setIsOpen={setIsCategoryPanelOpen}
                  >
                    <CategoryBudgetSetting
                      selectedDate={selectedDate}
                      onSaveSuccess={() => setIsCategoryPanelOpen(false)}
                    />
                  </ResponsivePanel>
                </AnalysisEmpty>
              ) : (
                <div>
                  <div className="absolute top-8 right-8 flex gap-1">
                    <ResponsivePanel
                      trigger={
                        <Button
                          variant="ghost"
                          className="text-muted-foreground hover:text-foreground h-8 cursor-pointer px-2"
                        >
                          수정
                        </Button>
                      }
                      isOpen={isCategoryPanelOpen}
                      setIsOpen={setIsCategoryPanelOpen}
                    >
                      <CategoryBudgetSetting
                        selectedDate={selectedDate}
                        onSaveSuccess={() => setIsCategoryPanelOpen(false)}
                      />
                    </ResponsivePanel>
                    <Button
                      variant="ghost"
                      className="text-destructive hover:text-destructive h-8 cursor-pointer px-2"
                    >
                      초기화
                    </Button>
                  </div>
                  <div>카테고리</div>
                </div>
              )}
            </AnalysisSection>
          </div>
        </>
      )}

      {/* 총 예산 설정 모달창 */}
      <BudgetSetupDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedDate={selectedDate}
        defaultAmount={totalBudget?.amount} // 기존 금액 전달
      />

      {/* 초기화 확인 모달창 */}
      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={() => {
          removeBudget(null, {
            onSuccess: () => {
              setIsConfirmOpen(false); // 성공 후 닫기
            },
          });
        }}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default BudgetView;
