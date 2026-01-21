import AnalysisLoading from '@/components/analysis/common/AnalysisLoading';
import BudgetView from '@/components/budgets/BudgetView';
import MonthNavigator from '@/components/analysis/common/MonthNavigator';
import { Suspense } from 'react';
import { getBudgetBundle } from '@/services/analysis/budgetService.server';

type BudgetPageProps = {
  searchParams: Promise<{ year?: string; month?: string }>;
};

// 날짜 검증 (연/월 범위 제한)
const validateDate = (yearParam?: string, monthParam?: string) => {
  const now = new Date();
  const year = Math.min(
    Math.max(Number(yearParam) || now.getFullYear(), 2010),
    now.getFullYear() + 5
  );
  const month = Math.min(
    Math.max(Number(monthParam) || now.getMonth() + 1, 1),
    12
  );
  return { year, month, currentDate: new Date(year, month - 1) };
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
  const { year: yearParam, month: monthParam } = await searchParams;
  const { year, month, currentDate } = validateDate(yearParam, monthParam);

  return (
    <div className="flex min-h-screen w-full flex-col py-4">
      <MonthNavigator year={year} month={month} baseUrl="/budget" />

      <div className="mx-auto w-full max-w-4xl px-6 md:px-12">
        <Suspense fallback={<AnalysisLoading />}>
          <BudgetDataSection date={currentDate} />
        </Suspense>
      </div>
    </div>
  );
};

export default BudgetPage;
