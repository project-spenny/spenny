export type FixedCostType = 'income' | 'expense' | '';
export type FixedCostCycle = 'WEEKLY' | 'MONTHLY' | '';

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
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
};
