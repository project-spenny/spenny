import { Calendar } from '@/components/calendar/Calendar';
import { getTransaction } from './history/actions';
import { TransactionFilters } from './history/actions';
import { Suspense } from 'react';
import { formatMonth } from '@/utils/date';
import { getMonthRange } from '@/utils/date';
import { CalendarProvider } from '@/context/CalendarContext';
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
    <div>
      <CalendarProvider>
        <Suspense fallback={<div>skeleton</div>}>
          <DataCalendar
            filters={filters}
            currentMonth={currentMonth}
            selectedDate={params.selected_date}
          />
        </Suspense>
      </CalendarProvider>
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
  console.log(transactions);
  console.log(currentMonth);
  console.log(selectedDate);
  return <Calendar 
      currentMonth={currentMonth}
      transactions={transactions}
    />;
}
