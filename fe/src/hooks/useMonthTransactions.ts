'use client';

import { useQuery } from '@tanstack/react-query';
import { getMonthTransactions } from '@/app/(app)/history/actions';
import { ITransaction } from '@/types/transactions';

interface MonthTransactionsProps {
  month: string;
  currentMonth: string;
  initialTransactions?: ITransaction[];
}

export function useMonthTransactions({
  month,
  currentMonth,
  initialTransactions,
}: MonthTransactionsProps) {
  return useQuery({
    queryKey: ['transactions', month],
    queryFn: () => getMonthTransactions(month),
    initialData: month === currentMonth ? initialTransactions : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,   // 30 minutes
  });
}