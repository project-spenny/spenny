import AnalysisEmpty from './common/AnalysisEmpty';
import AnalysisSection from '@/components/analysis/common/AnalysisSection';
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
            <div className="md: space-y-6 px-2 pt-6">
              {categoryData.map((item) => (
                <div key={item.name} className="group">
                  <div className="flex items-center justify-between">
                    {/* 왼쪽: 차트 색상 매칭 + 이름 + 퍼센트 */}
                    <div className="flex items-center gap-4">
                      {/* TODO: 추후 차트 색생과 매칭 예정 */}
                      <div className="bg-primary/40 group-hover:bg-primary h-4 w-2 rounded-full transition-colors" />

                      <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                        <span className="text-primary/90 text-sm font-medium md:text-base">
                          {item.name}
                        </span>
                        <span className="text-muted-foreground text-xs font-medium md:text-sm">
                          {item.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* 오른쪽: 금액 */}
                    <div className="flex flex-col items-end">
                      <span className="text-primary/90 text-sm md:text-base">
                        {item.amount.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
