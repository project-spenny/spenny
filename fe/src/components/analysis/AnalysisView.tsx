'use client';

import { AnalysisData, TransactionType } from '@/types/analysis';
import { useEffect, useState } from 'react';

import { ANALYSIS_CONFIG } from '@/constants/analysis';
import AnalysisEmpty from '@/components/analysis/common/AnalysisEmpty';
import AnalysisSection from '@/components/analysis/common/AnalysisSection';
import { Button } from '@/components/ui/button';
import CategoryAnalysisList from '@/components/analysis/CategoryAnalysisList';
import CategoryChart from '@/components/analysis/CategoryChart';
import Link from 'next/link';
import { PieChart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getMonthRange } from '@/utils/date';

type AnalysisViewProps = {
  type: TransactionType;
  selectedDate: Date;
  initialData: AnalysisData;
};

const AnalysisView = ({
  type,
  selectedDate,
  initialData,
}: AnalysisViewProps) => {
  const config = ANALYSIS_CONFIG[type];
  const Icon = config.icon;

  const { current, prev, totalAmount, diff, categoryData } = initialData;

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  // 사용자가 달을 옮기면 '가장 많이 쓴 카테고리'부터 보여줌
  useEffect(() => {
    if (categoryData && categoryData.length > 0) {
      setSelectedIndex(0);
    }
  }, [selectedDate]);

  // 선택된 월 기준으로 history 페이지 이동용 URL 생성
  const { startDate, endDate } = getMonthRange(selectedDate);
  const historyParams = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
  }).toString();
  const historyUrl = `/history?${historyParams}`;

  return (
    <div className="animate-in fade-in slide-in-from-top-1 space-y-4 duration-300">
      {current.length === 0 ? (
        // 이번 달 내역(current)이 비어있을 때 Empty 화면
        <AnalysisEmpty
          title={`이번 달 ${config.label}이 없어요!`}
          description={config.emptyDescription}
        >
          <Button asChild>
            <Link href={historyUrl}>기록하러 가기</Link>
          </Button>
        </AnalysisEmpty>
      ) : (
        <>
          <AnalysisSection
            title={`월별 ${config.label}`}
            icon={<Icon className={config.color} />}
          >
            {/* 월별 분석 */}
            <div className="text-lg font-bold">
              총 {config.label}{' '}
              <span className={config.color}>
                {totalAmount.toLocaleString()}
              </span>
              원
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
        </>
      )}
    </div>
  );
};

export default AnalysisView;
