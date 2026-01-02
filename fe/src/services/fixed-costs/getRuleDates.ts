import { IFixedRule } from '@/types/fixed-costs';
import { formatLocalDate, getMonthRange } from '@/utils/date';

type RuleForCalc = Pick<
  IFixedRule,
  'cycle' | 'weekday' | 'monthday' | 'start_date' | 'end_date'
>;

const toJsWeekday = (weekday: number) => {
  // rule.weekday: 1~7 (월~일)
  // Date.getDay(): 0~6 (일~토)
  return weekday % 7;
};

// 월별 고정비 발생 날짜 계산
export const getFixedRuleDates = (
  rule: RuleForCalc,
  monthDate: Date
): string[] => {
  const year = monthDate.getFullYear();
  const monthIndex = monthDate.getMonth();
  const { startDate: monthStart, endDate: monthEnd } = getMonthRange(monthDate);
  const lastDay = Number(monthEnd.slice(8, 10));

  // 해당 월에서 유효한 날짜 범위
  const minDate = rule.start_date > monthStart ? rule.start_date : monthStart;
  const maxDate =
    rule.end_date && rule.end_date < monthEnd ? rule.end_date : monthEnd;

  // MONTHLY : 해당 날짜(없으면 말일로 당김) 1개만 반환
  if (rule.cycle === 'MONTHLY') {
    if (!rule.monthday) return [];
    const day = Math.min(rule.monthday, lastDay);
    const date = formatLocalDate(new Date(year, monthIndex, day));

    if (date < minDate || date > maxDate) return [];
    return [date];
  }

  // WEEKLY : 지정 요일 기준 해당 월의 모든 날짜 반환
  if (rule.cycle === 'WEEKLY') {
    if (!rule.weekday) return [];
    const target = toJsWeekday(rule.weekday);
    const dates: string[] = [];

    for (let d = 1; d <= lastDay; d++) {
      const js = new Date(year, monthIndex, d).getDay();
      if (js !== target) continue;

      const date = formatLocalDate(new Date(year, monthIndex, d));

      if (date < minDate || date > maxDate) continue;
      dates.push(date);
    }
    return dates;
  }

  return [];
};
