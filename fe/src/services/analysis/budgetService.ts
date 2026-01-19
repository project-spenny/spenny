import { BudgetWithCategory } from '@/types/analysis';
import { getMonthRange } from '@/utils/date';
import { supabase } from '@/utils/supabase/client';

// 특정 월의 예산 데이터 가져오기 (Read)
export const fetchBudgets = async (userId: string, date: Date) => {
  // 해당 월의 1일
  const { startDate } = getMonthRange(date);

  const { data, error } = await supabase
    .from('budgets')
    .select(
      `id,
      amount,
      budget_month,
      category_id,
      category:categories!category_id (
        name_ko,
        category_key
      )`
    )
    .eq('user_id', userId)
    .eq('budget_month', startDate);

  if (error) throw error;

  // 단일 객체로 정규화
  const normalized: BudgetWithCategory[] = (data ?? []).map((t) => ({
    ...t,
    category: Array.isArray(t.category) // category가 배열인지 검사
      ? (t.category[0] ?? null)
      : (t.category ?? null),
  }));

  return normalized;
};

// 예산 데이터 저장 및 수정 (Upsert)
export const upsertBudget = async (
  userId: string,
  date: Date,
  amount: number,
  categoryId: string | null = null
) => {
  const { startDate } = getMonthRange(date);

  const { data, error } = await supabase.from('budgets').upsert(
    [
      {
        user_id: userId,
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

// 카테고리 예산 일괄 저장 (배열)
export const upsertCategoryBudgets = async (
  userId: string,
  date: Date,
  categoryData: { categoryId: string; amount: number }[]
) => {
  const { startDate } = getMonthRange(date);

  const upsertRows = categoryData.map((item) => ({
    user_id: userId,
    budget_month: startDate,
    category_id: item.categoryId,
    amount: item.amount,
  }));

  const { data, error } = await supabase
    .from('budgets')
    .upsert(upsertRows, { onConflict: 'user_id, budget_month, category_id' });

  if (error) throw error;
  return data;
};

// 예산 삭제 (Delete)
export const deleteBudgets = async (
  userId: string,
  date: Date,
  categoryId: string | string[] | null = null
) => {
  const { startDate } = getMonthRange(date);

  let query = supabase
    .from('budgets')
    .delete()
    .eq('user_id', userId)
    .eq('budget_month', startDate);

  if (categoryId === 'ALL_CATEGORIES') {
    // 카테고리 예산만 삭제 (null이 아닌 것들만 삭제)
    query = query.not('category_id', 'is', null);
  } else if (Array.isArray(categoryId)) {
    // 여러 ID를 한 번에 삭제
    query = query.in('category_id', categoryId);
  } else if (categoryId === null) {
    // 총 예산 삭제 (총 예산 + 카테고리 예산 모두 삭제)
  } else {
    // 특정 카테고리 하나만 삭제
    query = query.eq('category_id', categoryId);
  }

  const { error } = await query;

  if (error) throw error;
};
