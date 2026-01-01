import type { IFixedRule } from '@/types/fixed-costs';
import { getFixedRuleDates } from './getRuleDates';
import { supabase } from '@/utils/supabase/client';
import { fetchActiveFixedRulesByMonth, requireUserId } from './fixed-costs';
import { getMonthRange } from '@/utils/date';

const getRuleDatesMap = (rules: IFixedRule[], monthDate: Date) => {
  const map = new Map<string, string[]>();
  for (const rule of rules) {
    const dates = getFixedRuleDates(rule, monthDate);
    if (dates.length > 0) map.set(rule.id, dates);
  }
  return map;
};

const fetchExistingKeys = async ({
  userId,
  ruleIds,
  startDate,
  endDate,
}: {
  userId: string;
  ruleIds: string[];
  startDate: string;
  endDate: string;
}) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('fixed_rule_id, date')
    .eq('user_id', userId)
    .in('fixed_rule_id', ruleIds)
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) throw error;
  return new Set((data ?? []).map((t) => `${t.fixed_rule_id}__${t.date}`));
};

const buildMissingInserts = ({
  userId,
  rules,
  ruleDatesMap,
  existingSet,
}: {
  userId: string;
  rules: IFixedRule[];
  ruleDatesMap: Map<string, string[]>;
  existingSet: Set<string>;
}) => {
  const inserts: Array<{
    user_id: string;
    fixed_rule_id: string;
    date: string;
    title: string;
    type: 'income' | 'expense';
    amount: number;
    category_id: string;
  }> = [];

  for (const rule of rules) {
    const dates = ruleDatesMap.get(rule.id);
    if (!dates) continue;

    for (const date of dates) {
      const key = `${rule.id}__${date}`;
      if (existingSet.has(key)) continue;

      inserts.push({
        user_id: userId,
        fixed_rule_id: rule.id,
        date,
        title: rule.title,
        type: rule.type,
        amount: rule.amount,
        category_id: rule.category_id,
      });
    }
  }

  return inserts;
};

export const syncByMonth = async (monthDate: Date) => {
  const userId = await requireUserId();
  const { startDate, endDate } = getMonthRange(monthDate);

  // 해당 월에 유효한 고정비 규칙 조회
  const rules = await fetchActiveFixedRulesByMonth(monthDate);
  if (rules.length === 0) return { createdCount: 0 };

  // 규칙별 월 발생 날짜 계산
  const ruleDatesMap = getRuleDatesMap(rules, monthDate);
  const ruleIds = [...ruleDatesMap.keys()];
  if (ruleIds.length === 0) return { createdCount: 0 };

  // 이미 생성된 거래 조회
  const existingSet = await fetchExistingKeys({
    userId,
    ruleIds,
    startDate,
    endDate,
  });

  // 누락된 날짜만 insert payload 생성
  const inserts = buildMissingInserts({
    userId,
    rules,
    ruleDatesMap,
    existingSet,
  });

  // 누락이 없으면 종료
  if (inserts.length === 0) return { createdCount: 0 };

  // 누락만 생성
  const { error } = await supabase.from('transactions').insert(inserts);
  if (error) throw error;

  return { createdCount: inserts.length };
};
