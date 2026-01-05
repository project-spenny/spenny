import { supabase } from '@/utils/supabase/client';
import type {
  ApplyScope,
  CreateFixedRuleInput,
  IFixedRule,
} from '@/types/fixed-costs';
import { getMonthRange, getWeekRange } from '@/utils/date';

export const requireUserId = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) throw new Error('로그인이 필요합니다');
  return user.id;
};

// 고정비 규칙 목록 조회
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

// 고정비 규칙 생성
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

// 고정비 규칙 수정
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

type UpdateFixedRuleInPeriod = Pick<
  CreateFixedRuleInput,
  'title' | 'type' | 'amount' | 'category_id'
>;

// cycle 기준으로 "이번 기간"의 날짜 범위를 반환
function getCurrentPeriod(cycle: IFixedRule['cycle']) {
  return cycle === 'MONTHLY'
    ? getMonthRange(new Date()) // 이번달 범위
    : getWeekRange(new Date()); // 이번주 범위
}

// '포함' 옵션일 때, 이번달/이번주에 생성된 고정비 거래를 새 규칙 값으로 동기화
export const updateFixedRuleInPeriod = async ({
  fixedRuleId,
  cycle,
  input,
  scope,
}: {
  fixedRuleId: string;
  cycle: IFixedRule['cycle'];
  input: UpdateFixedRuleInPeriod;
  scope: ApplyScope;
}) => {
  if (scope === 'EXCLUDE_CURRENT') return [];

  const userId = await requireUserId();
  const { startDate, endDate } = getCurrentPeriod(cycle);

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

// 고정비 규칙 수정 + 적용 범위에 따른 거래 동기화 처리
export const updateFixedRuleWithScope = async ({
  id,
  ruleInput,
  scope,
}: {
  id: string;
  ruleInput: CreateFixedRuleInput;
  scope: ApplyScope;
}) => {
  // 규칙 row 업데이트
  const updatedRule = await updateFixedRule(id, ruleInput);

  // 포함이면 이번 기간 거래 업데이트
  await updateFixedRuleInPeriod({
    fixedRuleId: id,
    cycle: updatedRule.cycle,
    input: {
      title: updatedRule.title,
      type: updatedRule.type,
      amount: updatedRule.amount,
      category_id: updatedRule.category_id,
    },
    scope,
  });

  return updatedRule;
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

// 고정비 항목 삭제
export const deleteFixedRule = async (ruleId: string) => {
  const userId = await requireUserId();

  const { error } = await supabase
    .from('fixed_rules')
    .delete()
    .eq('id', ruleId)
    .eq('user_id', userId);

  if (error) throw error;
};
