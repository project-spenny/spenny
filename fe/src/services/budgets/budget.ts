import { getMonthRange } from '@/utils/date';
import { createClient } from '@/utils/supabase/server';
import type { Budget } from '@/types/analysis';

export const fetchBudgetsServer = async (date: Date): Promise<Budget[]> => {
  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) throw new Error('로그인이 필요합니다');

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
    .eq('user_id', auth.user.id)
    .eq('budget_month', startDate);

  if (error) throw error;
  return (data ?? []) as Budget[];
};
