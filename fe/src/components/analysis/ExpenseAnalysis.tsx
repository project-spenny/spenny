import AnalysisSection from '@/components/analysis/common/AnalysisSection';
import MonthlyAmount from './common/MonthlyAmount';
import { TrendingDown } from 'lucide-react';
import { useAnalysisData } from '@/hooks/useAnalysisData';

const ExpenseAnalysis = ({ selectedDate }: { selectedDate: Date }) => {
  const { current, prev, totalAmount, diff, isLoading } = useAnalysisData(
    selectedDate,
    'expense'
  );

  return (
    <AnalysisSection
      title="월별 지출"
      icon={<TrendingDown className="text-red-400" />}
    >
      <div className="px-2 py-4">
        <MonthlyAmount
          type="expense"
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

export default ExpenseAnalysis;
