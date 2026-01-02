'use server';
import { syncByMonthServer } from '@/services/fixed-costs/syncFixedTransactions.server';
import { formatLocalDate } from '@/utils/date';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export interface TransactionFilters {
  type?: 'income' | 'expense';
  category_id?: string;
  start_date?: string;
  end_date?: string;
  searchQuery?: string;
}

export const getTransaction = async (
  filters?: TransactionFilters,
  defaultMonth: boolean = true
) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('No User');

  let startDate = filters?.start_date;
  let endDate = filters?.end_date;

  if ((!startDate || !endDate) && defaultMonth) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    startDate = `${year}-${month}-01`;

    const lastDay = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();
    endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
  }

  // 월별 거래 조회 전에, 해당 월 고정비 거래를 '오늘까지' 선행 생성
  if (startDate && endDate) {
    const monthDate = new Date(`${startDate}T00:00:00`);
    const generateThroughDate = formatLocalDate(new Date());

    await syncByMonthServer({
      monthDate,
      startDate,
      endDate,
      generateThroughDate,
    });
  }

  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (startDate) {
    query = query.gte('date', startDate);
  }
  if (endDate) {
    query = query.lte('date', endDate);
  }
  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  if (filters?.category_id) {
    query = query.eq('category_id', filters.category_id);
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
