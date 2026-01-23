import { supabase } from '@/utils/supabase/client';
import type {
  ApplyScope,
  CreateFixedRuleInput,
  IFixedRule,
} from '@/types/fixed-costs';
import {
  formatLocalDate,
  getMonthRange,
  getWeekRange,
  parseLocalDate,
} from '@/utils/date';

// 고정비 규칙 생성
export const createFixedRule = async (
  userId: string,
  input: CreateFixedRuleInput
) => {
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
  userId: string,
  id: string,
  input: CreateFixedRuleInput
) => {
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

// 고정비 규칙 단건 조회
export const fetchFixedRuleById = async (userId: string, ruleId: string) => {
  const { data, error } = await supabase
    .from('fixed_rules')
    .select('*')
    .eq('id', ruleId)
    .eq('user_id', userId)
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

// cycle 기준 "다음 기간 시작일" 반환
function getNextPeriodStartDate(cycle: IFixedRule['cycle']) {
  const now = new Date();

  if (cycle === 'MONTHLY') {
    return formatLocalDate(new Date(now.getFullYear(), now.getMonth() + 1, 1));
  }

  const { endDate } = getWeekRange(now);
  const end = parseLocalDate(endDate)!;
  end.setDate(end.getDate() + 1);
  return formatLocalDate(end);
}

// 반복 일정(cycle/weekday/monthday) 변경 여부 판단
function hasScheduleChanged(prev: IFixedRule, next: CreateFixedRuleInput) {
  if (prev.cycle !== next.cycle) return true;

  if (next.cycle === 'WEEKLY') return prev.weekday !== next.weekday;
  if (next.cycle === 'MONTHLY') return prev.monthday !== next.monthday;

  return false;
}

// '포함' 옵션일 때, 이번달/이번주에 생성된 고정비 거래를 새 규칙 값으로 동기화
export const updateFixedRuleInPeriod = async ({
  userId,
  fixedRuleId,
  cycle,
  input,
  scope,
}: {
  userId: string;
  fixedRuleId: string;
  cycle: IFixedRule['cycle'];
  input: UpdateFixedRuleInPeriod;
  scope: ApplyScope;
}) => {
  if (scope === 'EXCLUDE_CURRENT') return [];

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
  userId,
  id,
  ruleInput,
  scope,
}: {
  userId: string;
  id: string;
  ruleInput: CreateFixedRuleInput;
  scope: ApplyScope;
}) => {
  // 기존 규칙 조회
  const prevRule = await fetchFixedRuleById(userId, id);
  const scheduleChanged = hasScheduleChanged(prevRule, ruleInput);

  // 포함 : 기존 규칙 업데이트 + 이번 기간 거래 내용 반영
  if (scope === 'INCLUDE_CURRENT') {
    const updatedRule = await updateFixedRule(userId, id, ruleInput);

    await updateFixedRuleInPeriod({
      userId,
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
  }

  // 제외 : 반복 일정 변경 없음
  if (!scheduleChanged) {
    return await updateFixedRule(userId, id, ruleInput);
  }

  // 제외 : 반복 일정 변경 있음
  const { endDate: currentPeriodEnd } = getCurrentPeriod(prevRule.cycle);
  const nextStartDate = getNextPeriodStartDate(prevRule.cycle);

  const prevEndDate =
    prevRule.end_date && prevRule.end_date < currentPeriodEnd
      ? prevRule.end_date
      : currentPeriodEnd;

  // 기존 규칙 종료
  const { error: endDateError } = await supabase
    .from('fixed_rules')
    .update({ end_date: prevEndDate })
    .eq('id', id)
    .eq('user_id', userId);

  if (endDateError) throw endDateError;

  // 새 규칙 생성
  const createdRule = await createFixedRule(userId, {
    ...ruleInput,
    start_date: nextStartDate,
  });

  return createdRule;
};

// 해당 월에 적용되는 고정비 규칙 조회
export const fetchFixedRulesByMonth = async (
  userId: string,
  monthDate: Date
) => {
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

// 고정비 규칙 삭제
export const deleteFixedRule = async (userId: string, ruleId: string) => {
  const { error } = await supabase
    .from('fixed_rules')
    .delete()
    .eq('id', ruleId)
    .eq('user_id', userId);

  if (error) throw error;
};
