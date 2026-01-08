import {
  BudgetGuideData,
  CategoryBase,
  CategoryStat,
  MonthlySummary,
} from '@/types/budgetGuide';
import { formatLocalDate, formatMonth } from '@/utils/date';

import { EXPENSE_CATEGORY_GROUP_MAP } from '@/constants/analysis';
import { fetchTransactionByRange } from '@/services/analysis/analysisService';
import { getCurrentUser } from '@/services/analysis/budgetService';
import { useMemo } from 'react';
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

  // 월별 그룹화 및 가공
  const processedData = useMemo((): BudgetGuideData | null => {
    if (!rawTransactionData) return null;

    const { rawExpenseData, lastMonthIncome } = rawTransactionData;

    // 월별/카테고리별 누적
    const { monthlyMap, categoryMap } = rawExpenseData.reduce<{
      monthlyMap: Record<string, MonthlySummary>;
      categoryMap: Record<string, CategoryBase>;
    }>(
      (acc, item) => {
        const month = item.date.substring(0, 7);
        const categoryKey = item.category?.category_key || 'OTHER_EXPENSE';
        const categoryName = item.category?.name_ko || '기타';
        const groupId = EXPENSE_CATEGORY_GROUP_MAP[categoryKey] || 'flexible';

        // 월별 누적
        acc.monthlyMap[month] = acc.monthlyMap[month] || {
          month,
          total: 0,
          essential: 0,
          flexible: 0,
        };
        acc.monthlyMap[month].total += item.amount;
        acc.monthlyMap[month][groupId] += item.amount;

        // 카테고리별 누적
        acc.categoryMap[categoryKey] = acc.categoryMap[categoryKey] || {
          name: categoryName,
          total: 0,
          groupId,
        };
        acc.categoryMap[categoryKey].total += item.amount;

        return acc;
      },
      { monthlyMap: {}, categoryMap: {} }
    );

    // 통계 계산 (3개월 평균)
    const monthlyData = Object.values(monthlyMap).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
    const activeMonths = monthlyData.length || 1; // 데이터가 있는 달 기준 (최대 3)

    const summary = {
      avgTotal: monthlyData.reduce((sum, m) => sum + m.total, 0) / activeMonths,
      groupAverages: {
        essential:
          monthlyData.reduce((sum, m) => sum + m.essential, 0) / activeMonths,
        flexible:
          monthlyData.reduce((sum, m) => sum + m.flexible, 0) / activeMonths,
      },
    };

    const categoryStats = Object.entries(categoryMap).reduce<
      Record<string, CategoryStat>
    >((acc, [id, data]) => {
      acc[id] = {
        ...data,
        avgAmount: data.total / activeMonths,
      };
      return acc;
    }, {});

    return {
      lastMonthIncome,
      monthlyData,
      summary,
      categoryStats,
    };
  }, [rawTransactionData]);

  return { isLoading, processedData };
};

export default useBudgetGuideData;
