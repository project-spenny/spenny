import { SupabaseClient } from '@supabase/supabase-js';
import { TransactionType } from '@/types/analysis';

export const getCategories = async (
  supabase: SupabaseClient,
  type?: TransactionType
) => {
  try {
    let query = supabase.from('categories').select('*');

    if (type) query = query.eq('type', type);

    const { data, error } = await query;

    if (error) throw error;

    return data;
  } catch (error) {
    throw new Error(`[getCategories] 카테고리 조회 실패 (type: ${type})`, {
      cause: error,
    });
  }
};
