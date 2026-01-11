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

  weights?: SpendingPatternWeights; // 소비 패턴 기반 가중치 정보
  totalAmountBeforePattern?: number; // 소비 패턴 적용 전 오늘 총 권장액
  weightedTotalAmount?: number; // 오늘 총 권장액
  spentVariableToday?: number; // 오늘 가변 지출
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
  recommendedDailySeries: (number | null)[];
};

// 월 구간 (초/중/말)
export type DaySegment = 'early' | 'mid' | 'late';

// 소비 패턴 가중치 산출에 사용된 근거 데이터
export type SpendingPatternBasis = {
  avgAll: number; // 최근 기간 전체 평균
  avgWeekday: number; // 최근 기간 평일 평균
  avgWeekend: number; // 최근 기간 주말 평균

  avgEarly: number; // 월초(1~7) 평균
  avgMid: number; // 월중(8~23) 평균
  avgLate: number; // 월말(24~말일) 평균

  todayIsWeekend: boolean;
  todaySegment: DaySegment;

  lookbackDays: number; // 통계 계산에 사용한 기간(일)
};

// 소비 패턴 가중치 결과
export type SpendingPatternWeights = {
  dowWeight: number; // 평일/주말 패턴 영향
  segmentWeight: number; // 월초/중/말 패턴 영향
  combinedWeight: number; // 최종 적용 가중치

  basis: SpendingPatternBasis;
};
