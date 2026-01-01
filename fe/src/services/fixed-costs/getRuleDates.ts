import { IFixedRule } from '@/types/fixed-costs';
import { formatLocalDate, getMonthRange } from '@/utils/date';

type RuleForCalc = Pick<IFixedRule, 'cycle' | 'weekday' | 'monthday'>;

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
  const { endDate } = getMonthRange(monthDate);
  const lastDay = Number(endDate.slice(8, 10));

  // MONTHLY : 해당 날짜(없으면 말일로 당김) 1개만 반환
  if (rule.cycle === 'MONTHLY') {
    if (!rule.monthday) return [];
    const day = Math.min(rule.monthday, lastDay);
    return [formatLocalDate(new Date(year, monthIndex, day))];
  }

  // WEEKLY : 지정 요일 기준 해당 월의 모든 날짜 반환
  if (rule.cycle === 'WEEKLY') {
    if (!rule.weekday) return [];
    const target = toJsWeekday(rule.weekday);
    const dates: string[] = [];

    for (let d = 1; d <= lastDay; d++) {
      const js = new Date(year, monthIndex, d).getDay();
      if (js === target) {
        dates.push(formatLocalDate(new Date(year, monthIndex, d)));
      }
    }
    return dates;
  }

  return [];
};
