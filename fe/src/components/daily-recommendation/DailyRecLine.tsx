'use client';

import '@/components/daily-recommendation/chartSetup';
import { Line } from 'react-chartjs-2';
import type { ChartOptions, TooltipItem } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyRecChartData } from '@/types/dailyRec';

type Props = {
  dailyChartData: DailyRecChartData;
  planned: number;
  plannedUntilYesterdayRounded: number;
  diff: number;
};

export const DailyRecPaceCard = ({
  dailyChartData,
  planned,
  plannedUntilYesterdayRounded,
  diff,
}: Props) => {
  const dailyChart = {
    labels: dailyChartData.labels,
    datasets: [
      {
        label: '지출',
        data: dailyChartData.actualDailySeries,
        tension: 0.2,
        borderWidth: 3,
        pointRadius: 2,
        pointHoverRadius: 8,
        pointHitRadius: 50,
        borderColor: '#5C7AFF',
        fill: true,
      },
    ],
  };

  const dailyOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: { display: false },
      annotation: {
        annotations: {
          plannedLine: {
            type: 'line',
            yMin: planned,
            yMax: planned,
            borderColor: '#f43f5e',
            borderWidth: 3,
            label: {
              display: true,
              content: `기준 ${planned.toLocaleString()}원`,
              position: 'center',
              backgroundColor: '#FFFFFF',
              color: '#f43f5e',
              borderWidth: 0,
            },
          },
        },
      },

      tooltip: {
        callbacks: {
          title: (items) => items?.[0]?.label ?? '',
          label: (ctx: TooltipItem<'line'>) => {
            const idx = ctx.dataIndex;
            const actual = dailyChartData.actualDailySeries[idx] ?? 0;
            const diff = actual - planned;

            if (diff > 0) {
              return `${diff.toLocaleString()}원 더 사용`;
            }
            if (diff < 0) {
              return `${Math.abs(diff).toLocaleString()}원 덜 사용`;
            }
            return '차이 없음';
          },
        },
      },
    },
    scales: {
      x: { ticks: { autoSkip: true, maxTicksLimit: 8 } },
      y: {
        ticks: { callback: (v: string | number) => Number(v).toLocaleString() },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-end justify-between">
          <CardTitle className="text-base">기준 대비 소비 페이스</CardTitle>
          <p className="text-muted-foreground text-xs">어제까지 기준</p>
        </div>

        <p className="text-muted-foreground text-xs">
          기준 금액은 이번 달 사용 가능한 금액을 날짜에 따라 균등하게 나눈
          값이에요.
        </p>
      </CardHeader>
      <CardContent>
        {/* Line chart */}
        <div className="h-45">
          <Line data={dailyChart} options={dailyOptions} />
        </div>

        <div className="mt-2 grid grid-cols-[auto_1fr] gap-3 text-sm">
          <div className="p-2">
            <p className="text-muted-foreground">기준 누적</p>
            <p className="font-medium">
              {plannedUntilYesterdayRounded.toLocaleString()}원
            </p>
          </div>

          <div className="p-2">
            <p className="text-muted-foreground">현재 상태</p>
            <p className="font-medium">
              {diff < 0
                ? `기준보다 ${Math.abs(diff).toLocaleString()}원 더 사용했어요.`
                : diff > 0
                  ? `기준보다 ${diff.toLocaleString()}원 덜 사용했어요.`
                  : '기준과 거의 동일해요.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
