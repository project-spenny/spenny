import AnalysisLoading from '@/components/analysis/common/AnalysisLoading';
import BudgetView from '@/components/budgets/BudgetView';
import MonthNavigator from '@/components/analysis/common/MonthNavigator';
import { Suspense } from 'react';
import { getBudgetBundle } from '@/services/analysis/budgetService.server';
import { validateDateParams } from '../analysis/page';

type BudgetPageProps = {
  searchParams: Promise<{ year?: string; month?: string }>;
};

// 예산 데이터 페칭 섹션
const BudgetDataSection = async ({ date }: { date: Date }) => {
  const { budgetData, budgetGuideData, analysisData, categories } =
    await getBudgetBundle(date);

  return (
    <BudgetView
      selectedDate={date}
      initialBudgetData={budgetData}
      initialBudgetGuideData={budgetGuideData}
      initialAnalysisData={analysisData}
      initialCategories={categories}
    />
  );
};

const BudgetPage = async ({ searchParams }: BudgetPageProps) => {
  const params = await searchParams;
  const { year, month, currentDate } = validateDateParams(
    params.year,
    params.month
  );

  return (
    <div className="flex min-h-screen w-full flex-col py-4">
      <MonthNavigator year={year} month={month} baseUrl="/budget" />

      <div className="mx-auto w-full max-w-4xl px-6 md:px-12">
        <Suspense
          key={`budget-${year}-${month}`}
          fallback={<AnalysisLoading />}
        >
          <BudgetDataSection date={currentDate} />
        </Suspense>
      </div>
    </div>
  );
};

export default BudgetPage;
