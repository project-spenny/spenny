import AnalysisLoading from '@/components/analysis/common/AnalysisLoading';
import AnalysisTabs from '@/components/analysis/AnalysisTabs';
import AnalysisView from '@/components/analysis/AnalysisView';
import BudgetView from '@/components/budgets/BudgetView';
import MonthNavigator from '@/components/analysis/common/MonthNavigator';
import { Suspense } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { TransactionType } from '@/types/analysis';
import { getAnalysisData } from '@/services/analysis/analysisService.server';
import { getBudgetBundle } from '@/services/analysis/budgetService.server';
import { requireUserServer } from '@/utils/supabase/requireUserServer';

type AnalysisPageProps = {
  searchParams: Promise<{ year?: string; month?: string }>;
};

// 연/월 범위 제한
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

const AnalysisDataSection = async ({
  date,
  type,
}: {
  date: Date;
  type: TransactionType;
}) => {
  const { supabase, user } = await requireUserServer();
  const data = await getAnalysisData(supabase, user.id, date, type);
  return <AnalysisView type={type} selectedDate={date} initialData={data} />;
};

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

const AnalysisPage = async ({ searchParams }: AnalysisPageProps) => {
  const { year: yearParam, month: monthParam } = await searchParams;

  const { year, month, currentDate } = validateDate(yearParam, monthParam);

  const ANALYSIS_TABS = [
    {
      value: '지출',
      fetcher: <AnalysisDataSection date={currentDate} type="expense" />,
    },
    {
      value: '수입',
      fetcher: <AnalysisDataSection date={currentDate} type="income" />,
    },
    {
      value: '예산',
      fetcher: <BudgetDataSection date={currentDate} />,
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col py-4">
      {/* 달 이동 */}
      <MonthNavigator year={year} month={month} baseUrl="/analysis" />

      <AnalysisTabs key={`analysis-${year}-${month}`}>
        {ANALYSIS_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Suspense fallback={<AnalysisLoading />}>{tab.fetcher}</Suspense>
          </TabsContent>
        ))}
      </AnalysisTabs>
    </div>
  );
};

export default AnalysisPage;
