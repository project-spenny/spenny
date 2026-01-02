import AnalysisLoading from './common/AnalysisLoading';
import AnalysisSection from './common/AnalysisSection';
import useBudgetData from '@/hooks/useBudgetData';

const BudgetView = ({ selectedDate }: { selectedDate: Date }) => {
  const { budgets, isLoading } = useBudgetData(selectedDate);

  if (isLoading)
    return (
      <div className="py-20">
        <AnalysisLoading />
      </div>
    );

  return (
    <div className="space-y-4">
      <AnalysisSection title={'총 예산'}>총 예산</AnalysisSection>
      <AnalysisSection title={'카테고리별 예산'}>카테고리</AnalysisSection>
    </div>
  );
};

export default BudgetView;
