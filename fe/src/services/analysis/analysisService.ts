import { TransactionAnalysis, TransactionType } from '@/types/analysis';

import { supabase } from '@/utils/supabase/client';

// 특정 기간 동안 특정 유저의 거래 내역 조회
export const fetchTransactionByRange = async (
  userId: string,
  type: TransactionType,
  startDate: string,
  endDate: string
): Promise<TransactionAnalysis[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select(
      `
        amount,
        date,
        type,
        category_id,
        category:categories!category_id (
          name_ko,
          category_key
        )
      `
    )
    .eq('user_id', userId)
    .eq('type', type)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) throw error;

  // 단일 객체로 정규화
  const normalized: TransactionAnalysis[] = (data ?? []).map((t) => ({
    ...t,
    category: Array.isArray(t.category) // category가 배열인지 검사
      ? (t.category[0] ?? null)
      : (t.category ?? null),
  }));

  return normalized;
};
