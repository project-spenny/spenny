import { Calendar } from '@/components/calendar/Calendar';
import { getTransaction } from './history/actions';
import { TransactionFilters } from './history/actions';
import { Suspense } from 'react';
import { formatMonth } from '@/utils/date';
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
import { calculateDailyRec } from '@/services/daily-recommendation/calculate';

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

  const budgets = await fetchBudgetsServer(monthDate);
  const budget = getTotalBudgetAmount(budgets);

  return (
    <div className="flex min-h-[900px] w-full max-w-6xl self-start">
      <TransactionProvider>
        <CalendarProvider>
          <Suspense fallback={<CalendarSkeleton />}>
            <DataCalendar
              filters={filters}
              currentMonth={currentMonth}
              selectedDate={params.selected_date}
              budget={budget}
            />
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
  budget,
}: {
  filters: TransactionFilters;
  currentMonth: string;
  selectedDate?: string;
  budget: number;
}) {
  const transactions = await getTransaction(filters, true);
  const today = new Date();

  const spentTotalUntilYesterday = sumExpenseUntilYesterday(
    transactions,
    today
  );
  const spentFixedUntilYesterday = sumFixedExpenseUntilYesterday(
    transactions,
    today
  );

  const fixedPlannedThisMonth = 0;

  const daily = calculateDailyRec({
    today,
    budget,
    fixedPlannedThisMonth,
    spentTotalUntilYesterday,
    spentFixedUntilYesterday,
  });

  const amount = daily.amount;
  const varRemaining = daily.debug.varRemaining;
  const remainingDays = daily.debug.remainingDays;

  return (
    <div className="flex w-full flex-col gap-3">
      <DailyRecBar
        amount={amount}
        varRemaining={varRemaining}
        remainingDays={remainingDays}
        budget={budget}
      />

      <Calendar currentMonth={currentMonth} transactions={transactions} />
    </div>
  );
}
