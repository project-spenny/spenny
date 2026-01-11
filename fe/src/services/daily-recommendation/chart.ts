import { DailyRecChartData } from '@/types/dailyRec';
import { ITransaction } from '@/types/transactions';
import {
  isFixedExpense,
  sumExpenseUntilYesterday,
  sumFixedExpenseUntilYesterday,
} from '@/utils/transaction';
import { SpendingTransaction } from './spendingPattern';
import { formatLocalDate, formatMonth, parseLocalDate } from '@/utils/date';
import { calculateDailyRec } from './calculate';

export const buildDailyRecChartData = ({
  monthDate,
  transactions,
  today,
  budget,
  fixedPlannedThisMonth,
  spendingTransactions,
}: {
  monthDate: Date;
  transactions: ITransaction[];
  today: Date;
  budget: number;
  fixedPlannedThisMonth: number;
  spendingTransactions: SpendingTransaction[];
}): DailyRecChartData => {
  const ym = formatMonth(monthDate);
  const daysInMonth = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth() + 1,
    0
  ).getDate();
  const labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}일`);

  const actualDailySeries = Array.from({ length: daysInMonth }, () => 0);
  const recommendedDailySeries: Array<number | null> = Array.from(
    { length: daysInMonth },
    () => null
  );

  // 실제 지출 일별 시리즈
  for (const t of transactions) {
    // 지출만
    if (t.type !== 'expense') continue;

    // 고정비 제외
    if (isFixedExpense(t)) continue;

    // 해당 월만
    if (!t.date || t.date.slice(0, 7) !== ym) continue;

    const day = Number(t.date.slice(8, 10));
    if (!Number.isFinite(day) || day < 1 || day > daysInMonth) continue;

    actualDailySeries[day - 1] += Math.abs(Number(t.amount) || 0);
  }

  // 표시용 반올림
  for (let i = 0; i < actualDailySeries.length; i++) {
    actualDailySeries[i] = Math.round(actualDailySeries[i]);
  }

  // 권장액 일별 시리즈
  const todayStr = formatLocalDate(today);

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${ym}-${String(d).padStart(2, '0')}`;
    if (dateStr > todayStr) continue;

    const dayDate = parseLocalDate(dateStr)!;

    const spentTotalUntilYesterday = sumExpenseUntilYesterday(
      transactions,
      dayDate
    );
    const spentFixedUntilYesterday = sumFixedExpenseUntilYesterday(
      transactions,
      dayDate
    );

    const spendingUntilThatDay = spendingTransactions.filter(
      (st) => st.date <= dateStr
    );

    const rec = calculateDailyRec(
      {
        today: dayDate,
        budget,
        fixedPlannedThisMonth,
        spentTotalUntilYesterday,
        spentFixedUntilYesterday,
      },
      spendingUntilThatDay
    );

    recommendedDailySeries[d - 1] = Math.round(
      rec.debug.weightedTotalAmount ?? 0
    );
  }

  return { labels, actualDailySeries, recommendedDailySeries };
};
