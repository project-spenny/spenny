import type { Budget } from '@/types/analysis';

// 특정 월 총 예산 금액 반환
export const getTotalBudgetAmount = (budgets: Budget[]) => {
  const total = budgets.find((b) => b.category_id === null);
  return total?.amount ?? 0;
};
