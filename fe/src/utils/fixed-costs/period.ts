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
