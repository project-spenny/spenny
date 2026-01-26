import { getMonthRange, parseLocalDate } from '@/utils/date';
import type { FixedCostsFilters, IFixedRule } from '@/types/fixed-costs';
import { requireUserServer } from '@/utils/supabase/requireUserServer';
import {
  hasMonthlyOccurrence,
  hasWeeklyOccurrence,
} from '@/utils/fixed-costs/period';

// group_id별 대표 rule 선택
const pickRepresentativeRule = (rules: IFixedRule[]) => {
  // end_date가 null인 규칙 우선
  const open = rules.filter((r) => r.end_date == null);
  const candidates = open.length > 0 ? open : rules;

  // start_date 최신 우선
  // 동률이면 created_at 최신
  return candidates.sort((a, b) => {
    if (a.start_date !== b.start_date)
      return a.start_date < b.start_date ? 1 : -1;

    const ac = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bc = b.created_at ? new Date(b.created_at).getTime() : 0;
    return bc - ac;
  })[0];
};

// 고정비 규칙 목록 조회
export const fetchFixedRulesServer = async (
  filters: FixedCostsFilters = {}
) => {
  const { supabase, user } = await requireUserServer();

  const { data, error } = await supabase
    .from('fixed_rules')
    .select('*')
    .eq('user_id', user.id)
    .order('start_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;

  // 필터링 전 전체 데이터
  let rules = (data ?? []) as IFixedRule[];

  // 필터링 적용
  if (filters.type) {
    rules = rules.filter((r) => r.type === filters.type);
  }
  if (filters.cycle) {
    rules = rules.filter((r) => r.cycle === filters.cycle);
  }
  const rangeStart = parseLocalDate(filters.start_date);
  const rangeEnd = parseLocalDate(filters.end_date);

  if (rangeStart && rangeEnd) {
    rules = rules.filter((rule) => {
      if (rule.cycle === 'MONTHLY') {
        return hasMonthlyOccurrence(rule, rangeStart, rangeEnd);
      }
      if (rule.cycle === 'WEEKLY') {
        return hasWeeklyOccurrence(rule, rangeStart, rangeEnd);
      }
      return false;
    });
  }

  // group_id가 아직 없는 데이터 대비 대표 rule 선택
  const groupMap = new Map<string, IFixedRule[]>();
  for (const r of rules) {
    const key = r.group_id ?? r.id;
    const arr = groupMap.get(key) ?? [];
    arr.push(r);
    groupMap.set(key, arr);
  }

  // group별 대표 rule만 반환
  return [...groupMap.values()].map(pickRepresentativeRule);
};

// 해당 월에 적용되는 고정비 규칙 조회
export const fetchFixedRulesByMonthServer = async (monthDate: Date) => {
  const { supabase, user } = await requireUserServer();

  const { startDate, endDate } = getMonthRange(monthDate);

  const { data, error } = await supabase
    .from('fixed_rules')
    .select('*')
    .eq('user_id', user.id)
    .lte('start_date', endDate)
    .or(`end_date.is.null,end_date.gte.${startDate}`);

  if (error) throw error;
  return (data ?? []) as IFixedRule[];
};
