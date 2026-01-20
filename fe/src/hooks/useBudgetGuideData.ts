import { formatLocalDate, formatMonth } from '@/utils/date';

import { BudgetGuideData } from '@/types/budgetGuide';
import { fetchTransactionByRange } from '@/services/analysis/analysisService';
import { transformBudgetGuideData } from '@/utils/analysis-transform';
import { useAuth } from '@/providers/AuthProvider';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

const useBudgetGuideData = (selectedDate: Date, targetSaving: number = 0) => {
  const { userId, isLoading: authLoading } = useAuth();

  const { data: rawTransactionData, isLoading } = useQuery({
    queryKey: ['budget-guide', formatMonth(selectedDate)],
    enabled: !authLoading && !!userId,
    queryFn: async () => {
      // 전월 날짜 계산
      const prevMonthStart = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() - 1,
        1
      );
      const prevMonthEnd = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        0
      );
      // 3개월 전 날짜
      const threeMonthsStart = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() - 3,
        1
      );

      // 서비스 함수 호출 (수입 - 지난 달, 지출 - 최근 3개월)
      const [incomeData, expenseData] = await Promise.all([
        fetchTransactionByRange(
          userId!,
          'income',
          formatLocalDate(prevMonthStart),
          formatLocalDate(prevMonthEnd)
        ),
        fetchTransactionByRange(
          userId!,
          'expense',
          formatLocalDate(threeMonthsStart),
          formatLocalDate(prevMonthEnd)
        ),
      ]);

      const lastMonthIncome = incomeData.reduce(
        (sum, item) => sum + item.amount,
        0
      );

      return {
        lastMonthIncome,
        rawExpenseData: expenseData, // 원본 데이터
      };
    },
  });

  // 월별 그룹화 및 가공
  const processedData = useMemo((): BudgetGuideData | null => {
    if (!rawTransactionData) return null;

    const { rawExpenseData, lastMonthIncome } = rawTransactionData;

    return transformBudgetGuideData(
      rawExpenseData,
      lastMonthIncome,
      targetSaving
    );
  }, [rawTransactionData, targetSaving]);

  return { isLoading, processedData };
};

export default useBudgetGuideData;
