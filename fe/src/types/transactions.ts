export interface ITransaction {
  id: string;
  title: string;
  user_id: string;
  category_id: string;
  type: 'income' | 'expense' | '';
  date: string;
  amount: number;
  fixed_rule_id: string | null;
  memo: string | null;
  created_at: Date;
  updated_at: Date;
  tags: string[];
}
