import { supabase } from '@/utils/supabase/client';
import type { CreateFixedRuleInput, IFixedRule } from '@/types/fixed-costs';
import { getMonthRange } from '@/utils/date';

export const requireUserId = async () => {
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

// 고정비 항목 수정
export const updateFixedRule = async (
  id: string,
  input: CreateFixedRuleInput
) => {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from('fixed_rules')
    .update(input)
    .eq('id', id)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) throw error;
  return data as IFixedRule;
};

type UpdateFixedThisMonthInput = Pick<
  CreateFixedRuleInput,
  'title' | 'type' | 'amount' | 'category_id'
>;

// 이번 달에 생성된 고정비 거래만 수정
export const updateFixedRuleThisMonth = async (
  fixedRuleId: string,
  input: UpdateFixedThisMonthInput
) => {
  const userId = await requireUserId();
  const { startDate, endDate } = getMonthRange(new Date());

  const { data, error } = await supabase
    .from('transactions')
    .update({
      title: input.title,
      type: input.type,
      amount: input.amount,
      category_id: input.category_id,
    })
    .eq('user_id', userId)
    .eq('fixed_rule_id', fixedRuleId)
    .gte('date', startDate)
    .lte('date', endDate)
    .select('id');

  if (error) throw error;
  return data ?? [];
};

// 해당 월에 적용되는 고정비 규칙 조회
export const fetchFixedRulesByMonth = async (monthDate: Date) => {
  const userId = await requireUserId();
  const { startDate, endDate } = getMonthRange(monthDate);

  const { data, error } = await supabase
    .from('fixed_rules')
    .select('*')
    .eq('user_id', userId)
    .lte('start_date', endDate)
    .or(`end_date.is.null,end_date.gte.${startDate}`);

  if (error) throw error;
  return (data ?? []) as IFixedRule[];
};

export const deleteFixedRule = async (ruleId: string) => {
  const userId = await requireUserId();

  const { error } = await supabase
    .from('fixed_rules')
    .delete()
    .eq('id', ruleId)
    .eq('user_id', userId);

  if (error) throw error;
};
