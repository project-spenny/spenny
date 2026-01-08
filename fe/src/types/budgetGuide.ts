export type CategoryGroupId = 'essential' | 'flexible';

export type MonthlySummary = {
  month: string;
  total: number;
  essential: number;
  flexible: number;
};

export type CategoryBase = {
  name: string;
  groupId: CategoryGroupId;
  total: number;
};

export type CategoryStat = CategoryBase & {
  avgAmount: number;
};

export type BudgetGuideData = {
  lastMonthIncome: number; // 전월 총 수입
  monthlyData: MonthlySummary[]; // 월별 지출 추이
  summary: {
    avgTotal: number; // 3개월 총 지출 평균
    groupAverages: Record<CategoryGroupId, number>; // 그룹별 평균
  };
  categoryStats: Record<string, CategoryStat>; // 카테고리 ID별 통계
};
