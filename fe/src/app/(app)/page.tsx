import { Calendar } from '@/components/calendar/Calendar';
import { getTransaction } from './history/actions';
import { TransactionFilters } from './history/actions';
import { Suspense } from 'react';
import { formatLocalDate, formatMonth } from '@/utils/date';
import { getMonthRange } from '@/utils/date';
import { CalendarProvider } from '@/context/CalendarContext';
import { TransactionProvider } from './history/TransactionContext';
import { CalendarSkeleton } from '@/components/calendar/CalendarSkeleton';
import { DailyRecBar } from '@/components/daily-recommendation/DailyRecBar';
import { getTotalBudgetAmount } from '@/utils/budget';
import { fetchBudgetsServer } from '@/services/budgets/budget';
import {
  sumExpenseUntilYesterday,
  sumFixedExpenseUntilYesterday,
} from '@/utils/transaction';
import { fetchFixedRulesByMonthServer } from '@/services/fixed-costs/fixedCostsServer';
import { getFixedPlannedExpenseByMonth } from '@/utils/fixed-costs/fixedCosts';
import { buildDailyRecChartData } from '@/services/daily-recommendation/chart';
import { calculateDailyRec } from '@/services/daily-recommendation/calculate';
import { SpendingTransaction } from '@/services/daily-recommendation/spendingPattern';

interface PageProps {
  searchParams: Promise<{
    month?: string;
    selected_date?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;

  const currentMonth = params.month || formatMonth(new Date());
  const monthDate = new Date(`${currentMonth}-01`);
  const { startDate, endDate } = getMonthRange(monthDate);

  const filters: TransactionFilters = {
    start_date: startDate,
    end_date: endDate,
  };

  return (
    <div className="flex min-h-screen w-full max-w-6xl self-start">
      <TransactionProvider>
        <CalendarProvider>
          <Suspense key={currentMonth} fallback={<CalendarSkeleton />}>
            <DataCalendar
              filters={filters}
              currentMonth={currentMonth}
              selectedDate={params.selected_date}
              monthDate={monthDate}
            />
            {/* <CalendarSkeleton /> */}
          </Suspense>
        </CalendarProvider>
      </TransactionProvider>
    </div>
  );
}

async function DataCalendar({
  filters,
  currentMonth,
  selectedDate,
  monthDate,
}: {
  filters: TransactionFilters;
  currentMonth: string;
  selectedDate?: string;
  monthDate: Date;
}) {
  const [transactions, budgets, fixedRules] = await Promise.all([
    getTransaction(filters, true),
    fetchBudgetsServer(monthDate),
    fetchFixedRulesByMonthServer(monthDate),
  ]);

  const budget = getTotalBudgetAmount(budgets);

  const today = new Date();
  const isCurrentMonth = currentMonth === formatMonth(today);

  const fixedPlannedThisMonth = getFixedPlannedExpenseByMonth(
    fixedRules,
    monthDate
  );
  if (!isCurrentMonth) {
    return (
      <div className="flex w-full flex-col gap-3">
        <Calendar currentMonth={currentMonth} transactions={transactions} />
      </div>
    );
  }

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
      start_date: lookbackStartDateString,
      end_date: lookbackEndDateString,
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
    monthDate,
    transactions,
    today,
    budget,
    fixedPlannedThisMonth,
    spendingTransactions,
  });

  return (
    <div className="flex w-full flex-col gap-3">
      <Calendar currentMonth={currentMonth} transactions={transactions}>
        <DailyRecBar daily={daily} dailyChartData={dailyChartData} />
      </Calendar>
    </div>
  );
}
