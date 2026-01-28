'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar } from './Calendar';
import { CalendarProvider } from '@/context/CalendarContext';
import { TransactionProvider } from '@/app/(app)/history/TransactionContext';
import { DailyRecBar } from '@/components/daily-recommendation/DailyRecBar';
import { useMonthTransactions } from '@/hooks/useMonthTransactions';
import { useInfiniteTransactions } from '@/hooks/useInfiniteTransactions';
import { ITransaction } from '@/types/transactions';
import { DailyRecResult, DailyRecChartData } from '@/types/dailyRec';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TransactionList } from '@/components/transaction/TransactionList';
import TransactionClient from '@/app/(app)/history/TransactionClient';

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
    if (newTab === 'list') {
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

  // 가계부 탭에서 무한스크롤 사용
  const {
    transactions: listTransactions,
    isLoading: infiniteLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteTransactions({ month });

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
              <TabsList className="bg-brand-soft rounded-full">
                <TabsTrigger
                  className="data-[state=active]:bg-brand cursor-pointer rounded-full px-3 text-xs text-white"
                  value="list"
                >
                  가계부
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-brand cursor-pointer rounded-full px-3 text-xs text-white"
                  value="calendar"
                >
                  캘린더
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="calendar">
              <Calendar
                currentMonth={month}
                transactions={transactions || []}
                isLoading={isLoading}
                onMonthChange={setMonth}
              ></Calendar>
            </TabsContent>

            <TabsContent value="list">
              <div>
                <DailyRecBar daily={dailyRec} dailyChartData={dailyChartData} />
              </div>
              <TransactionList
                transactions={listTransactions}
                isLoading={infiniteLoading}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                month={month}
                onMonthChange={setMonth}
              />
              <TransactionClient />
            </TabsContent>
          </Tabs>
        </div>
      </TransactionProvider>
    </CalendarProvider>
  );
}
