import { CalculatedBudgetItem, CategoryStat } from '@/types/budgetGuide';

// 그룹 내에서 예산 배분 및 자투리 보정 (공통 로직)
const distributeGroupBudget = (
  items: [string, CategoryStat][],
  targetTotal: number,
  totalBudget: number
): CalculatedBudgetItem[] => {
  // 필수/유연 중 한 그룹이 아예 비어있을 때
  if (items.length === 0) return [];

  // 그룹 내 과거 지출 총합 계산
  const groupPastTotal = items.reduce(
    (sum, [_, stat]) => sum + stat.avgAmount,
    0
  );

  // 각 항목별 금액 1차 계산 (내림 처리)
  const calculatedItems = items.map(([id, stat]) => {
    // 그룹 내에서의 비중 계산
    const localWeight =
      groupPastTotal === 0 ? 1 / items.length : stat.avgAmount / groupPastTotal;

    // 목표 금액에 비중을 곱해 금액 산출 (100원 단위 내림)
    const amount = Math.floor((targetTotal * localWeight) / 100) * 100;

    return {
      categoryId: id,
      name: stat.name,
      groupId: stat.groupId,
      amount,
      weight: 0,
    };
  });

  // 자투리 금액 계산 및 보정 (같은 그룹 내에서 비중이 큰 순서대로 100원씩 분배)
  const currentTotal = calculatedItems.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  let gap = targetTotal - currentTotal;

  if (gap > 0 && calculatedItems.length > 0) {
    // 과거 평균 지출액이 큰 순서대로 정렬하여 100원씩 분배
    const sortedIndices = calculatedItems
      .map((item, index) => ({ index, amount: item.amount }))
      .sort((a, b) => b.amount - a.amount); // 금액 큰 순

    let i = 0;
    while (gap > 0 && sortedIndices.length > 0) {
      const targetIndex = sortedIndices[i % sortedIndices.length].index;
      calculatedItems[targetIndex].amount += 100;
      gap -= 100;
      i++;
    }
  }

  // 최종 비중 갱신 및 반환
  return calculatedItems.map((item) => ({
    ...item,
    weight: item.amount / totalBudget,
  }));
};

// 지출 패턴 유지 (Keep Pattern)
export const calculateKeepPatternBudget = (
  spendableBudget: number,
  categoryStats: Record<string, CategoryStat>
): CalculatedBudgetItem[] => {
  const statsArray = Object.entries(categoryStats);
  if (statsArray.length === 0) return [];

  // 전체 데이터 기준, 그룹별 비중 계산
  const totalPastAvg = statsArray.reduce(
    (sum, [_, stat]) => sum + stat.avgAmount,
    0
  );

  // 필수 지출 그룹의 과거 총액
  const essentialPastTotal = statsArray
    .filter(([_, stat]) => stat.groupId !== 'flexible')
    .reduce((sum, [_, stat]) => sum + stat.avgAmount, 0);

  // 필수 지출 비중
  const essentialRatio =
    totalPastAvg === 0 ? 0.5 : essentialPastTotal / totalPastAvg;

  // 그룹별 목표 금액 확정
  const targetEssentialTotal =
    Math.floor((spendableBudget * essentialRatio) / 100) * 100;

  const targetFlexibleTotal = spendableBudget - targetEssentialTotal;

  // 그룹별 배분
  const essentialItems = statsArray.filter(
    ([_, stat]) => stat.groupId !== 'flexible'
  );
  const flexibleItems = statsArray.filter(
    ([_, stat]) => stat.groupId === 'flexible'
  );

  const finalEssential = distributeGroupBudget(
    essentialItems,
    targetEssentialTotal,
    spendableBudget
  );
  const finalFlexible = distributeGroupBudget(
    flexibleItems,
    targetFlexibleTotal,
    spendableBudget
  );

  // 결과 반환
  return [...finalEssential, ...finalFlexible].sort(
    (a, b) => b.amount - a.amount
  );
};

// 유연 지출 조정
export const calculateSaveFlexible = (
  spendableBudget: number,
  categoryStats: Record<string, CategoryStat>,
  maxFlexibleRatio: number
): { items: CalculatedBudgetItem[]; isAdjusted: boolean } => {
  const statsArray = Object.entries(categoryStats);
  if (statsArray.length === 0) return { items: [], isAdjusted: false };

  // 조정 여부 판단
  const totalPastAvg = statsArray.reduce(
    (sum, [_, stat]) => sum + stat.avgAmount,
    0
  );

  const flexiblePastTotal = statsArray
    .filter(([_, stat]) => stat.groupId === 'flexible')
    .reduce((sum, [_, stat]) => sum + stat.avgAmount, 0);

  const currentFlexibleRatio =
    totalPastAvg === 0 ? 0 : flexiblePastTotal / totalPastAvg;
  const isAdjusted = currentFlexibleRatio > maxFlexibleRatio;

  // 그룹별 목표 금액 확정
  let targetEssentialTotal: number;
  let targetFlexibleTotal: number;

  if (isAdjusted) {
    // 조정 필요 시 유연 지출을 제한 비율에 맞춤 (나머지는 필수 지출)
    targetFlexibleTotal =
      Math.floor((spendableBudget * maxFlexibleRatio) / 100) * 100;
    targetEssentialTotal = spendableBudget - targetFlexibleTotal;
  } else {
    // 조정 불필요 시 기존 비율 유지
    const essentialRatio = 1 - currentFlexibleRatio;
    targetEssentialTotal =
      Math.floor((spendableBudget * essentialRatio) / 100) * 100;
    targetFlexibleTotal = spendableBudget - targetEssentialTotal;
  }

  // 그룹별 배분
  const essentialItems = statsArray.filter(
    ([_, stat]) => stat.groupId !== 'flexible'
  );
  const flexibleItems = statsArray.filter(
    ([_, stat]) => stat.groupId === 'flexible'
  );

  const finalEssential = distributeGroupBudget(
    essentialItems,
    targetEssentialTotal,
    spendableBudget
  );
  const finalFlexible = distributeGroupBudget(
    flexibleItems,
    targetFlexibleTotal,
    spendableBudget
  );

  // 결과 반환
  return {
    items: [...finalEssential, ...finalFlexible].sort(
      (a, b) => b.amount - a.amount
    ),
    isAdjusted,
  };
};
