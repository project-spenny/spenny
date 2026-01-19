import AnalysisClient from '@/components/analysis/AnalysisClient';
import { getAnalysisData } from '@/services/analysis/analysisService.server';

type AnalysisPageProps = {
  searchParams: Promise<{ year?: string; month?: string }>;
};

const AnalysisPage = async ({ searchParams }: AnalysisPageProps) => {
  const { year: yearParam, month: monthParam } = await searchParams;

  const now = new Date();

  const year = Number(yearParam) || now.getFullYear();
  const month = Number(monthParam) || now.getMonth() + 1;
  const currentDate = new Date(year, month - 1);

  // 거래 데이터 가져오기
  const [initialExpense, initialIncome] = await Promise.all([
    getAnalysisData(currentDate, 'expense'),
    getAnalysisData(currentDate, 'income'),
  ]);

  return (
    <AnalysisClient
      key={`analysis-${year}-${month}`}
      initialYear={year}
      initialMonth={month}
      initialData={{
        expense: initialExpense,
        income: initialIncome,
      }}
    />
  );
};

export default AnalysisPage;
