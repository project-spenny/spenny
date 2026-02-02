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
import { cn } from '@/lib/utils';
import { TransactionList } from '@/components/transaction/TransactionList';
import TransactionClient from '@/app/(app)/history/TransactionClient';
import { TransactionFilters } from '@/app/(app)/history/actions';
import { ScheduledFixedByDateMap } from '@/types/fixed-costs';

type ListFilters = Omit<TransactionFilters, 'startDate' | 'endDate'>;

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
  const [filters, setFilters] = useState<ListFilters>({});
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabValue>(
    () => (searchParams.get('view') as TabValue) || 'list'
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

  const { data, isLoading } = useMonthTransactions({
    month,
    currentMonth,
    initialTransactions,
    initialScheduledFixedByDateMap,
  });

  // 가계부 탭에서 무한스크롤 사용
  const {
    transactions: listTransactions,
    isLoading: infiniteLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteTransactions({ month, filters });

  const dataTransactions = data?.transactions ?? [];
  const scheduledFixedByDateMap = data?.scheduledFixedByDateMap ?? {};

  return (
    <CalendarProvider>
      <TransactionProvider>
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-6 md:px-12">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="bg-brand-subtle dark:bg-brand/10 mx-auto mt-4 flex h-12 w-full max-w-md gap-2 p-2 md:h-14">
              <TabsTrigger
                value="list"
                className={cn(
                  'flex-1 cursor-pointer transition-all md:text-base',
                  'hover:bg-brand/10',
                  'data-[state=active]:font-bold'
                )}
              >
                가계부
              </TabsTrigger>
              <TabsTrigger
                value="calendar"
                className={cn(
                  'flex-1 cursor-pointer transition-all md:text-base',
                  'hover:bg-brand/10',
                  'data-[state=active]:font-bold'
                )}
              >
                캘린더
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar">
              <Calendar
                currentMonth={month}
                transactions={dataTransactions}
                scheduledFixedByDateMap={scheduledFixedByDateMap}
                isLoading={isLoading}
                onMonthChange={setMonth}
              />
            </TabsContent>

            <TabsContent value="list">
              <TransactionList
                transactions={listTransactions}
                isLoading={infiniteLoading}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                month={month}
                onMonthChange={setMonth}
                filters={filters}
                onFiltersChange={setFilters}
              >
                <DailyRecBar daily={dailyRec} dailyChartData={dailyChartData} />
              </TransactionList>
            </TabsContent>
          </Tabs>
          <TransactionClient />
        </div>
      </TransactionProvider>
    </CalendarProvider>
  );
}
