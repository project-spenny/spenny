'use client';

import { useState } from 'react';
import { Calendar } from './Calendar';
import { CalendarProvider } from '@/context/CalendarContext';
import { TransactionProvider } from '@/app/(app)/history/TransactionContext';
import { DailyRecBar } from '@/components/daily-recommendation/DailyRecBar';
import { useMonthTransactions } from '@/hooks/useMonthTransactions';
import { ITransaction } from '@/types/transactions';

interface CalendarClientProps {
  currentMonth: string;
  initialTransactions: ITransaction[];
  dailyRec: any;
  dailyChartData: any;
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
          {month === currentMonth && (
            <DailyRecBar daily={dailyRec} dailyChartData={dailyChartData} />
          )}
          
          <Calendar
            currentMonth={month}
            transactions={transactions || []}
            // loading state, month setState 추가
          />
        </div>
      </TransactionProvider>
    </CalendarProvider>
  );
}