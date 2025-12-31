import {
  ArcElement,
  Chart as ChartJS,
  Colors,
  Legend,
  Tooltip,
} from 'chart.js';

import { Doughnut } from 'react-chartjs-2';

// Chart.js에 필요한 요소들을 등록
ChartJS.register(ArcElement, Tooltip, Legend, Colors);

type CategoryChartProps = {
  data: {
    name: string;
    amount: number;
    percentage: number;
  }[];
};

const CategoryChart = ({ data }: CategoryChartProps) => {
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: '금액',
        data: data.map((item) => item.amount),
        borderWidth: 2,
      },
    ],
  };

  return (
    <div>
      <Doughnut data={chartData} />
    </div>
  );
};

export default CategoryChart;
