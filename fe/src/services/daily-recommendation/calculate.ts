import { getMonthDayStats } from '@/utils/date';

// 일일 권장 사용 금액 계산에 필요한 입력 값
export type DailyRecInput = {
  today: Date;
  budget: number;
  fixedPlannedThisMonth: number; // 이번 달 예정 고정비 합
  spentTotalUntilYesterday: number; // 이번 달 어제까지의 총 지출 합
  spentFixedUntilYesterday: number; // 이번 달 어제까지 고정비로 지출된 금액 합
};

// 디버그용 중간 계산 결과
export type DailyRecDebug = {
  // 날짜 관련
  daysInMonth: number;
  dayOfMonth: number;
  elapsedDays: number;
  remainingDays: number;

  // 가변 예산 흐름
  varTotal: number;
  varSpentUntilYesterday: number;
  varRemaining: number;

  // 계산 단계별 값
  baseDaily: number;
};

export type DailyRecResult = {
  amount: number; // 최종 일일 권장 사용 금액
  debug: DailyRecDebug;
};

// 일일 권장 사용 금액 계산
export const calculateDailyRec = (input: DailyRecInput): DailyRecResult => {
  // 날짜 통계
  const { daysInMonth, dayOfMonth, elapsedDays, remainingDays } =
    getMonthDayStats(input.today);

  // 이번 달 가변 총액
  const varTotal = input.budget - input.fixedPlannedThisMonth;

  // 어제까지 가변 지출
  const varSpentUntilYesterday =
    input.spentTotalUntilYesterday - input.spentFixedUntilYesterday;
  // 남은 가변 예산
  const varRemaining = varTotal - varSpentUntilYesterday;

  // 기본 일일 한도
  const baseDaily = remainingDays > 0 ? varRemaining / remainingDays : 0;
  const amount = Math.floor(Math.min(baseDaily, varRemaining));

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
    },
  };
};
