import { formatLocalDate, formatMonth } from '@/utils/date';
import { getMonthTransactions, getTransaction } from './history/actions';
import {
  sumExpenseUntilYesterday,
  sumFixedExpenseUntilYesterday,
} from '@/utils/transaction';

import { CalendarClient } from '@/components/calendar/CalendarClient';
import { CalendarSkeleton } from '@/components/calendar/CalendarSkeleton';
import { DailyRecBar } from '@/components/daily-recommendation/DailyRecBar';
import { SpendingTransaction } from '@/services/daily-recommendation/spendingPattern';
import { Suspense } from 'react';
import { buildDailyRecChartData } from '@/services/daily-recommendation/chart';
import { calculateDailyRec } from '@/services/daily-recommendation/calculate';
import { fetchBudgetsServer } from '@/services/budgets/budget';
import { fetchFixedRulesByMonthServer } from '@/services/fixed-costs/fixedCostsServer';
import { getFixedPlannedExpenseByMonth } from '@/utils/fixed-costs/fixedCosts';
import { getTotalBudgetAmount } from '@/utils/budget';

export default async function Home() {
  const today = new Date();
  const currentMonth = formatMonth(today);

  return (
    <div className="flex w-full max-w-6xl self-start">
      <Suspense fallback={<CalendarSkeleton />}>
        <InitialDataLoader currentMonth={currentMonth} />
      </Suspense>
    </div>
  );
}

async function InitialDataLoader({ currentMonth }: { currentMonth: string }) {
  const today = new Date();
  const currentMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);

  // 당월 데이터 fetch
  const [{ transactions, scheduledFixedByDateMap }, budgets, fixedRules] =
    await Promise.all([
      getMonthTransactions(currentMonth),
      fetchBudgetsServer(currentMonthDate),
      fetchFixedRulesByMonthServer(currentMonthDate),
    ]);

  const budget = getTotalBudgetAmount(budgets);
  const fixedPlannedThisMonth = getFixedPlannedExpenseByMonth(
    fixedRules,
    currentMonthDate
  );

  // 소비패턴
  const lookbackDays = 56;
  const lookbackEndDateString = formatLocalDate(today);
  const lookbackStartDate = new Date(today);
  lookbackStartDate.setDate(lookbackStartDate.getDate() - (lookbackDays - 1));
  const lookbackStartDateString = formatLocalDate(lookbackStartDate);

  // 어제까지 월 누적 지출 계산
  const spentTotalUntilYesterday = sumExpenseUntilYesterday(
    transactions,
    today
  );
  const spentFixedUntilYesterday = sumFixedExpenseUntilYesterday(
    transactions,
    today
  );

  // 최근 N일 거래 (소비 패턴 가중치 계산용)
  const patternTransactions = await getTransaction(
    {
      startDate: lookbackStartDateString,
      endDate: lookbackEndDateString,
    },
    true
  );

  // 소비 패턴 가중치 계산에 사용할 지출 데이터
  const spendingTransactions: SpendingTransaction[] = patternTransactions
    .filter((transaction) => {
      if (transaction.type !== 'expense') return false;
      if (transaction.fixed_rule_id !== null) return false;
      if (!Number.isFinite(transaction.amount) || transaction.amount <= 0)
        return false;
      return true;
    })
    .map((transaction) => ({
      date: transaction.date,
      amount: transaction.amount,
    }));

  const daily = calculateDailyRec(
    {
      today,
      budget,
      fixedPlannedThisMonth,
      spentTotalUntilYesterday,
      spentFixedUntilYesterday,
    },
    spendingTransactions
  );

  const dailyChartData = buildDailyRecChartData({
    monthDate: currentMonthDate,
    transactions,
    today,
    budget,
    fixedPlannedThisMonth,
    spendingTransactions,
  });

  return (
    <CalendarClient
      currentMonth={currentMonth}
      initialTransactions={transactions}
      initialScheduledFixedByDateMap={scheduledFixedByDateMap}
      dailyRec={daily}
      dailyChartData={dailyChartData}
    />
  );
}
