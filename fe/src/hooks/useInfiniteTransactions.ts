'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import {
  getTransactionsPaginated,
  TransactionFilters,
} from '@/app/(app)/history/actions';

interface UseInfiniteTransactionsProps {
  month: string;
  filters?: Omit<TransactionFilters, 'start_date' | 'end_date'>;
  pageSize?: number;
}

export function useInfiniteTransactions({
  month,
  filters,
  pageSize = 10,
}: UseInfiniteTransactionsProps) {
  // 월 범위 계산
  const getMonthRange = (monthStr: string) => {
    const date = new Date(`${monthStr}-01`);
    const year = date.getFullYear();
    const monthNum = String(date.getMonth() + 1).padStart(2, '0');
    const lastDay = new Date(year, date.getMonth() + 1, 0).getDate();

    return {
      start_date: `${year}-${monthNum}-01`,
      end_date: `${year}-${monthNum}-${String(lastDay).padStart(2, '0')}`,
    };
  };

  const { start_date, end_date } = getMonthRange(month);

  const infiniteQuery = useInfiniteQuery({
    queryKey: ['transactions-infinite', month, filters],
    queryFn: ({ pageParam = 0 }) =>
      getTransactionsPaginated(
        {
          ...filters,
          start_date,
          end_date,
        },
        pageParam,
        pageSize
      ),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const transactions =
    infiniteQuery.data?.pages.flatMap((page) => page.data) ?? [];

  return {
    transactions,
    isLoading: infiniteQuery.isLoading,
    isFetchingNextPage: infiniteQuery.isFetchingNextPage,
    hasNextPage: infiniteQuery.hasNextPage,
    fetchNextPage: infiniteQuery.fetchNextPage,
    refetch: infiniteQuery.refetch,
  };
}
