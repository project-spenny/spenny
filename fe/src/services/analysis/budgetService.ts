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

// 예산 데이터 저장 및 수정 (Upsert)
export const upsertBudgets = async (
  date: Date,
  amount: number,
  categoryId: string | null = null
) => {
  const user = await getCurrentUser();
  const { startDate } = getMonthRange(date);

  const { data, error } = await supabase.from('budgets').upsert(
    [
      {
        user_id: user.id,
        budget_month: startDate,
        category_id: categoryId,
        amount: amount,
      },
    ],
    {
      onConflict: 'user_id, budget_month, category_id',
    }
  );

  if (error) throw error;
  return data;
};

// 예산 삭제 (Delete)
export const deleteBudgets = async (
  date: Date,
  categoryId: string | null = null
) => {
  const user = await getCurrentUser();
  const { startDate } = getMonthRange(date);

  let query = supabase
    .from('budgets')
    .delete()
    .eq('user_id', user.id)
    .eq('budget_month', startDate);

  if (categoryId === null) {
    // 총 예산 삭제 시 (null 체크 .is() 사용 )
    query = query.is('category_id', null);
  } else {
    // 특정 카테고리 삭제 시
    query = query.eq('category_id', categoryId);
  }

  const { error } = await query;

  if (error) throw error;
};
