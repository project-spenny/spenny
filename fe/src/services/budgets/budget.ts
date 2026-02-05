import { getMonthRange } from '@/utils/date';
import type { Budget } from '@/types/analysis';
import { requireUserServer } from '@/utils/supabase/requireUserServer';

export const fetchBudgetsServer = async (date: Date): Promise<Budget[]> => {
  const { supabase, user } = await requireUserServer();

  const { startDate } = getMonthRange(date);

  const { data, error } = await supabase
    .from('budgets')
    .select(
      `*, 
       categories!category_id (
         name_ko,
         category_key
       )`
    )
    .eq('user_id', user.id)
    .eq('budget_month', startDate);

  if (error) throw error;
  return (data ?? []) as Budget[];
};
