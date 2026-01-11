import type {
  DaySegment,
  SpendingPatternWeights,
  SpendingPatternBasis,
} from '@/types/dailyRec';
import { formatLocalDate, parseLocalDate } from '@/utils/date';

// 소비 패턴 계산에 필요한 최소 지출 데이터
export type SpendingTransaction = {
  date: string;
  amount: number;
};

// 숫자를 [min, max] 범위로 제한
const clampNumber = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

// 주말 여부
const isWeekend = (date: Date) => {
  const dayOfWeek = date.getDay(); // 0:일 ~ 6:토
  return dayOfWeek === 0 || dayOfWeek === 6;
};

// 월 내 날짜 구간 분류
const getDaySegment = (d: Date): DaySegment => {
  const day = d.getDate();
  if (day <= 7) return 'early';
  if (day <= 23) return 'mid';
  return 'late';
};

// 평균 계산 (데이터 부족 시 오류 방지)
const average = (sum: number, count: number) => (count > 0 ? sum / count : 0);

// 통계 단위 : 합계(sum) + 표본 수(count)
type Stat = { sum: number; count: number };

// 소비 패턴 계산에 필요한 통계 묶음
type Stats = {
  all: Stat;
  weekday: Stat;
  weekend: Stat;
  early: Stat;
  mid: Stat;
  late: Stat;
};

// 통계 초기화
const createStats = (): Stats => ({
  all: { sum: 0, count: 0 },
  weekday: { sum: 0, count: 0 },
  weekend: { sum: 0, count: 0 },
  early: { sum: 0, count: 0 },
  mid: { sum: 0, count: 0 },
  late: { sum: 0, count: 0 },
});

const addStat = (stat: Stat, value: number) => {
  stat.sum += value;
  stat.count += 1;
};
const avgStat = (stat: Stat) => average(stat.sum, stat.count);

type SpendingPatternOptions = {
  lookbackDays?: number; // 최근 패턴 계산에 사용할 기간(일)
  weekdayWeekendClamp?: { min: number; max: number }; // 평일/주말 가중치 제한 범위
  segmentClamp?: { min: number; max: number }; // 월초/중/말 가중치 제한 범위
  combinedClamp?: { min: number; max: number }; // 최종 가중치 제한 범위
  combineMix?: { weekdayWeekend: number; segment: number }; // 결합 비율(합=1)
};

const defaultOptions: Required<SpendingPatternOptions> = {
  lookbackDays: 56, // 최근 8주
  weekdayWeekendClamp: { min: 0.85, max: 1.15 },
  segmentClamp: { min: 0.9, max: 1.1 },
  combinedClamp: { min: 0.85, max: 1.15 },
  combineMix: { weekdayWeekend: 0.6, segment: 0.4 },
};

