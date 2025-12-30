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
    <div className="space-y-4">
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

      <AnalysisSection title="카테고리별 지출">카테고리별 지출</AnalysisSection>
    </div>
  );
};

export default ExpenseAnalysis;
