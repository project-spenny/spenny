import { CalculatedBudgetItem, CategoryStat } from '@/types/budgetGuide';

// 기본 비중 배분 함수
const getBasicDraft = (
  spendableBudget: number,
  categoryStats: Record<string, CategoryStat>
): CalculatedBudgetItem[] => {
  const statsArray = Object.entries(categoryStats);
  // 과거 지출 총합 (가중치 계산용)
  const totalPastAvg = statsArray.reduce(
    (sum, [_, stat]) => sum + stat.avgAmount,
    0
  );

  // 과거 데이터가 없는 경우 균등 배분
  if (totalPastAvg === 0) {
    const count = statsArray.length;
    const equalAmount = Math.floor(spendableBudget / count / 100) * 100;

    return statsArray.map(([id, stat]) => ({
      categoryId: id,
      name: stat.name,
      groupId: stat.groupId,
      amount: equalAmount,
      weight: 1 / count,
    }));
  }

  // 비중대로 배분 및 100원 단위 절삭
  return statsArray.map(([id, stat]) => {
    const weight = stat.avgAmount / totalPastAvg; // 비중(가중치) 계산
    const rawAmount = spendableBudget * weight; // 가중치 적용
    const amount = Math.floor(rawAmount / 100) * 100; // 100원 단위 절삭

    return {
      categoryId: id,
      name: stat.name,
      groupId: stat.groupId,
      amount,
      weight,
    };
  });
};

// 자투리 금액 보정 함수 (총액 맞추기)
const fillGap = (
  items: CalculatedBudgetItem[],
  targetTotal: number
): CalculatedBudgetItem[] => {
  const currentTotal = items.reduce((sum, item) => sum + item.amount, 0);
  const gap = targetTotal - currentTotal;

  if (gap <= 0) return items;

  // 가장 비중이 큰 항목에 차액 합산
  const topItem = items.reduce((prev, curr) =>
    prev.amount > curr.amount ? prev : curr
  );
  topItem.amount += gap;

  return items;
};

// 지출 패턴 유지 예산 산출
export const calculateKeepPatternBudget = (
  spendableBudget: number,
  categoryStats: Record<string, CategoryStat>
): CalculatedBudgetItem[] => {
  if (Object.keys(categoryStats).length === 0) return [];

  // 비중대로 나누기
  const distributedItems = getBasicDraft(spendableBudget, categoryStats);

  // 자투리 금액 보정하여 최종 반환
  return fillGap(distributedItems, spendableBudget);
};
