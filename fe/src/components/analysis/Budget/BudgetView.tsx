import { Calculator, Edit, ListPlus } from 'lucide-react';

import AnalysisEmpty from '@/components/analysis/common/AnalysisEmpty';
import AnalysisLoading from '@/components/analysis/common/AnalysisLoading';
import AnalysisSection from '@/components/analysis/common/AnalysisSection';
import BudgetRecommendDialog from '@/components/analysis/Budget/BudgetRecommendDialog';
import BudgetSetupDialog from '@/components/analysis/Budget/BudgetSetupDialog';
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
    futureFixedAmount,
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
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);
  const [activeCategoryKey, setActiveCategoryKey] = useState<string | null>(
    null
  );

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
  const remaining = budgetAmount - totalExpense - futureFixedAmount; // 고정비까지 고려
  // (실제 지출 + 지출 예정 합산) 퍼센트
  const totalPercentage = Math.min(
    Math.round(((totalExpense + futureFixedAmount) / budgetAmount) * 100),
    100
  );

  const openCategorySetting = (key: string) => {
    setActiveCategoryKey(key);
    setIsCategoryPanelOpen(true);
  };

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
            <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => setIsRecommendOpen(true)}
              >
                추천 템플릿으로 시작
              </Button>

              <Button
                className="cursor-pointer"
                onClick={() => setIsDialogOpen(true)}
              >
                이번 달 예산 설정하기
              </Button>
            </div>
          </AnalysisEmpty>
        </div>
      ) : (
        <>
          <div className="relative">
            {/* 예산이 있을 때 보여줄 화면  */}
            <AnalysisSection title={'총 예산'}>
              <div className="flex flex-col items-center gap-4 py-6">
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
                <div className="flex w-full max-w-lg flex-col items-center justify-center gap-10 py-4 text-center sm:flex-row">
                  <div className="flex-1">
                    <p className="text-muted-foreground">현재 지출</p>
                    <p
                      className={`text-lg font-semibold ${THEME_COLOR.EXPENSE}`}
                    >
                      {totalExpense.toLocaleString()}원
                    </p>
                  </div>

                  {futureFixedAmount > 0 && (
                    <div className="flex-1">
                      <p className="text-muted-foreground">지출 예정</p>
                      <p className="text-lg font-semibold text-[#5C7AFF]">
                        {futureFixedAmount.toLocaleString()}원
                      </p>
                    </div>
                  )}

                  <div className="flex-1">
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
                    <span>
                      예산 사용률
                      {futureFixedAmount > 0 && (
                        <span className="rounded pl-1 text-sm">
                          (지출 예정 포함)
                        </span>
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
                    className="h-4"
                    indicatorClassName={
                      totalPercentage >= 90 ? 'bg-red-400' : 'bg-primary'
                    }
                  />

                  {totalPercentage >= 100 && (
                    <p className="mt-4 text-center text-sm font-medium">
                      이번 달 예산을{' '}
                      <span
                        className={cn('font-semibold', THEME_COLOR.EXPENSE)}
                      >
                        {Math.abs(remaining).toLocaleString()}원 초과
                      </span>
                      하여 지출하고 있어요!
                    </p>
                  )}
                  {totalPercentage >= 90 && totalPercentage < 100 && (
                    <p className="mt-4 text-center text-sm font-medium">
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

          <div className="relative">
            {/* 카테고리별 예산 */}
            <AnalysisSection title={'카테고리별 예산'}>
              {categoryBudgets.length === 0 ? (
                <AnalysisEmpty
                  title="카테고리별 예산을 설정해주세요"
                  description="식비, 교통비 등 항목별로 예산을 나누면 더 체계적으로 관리할 수 있어요."
                  icon={ListPlus}
                >
                  <Button
                    variant="ghost"
                    className="bg-primary/5 hover:bg-primary/10 mt-2 cursor-pointer"
                    onClick={() => setIsCategoryPanelOpen(true)}
                  >
                    카테고리 예산 설정하기
                  </Button>
                </AnalysisEmpty>
              ) : (
                <div className="flex flex-col items-center py-6">
                  <div className="absolute top-8 right-8 flex gap-1">
                    <Button
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground h-8 cursor-pointer px-2"
                      onClick={() => setIsCategoryPanelOpen(true)}
                    >
                      수정
                    </Button>

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

                      const isOver = categoryExpense > budget.amount;
                      const diff = Math.abs(budget.amount - categoryExpense);
                      const usagePercentage =
                        budget.amount > 0
                          ? Math.round((categoryExpense / budget.amount) * 100)
                          : 0;

                      return (
                        <div
                          key={budget.id}
                          className={cn(
                            'border-muted-foreground/30 rounded-2xl border border-dashed p-5 transition-all',
                            isOver ? 'bg-destructive/5' : 'bg-card'
                          )}
                        >
                          <div className="mb-4 flex items-end justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <span className="font-bold">
                                  {categoryName}
                                </span>
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
                                  {categoryExpense.toLocaleString()}
                                </span>
                                <div className="text-muted-foreground flex items-center text-sm">
                                  /
                                  <div
                                    className="hover:text-primary flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 transition-colors hover:underline"
                                    onClick={() =>
                                      categoryKey &&
                                      openCategorySetting(categoryKey)
                                    }
                                  >
                                    {budget.amount.toLocaleString()}원
                                    <Edit className="h-4 w-4" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-muted-foreground text-xs font-medium">
                                남은 예산
                              </p>
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
                                usagePercentage >= 90
                                  ? 'bg-red-400'
                                  : 'bg-primary'
                              }
                            />

                            {isOver && (
                              <p
                                className={cn(
                                  'mt-2 text-sm font-medium',
                                  THEME_COLOR.EXPENSE
                                )}
                              >
                                ⚠️ [{categoryName}] 카테고리 지출이 예산을
                                초과했습니다.
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 예산 미설정 지출 목록 */}
              {unbudgetedExpenses.length > 0 && (
                <>
                  <Separator className="my-10" />

                  <div className="flex w-full flex-col items-center">
                    <div className="mt-4 w-full max-w-lg">
                      <div className="mb-4 flex flex-col justify-between px-1 md:flex-row md:items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                          <span className="text-foreground text-sm font-bold">
                            예산 미설정 지출
                          </span>
                          <span
                            className={cn(
                              'bg-destructive/10 rounded-full px-2 py-0.5 text-xs font-bold',
                              THEME_COLOR.EXPENSE
                            )}
                          >
                            {unbudgetedExpenses.length}
                          </span>
                        </div>
                        <span className="text-muted-foreground text-xs md:mt-0">
                          설정하기를 눌러 예산을 설정해주세요
                        </span>
                      </div>

                      <div className="flex flex-col gap-3">
                        {unbudgetedExpenses.map((item) => (
                          <div
                            key={item.key}
                            className="border-muted-foreground/30 bg-card rounded-xl border border-dashed p-5 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-foreground text-base font-bold transition-colors">
                                    {item.name}
                                  </p>
                                  <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                                    미설정
                                  </span>
                                </div>
                                <p className="text-muted-foreground text-sm font-semibold">
                                  <span className="text-foreground">
                                    {item.amount.toLocaleString()}원
                                  </span>{' '}
                                  지출됨
                                </p>
                              </div>

                              {/* 오른쪽 액션 아이콘 */}
                              <div className="flex flex-col items-end gap-1">
                                <div
                                  className="text-muted-foreground hover:text-primary flex cursor-pointer items-center gap-1 hover:underline"
                                  onClick={() => openCategorySetting(item.key)}
                                >
                                  <span className="text-xs font-bold">
                                    설정하기
                                  </span>
                                  <Edit className="h-4 w-4 group-hover:hidden" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </AnalysisSection>
          </div>
        </>
      )}

      {/* ResponsivePanel을 공용으로 사용하기 위해 분리 */}
      <ResponsivePanel
        isOpen={isCategoryPanelOpen}
        setIsOpen={(open) => {
          setIsCategoryPanelOpen(open);
          if (!open) setActiveCategoryKey(null);
        }}
      >
        <CategoryBudgetSetting
          selectedDate={selectedDate}
          totalBudgetAmount={totalBudget?.amount || 0}
          initialCategoryKey={activeCategoryKey}
          onSaveSuccess={() => setIsCategoryPanelOpen(false)}
          onEditTotalBudget={() => setIsDialogOpen(true)}
        />
      </ResponsivePanel>

      {/* 총 예산 설정 모달창 */}
      <BudgetSetupDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedDate={selectedDate}
        defaultAmount={totalBudget?.amount} // 기존 금액 전달
      />

      <BudgetRecommendDialog
        open={isRecommendOpen}
        onOpenChange={setIsRecommendOpen}
        selectedDate={selectedDate}
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
