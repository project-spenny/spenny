'use client';

import '@/components/daily-recommendation/chartSetup';
import { Doughnut } from 'react-chartjs-2';
import type { ChartOptions, TooltipItem } from 'chart.js';
import { CHART_COLORS } from '@/constants/colors';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type Props = {
  varTotal: number;
  varSpentUntilYesterday: number;
  varRemaining: number;
};

export const DailyRecUsageCard = ({
  varTotal,
  varSpentUntilYesterday,
  varRemaining,
}: Props) => {
  const doughnutData = {
    labels: ['지출', '남은 금액'],
    datasets: [
      {
        data: [varSpentUntilYesterday, varRemaining],
        backgroundColor: [CHART_COLORS.TOP_5[4], CHART_COLORS.TOP_5[2]],
      },
    ],
  };

  const doughnutOptions: ChartOptions<'doughnut'> = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => {
            const value = Number(context.raw ?? 0);
            const data = context.dataset.data as number[];
            const total = data.reduce((acc, cur) => acc + Number(cur ?? 0), 0);
            const percent = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${percent}%`;
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-end justify-between">
          <CardTitle className="text-base">이번 달 사용 금액 현황</CardTitle>
          <p className="text-muted-foreground text-xs">어제까지 기준</p>
        </div>
        <CardDescription className="text-xs">
          총 예산에서 고정비를 제외한 금액이에요.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 items-center">
          {/* Doughnut */}
          <div className="h-38 w-38">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>

          <div className="space-y-1">
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                이번 달 사용 가능 금액
              </span>
              <span className="font-medium">{varTotal.toLocaleString()}원</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                어제까지의 지출
              </span>
              <span className="font-medium">
                {varSpentUntilYesterday.toLocaleString()}원
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">남은 금액</span>
              <span className="font-medium">
                {varRemaining.toLocaleString()}원
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
