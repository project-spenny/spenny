'use client';

import { AnalysisData, TransactionType } from '@/types/analysis';
import { formatLocalDate, getMonthRange, getWeeksInMonth } from '@/utils/date';
import { useEffect, useMemo, useState } from 'react';

import { ANALYSIS_CONFIG } from '@/constants/analysis';
import AnalysisEmpty from '@/components/analysis/common/AnalysisEmpty';
import AnalysisSection from '@/components/analysis/common/AnalysisSection';
import { Button } from '@/components/ui/button';
import CategoryAnalysisList from '@/components/analysis/CategoryAnalysisList';
import CategoryChart from '@/components/analysis/CategoryChart';
import Link from 'next/link';
import { PieChart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import WeeklyChart from '@/components/analysis/WeeklyChart';
import WeeklyListCard from '@/components/analysis/WeeklyListCard';

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
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(0);

  // 주차별 데이터 가공
  const weeklyData = useMemo(() => {
    const weeks = getWeeksInMonth(selectedDate);
    const todayStr = formatLocalDate(new Date());

    return weeks.map((week) => {
      const weekTransactions = current.filter(
        (t) => t.date >= week.startDate && t.date <= week.endDate
      );
      const totalAmount = weekTransactions.reduce(
        (sum, t) => sum + t.amount,
        0
      );

      return {
        label: `${week.weekNumber}주차`,
        period: `${week.startDate} ~ ${week.endDate}`,
        amount: totalAmount,
        transactions: weekTransactions.sort((a, b) =>
          a.date.localeCompare(b.date)
        ),
        isCurrentWeek: todayStr >= week.startDate && todayStr <= week.endDate,
      };
    });
  }, [current, selectedDate]);

  // 현재 선택된 주차의 상세 데이터
  const selectedWeekDetail = weeklyData[selectedWeekIndex];

  // 달이 바뀌면 선택 인덱스 초기화
  useEffect(() => {
    if (categoryData && categoryData.length > 0) setSelectedIndex(0);

    // 이번 달이라면 오늘이 포함된 주차, 아니면 1주차
    const currentIndex = weeklyData.findIndex((w) => w.isCurrentWeek);
    setSelectedWeekIndex(currentIndex !== -1 ? currentIndex : 0);
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
            <div className="font-bold md:text-lg">
              총 {config.label}{' '}
              <span className={config.color}>
                {totalAmount.toLocaleString()}
              </span>
              원
            </div>

            <div className="mt-2 text-sm md:text-base">
              {prev.length === 0 ? (
                <p>이전 달 {config.label} 내역이 없어요!</p>
              ) : diff === 0 ? (
                <p>지난 달과 총 {config.label} 금액이 똑같아요!</p>
              ) : (
                <p>
                  지난달보다{' '}
                  <span className="font-semibold">
                    {Math.abs(diff).toLocaleString()}
                  </span>
                  원 {diff > 0 ? config.increaseText : config.decreaseText}
                </p>
              )}
            </div>

            <Separator className="my-6" />

            {/* 주간 차트 */}
            <div className="space-y-4">
              <p className="font-bold md:text-lg">주간 {config.label}</p>

              <WeeklyChart
                data={weeklyData}
                type={type}
                selectedIndex={selectedWeekIndex}
                onSelect={setSelectedWeekIndex}
              />

              {/* 주간 상세 */}
              {selectedWeekIndex !== -1 && selectedWeekDetail && (
                <WeeklyListCard
                  index={selectedWeekIndex}
                  detail={selectedWeekDetail}
                />
              )}
            </div>
          </AnalysisSection>

          <AnalysisSection
            title={`카테고리별 ${config.label}`}
            icon={<PieChart className={config.color} />}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* 카테고리 차트 */}
              <div className="flex items-center justify-center lg:flex-1">
                <CategoryChart
                  data={categoryData}
                  selectedIndex={selectedIndex}
                  onSelect={setSelectedIndex}
                />
              </div>

              <div className="lg:flex-1">
                {/* 카테고리 리스트 */}
                <CategoryAnalysisList
                  data={categoryData}
                  allTransactions={current}
                  selectedIndex={selectedIndex}
                  onSelect={setSelectedIndex}
                />
              </div>
            </div>
          </AnalysisSection>
        </>
      )}
    </div>
  );
};

export default AnalysisView;
