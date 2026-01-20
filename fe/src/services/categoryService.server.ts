import { TransactionType } from '@/types/analysis';
import { createClient } from '@/utils/supabase/server';

export const getCategories = async (type?: TransactionType) => {
  const supabase = await createClient();

  let query = supabase.from('categories').select('*');

  if (type) query = query.eq('type', type);

  const { data, error } = await query;

  if (error) throw error;
  return data;
};
