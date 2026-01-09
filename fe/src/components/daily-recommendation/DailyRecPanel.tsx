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
    totalAmountBeforePattern,
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

                <p className="text-muted-foreground text-sm">
                  총 권장액{' '}
                  <span className="text-foreground font-medium">
                    {totalAmount.toLocaleString()}원
                  </span>
                  <span className="text-foreground px-2 font-bold">-</span>오늘
                  지출{' '}
                  <span className="text-foreground font-medium">
                    {spentToday.toLocaleString()}원
                  </span>
                </p>
              </div>

              <Badge variant="outline">{title}</Badge>
            </div>
          </CardHeader>

          <CardContent>
            {/* 가중치(패턴) 근거 */}
            <p className="text-foreground border-primary/40 border-l-2 pl-3 text-sm">
              {patternMessage.message}
            </p>
            {/* 페이스(누적 흐름) 근거 */}
            <p className="text-foreground border-primary/40 border-l-2 pl-3 text-sm">
              {desc}
            </p>
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
              소비 흐름(누적)과 소비 패턴(요일/월초·월말)을 함께 반영해 오늘
              권장액을 계산해요.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* 소비 흐름 보정(페이스) */}
            <div>
              <p className="mb-2 text-xs font-medium">소비 흐름 보정</p>

              <div className="flex flex-col gap-2 rounded-md border p-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    기준 누적(어제까지)
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
            </div>

            {/* 소비 패턴 보정(패턴) */}
            <div>
              <p className="mb-2 text-xs font-medium">소비 패턴 보정</p>

              <div className="flex flex-col gap-2 rounded-md border p-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">반영 기준</span>
                  <span className="font-medium">
                    {patternMessage.reasonLabel ?? '-'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">패턴 보정률</span>
                  <span className="font-medium">
                    {patternMessage.ratePercent > 0
                      ? `+${patternMessage.ratePercent}%`
                      : `${patternMessage.ratePercent}%`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">패턴 영향 금액</span>
                  <span className="font-medium">
                    {(
                      (weightedTotalAmount ?? 0) -
                      (totalAmountBeforePattern ?? 0)
                    ).toLocaleString()}
                    원
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
