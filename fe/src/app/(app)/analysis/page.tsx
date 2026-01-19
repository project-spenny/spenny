import AnalysisClient from '@/components/analysis/AnalysisClient';

type AnalysisPageProps = {
  searchParams: Promise<{ year?: string; month?: string }>;
};

const AnalysisPage = async ({ searchParams }: AnalysisPageProps) => {
  const { year: yearParam, month: monthParam } = await searchParams;

  const now = new Date();

  const year = Number(yearParam) || now.getFullYear();
  const month = Number(monthParam) || now.getMonth() + 1;

  return <AnalysisClient initialYear={year} initialMonth={month} />;
};

export default AnalysisPage;
