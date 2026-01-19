import { getMonthRange } from '@/utils/date';
import type { IFixedRule } from '@/types/fixed-costs';
import { requireUserServer } from '@/utils/supabase/requireUserServer';

// 해당 월에 적용되는 고정비 규칙 조회 (서버용)
export const fetchFixedRulesByMonthServer = async (monthDate: Date) => {
  const { supabase, user } = await requireUserServer();

  const { startDate, endDate } = getMonthRange(monthDate);

  const { data, error } = await supabase
    .from('fixed_rules')
    .select('*')
    .eq('user_id', user.id)
    .lte('start_date', endDate)
    .or(`end_date.is.null,end_date.gte.${startDate}`);

  if (error) throw error;
  return (data ?? []) as IFixedRule[];
};
