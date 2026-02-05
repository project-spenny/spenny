import BudgetRecommendDialogWrapper from '@/components/budgets/BudgetRecommendDialogWrapper';
import { getBudgetBundle } from '@/services/analysis/budgetService.server';
import { validateDateParams } from '@/app/(app)/analysis/page';

type BudgetRecommendPageProps = {
  searchParams: Promise<{ year?: string; month?: string }>;
};

const BudgetRecommendPage = async ({
  searchParams,
}: BudgetRecommendPageProps) => {
  const params = await searchParams;
  const { currentDate } = validateDateParams(params.year, params.month);

  const { budgetGuideData, budgetData } = await getBudgetBundle(currentDate);

  return (
    <BudgetRecommendDialogWrapper
      guideData={budgetGuideData}
      selectedDate={currentDate}
      initialBudgetData={budgetData}
    />
  );
};

export default BudgetRecommendPage;
