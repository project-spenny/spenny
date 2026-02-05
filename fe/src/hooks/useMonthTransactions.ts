'use client';

import { useQuery } from '@tanstack/react-query';
import { getMonthTransactions } from '@/app/(app)/history/actions';
import { ITransaction } from '@/types/transactions';
import { ScheduledFixedByDateMap } from '@/types/fixed-costs';

interface MonthTransactionsProps {
  month: string;
  currentMonth: string;
  initialTransactions?: ITransaction[];
  initialScheduledFixedByDateMap?: ScheduledFixedByDateMap;
}

type MonthTransactionsData = {
  transactions: ITransaction[];
  scheduledFixedByDateMap: ScheduledFixedByDateMap;
};

export function useMonthTransactions({
  month,
  currentMonth,
  initialTransactions,
  initialScheduledFixedByDateMap,
}: MonthTransactionsProps) {
  return useQuery<MonthTransactionsData>({
    queryKey: ['transactions', month],
    queryFn: () => getMonthTransactions(month),
    initialData:
      month === currentMonth
        ? {
            transactions: initialTransactions ?? [],
            scheduledFixedByDateMap: initialScheduledFixedByDateMap ?? {},
          }
        : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
