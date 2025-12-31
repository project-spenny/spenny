'use client';

import {
  ActiveElement,
  ArcElement,
  ChartEvent,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Tooltip,
} from 'chart.js';
import { useEffect, useState } from 'react';

import { CategoryAnalysis } from '@/types/analysis';
import { Doughnut } from 'react-chartjs-2';
import { useTheme } from 'next-themes';

// Chart.js에 필요한 요소들을 등록
ChartJS.register(ArcElement, Tooltip, Legend);

// 상위 5개 색상
const TOP_COLORS = ['#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#f43f5e'];
// 나머지를 위한 회색
const GRAY_COLOR = '#d4d4d4';

type CategoryChartProps = {
  data: CategoryAnalysis[];
};

const CategoryChart = ({ data }: CategoryChartProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // 데이터가 로드되면 가장 큰 금액을 가진 항목을 기본으로 선택
  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedIndex(0);
    }
  }, [data]);

  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: '금액',
        data: data.map((item) => item.amount),
        backgroundColor: data.map((_, i) =>
          i < 5 ? TOP_COLORS[i] : GRAY_COLOR
        ),
        hoverBackgroundColor: data.map((_, i) =>
          i < 5 ? TOP_COLORS[i] : GRAY_COLOR
        ),
        borderWidth: data.map((_, i) => (i === selectedIndex ? 2 : 1)),
        borderColor: isDark ? '#ffffff' : '#3b3b3b',
        offset: data.map((_, i) => (i === selectedIndex ? 25 : 0)), // 선택된 인덱스만 튀어나오도록
        hoverOffset: 15, // 마우스 올렸을 때 튀어나오는 효과
      },
    ],
  };

  // Chart.js 공식 옵션 타입 적용
  const options: ChartOptions<'doughnut'> = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    // 클릭 시 해당 조각의 인덱스 저장
    onClick: (event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) {
        setSelectedIndex(elements[0].index);
      }
    },
  };

  // 현재 선택된 데이터 정보
  const selectedItem = data[selectedIndex] || data[0];

  return (
    <div className="relative mx-auto flex items-center justify-center">
      <Doughnut data={chartData} options={options} />

      <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
        {selectedItem ? (
          <>
            <span className="text-muted-foreground text-base font-medium">
              {selectedItem.name}
            </span>
            <span className="text-primary animate-in zoom-in text-xl font-bold duration-300">
              {selectedItem.percentage.toFixed(1)}%
            </span>
          </>
        ) : (
          <span className="text-muted-foreground text-sm">데이터 없음</span>
        )}
      </div>
    </div>
  );
};

export default CategoryChart;
