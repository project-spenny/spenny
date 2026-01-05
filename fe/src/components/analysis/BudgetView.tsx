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
import { Separator } from '@/components/ui/separator';
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
  const {
    totalAmount: totalExpense,
    isLoading: isExpenseLoading,
    categoryTotalsByKey,
    current: transactions,
  } = useAnalysisData(selectedDate, 'expense');

  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTotalConfirmOpen, setIsTotalConfirmOpen] = useState(false);
  const [isCategoryConfirmOpen, setIsCategoryConfirmOpen] = useState(false);

  const isLoading = isBudgetLoading || isExpenseLoading;

  // 예산이 설정된 카테고리 키 목록 생성
  const budgetKeys = new Set(
    categoryBudgets.map((b) => b.categories?.category_key).filter(Boolean)
  );
  // 예산에는 없지만 지출이 발생한 항목들 필터링
  const unbudgetedExpenses = Object.entries(categoryTotalsByKey)
    .filter(([key]) => !budgetKeys.has(key))
    .map(([key, amount]) => {
      const categoryName =
        transactions.find((t) => t.categories?.category_key === key)?.categories
          ?.name_ko || key;

      return { key, amount, name: categoryName };
    })
    .sort((a, b) => b.amount - a.amount);

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
                    onClick={() => setIsTotalConfirmOpen(true)}
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
                <div className="w-full max-w-lg space-y-2">
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
                <div className="flex flex-col items-center py-6">
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
                      onClick={() => setIsCategoryConfirmOpen(true)}
                    >
                      초기화
                    </Button>
                  </div>

                  {/* 카테고리별 예산 리스트 */}
                  <div className="w-full max-w-lg space-y-6">
                    {categoryBudgets.map((budget) => {
                      const categoryName =
                        budget.categories?.name_ko || '미지정';

                      const categoryKey = budget.categories?.category_key;
                      const categoryExpense = categoryKey
                        ? categoryTotalsByKey[categoryKey] || 0
                        : 0;

                      const usagePercentage =
                        budget.amount > 0
                          ? Math.min(
                              Math.round(
                                (categoryExpense / budget.amount) * 100
                              ),
                              100
                            )
                          : 0;

                      return (
                        <div key={budget.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-foreground text-base">
                                {categoryName}
                              </span>
                              <span
                                className={cn(
                                  'text-sm',
                                  usagePercentage >= 90
                                    ? THEME_COLOR.EXPENSE
                                    : 'text-foreground'
                                )}
                              >
                                {usagePercentage}%
                              </span>
                            </div>

                            <div className="text-sm font-medium">
                              <span className="text-foreground font-semibold">
                                {categoryExpense.toLocaleString()}
                              </span>
                              <span className="text-muted-foreground mx-1">
                                /
                              </span>
                              <span className="text-muted-foreground">
                                {budget.amount.toLocaleString()}원
                              </span>
                            </div>
                          </div>

                          {/* 카테고리별 사용량 바 */}
                          <Progress
                            value={usagePercentage}
                            className="h-2"
                            indicatorClassName={cn(
                              usagePercentage >= 90
                                ? 'bg-red-400'
                                : 'bg-primary'
                            )}
                          />
                        </div>
                      );
                    })}

                    <Separator className="my-10" />

                    {unbudgetedExpenses.length > 0 && (
                      <div className="">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                            예산 미설정 지출
                          </div>
                          <span className="text-muted-foreground text-xs">
                            예산을 설정 해주세요
                          </span>
                        </div>

                        <div className="space-y-6">
                          {unbudgetedExpenses.map((item) => (
                            <div key={item.key} className="relative">
                              <div className="mb-1 flex items-center justify-between space-y-2">
                                <div className="flex items-center">
                                  <span className="text-foreground">
                                    {item.name}
                                  </span>
                                </div>

                                <div className="text-sm font-medium">
                                  <span
                                    className={cn(
                                      'font-semibold',
                                      THEME_COLOR.EXPENSE
                                    )}
                                  >
                                    {item.amount.toLocaleString()}원
                                  </span>
                                  <span className="text-muted-foreground mx-1">
                                    /
                                  </span>
                                  <span className="text-muted-foreground">
                                    0원
                                  </span>
                                </div>
                              </div>
                              <Progress
                                value={100}
                                className="h-2"
                                indicatorClassName="bg-red-400"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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

      {/* 총 예산 초기화 모달창 */}
      <ConfirmDialog
        open={isTotalConfirmOpen}
        onOpenChange={setIsTotalConfirmOpen}
        title="총 예산 초기화"
        description={`총 예산을 초기화하면\n설정된 카테고리별 예산도 함께 삭제됩니다.\n정말 진행하시겠습니까?`}
        onConfirm={() => {
          removeBudget(null, {
            onSuccess: () => {
              setIsTotalConfirmOpen(false); // 성공 후 닫기
            },
          });
        }}
        isLoading={isDeleting}
      />

      {/* 카테고리 예산 초기화 모달창 */}
      <ConfirmDialog
        open={isCategoryConfirmOpen}
        onOpenChange={setIsCategoryConfirmOpen}
        title="카테고리 예산 초기화"
        description={
          '설정된 모든 카테고리별 예산이 삭제됩니다.\n정말 진행하시겠습니까?'
        }
        onConfirm={() => {
          removeBudget('ALL_CATEGORIES', {
            onSuccess: () => setIsCategoryConfirmOpen(false),
          });
        }}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default BudgetView;
