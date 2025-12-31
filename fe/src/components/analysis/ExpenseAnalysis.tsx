import AnalysisEmpty from './common/AnalysisEmpty';
import AnalysisSection from '@/components/analysis/common/AnalysisSection';
import CategoryAnalysisList from '@/components/analysis/common/CategoryAnalysisList';
import CategoryChart from './common/CategoryChart';
import MonthlyAmount from './common/MonthlyAmount';
import { Separator } from '../ui/separator';
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
          <>
            {/* 카테고리 차트 */}
            <div className="flex items-center justify-center p-4">
              <CategoryChart data={categoryData} />
            </div>

            <Separator />

            {/* 카테고리 리스트 */}
            <CategoryAnalysisList data={categoryData} />
          </>
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
