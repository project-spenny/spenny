'use server';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export interface TransactionFilters {
  type?: 'income' | 'expense';
  category_id?: string;
  start_date?: string;
  end_date?: string;
  searchQuery?: string;
}

export const getTransaction = async (filters?: TransactionFilters) => {
  console.log('📊 Received filters:', filters);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('No User');

  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  if (filters?.category_id) {
    query = query.eq('category_id', filters.category_id);
  }

  if (filters?.start_date) {
    query = query.gte('date', filters.start_date);
  }

  if (filters?.end_date) {
    query = query.lte('date', filters.end_date);
  }

  if (filters?.searchQuery) {
    query = query.ilike('title', `%${filters.searchQuery}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  return data || [];
};

export async function revalidateTransactions() {
  revalidatePath('/history');
}
