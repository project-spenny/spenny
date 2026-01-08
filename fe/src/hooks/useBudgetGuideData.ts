import { formatLocalDate, formatMonth } from '@/utils/date';

import { fetchTransactionByRange } from '@/services/analysis/analysisService';
import { getCurrentUser } from '@/services/analysis/budgetService';
import { useQuery } from '@tanstack/react-query';

const useBudgetGuideData = (selectedDate: Date) => {
  const { data: rawTransactionData, isLoading } = useQuery({
    queryKey: ['budget-guide', formatMonth(selectedDate)],
    queryFn: async () => {
      // 현재 유저 정보 가져오기
      const user = await getCurrentUser();

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

      // 3게월 전 날짜
      const threeMonthsStart = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() - 3,
        1
      );

      // 서비스 함수 호출 (수입 - 지난 달, 지출 - 최근 3개월)
      const [incomeData, expenseData] = await Promise.all([
        fetchTransactionByRange(
          user.id,
          'income',
          formatLocalDate(prevMonthStart),
          formatLocalDate(prevMonthEnd)
        ),
        fetchTransactionByRange(
          user.id,
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

  // TODO: 월별 그룹화 및 가공 로직 구현

  return { isLoading, rawTransactionData };
};

export default useBudgetGuideData;
