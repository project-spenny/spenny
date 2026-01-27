import { IFixedCostFormData } from '@/hooks/useFixedCostForm';
import { ApplyScope, IFixedRule } from '@/types/fixed-costs';
import { parseLocalDate } from '../date';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  addWeeks,
} from 'date-fns';
import { getFixedRuleDates } from '@/services/fixed-costs/getRuleDates';

const WEEKDAY_LABEL: Record<number, string> = {
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토',
  7: '일',
};

export const formatFixedRuleCycle = (rule: {
  cycle: 'WEEKLY' | 'MONTHLY';
  weekday: number | null;
  monthday: number | null;
}) => {
  if (rule.cycle === 'WEEKLY' && rule.weekday) {
    return `매주 ${WEEKDAY_LABEL[rule.weekday]}요일`;
  }

  if (rule.cycle === 'MONTHLY' && rule.monthday) {
    return `매달 ${rule.monthday}일`;
  }

  return '';
};

// 고정비 테이블 값을 고정비 폼 초기값으로 변환
export const mapFixedRuleToFormData = (
  rule: IFixedRule
): Partial<IFixedCostFormData> => ({
  title: rule.title ?? '',
  type: rule.type,
  amount: String(rule.amount),
  category_id: rule.category_id,

  cycle: rule.cycle,
  weekday: rule.weekday ?? null,
  monthday: rule.monthday ?? null,

  start_date: parseLocalDate(rule.start_date),
  end_date: rule.end_date ? parseLocalDate(rule.end_date) : null,
});

// 고정비 규칙 수정 시 적용 시작 기준 날짜 (오늘 기준)
export const getRuleApplyStartDate = ({
  cycle,
  scope,
  today = new Date(),
}: {
  cycle: 'MONTHLY' | 'WEEKLY';
  scope: ApplyScope;
  today?: Date;
}): Date => {
  if (cycle === 'MONTHLY') {
    return scope === 'INCLUDE_CURRENT'
      ? startOfMonth(today)
      : startOfMonth(addMonths(today, 1));
  }

  // WEEKLY (월요일 시작)
  return scope === 'INCLUDE_CURRENT'
    ? startOfWeek(today, { weekStartsOn: 1 })
    : startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });
};

// '포함' 옵션에서 기존 거래를 수정할 대상 기간 (오늘 기준)
export const getRuleApplyRange = ({
  cycle,
  today = new Date(),
}: {
  cycle: 'MONTHLY' | 'WEEKLY';
  today?: Date;
}) => {
  if (cycle === 'MONTHLY') {
    return {
      from: startOfMonth(today),
      to: endOfMonth(today),
    };
  }

  return {
    from: startOfWeek(today, { weekStartsOn: 1 }),
    to: endOfWeek(today, { weekStartsOn: 1 }),
  };
};

// 이번 달에 예정된 고정비 지출 총합 계산
export const getFixedPlannedExpenseByMonth = (
  rules: IFixedRule[],
  monthDate: Date
) => {
  return rules
    .filter((r) => r.type === 'expense')
    .reduce((sum, r) => {
      const occurrences = getFixedRuleDates(r, monthDate).length;
      return sum + r.amount * occurrences;
    }, 0);
};
