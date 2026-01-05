import { Calendar } from '@/components/calendar/Calendar';
import { getTransaction } from './history/actions';
import { TransactionFilters } from './history/actions';
import { Suspense } from 'react';
import { formatMonth } from '@/utils/date';
import { getMonthRange } from '@/utils/date';
import { CalendarProvider } from '@/context/CalendarContext';
import { TransactionProvider } from './history/TransactionContext';
import { CalendarSkeleton } from '@/components/calendar/CalendarSkeleton';
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
    <div className="flex w-full max-w-6xl">
      <TransactionProvider>
        <CalendarProvider>
          <Suspense fallback={<CalendarSkeleton />}>
            <DataCalendar
              filters={filters}
              currentMonth={currentMonth}
              selectedDate={params.selected_date}
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
}: {
  filters: TransactionFilters;
  currentMonth: string;
  selectedDate?: string;
}) {
  const transactions = await getTransaction(filters, true);
  return <Calendar currentMonth={currentMonth} transactions={transactions} />;
}
