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
  const weightedTotalAmountRaw = baseResult.amount * weights.combinedWeight;
  const weightedTotalAmount = Math.floor(weightedTotalAmountRaw);

  // 일일 권장액에 오늘 지출 합산
  const spentVariableToday = spendingTransactions.reduce((sum, transaction) => {
    const isToday = transaction.date === todayDateString;
    const amount = transaction.amount;

    if (!isToday) return sum;
    if (!Number.isFinite(amount) || amount <= 0) return sum;

    return sum + amount;
  }, 0);

  // 최종적으로 오늘 남은 권장액
  const remainingAmount = Math.max(weightedTotalAmount - spentVariableToday, 0);

  return {
    amount: remainingAmount,
    debug: {
      ...baseResult.debug,
      weights,
      weightedTotalAmount,
      spentVariableToday,
    },
  };
};
