import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DailyRecUsageCard } from './DailyRecDoughnut';
import { DailyRecPaceCard } from './DailyRecLine';
import { DailyRecChartData, DailyRecResult } from '@/types/dailyRec';
import {
  getPaceExplanation,
  getPaceStatus,
  getPatternExplanation,
} from '@/services/daily-recommendation/explain';

type Props = {
  daily: DailyRecResult;
  dailyChartData: DailyRecChartData;
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
    weights,
    weightedTotalAmount,
    spentVariableToday,
  } = debug;

  const plannedUntilYesterdayRounded = Math.round(plannedUntilYesterday);
  const adjustPerDayRounded = Math.round(adjustPerDay);
  const diff = Math.round(rawDiff);
  const paceStatus = getPaceStatus(diff);
  const { title, desc } = getPaceExplanation(paceStatus);
  const planned =
    daily.debug.daysInMonth > 0
      ? Math.round(daily.debug.varTotal / daily.debug.daysInMonth)
      : 0;

  const totalAmount = weightedTotalAmount ?? amount;
  const spentToday = spentVariableToday ?? 0;

  const patternMessage = getPatternExplanation(weights);

  return (
    <div className="flex min-h-full flex-col px-6">
      <div className="scrollbar-hide space-y-6 overflow-y-auto pb-24">
        {/* 요약 카드 */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">
                  오늘 남은 권장 사용액
                </p>
                <CardTitle className="text-2xl">
                  {amount.toLocaleString()}원
                </CardTitle>

                <p className="text-muted-foreground text-xs">
                  총 권장액 {totalAmount.toLocaleString()}원에서 오늘 지출{' '}
                  {spentToday.toLocaleString()}원을 뺐어요
                </p>
              </div>

              <Badge variant="outline">{title}</Badge>
            </div>
          </CardHeader>

          <CardContent>
            {/* 가중치(패턴) 근거 */}
            <p className="text-muted-foreground text-xs">{patternMessage}</p>

            {/* 페이스(누적 흐름) 근거 */}
            <p className="text-muted-foreground text-xs">{desc}</p>
          </CardContent>
        </Card>

        {/* 이번 달 사용 현황 (가변 예산 기준) */}
        <DailyRecUsageCard
          varTotal={varTotal}
          varSpentUntilYesterday={varSpentUntilYesterday}
          varRemaining={varRemaining}
        />

        {/* 기준 대비 소비 페이스 */}
        <DailyRecPaceCard
          dailyChartData={dailyChartData}
          planned={planned}
          plannedUntilYesterdayRounded={plannedUntilYesterdayRounded}
          diff={diff}
        />

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
