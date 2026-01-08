import { ITransaction } from '@/types/transactions';
import { isFixedExpense } from '@/utils/transaction';

export type DailyRecChartData = {
  labels: string[];
  actualDailySeries: number[];
};

export const buildDailyRecChartData = ({
  monthDate,
  transactions,
}: {
  monthDate: Date;
  transactions: ITransaction[];
}): DailyRecChartData => {
  const year = monthDate.getFullYear();
  const month = String(monthDate.getMonth() + 1).padStart(2, '0');
  const ym = `${year}-${month}`;
  const daysInMonth = new Date(year, monthDate.getMonth() + 1, 0).getDate();
  const labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}일`);

  const actualDailySeries = Array.from({ length: daysInMonth }, () => 0);

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

  return { labels, actualDailySeries };
};
