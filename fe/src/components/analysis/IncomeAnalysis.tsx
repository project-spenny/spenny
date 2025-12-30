import AnalysisSection from '@/components/analysis/common/AnalysisSection';
import MonthlyAmount from './common/MonthlyAmount';
import { TrendingUp } from 'lucide-react';
import { useAnalysisData } from '@/hooks/useAnalysisData';

const IncomeAnalysis = ({ selectedDate }: { selectedDate: Date }) => {
  const { current, prev, totalAmount, diff, isLoading } = useAnalysisData(
    selectedDate,
    'income'
  );

  return (
    <AnalysisSection
      title="월별 수입"
      icon={<TrendingUp className="text-blue-400" />}
    >
      <div className="px-2 py-4">
        <MonthlyAmount
          type="income"
          isLoading={isLoading}
          currentCount={current.length}
          prevCount={prev.length}
          totalAmount={totalAmount}
          diff={diff}
        />
      </div>
    </AnalysisSection>
  );
};

export default IncomeAnalysis;
