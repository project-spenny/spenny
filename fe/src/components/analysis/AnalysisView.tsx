'use client';

import { useEffect, useState } from 'react';

import { ANALYSIS_CONFIG } from '@/constants/analysis';
import AnalysisEmpty from '@/components/analysis/common/AnalysisEmpty';
import AnalysisLoading from '@/components/analysis/common/AnalysisLoading';
import AnalysisSection from '@/components/analysis/common/AnalysisSection';
import CategoryAnalysisList from '@/components/analysis/CategoryAnalysisList';
import CategoryChart from '@/components/analysis/CategoryChart';
import { PieChart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { TransactionType } from '@/types/analysis';
import { useAnalysisData } from '@/hooks/useAnalysisData';

type AnalysisViewProps = {
  type: TransactionType;
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
      <div className="py-20">
        <AnalysisLoading />
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
        {/* 월별 분석 */}
        <div className="text-lg font-bold">
          총 {config.label}{' '}
          <span className={config.color}>{totalAmount.toLocaleString()}</span>원
        </div>

        <div className="mt-2 text-base font-medium">
          {prev.length === 0 ? (
            <p>이전 달 {config.label} 내역이 없어요!</p>
          ) : diff === 0 ? (
            <p>지난 달과 총 {config.label} 금액이 똑같아요!</p>
          ) : (
            <p>
              지난달보다 <span>{Math.abs(diff).toLocaleString()}</span>원{' '}
              {diff > 0 ? config.increaseText : config.decreaseText}
            </p>
          )}
        </div>
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
