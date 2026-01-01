'use client';

import { PieChart, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

import AnalysisEmpty from '@/components/analysis/common/AnalysisEmpty';
import AnalysisSection from '@/components/analysis/common/AnalysisSection';
import CategoryAnalysisList from '@/components/analysis/common/CategoryAnalysisList';
import CategoryChart from '@/components/analysis/common/CategoryChart';
import MonthlyAmount from '@/components/analysis/common/MonthlyAmount';
import { Separator } from '@/components/ui/separator';
import { THEME_COLOR } from '@/constants/colors';
import { useAnalysisData } from '@/hooks/useAnalysisData';

type AnalysisViewProps = {
  type: 'expense' | 'income';
  selectedDate: Date;
};

const AnalysisView = ({ type, selectedDate }: AnalysisViewProps) => {
  const typeLabel = type === 'expense' ? '지출' : '수입';
  const typeColor =
    type === 'expense' ? THEME_COLOR.EXPENSE : THEME_COLOR.INCOME;
  const { current, prev, totalAmount, diff, isLoading, categoryData } =
    useAnalysisData(selectedDate, type);

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
        title={`월별 ${typeLabel}`}
        icon={
          type === 'expense' ? (
            <TrendingDown className={typeColor} />
          ) : (
            <TrendingUp className={typeColor} />
          )
        }
      >
        <MonthlyAmount
          type={type}
          isLoading={isLoading}
          currentCount={current.length}
          prevCount={prev.length}
          totalAmount={totalAmount}
          diff={diff}
        />
      </AnalysisSection>

      <AnalysisSection
        title={`카테고리별 ${typeLabel}`}
        icon={<PieChart className={typeColor} />}
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
            title={`이번 달 ${typeLabel}이 없어요!`}
            description={
              type === 'expense'
                ? `${typeLabel}을 기록하고 소비 습관을 파악해보세요`
                : '월급이나 부수입을 기록해보세요'
            }
          />
        )}
      </AnalysisSection>
    </div>
  );
};

export default AnalysisView;
