'use client';

import { useState } from 'react';
import { Calendar } from './Calendar';
import { CalendarProvider } from '@/context/CalendarContext';
import { TransactionProvider } from '@/app/(app)/history/TransactionContext';
import { DailyRecBar } from '@/components/daily-recommendation/DailyRecBar';
import { useMonthTransactions } from '@/hooks/useMonthTransactions';
import { ITransaction } from '@/types/transactions';
import { DailyRecResult, DailyRecChartData } from '@/types/dailyRec';
interface CalendarClientProps {
  currentMonth: string;
  initialTransactions: ITransaction[];
  dailyRec: DailyRecResult;
  dailyChartData: DailyRecChartData;
}

export function CalendarClient({
  currentMonth,
  initialTransactions,
  dailyRec,
  dailyChartData,
}: CalendarClientProps) {
  const [month, setMonth] = useState(currentMonth);

  const { data: transactions, isLoading } = useMonthTransactions({
    month,
    currentMonth,
    initialTransactions,
  });

  return (
    <CalendarProvider>
      <TransactionProvider>
        <div className="flex w-full flex-col gap-3">
          <DailyRecBar daily={dailyRec} dailyChartData={dailyChartData} />
          <Calendar
            currentMonth={month}
            transactions={transactions || []}
            isLoading={isLoading}
            onMonthChange={setMonth}
          />
        </div>
      </TransactionProvider>
    </CalendarProvider>
  );
}
