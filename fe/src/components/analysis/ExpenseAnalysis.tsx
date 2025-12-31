import AnalysisEmpty from './common/AnalysisEmpty';
import AnalysisSection from '@/components/analysis/common/AnalysisSection';
import MonthlyAmount from './common/MonthlyAmount';
import { TrendingDown } from 'lucide-react';
import { useAnalysisData } from '@/hooks/useAnalysisData';

const ExpenseAnalysis = ({ selectedDate }: { selectedDate: Date }) => {
  const { current, prev, totalAmount, diff, isLoading, categoryData } =
    useAnalysisData(selectedDate, 'expense');

  return (
    <div className="space-y-4">
      <AnalysisSection
        title="월별 지출"
        icon={<TrendingDown className="text-red-400" />}
      >
        <MonthlyAmount
          type="expense"
          isLoading={isLoading}
          currentCount={current.length}
          prevCount={prev.length}
          totalAmount={totalAmount}
          diff={diff}
        />
      </AnalysisSection>

      <AnalysisSection title="카테고리별 지출">
        {isLoading ? (
          <div>데이터 불러오는 중...</div>
        ) : categoryData.length > 0 ? (
          categoryData.map((item) => (
            <div key={item.name}>
              <div className="flex items-center justify-between text-base">
                <span>{item.name}</span>

                <div className="space-x-2">
                  <span>{item.amount.toLocaleString()}원</span>
                  <span>({item.percentage.toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <AnalysisEmpty
            title={`이번 달 지출이 없어요!`}
            description={`지출을 기록하고 소비 습관을 파악해보세요`}
          />
        )}
      </AnalysisSection>
    </div>
  );
};

export default ExpenseAnalysis;
