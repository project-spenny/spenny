import { TransactionType } from '@/types/analysis';
import { supabase } from '@/utils/supabase/client';

// 특정 기간 동안 특정 유저의 거래 내역 조회
export const fetchTransactionByRange = async (
  userId: string,
  type: TransactionType,
  startDate: string,
  endDate: string
) => {
  const { data, error } = await supabase
    .from('transactions')
    .select(
      `
        *,
        categories!category_id (
          name_ko,
          category_key
        )
      `
    )
    .eq('user_id', userId)
    .eq('type', type)
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) throw error;
  return data || [];
};
