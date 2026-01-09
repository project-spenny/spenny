import { DailyRecInput, DailyRecResult } from '@/types/dailyRec';
import { getMonthDayStats } from '@/utils/date';

// 계산 결과를 항상 0 이상인 유한한 숫자로 보정
const toNonNegative = (n: number) => (Number.isFinite(n) ? Math.max(n, 0) : 0);

// 일일 권장 사용 금액 계산
export const calculateDailyRec = (input: DailyRecInput): DailyRecResult => {
  // 날짜 통계
  const { daysInMonth, dayOfMonth, elapsedDays, remainingDays } =
    getMonthDayStats(input.today);

  // 이번 달 가변 총액
  const varTotal = toNonNegative(input.budget - input.fixedPlannedThisMonth);

  // 어제까지 가변 지출
  const varSpentUntilYesterday = toNonNegative(
    input.spentTotalUntilYesterday - input.spentFixedUntilYesterday
  );

  // 남은 가변 예산
  const varRemaining = toNonNegative(varTotal - varSpentUntilYesterday);

  // 기본 일일 한도
  const baseDaily = remainingDays > 0 ? varRemaining / remainingDays : 0;

  // 계획 기준 어제까지의 가변 지출
  const plannedUntilYesterday =
    daysInMonth > 0 ? (varTotal / daysInMonth) * elapsedDays : 0;

  // 실제 지출과 계획 지출의 차이
  const diff = plannedUntilYesterday - varSpentUntilYesterday;

  // 남은 기간(오늘 포함)에 차이를 분산
  const adjustPerDay = remainingDays > 0 ? diff / remainingDays : 0;

  // 보정된 일일 한도
  const adjustedDaily = baseDaily + adjustPerDay;

  // 최종 일일 권장액
  const amount = Math.floor(
    Math.min(toNonNegative(adjustedDaily), varRemaining)
  );

  return {
    amount,
    debug: {
      daysInMonth,
      dayOfMonth,
      elapsedDays,
      remainingDays,

      varTotal,
      varSpentUntilYesterday,
      varRemaining,

      baseDaily,

      plannedUntilYesterday,
      diff,
      adjustPerDay,
      adjustedDaily,
    },
  };
};
