import { getMonthRange } from '@/utils/date';
import { supabase } from '@/utils/supabase/client';

// 현재 로그인한 유저 정보 가져오기
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!user || error) throw new Error('로그인이 필요합니다');
  return user;
};

// 특정 월의 예산 데이터 가져오기 (Read)
export const fetchBudgets = async (date: Date) => {
  const user = await getCurrentUser();

  // 해당 월의 1일
  const { startDate } = getMonthRange(date);

  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', user.id)
    .eq('budget_month', startDate);

  if (error) throw error;
  return data;
};
