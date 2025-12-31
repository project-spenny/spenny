import { supabase } from '@/utils/supabase/client';
import type { CreateFixedRuleInput, IFixedRule } from '@/types/fixed-costs';

const requireUserId = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) throw new Error('로그인이 필요합니다');
  return user.id;
};

// 고정비 목록 조회
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

// 고정비 활성화/비활성화 설정
export const setFixedRuleActive = async (id: string, isActive: boolean) => {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from('fixed_rules')
    .update({ is_active: isActive })
    .eq('id', id)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) throw error;
  return data as IFixedRule;
};

// 고정비 항목 생성
export const createFixedRule = async (input: CreateFixedRuleInput) => {
  const userId = await requireUserId();

  const payload = {
    user_id: userId,
    ...input,
  };

  const { data, error } = await supabase
    .from('fixed_rules')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;
  return data as IFixedRule;
};
