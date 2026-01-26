import type { CreateFixedRuleInput, IFixedRule } from '@/types/fixed-costs';
import { formatLocalDate } from '@/utils/date';

type EndDateInput = { end_date?: string | Date | null } | undefined | null;

// 종료된 고정비 규칙인지 판단
export function isEndedFixedRule(target: EndDateInput): boolean {
  if (!target?.end_date) return false;

  const today = formatLocalDate(new Date());

  const endDateStr =
    target.end_date instanceof Date
      ? formatLocalDate(target.end_date)
      : target.end_date;

  return endDateStr < today;
}

// 반복 일정(cycle/weekday/monthday) 변경 여부 판단
export function hasScheduleChanged(
  prev: IFixedRule,
  next: CreateFixedRuleInput
): boolean {
  if (prev.cycle !== next.cycle) return true;

  if (next.cycle === 'WEEKLY') {
    return prev.weekday !== next.weekday;
  }

  if (next.cycle === 'MONTHLY') {
    return prev.monthday !== next.monthday;
  }

  return false;
}

// 현재 기간 기준으로 미래 시작 규칙인지 판단
export function isFutureRuleStart(
  start_date: string,
  currentPeriodEnd: string
): boolean {
  return start_date > currentPeriodEnd;
}
