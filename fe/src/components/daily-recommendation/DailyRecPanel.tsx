import { DailyRecResult } from '@/services/daily-recommendation/calculate';

type Props = {
  daily: DailyRecResult;
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

  return (
    <div className="flex min-h-full flex-col px-6">
      <div className="scrollbar-hide space-y-6 overflow-y-auto pb-24">
        {/* 요약 카드 */}
        <section className="space-y-2 rounded-xl border p-4">
          <div>
            <p className="text-muted-foreground text-xs">오늘 권장 사용 금액</p>
            <p className="text-2xl font-semibold">
              {amount.toLocaleString()}원
            </p>
          </div>
        </section>

        {/* 이번 달 사용 현황 (가변 예산 기준) */}
        <section className="space-y-3 rounded-xl border p-4">
          <div className="flex items-end justify-between">
            <h3 className="font-medium">이번 달 가변 예산 사용 현황</h3>
            <p className="text-muted-foreground text-xs">어제까지 기준</p>
          </div>

          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            {/* Doughnut */}
            <div className="bg-muted/30 text-muted-foreground flex h-[120px] w-[120px] items-center justify-center rounded-md text-xs">
              Doughnut
            </div>

            <div className="space-y-1">
              <p className="flex justify-between">
                <span className="text-muted-foreground">가변 예산</span>
                <span className="font-medium">
                  {varTotal.toLocaleString()}원
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">사용</span>
                <span className="font-medium">
                  {varSpentUntilYesterday.toLocaleString()}원
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">남음</span>
                <span className="font-medium">
                  {varRemaining.toLocaleString()}원
                </span>
              </p>
            </div>
          </div>
        </section>

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
