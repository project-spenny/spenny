import { DailyRecResult } from '@/services/daily-recommendation/calculate';
import {
  ArcElement,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Tooltip,
  TooltipItem,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CHART_COLORS } from '@/constants/colors';

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  daily: DailyRecResult;
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

export const DailyRecPanel = ({ daily }: Props) => {
  const { amount, debug } = daily;
  const {
    varTotal,
    varSpentUntilYesterday,
    varRemaining,
    plannedUntilYesterday,
    diff,
    adjustPerDay,
  } = debug;

  const status = getStatus(diff);
  const { title, desc } = statusText[status];

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

        {/* 계획 vs 실제 누적 */}
        <section className="space-y-3 rounded-xl border p-4">
          <div className="flex items-end justify-between">
            <h3 className="font-medium">계획 대비 소비 페이스</h3>
            <p className="text-muted-foreground text-xs">누적 기준</p>
          </div>

          {/* Line chart */}
          <div className="bg-muted/30 text-muted-foreground flex h-[180px] items-center justify-center rounded-md text-xs">
            Line Chart (계획선 vs 실제선)
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-muted/20 rounded-md p-2">
              <p className="text-muted-foreground">계획(어제까지)</p>
              <p className="font-medium">
                {plannedUntilYesterday.toLocaleString()}원
              </p>
            </div>
            <div className="bg-muted/20 rounded-md p-2">
              <p className="text-muted-foreground">실제(어제까지)</p>
              <p className="font-medium">
                {varSpentUntilYesterday.toLocaleString()}원
              </p>
            </div>
            <div className="bg-muted/20 rounded-md p-2">
              <p className="text-muted-foreground">차이</p>
              <p className="font-medium">
                {Math.abs(diff).toLocaleString()}원{' '}
                {diff < 0 ? '초과' : diff > 0 ? '절약' : ''}
              </p>
            </div>
          </div>
        </section>

        {/* 계산 근거 */}
        <section className="space-y-2 rounded-xl border p-4">
          <h3 className="font-medium">오늘 권장액이 조정된 이유</h3>
          <p className="text-muted-foreground text-xs">
            어제까지의 계획과 실제 차이를 남은 기간에 나눠 하루 권장액을
            조정합니다.
          </p>

          <div className="bg-muted/20 space-y-1 rounded-md p-3 text-xs">
            <p className="flex justify-between">
              <span className="text-muted-foreground">계획 - 실제</span>
              <span className="font-medium">{diff.toLocaleString()}원</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">하루 보정값</span>
              <span className="font-medium">
                {adjustPerDay.toLocaleString()}원
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">보정 후 권장액 기준</span>
              <span className="font-medium">(기본 일일 한도 + 보정값)</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
