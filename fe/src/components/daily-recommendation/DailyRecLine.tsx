'use client';

import '@/components/daily-recommendation/chartSetup';
import { Line } from 'react-chartjs-2';
import type { ChartOptions, TooltipItem, Chart as ChartJS } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyRecChartData } from '@/types/dailyRec';
import { useRef, useState } from 'react';

type Props = {
  dailyChartData: DailyRecChartData;
  planned: number;
};

export const DailyRecPaceCard = ({ dailyChartData, planned }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(() => {
    return new Date().getDate() - 1;
  });
  const chartRef = useRef<ChartJS<'line'>>(null);

  const handleChartClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const chart = chartRef.current;
    if (!chart) return;

    const elements = chart.getElementsAtEventForMode(
      event.nativeEvent,
      'index',
      { intersect: false },
      true
    );

    if (!elements.length) return;
    setSelectedIndex(elements[0].index);
  };

  const label = dailyChartData.labels[selectedIndex] ?? '';
  const rec = dailyChartData.recommendedDailySeries[selectedIndex] ?? 0;
  const actual = dailyChartData.actualDailySeries[selectedIndex] ?? 0;
  const diffToRec = actual - rec;

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
            borderColor: '#94a3b8',
            borderWidth: 2,
            label: {
              display: true,
              content: `기준 ${planned.toLocaleString()}원`,
              position: 'end',
              backgroundColor: 'rgba(255,255,255,0.8)',
              color: '#94a3b8',
              padding: 4,
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

            if (diff > 0) return `+ ${diff.toLocaleString()}원`;
            if (diff < 0) return `- ${Math.abs(diff).toLocaleString()}원`;
            return '동일';
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
          <Line
            ref={chartRef}
            data={dailyChart}
            options={dailyOptions}
            onClick={handleChartClick}
          />
        </div>

        <div className="mt-3 space-y-2 rounded-md border p-3 text-sm">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-medium">{label}</span>

            <span className="text-muted-foreground text-xs">권장</span>
            <span className="font-medium">{rec.toLocaleString()}원</span>

            <span className="text-muted-foreground text-xs">지출</span>
            <span className="font-medium">{actual.toLocaleString()}원</span>
          </div>

          {/* 권장 대비 문장 */}
          <p className="text-sm font-medium">
            {rec === 0 && actual === 0 ? (
              '해당 날짜의 지출 데이터가 없어요.'
            ) : diffToRec > 0 ? (
              <span className="text-red-500">
                권장보다 {diffToRec.toLocaleString()}원 더 사용했어요.
              </span>
            ) : diffToRec < 0 ? (
              <span className="text-blue-600">
                권장보다 {Math.abs(diffToRec).toLocaleString()}원 덜 사용했어요.
              </span>
            ) : (
              <span className="text-foreground">
                권장과 동일하게 사용했어요.
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
