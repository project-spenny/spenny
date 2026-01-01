'use client';

import { PieChart, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';

import AnalysisEmpty from './common/AnalysisEmpty';
import AnalysisSection from '@/components/analysis/common/AnalysisSection';
import CategoryAnalysisList from '@/components/analysis/common/CategoryAnalysisList';
import CategoryChart from './common/CategoryChart';
import MonthlyAmount from './common/MonthlyAmount';
import { Separator } from '../ui/separator';
import { THEME_COLOR } from '@/constants/colors';
import { useAnalysisData } from '@/hooks/useAnalysisData';

const ExpenseAnalysis = ({ selectedDate }: { selectedDate: Date }) => {
  const { current, prev, totalAmount, diff, isLoading, categoryData } =
    useAnalysisData(selectedDate, 'expense');

  // 상태 끌어올리기
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // 사용자가 달을 옮기면 '가장 많이 쓴 카테고리'부터 보여줌
  useEffect(() => {
    if (categoryData && categoryData.length > 0) {
      setSelectedIndex(0);
    }
  }, [selectedDate]);

  return (
    <div className="space-y-4">
      <AnalysisSection
        title="월별 지출"
        icon={<TrendingDown className={THEME_COLOR.EXPENSE} />}
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

      <AnalysisSection
        title="카테고리별 지출"
        icon={<PieChart className={THEME_COLOR.EXPENSE} />}
      >
        {isLoading ? (
          <div>데이터 불러오는 중...</div>
        ) : categoryData.length > 0 ? (
          <>
            {/* 카테고리 차트 */}
            <div className="flex items-center justify-center p-4">
              <CategoryChart
                data={categoryData}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
              />
            </div>

            <Separator />

            {/* 카테고리 리스트 */}
            <CategoryAnalysisList
              data={categoryData}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
            />
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
