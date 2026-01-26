export type FixedCostType = 'income' | 'expense' | '';
export type FixedCostCycle = 'WEEKLY' | 'MONTHLY' | '';
export type ApplyScope = 'INCLUDE_CURRENT' | 'EXCLUDE_CURRENT';

// 고정비 테이블 항목 타입
export interface IFixedRule {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category_id: string;
  cycle: 'WEEKLY' | 'MONTHLY';
  weekday: number | null;
  monthday: number | null;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  group_id: string;
}

// 고정비 항목 생성에 필요한 입력 타입
export type CreateFixedRuleInput = {
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category_id: string;

  cycle: 'WEEKLY' | 'MONTHLY';
  weekday: number | null;
  monthday: number | null;

  start_date: string;
  end_date: string | null;

  group_id?: string;
};

// 고정비 규칙으로부터 생성되는 거래 insert 타입
export type FixedTransactionInsert = {
  user_id: string;
  fixed_rule_id: string;
  date: string;
  origin_date?: string;
  title: string;
  type: 'income' | 'expense';
  amount: number;
  category_id: string;
};

// 고정비 규칙 필터링 타입
export type FixedCostsFilters = {
  type?: 'income' | 'expense';
};