export const calculateSpendingPatternWeights = (
  spendingTransactions: SpendingTransaction[],
  todayDateString: string,
  options?: SpendingPatternOptions
): SpendingPatternWeights => {
  // 옵션 병합 (설정이 없으면 기본값 사용)
  const mergedOptions = { ...defaultOptions, ...options };

  // 기준일 Date
  const todayDate =
    parseLocalDate(todayDateString) ?? new Date(todayDateString);

  // 어제 Date
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);

  // lookback 시작일 Date (어제까지 포함)
  const lookbackStartDate = new Date(yesterdayDate);
  lookbackStartDate.setDate(
    lookbackStartDate.getDate() - (mergedOptions.lookbackDays - 1)
  );

  // 일자별 지출 합계
  const dailySpendByDate = new Map<string, number>(); // 날짜별 총 지출 맵

  for (const transaction of spendingTransactions) {
    const transactionDate = parseLocalDate(transaction.date);
    const transactionAmount = transaction.amount;

    if (!transactionDate) continue;
    if (!Number.isFinite(transactionAmount) || transactionAmount <= 0) continue;

    // 소비 패턴은 어제까지 기준
    if (transactionDate < lookbackStartDate || transactionDate > yesterdayDate)
      continue;

    // 날짜별 합계 키
    const transactionDateKey = formatLocalDate(transactionDate);

    // 날짜별 합계 누적
    const prevDailySpend = dailySpendByDate.get(transactionDateKey) ?? 0; // 기존 합계(없으면 0)
    dailySpendByDate.set(
      transactionDateKey,
      prevDailySpend + transactionAmount
    );
  }

  // 일 단위 합계/일수 집계
  const stats = createStats();

  // lookback 기간 내 해당 날짜의 총 지출을 기준으로 평균 계산
  for (
    let cursorDate = new Date(lookbackStartDate);
    cursorDate <= yesterdayDate;
    cursorDate.setDate(cursorDate.getDate() + 1)
  ) {
    const cursorDateKey = formatLocalDate(cursorDate);
    const currentDaySpend = dailySpendByDate.get(cursorDateKey) ?? 0;

    // 전체
    addStat(stats.all, currentDaySpend);

    // 평일/주말
    if (isWeekend(cursorDate)) {
      addStat(stats.weekend, currentDaySpend);
    } else {
      addStat(stats.weekday, currentDaySpend);
    }

    // 월 내 구간
    const daySegment = getDaySegment(cursorDate);
    if (daySegment === 'early') {
      addStat(stats.early, currentDaySpend);
    } else if (daySegment === 'mid') {
      addStat(stats.mid, currentDaySpend);
    } else {
      addStat(stats.late, currentDaySpend);
    }
  }

  // 평균 계산
  const avgAll = avgStat(stats.all);
  const avgWeekday = avgStat(stats.weekday);
  const avgWeekend = avgStat(stats.weekend);
  const avgEarly = avgStat(stats.early);
  const avgMid = avgStat(stats.mid);
  const avgLate = avgStat(stats.late);

  // 오늘 기준 상태값
  const todayIsWeekend = isWeekend(todayDate);
  const todaySegment = getDaySegment(todayDate);

  // 근거 데이터
  const basis: SpendingPatternBasis = {
    avgAll,
    avgWeekday,
    avgWeekend,
    avgEarly,
    avgMid,
    avgLate,
    todayIsWeekend,
    todaySegment,
    lookbackDays: mergedOptions.lookbackDays,
  };

  // 데이터가 없으면 보정 차단
  if (!Number.isFinite(avgAll) || avgAll <= 0) {
    return {
      dowWeight: 1,
      segmentWeight: 1,
      combinedWeight: 1,
      basis: { ...basis, avgAll: 0 },
    };
  }

  // 요일(평일/주말) 가중치 계산
  const weekdayWeekendWeightRaw = todayIsWeekend
    ? avgWeekend / avgAll
    : avgWeekday / avgAll;

  const dowWeight = clampNumber(
    weekdayWeekendWeightRaw,
    mergedOptions.weekdayWeekendClamp.min,
    mergedOptions.weekdayWeekendClamp.max
  );

  // 월초/중/말 구간 가중치 계산
  const segmentAverage =
    todaySegment === 'early'
      ? avgEarly
      : todaySegment === 'mid'
        ? avgMid
        : avgLate;

  const segmentWeightRaw = segmentAverage > 0 ? segmentAverage / avgAll : 1;
  const segmentWeight = clampNumber(
    segmentWeightRaw,
    mergedOptions.segmentClamp.min,
    mergedOptions.segmentClamp.max
  );

  // 최종 가중치 결합
  const combinedWeightRaw =
    mergedOptions.combineMix.weekdayWeekend * dowWeight +
    mergedOptions.combineMix.segment * segmentWeight;

  const combinedWeight = clampNumber(
    combinedWeightRaw,
    mergedOptions.combinedClamp.min,
    mergedOptions.combinedClamp.max
  );

  return {
    dowWeight,
    segmentWeight,
    combinedWeight,
    basis,
  };
};
