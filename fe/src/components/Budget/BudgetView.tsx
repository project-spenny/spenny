import { useMemo, useState } from 'react';

import AnalysisEmpty from '@/components/analysis/common/AnalysisEmpty';
import AnalysisLoading from '@/components/analysis/common/AnalysisLoading';
import AnalysisSection from '@/components/analysis/common/AnalysisSection';
import BudgetCategoryList from '@/components/budget/BudgetCategoryList';
import BudgetOverview from './BudgetOverview';
import BudgetRecommendDialog from '@/components/budget/BudgetRecommendDialog';
import BudgetSetupDialog from '@/components/budget/BudgetSetupDialog';
import { Button } from '@/components/ui/button';
import { CalculatedBudgetItem } from '@/types/budgetGuide';
import { Calculator } from 'lucide-react';
import CategoryBudgetSetting from '@/components/budget/CategoryBudgetSetting';
import ConfirmDialog from '@/components/budget/ConfirmDialog';
import ResponsivePanel from '@/components/panel/ResponsivePanel';
import UnbudgetedList from '@/components/budget/UnbudgetedList';
import { useAnalysisData } from '@/hooks/useAnalysisData';
import useBudgetData from '@/hooks/useBudgetData';
import useBudgetGuideData from '@/hooks/useBudgetGuideData';

const BudgetView = ({ selectedDate }: { selectedDate: Date }) => {
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTotalConfirmOpen, setIsTotalConfirmOpen] = useState(false);
  const [isCategoryConfirmOpen, setIsCategoryConfirmOpen] = useState(false);
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);
  const [activeCategoryKey, setActiveCategoryKey] = useState<string | null>(
    null
  );

  const {
    totalBudget,
    categoryBudgets,
    saveBudget,
    saveCategoryBudgets,
    removeBudget,
    futureFixedAmount,
    isLoading: isBudgetLoading,
    isDeleting,
    isSaving,
    isSavingCategories,
  } = useBudgetData(selectedDate);
  const {
    totalAmount: totalExpense,
    isLoading: isExpenseLoading,
    categoryTotalsByKey,
    current: transactions,
  } = useAnalysisData(selectedDate, 'expense');
  const { processedData, isLoading: isAnalysisLoading } =
    useBudgetGuideData(selectedDate);

  // 과거 데이터 유무 판단 (이번 달 제외 3개월)
  const hasPastData = useMemo(() => {
    return processedData && processedData.monthlyData.length > 0;
  }, [processedData]);

  const isLoading = isBudgetLoading || isExpenseLoading || isAnalysisLoading;
  const isSubmitting = isSaving || isSavingCategories;

  // 예산 미설정 지출 목록 구하기
  const unbudgetedExpenses = useMemo(() => {
    // 예산이 설정된 키 목록
    const budgetKeys = new Set(
      categoryBudgets.map((b) => b.category?.category_key).filter(Boolean)
    );

    return Object.entries(categoryTotalsByKey)
      .filter(([key]) => !budgetKeys.has(key))
      .map(([key, amount]) => {
        const categoryName =
          transactions.find((t) => t.category?.category_key === key)?.category
            ?.name_ko || key;

        return { key, amount, name: categoryName };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [categoryBudgets, categoryTotalsByKey, transactions]);

  const openCategorySetting = (key: string) => {
    setActiveCategoryKey(key);
    setIsCategoryPanelOpen(true);
  };

  // 추천 예산 적용 핸들러
  const handleRecommendConfirm = (
    budgetDraft: CalculatedBudgetItem[],
    totalBudget: number
  ) => {
    saveBudget(
      { amount: totalBudget, categoryId: null },
      {
        onSuccess: () => {
          // 총 예산 저장 성공 후, 카테고리별 예산 일괄 저장
          const categoryData = budgetDraft.map((item) => ({
            categoryId: item.categoryId,
            amount: item.amount,
          }));

          saveCategoryBudgets(categoryData, {
            onSuccess: () => {
              setIsRecommendOpen(false); // 모든 저장 성공 시 다이얼로그 닫기
            },
          });
        },
      }
    );
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
              {hasPastData && (
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => setIsRecommendOpen(true)}
                >
                  추천 템플릿으로 시작
                </Button>
              )}

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
        // 예산이 있을 때 보여줄 화면
        <>
          {/* 총 예산 섹션 */}
          <BudgetOverview
            totalAmount={totalBudget.amount}
            totalExpense={totalExpense}
            futureFixedAmount={futureFixedAmount}
            onEdit={() => setIsDialogOpen(true)}
            onReset={() => setIsTotalConfirmOpen(true)}
          />

          <div className="relative">
            {/* 카테고리별 예산 */}
            <AnalysisSection title={'카테고리별 예산'}>
              <BudgetCategoryList
                budgets={categoryBudgets}
                categoryTotalsByKey={categoryTotalsByKey}
                onEditAll={() => setIsCategoryPanelOpen(true)}
                onResetAll={() => setIsCategoryConfirmOpen(true)}
                onEditItem={openCategorySetting}
              />

              {/* 예산 미설정 지출 목록 */}
              <UnbudgetedList
                items={unbudgetedExpenses}
                onSetBudget={openCategorySetting}
              />
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

      {/* 예산 추천 */}
      <BudgetRecommendDialog
        open={isRecommendOpen}
        onOpenChange={setIsRecommendOpen}
        selectedDate={selectedDate}
        onConfirm={handleRecommendConfirm}
        isSubmitting={isSubmitting}
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
