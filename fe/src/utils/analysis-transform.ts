import { CategoryAnalysis, TransactionAnalysis } from '@/types/analysis';

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
