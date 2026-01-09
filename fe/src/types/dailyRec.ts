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

  baseDaily: number;

  // 누적 소비 흐름 보정
  plannedUntilYesterday: number;
  diff: number;
  adjustPerDay: number;
  adjustedDaily: number;
};

// 일일 권장 사용 금액 계산 결과
export type DailyRecResult = {
  amount: number;
  debug: DailyRecDebug;
};

// 일일 권장 사용 금액 관련 차트 데이터
export type DailyRecChartData = {
  labels: string[];
  actualDailySeries: number[];
};
