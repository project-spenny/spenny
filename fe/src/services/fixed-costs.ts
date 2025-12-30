import { supabase } from '@/utils/supabase/client';
import type { IFixedRule } from '@/types/fixed-costs';

const requireUserId = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) throw new Error('로그인이 필요합니다');
  return user.id;
};

export const fetchFixedRules = async () => {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from('fixed_rules')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as IFixedRule[];
};
