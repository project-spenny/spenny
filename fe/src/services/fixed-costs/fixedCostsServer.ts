import { getMonthRange } from '@/utils/date';
import type { IFixedRule } from '@/types/fixed-costs';
import { createClient } from '@/utils/supabase/server';

// 해당 월에 적용되는 고정비 규칙 조회 (서버용)
export const fetchFixedRulesByMonthServer = async (monthDate: Date) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) throw new Error('로그인이 필요합니다');

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
