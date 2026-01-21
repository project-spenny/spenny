import {
  BudgetWithCategory,
  CategoryAnalysis,
  TransactionAnalysis,
} from '@/types/analysis';
import {
  CategoryBase,
  CategoryStat,
  MonthlySummary,
} from '@/types/budgetGuide';

import { EXPENSE_CATEGORY_GROUP_MAP } from '@/constants/analysis';

/* 데이터 정규화 */
// 카테고리 필드가 배열 혹은 객체일 수 있음
type CategoryField = {
  category:
    | { name_ko: string; category_key: string }
    | { name_ko: string; category_key: string }[]
    | null;
};

// 예산 데이터용 정규화
export const normalizeBudgetCategory = (
  data: (Omit<BudgetWithCategory, 'category'> & CategoryField)[]
): BudgetWithCategory[] => {
  return data.map((item) => ({
    ...item,
    category: Array.isArray(item.category)
      ? (item.category[0] ?? null)
      : (item.category ?? null),
  })) as BudgetWithCategory[];
};

// 거래 데이터용 정규화
export const normalizeTransactionCategory = (
  data: (Omit<TransactionAnalysis, 'category'> & CategoryField)[]
): TransactionAnalysis[] => {
  return data.map((item) => ({
    ...item,
    category: Array.isArray(item.category)
      ? (item.category[0] ?? null)
      : (item.category ?? null),
  })) as TransactionAnalysis[];
};

/* 데이터 가공 */
export type TransformAnalysisResult = {
  totalAmount: number;
  prevAmount: number;
  diff: number;
  categoryData: CategoryAnalysis[];
  categoryTotalsByKey: Record<string, number>;
};

// 분석 데이터 가공 로직
export const transformAnalysisData = (
  current: TransactionAnalysis[],
  prev: TransactionAnalysis[]
): TransformAnalysisResult => {
  // 현재/이전 달 총액 계산
  const currentTotal = current.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );
  const lastTotal = prev.reduce((sum, item) => sum + (item.amount || 0), 0);

  // 카테고리별 그룹화
  const totalsByKey: Record<string, number> = {};
  const grouped: Record<string, number> = {};

  current.forEach((item) => {
    const categoryName = item.category?.name_ko || '기타';
    const categoryKey = item.category?.category_key;

    grouped[categoryName] = (grouped[categoryName] || 0) + (item.amount || 0);

    if (categoryKey) {
      totalsByKey[categoryKey] =
        (totalsByKey[categoryKey] || 0) + (item.amount || 0);
    }
  });

  // 배열 변환 및 정렬, 비율 계산
  const sortedCategoryData: CategoryAnalysis[] = Object.entries(grouped)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: currentTotal > 0 ? (amount / currentTotal) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    totalAmount: currentTotal,
    prevAmount: lastTotal,
    diff: currentTotal - lastTotal,
    categoryData: sortedCategoryData,
    categoryTotalsByKey: totalsByKey,
  };
};

// 예산 추천 가이드를 위한 최근 거래 데이터 가공 로직
export const transformBudgetGuideData = (
  rawExpenseData: TransactionAnalysis[],
  lastMonthIncome: number,
  targetSaving: number
) => {
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

  // 가용 예산 = (Income - Saving)
  const spendableBudget = lastMonthIncome - targetSaving;

  return {
    lastMonthIncome,
    targetSaving,
    spendableBudget,
    monthlyData,
    summary,
    categoryStats,
  };
};
