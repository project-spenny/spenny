import { DailyRecInput, DailyRecResult } from '@/types/dailyRec';
import {
  calculateSpendingPatternWeights,
  SpendingTransaction,
} from './spendingPattern';
import { calculateBaseDailyRec } from './base';
import { formatLocalDate } from '@/utils/date';

export const calculateDailyRec = (
  input: DailyRecInput,
  spendingTransactions: SpendingTransaction[]
): DailyRecResult => {
  // 누적 흐름 기반 일일 권장액 계산
  const baseResult = calculateBaseDailyRec(input);

  // 가중치 계산을 위한 기준일 문자열
  const todayDateString = formatLocalDate(input.today);

  // 소비 패턴 가중치 계산
  const weights = calculateSpendingPatternWeights(
    spendingTransactions,
    todayDateString
  );

  // 일일 권장액에 가중치 적용
  const weightedAmountRaw = baseResult.amount * weights.combinedWeight;
  const weightedAmount = Math.floor(weightedAmountRaw);

  return {
    amount: weightedAmount,
    debug: {
      ...baseResult.debug,
      weights,
    },
  };
};
