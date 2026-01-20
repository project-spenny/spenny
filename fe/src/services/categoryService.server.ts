import { TransactionType } from '@/types/analysis';
import { createClient } from '@/utils/supabase/server';

export const getCategories = async (type?: TransactionType) => {
  try {
    const supabase = await createClient();

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
