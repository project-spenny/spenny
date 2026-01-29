'use client';

import { BudgetGuideData, CalculatedBudgetItem } from '@/types/budgetGuide';

import { BUDGET_STORAGE_KEY } from '@/hooks/useBudgetRecommendState';
import BudgetRecommendDialog from '@/components/budgets/dialogs/BudgetRecommendDialog';
import { BudgetWithCategory } from '@/types/analysis';
import useBudgetData from '@/hooks/useBudgetData';
import { useRouter } from 'next/navigation';

export default function BudgetRecommendDialogWrapper({
  guideData,
  selectedDate,
  initialBudgetData,
}: {
  guideData: BudgetGuideData;
  selectedDate: Date;
  initialBudgetData: BudgetWithCategory[];
}) {
  const router = useRouter();

  // 데이터 저장을 위한 훅
  const { applyRecommendTemplate, isApplyingTemplate } = useBudgetData(
    selectedDate,
    initialBudgetData
  );

  const handleClose = () => {
    router.back(); // 뒤로 가기 시 부모 페이지(/budget)로 복귀
  };

  // 추천 예산 적용 핸들러
  const handleConfirm = (
    budgetDraft: CalculatedBudgetItem[],
    totalAmount: number
  ) => {
    const categoryData = budgetDraft.map((item) => ({
      categoryId: item.categoryId,
      amount: item.amount,
    }));

    applyRecommendTemplate(totalAmount, categoryData, {
      onSuccess: () => {
        // 저장 성공 시 세션 정리
        sessionStorage.removeItem(BUDGET_STORAGE_KEY);

        router.back();
      },
    });
  };

  return (
    <BudgetRecommendDialog
      open={true}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      guideData={guideData}
      onConfirm={handleConfirm}
      isSubmitting={isApplyingTemplate}
    />
  );
}
