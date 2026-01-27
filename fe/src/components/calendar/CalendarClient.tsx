'use client';

import { useState } from 'react';
import { Calendar } from './Calendar';
import { CalendarProvider } from '@/context/CalendarContext';
import { TransactionProvider } from '@/app/(app)/history/TransactionContext';
import { DailyRecBar } from '@/components/daily-recommendation/DailyRecBar';
import { useMonthTransactions } from '@/hooks/useMonthTransactions';
import { ITransaction } from '@/types/transactions';
import { DailyRecResult, DailyRecChartData } from '@/types/dailyRec';
import { ScheduledFixedByDateMap } from '@/types/fixed-costs';
interface CalendarClientProps {
  currentMonth: string;
  initialTransactions: ITransaction[];
  initialScheduledFixedByDateMap: ScheduledFixedByDateMap;
  dailyRec: DailyRecResult;
  dailyChartData: DailyRecChartData;
}

export function CalendarClient({
  currentMonth,
  initialTransactions,
  initialScheduledFixedByDateMap,
  dailyRec,
  dailyChartData,
}: CalendarClientProps) {
  const [month, setMonth] = useState(currentMonth);

  const { data, isLoading } = useMonthTransactions({
    month,
    currentMonth,
    initialTransactions,
    initialScheduledFixedByDateMap,
  });

  const transactions = data?.transactions ?? [];
  const scheduledFixedByDateMap = data?.scheduledFixedByDateMap ?? {};

  return (
    <CalendarProvider>
      <TransactionProvider>
        <div className="flex w-full flex-col gap-3">
          <Calendar
            currentMonth={month}
            transactions={transactions}
            scheduledFixedByDateMap={scheduledFixedByDateMap}
            isLoading={isLoading}
            onMonthChange={setMonth}
          >
            <DailyRecBar daily={dailyRec} dailyChartData={dailyChartData} />
          </Calendar>
        </div>
      </TransactionProvider>
    </CalendarProvider>
  );
}
