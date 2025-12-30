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
