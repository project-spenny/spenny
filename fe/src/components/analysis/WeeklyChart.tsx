'use client';

import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';

import { CHART_COLORS } from '@/constants/colors';
import { Line } from 'react-chartjs-2';
import { TransactionAnalysis } from '@/types/analysis';
import { getWeeksInMonth } from '@/utils/date';
import { useMemo } from 'react';
import { useTheme } from 'next-themes';

// Line Chart에 필요한 요소 등록
ChartJS.register(
  CategoryScale, // x
  LinearScale, // y
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

type WeeklyChartProps = {
  transactions: TransactionAnalysis[];
  selectedDate: Date;
  type: string;
};

const WeeklyChart = ({
  transactions,
  selectedDate,
  type,
}: WeeklyChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // 주차별 데이터 가공
  const weeklyData = useMemo(() => {
    const weeks = getWeeksInMonth(selectedDate);

    return weeks.map((week) => {
      const totalAmount = transactions
        .filter((t) => t.date >= week.startDate && t.date <= week.endDate)
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        label: `${week.weekNumber}주차`,
        period: `${week.startDate} ~ ${week.endDate}`,
        amount: totalAmount,
      };
    });
  }, [transactions, selectedDate]);

  // 차트 색상
  const lineColor =
    type === 'expense' ? 'rgb(255, 100, 103)' : 'rgb(81, 162, 255)';
  const fillColor =
    type === 'expense' ? 'rgba(255, 100, 103, 0.3)' : 'rgba(81, 162, 255, 0.3)';

  // 차트 데이터 구성
  const chartData = {
    labels: weeklyData.map((d) => d.label),
    datasets: [
      {
        label: '금액',
        data: weeklyData.map((d) => d.amount),
        borderColor: lineColor, // 선 색상
        backgroundColor: fillColor, // 채워지는 영역 색상
        fill: true, // 영역 채우기 활성화
        tension: 0.4, // 곡선
        pointRadius: 5, // 점 크기
        pointBackgroundColor: lineColor, // 점 색상
        pointBorderWidth: 2,
        pointBorderColor: '#fff', // 점 테두리
        borderWidth: 2, // 선 두께
      },
    ],
  };

  // 차트 옵션 설정
  const options: ChartOptions<'line'> = {
    maintainAspectRatio: false,
    interaction: {
      mode: 'index', // 마우스 올렸을 때 같은 X축 데이터 강조
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            return `${weeklyData[index].label} (${weeklyData[index].period})`;
          },
          label: (context) => ` ${context.raw?.toLocaleString()}원`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: isDark ? '#A1A1AA' : '#52525B',
          font: { size: 12 },
        },
        title: {
          display: true,
          text: '주차별 합계 (월요일~일요일 기준)',
          color: isDark ? CHART_COLORS.GRAY.LIGHT : CHART_COLORS.GRAY.DARK,
          font: { size: 12 },
          padding: { top: 4 },
        },
      },
      y: {
        grid: {
          color: isDark ? '#3b3b3b' : '#dfdfdf',
        },
        ticks: {
          maxTicksLimit: 6,
          color: isDark ? '#A1A1AA' : '#52525B',
          font: { size: 12 },
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="relative h-[250px] w-full md:h-[300px]">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default WeeklyChart;
