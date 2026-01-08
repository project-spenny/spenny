import { DailyRecResult } from '@/services/daily-recommendation/calculate';
import {
  ArcElement,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Tooltip,
  TooltipItem,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CHART_COLORS } from '@/constants/colors';
import { DailyRecChartData } from '@/services/daily-recommendation/chart';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  annotationPlugin
);

type Props = {
  daily: DailyRecResult;
  dailyChartData: DailyRecChartData;
};

type PaceStatus = 'ahead' | 'behind' | 'onTrack';

const getStatus = (diff: number): PaceStatus => {
  const epsilon = 1000; // 허용 오차(원)
  if (Math.abs(diff) < epsilon) return 'onTrack';
  return diff < 0 ? 'ahead' : 'behind';
};

const statusText: Record<PaceStatus, { title: string; desc: string }> = {
  ahead: {
    title: '계획보다 빠르게 쓰고 있어요',
    desc: '초과 사용분을 남은 기간에 나눠 오늘 권장액을 낮췄어요.',
  },
  behind: {
    title: '계획보다 여유가 있어요',
    desc: '절약된 금액을 남은 기간에 나눠 오늘 권장액을 높였어요.',
  },
  onTrack: {
    title: '계획대로 진행 중이에요',
    desc: '현재까지 소비 흐름이 계획과 비슷해요.',
  },
};

export const DailyRecPanel = ({ daily, dailyChartData }: Props) => {
  const { amount, debug } = daily;
  const {
    varTotal,
    varSpentUntilYesterday,
    varRemaining,
    plannedUntilYesterday,
    diff: rawDiff,
    adjustPerDay,
    remainingDays,
  } = debug;

  const plannedUntilYesterdayRounded = Math.round(plannedUntilYesterday);
  const adjustPerDayRounded = Math.round(adjustPerDay);
  const diff = Math.round(rawDiff);
  const status = getStatus(diff);
  const { title, desc } = statusText[status];
  const planned =
    daily.debug.daysInMonth > 0
      ? Math.round(daily.debug.varTotal / daily.debug.daysInMonth)
      : 0;

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
    <div className="flex min-h-full flex-col px-6">
      <div className="scrollbar-hide space-y-6 overflow-y-auto pb-24">
        {/* 요약 카드 */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-muted-foreground text-xs">
                  오늘 권장 사용 금액
                </p>
                <CardTitle className="text-2xl">
                  {amount.toLocaleString()}원
                </CardTitle>
              </div>

              <Badge variant="outline">{title}</Badge>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground text-xs">{desc}</p>
          </CardContent>
        </Card>

        {/* 이번 달 사용 현황 (가변 예산 기준) */}
        <Card>
          <CardHeader>
            <div className="flex items-end justify-between">
              <CardTitle className="text-base">
                이번 달 사용 금액 현황
              </CardTitle>
              <p className="text-muted-foreground text-xs">어제까지 기준</p>
            </div>
            <CardDescription className="text-xs">
              총 예산에서 고정비를 제외한 금액이에요.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 items-center">
              {/* Doughnut */}
              <div className="h-[150px] w-[150px]">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>

              <div className="space-y-1">
                <p className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    이번 달 사용 가능 금액
                  </span>
                  <span className="font-medium">
                    {varTotal.toLocaleString()}원
                  </span>
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
                  <span className="text-muted-foreground text-sm">
                    남은 금액
                  </span>
                  <span className="font-medium">
                    {varRemaining.toLocaleString()}원
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 기준 대비 소비 페이스 */}
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
            <div className="h-[180px]">
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

        {/* 권장액 조정 방식 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              오늘 권장액이 달라진 이유
            </CardTitle>
            <CardDescription className="text-xs">
              어제까지의 실제 지출이 기준 누적과 얼마나 달랐는지에 따라, 그
              차이를 남은 기간에 나눠 오늘 권장액에 반영해요.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-2 rounded-md border p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  어제까지 기준 누적
                </span>
                <span className="font-medium">
                  {plannedUntilYesterdayRounded.toLocaleString()}원
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">기준 대비 차이</span>
                <span className="font-medium">{diff.toLocaleString()}원</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">남은 일수</span>
                <span className="font-medium">{remainingDays}일</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">하루 보정값</span>
                <span className="font-medium">
                  {adjustPerDayRounded.toLocaleString()}원
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
