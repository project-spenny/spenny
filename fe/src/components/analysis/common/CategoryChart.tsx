import {
  ActiveElement,
  ArcElement,
  ChartEvent,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Tooltip,
} from 'chart.js';

import { CHART_COLORS } from '@/constants/colors';
import { CategoryAnalysis } from '@/types/analysis';
import { Doughnut } from 'react-chartjs-2';
import { useTheme } from 'next-themes';

// Chart.js에 필요한 요소들을 등록
ChartJS.register(ArcElement, Tooltip, Legend);

type CategoryChartProps = {
  data: CategoryAnalysis[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

const CategoryChart = ({
  data,
  selectedIndex,
  onSelect,
}: CategoryChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: '금액',
        data: data.map((item) => item.amount),
        backgroundColor: data.map((_, i) =>
          i < 5
            ? CHART_COLORS.TOP_5[i]
            : isDark
              ? CHART_COLORS.GRAY.DARK
              : CHART_COLORS.GRAY.LIGHT
        ),
        hoverBackgroundColor: data.map((_, i) =>
          i < 5 ? CHART_COLORS.TOP_5[i] : CHART_COLORS.GRAY.LIGHT
        ),
        borderWidth: data.map((_, i) => (i === selectedIndex ? 2 : 1)),
        borderColor: isDark
          ? CHART_COLORS.BORDER.DARK
          : CHART_COLORS.BORDER.LIGHT,
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
        onSelect(elements[0].index);
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
