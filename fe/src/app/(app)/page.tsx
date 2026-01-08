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
import { fetchFixedRulesByMonthServer } from '@/services/fixed-costs/fixedCostsServer';
import { getFixedPlannedExpenseByMonth } from '@/utils/fixed-costs';

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

  const fixedRules = await fetchFixedRulesByMonthServer(monthDate);
  const fixedPlannedThisMonth = getFixedPlannedExpenseByMonth(
    fixedRules,
    monthDate
  );

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
              fixedPlannedThisMonth={fixedPlannedThisMonth}
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
  fixedPlannedThisMonth,
}: {
  filters: TransactionFilters;
  currentMonth: string;
  selectedDate?: string;
  budget: number;
  fixedPlannedThisMonth: number;
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

  const daily = calculateDailyRec({
    today,
    budget,
    fixedPlannedThisMonth,
    spentTotalUntilYesterday,
    spentFixedUntilYesterday,
  });

  return (
    <div className="flex w-full flex-col gap-3">
      <DailyRecBar daily={daily} budget={budget} />
      <Calendar currentMonth={currentMonth} transactions={transactions} />
    </div>
  );
}
