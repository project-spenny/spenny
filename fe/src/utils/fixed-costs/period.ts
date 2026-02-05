import type { IFixedRule } from '@/types/fixed-costs';
import {
  formatLocalDate,
  getMonthRange,
  getWeekRange,
  parseLocalDate,
} from '@/utils/date';

// cycle 기준으로 "이번 기간"의 날짜 범위를 반환
export function getCurrentPeriod(cycle: IFixedRule['cycle']) {
  return cycle === 'MONTHLY'
    ? getMonthRange(new Date()) // 이번달 범위
    : getWeekRange(new Date()); // 이번주 범위
}

// cycle 기준 "다음 기간 시작일" 반환
export function getNextPeriodStartDate(cycle: IFixedRule['cycle']) {
  const now = new Date();

  if (cycle === 'MONTHLY') {
    return formatLocalDate(new Date(now.getFullYear(), now.getMonth() + 1, 1));
  }

  const { endDate } = getWeekRange(now);
  const end = parseLocalDate(endDate)!;
  end.setDate(end.getDate() + 1);
  return formatLocalDate(end);
}

// 특정 날짜의 고정비 규칙 활성 여부 확인
export const isRuleActiveOn = (rule: IFixedRule, date: Date): boolean => {
  const ruleStart = parseLocalDate(rule.start_date)!;
  const ruleEnd = rule.end_date ? parseLocalDate(rule.end_date)! : null;

  if (date < ruleStart) return false;
  if (ruleEnd && date > ruleEnd) return false;

  return true;
};

// 특정 기간 내에 월간 규칙이 발생하는지 확인
export const hasMonthlyOccurrence = (
  rule: IFixedRule,
  rangeStart: Date,
  rangeEnd: Date
): boolean => {
  if (!rule.monthday) return false;

  // rangeStart가 속한 달부터 rangeEnd가 속한 달까지 월 단위 순회
  let cursor = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1);
  const endMonth = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), 1);

  while (cursor <= endMonth) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    // monthday가 실제로 존재하는 날짜일 때만 발생 가능
    if (rule.monthday <= lastDayOfMonth) {
      const occurrenceDate = new Date(year, month, rule.monthday);

      if (
        occurrenceDate >= rangeStart &&
        occurrenceDate <= rangeEnd &&
        isRuleActiveOn(rule, occurrenceDate)
      ) {
        return true;
      }
    }

    // 다음 달로 이동
    cursor = new Date(year, month + 1, 1);
  }

  return false;
};

// 특정 기간 내에 주간 규칙이 발생하는지 확인
export const hasWeeklyOccurrence = (
  rule: IFixedRule,
  rangeStart: Date,
  rangeEnd: Date
): boolean => {
  if (rule.weekday == null) return false;

  const startWeekday = rangeStart.getDay();
  const diff = (rule.weekday - startWeekday + 7) % 7;

  const firstOccurrence = new Date(rangeStart);
  firstOccurrence.setDate(rangeStart.getDate() + diff);

  if (firstOccurrence > rangeEnd) return false;

  return isRuleActiveOn(rule, firstOccurrence);
};
