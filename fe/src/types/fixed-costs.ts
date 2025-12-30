export type FixedCostType = 'income' | 'expense' | '';
export type FixedCostCycle = 'WEEKLY' | 'MONTHLY' | '';

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
  start_date: Date;
  end_date: Date | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
