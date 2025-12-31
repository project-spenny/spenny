import { IFixedCostFormData } from '@/hooks/useFixedCostForm';
import { IFixedRule } from '@/types/fixed-costs';
import { parseLocalDate } from './date';

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

  is_active: rule.is_active,
});
