import AnalysisLoading from '@/components/analysis/common/AnalysisLoading';
import AnalysisTabs from '@/components/analysis/AnalysisTabs';
import AnalysisView from '@/components/analysis/AnalysisView';
import MonthNavigator from '@/components/analysis/common/MonthNavigator';
import { Suspense } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { TransactionType } from '@/types/analysis';
import { getAnalysisData } from '@/services/analysis/analysisService.server';
import { requireUserServer } from '@/utils/supabase/requireUserServer';

type AnalysisPageProps = {
  searchParams: Promise<{ year?: string; month?: string }>;
};

// 날짜 검증 (연/월 범위 제한)
export const validateDateParams = (yearParam?: string, monthParam?: string) => {
  const now = new Date();

  const year = parseInt(yearParam || '') || now.getFullYear();
  const month = parseInt(monthParam || '') || now.getMonth() + 1;

  const validYear = Math.min(Math.max(year, 2010), now.getFullYear() + 5);
  const validMonth = Math.min(Math.max(month, 1), 12);

  return {
    year: validYear,
    month: validMonth,
    currentDate: new Date(validYear, validMonth - 1),
  };
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

const AnalysisPage = async ({ searchParams }: AnalysisPageProps) => {
  const params = await searchParams;
  const { year, month, currentDate } = validateDateParams(
    params.year,
    params.month
  );

  const ANALYSIS_TABS = [
    {
      value: '지출',
      fetcher: <AnalysisDataSection date={currentDate} type="expense" />,
    },
    {
      value: '수입',
      fetcher: <AnalysisDataSection date={currentDate} type="income" />,
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
