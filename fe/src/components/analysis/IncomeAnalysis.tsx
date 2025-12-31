import AnalysisSection from '@/components/analysis/common/AnalysisSection';
import MonthlyAmount from './common/MonthlyAmount';
import { TrendingUp } from 'lucide-react';
import { useAnalysisData } from '@/hooks/useAnalysisData';

const IncomeAnalysis = ({ selectedDate }: { selectedDate: Date }) => {
  const { current, prev, totalAmount, diff, isLoading, categoryData } =
    useAnalysisData(selectedDate, 'income');

  return (
    <div className="space-y-4">
      <AnalysisSection
        title="월별 수입"
        icon={<TrendingUp className="text-blue-400" />}
      >
        <MonthlyAmount
          type="income"
          isLoading={isLoading}
          currentCount={current.length}
          prevCount={prev.length}
          totalAmount={totalAmount}
          diff={diff}
        />
      </AnalysisSection>

      <AnalysisSection title="카테고리별 수입">카테고리별 수입</AnalysisSection>
    </div>
  );
};

export default IncomeAnalysis;
