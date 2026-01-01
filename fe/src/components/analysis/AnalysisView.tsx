'use client';

import { useEffect, useState } from 'react';

import { ANALYSIS_CONFIG } from '@/constants/analysis';
import AnalysisEmpty from '@/components/analysis/common/AnalysisEmpty';
import AnalysisSection from '@/components/analysis/common/AnalysisSection';
import CategoryAnalysisList from '@/components/analysis/common/CategoryAnalysisList';
import CategoryChart from '@/components/analysis/common/CategoryChart';
import MonthlyAmount from '@/components/analysis/common/MonthlyAmount';
import { PieChart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAnalysisData } from '@/hooks/useAnalysisData';

type AnalysisViewProps = {
  type: 'expense' | 'income';
  selectedDate: Date;
};

const AnalysisView = ({ type, selectedDate }: AnalysisViewProps) => {
  const config = ANALYSIS_CONFIG[type];
  const Icon = config.icon;

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

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="text-muted-foreground flex h-[400px] items-center justify-center">
        데이터를 불러오는 중입니다...
      </div>
    );
  }

  // 이번 달 내역(current)이 비어있으면 전체를 Empty 화면으로 교체
  if (current.length === 0) {
    return (
      <div className="py-20">
        <AnalysisEmpty
          title={`이번 달 ${config.label}이 없어요!`}
          description={config.emptyDescription}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnalysisSection
        title={`월별 ${config.label}`}
        icon={<Icon className={config.color} />}
      >
        <MonthlyAmount
          type={type}
          prevCount={prev.length}
          totalAmount={totalAmount}
          diff={diff}
        />
      </AnalysisSection>

      <AnalysisSection
        title={`카테고리별 ${config.label}`}
        icon={<PieChart className={config.color} />}
      >
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
      </AnalysisSection>
    </div>
  );
};

export default AnalysisView;
