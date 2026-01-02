/**
 * 거래 내역의 타입 (지출 또는 수입)
 */
export type TransactionType = 'expense' | 'income';

/**
 * 카테고리별 통계 분석 데이터 타입
 */
export type CategoryAnalysis = {
  name: string;
  amount: number;
  percentage: number;
};

/**
 * 예산 타입
 */
export type Budget = {
  id: string;
  user_id: string;
  category_id: string | null;
  budget_month: string;
  amount: number;
  created_at: Date;
  updated_at: Date;
};
