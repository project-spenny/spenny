'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar } from './Calendar';
import { CalendarProvider } from '@/context/CalendarContext';
import { TransactionProvider } from '@/app/(app)/history/TransactionContext';
import { DailyRecBar } from '@/components/daily-recommendation/DailyRecBar';
import { useMonthTransactions } from '@/hooks/useMonthTransactions';
import { ITransaction } from '@/types/transactions';
import { DailyRecResult, DailyRecChartData } from '@/types/dailyRec';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TransactionList } from '@/components/transaction/TransactionList';

type TabValue = 'calendar' | 'list';

// 현재 URL에서 탭 값을 읽어오기
const getTabFromUrl = (): TabValue => {
  if (typeof window === 'undefined') return 'calendar';
  const params = new URLSearchParams(window.location.search);
  return (params.get('view') as TabValue) || 'calendar';
};

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
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabValue>(
    () => (searchParams.get('view') as TabValue) || 'calendar'
  );

  // 동기화
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getTabFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // window.history.pushState로 URL 변경하여 탭 변경
  const handleTabChange = (value: string) => {
    const newTab = value as TabValue;
    setActiveTab(newTab);

    const params = new URLSearchParams(window.location.search);
    if (newTab === 'calendar') {
      params.delete('view');
    } else {
      params.set('view', newTab);
    }
    const query = params.toString();
    window.history.pushState(
      null,
      '',
      query ? `?${query}` : window.location.pathname
    );
  };

  const { data: transactions, isLoading } = useMonthTransactions({
    month,
    currentMonth,
    initialTransactions,
  });

  return (
    <CalendarProvider>
      <TransactionProvider>
        <div className="m-3 flex w-full flex-col gap-3">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="flex justify-center px-4">
              <TabsList className="bg-brand rounded-full">
                <TabsTrigger
                  className="cursor-pointer rounded-full px-3 text-xs"
                  value="calendar"
                >
                  캘린더
                </TabsTrigger>
                <TabsTrigger
                  className="cursor-pointer rounded-full px-3 text-xs active:bg-red-400"
                  value="list"
                >
                  리스트
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="calendar">
              <Calendar
                currentMonth={month}
                transactions={transactions || []}
                isLoading={isLoading}
                onMonthChange={setMonth}
              >
                <DailyRecBar daily={dailyRec} dailyChartData={dailyChartData} />
              </Calendar>
            </TabsContent>

            <TabsContent value="list">
              <TransactionList transactions={transactions || []} compact />
            </TabsContent>
          </Tabs>
        </div>
      </TransactionProvider>
    </CalendarProvider>
  );
}
