'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import {
  getTransactionsPaginated,
  TransactionFilters,
} from '@/app/(app)/history/actions';
import { getMonthRange } from '@/utils/date';

interface UseInfiniteTransactionsProps {
  month: string;
  filters?: Omit<TransactionFilters, 'startDate' | 'endDate'>;
  pageSize?: number;
}

export function useInfiniteTransactions({
  month,
  filters,
  pageSize = 10,
}: UseInfiniteTransactionsProps) {
  // 월 범위 계산

  const { startDate, endDate } = getMonthRange(new Date(`${month}-1`));

  const infiniteQuery = useInfiniteQuery({
    queryKey: ['transactions-infinite', month, filters],
    queryFn: ({ pageParam = 0 }) =>
      getTransactionsPaginated(
        {
          ...filters,
          startDate,
          endDate,
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
