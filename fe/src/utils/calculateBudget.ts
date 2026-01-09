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

// 유연 지출 절감형/강력 절약형 공통 예산 산출 함수
export const calculateSaveFlexible = (
  spendableBudget: number,
  categoryStats: Record<string, CategoryStat>,
  maxFlexibleRatio: number
): { items: CalculatedBudgetItem[]; isAdjusted: boolean } => {
  if (Object.keys(categoryStats).length === 0)
    return { items: [], isAdjusted: false };

  // 과거 비중으로 먼저 계산
  const distributedItems = getBasicDraft(spendableBudget, categoryStats);

  // 현재 유연 지출(flexible) 그룹의 총 비중 계산
  const currentFlexibleTotal = distributedItems
    .filter((item) => item.groupId === 'flexible')
    .reduce((sum, item) => sum + item.amount, 0);

  const currentFlexibleRatio = currentFlexibleTotal / spendableBudget;

  // 조정이 필요한지 확인 (상한선보다 클 때만 조정)
  const isAdjusted = currentFlexibleRatio > maxFlexibleRatio;

  if (!isAdjusted) {
    // 조정이 필요 없으면 원본에 차액만 보정해서 반환
    return {
      items: fillGap(distributedItems, spendableBudget),
      isAdjusted: false,
    };
  }

  // 조정 로직: 유연 지출을 상한선 금액으로 강제 고정
  const targetFlexibleTotal = spendableBudget * maxFlexibleRatio;
  const targetEssentialTotal = spendableBudget - targetFlexibleTotal;

  // 그룹별 내에서 다시 비중 재배분
  const adjustedItems = distributedItems.map((item) => {
    if (item.groupId === 'flexible') {
      // 유연 그룹 내에서의 상대적 비중 계산
      const groupWeight = item.amount / currentFlexibleTotal;

      return {
        ...item,
        amount: Math.floor((targetFlexibleTotal * groupWeight) / 100) * 100,
      };
    } else {
      // 필수/고정 그룹 합산 (essential)
      const currentEssentialTotal = spendableBudget - currentFlexibleTotal;
      const groupWeight = item.amount / currentEssentialTotal;

      return {
        ...item,
        amount: Math.floor((targetEssentialTotal * groupWeight) / 100) * 100,
      };
    }
  });

  // 자투리 보정 및 반환
  return {
    items: fillGap(adjustedItems, spendableBudget),
    isAdjusted: true,
  };
};
