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
        label: '실제 지출',
        data: dailyChartData.actualDailySeries,
        tension: 0.2,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 8,
        pointHitRadius: 50,
        borderColor: '#f43f5e',
        fill: true,
        spanGaps: false,
      },
      {
        label: '권장 사용액',
        data: dailyChartData.recommendedDailySeries,
        tension: 0.2,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 6,
        pointHitRadius: 50,
        borderColor: '#3b82f6',
        fill: false,
        spanGaps: false,
      },
    ],
  };

  const dailyOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },

    plugins: {
      legend: { display: true },
      annotation: {
        annotations: {
          plannedLine: {
            type: 'line',
            yMin: planned,
            yMax: planned,
            borderColor: '#C6D0E2',
            borderWidth: 2,
            label: {
              display: true,
              content: `기준 ${planned.toLocaleString()}원`,
              position: 'center',
              color: '#C6D0E2',
              borderWidth: 0,
            },
          },
        },
      },

      tooltip: {
        filter: (ctx) => ctx.datasetIndex === 0,
        callbacks: {
          title: (items) => items?.[0]?.label ?? '',
          label: (ctx: TooltipItem<'line'>) => {
            const idx = ctx.dataIndex;
            const actual = dailyChartData.actualDailySeries[idx] ?? 0;
            const rec = dailyChartData.recommendedDailySeries[idx];

            if (rec == null) return ''; // 미래 구간이면 표시 안 함

            const diff = actual - rec;

            if (diff > 0) return `권장보다 ${diff.toLocaleString()}원 더 사용`;
            if (diff < 0)
              return `권장보다 ${Math.abs(diff).toLocaleString()}원 덜 사용`;
            return '권장과 동일';
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
