import { TransactionAnalysis, TransactionType } from '@/types/analysis';

import { normalizeTransactionCategory } from '@/utils/analysis-transform';
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

  return normalizeTransactionCategory(data);
};
