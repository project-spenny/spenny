import type { IFixedRule } from '@/types/fixed-costs';
import type { ITransaction } from '@/types/transactions';
import type {
  ScheduledFixedInfo,
  ScheduledFixedByDateMap,
} from '@/types/fixed-costs';
import { getFixedRuleDates } from '@/services/fixed-costs/getRuleDates';
import { formatLocalDate } from '@/utils/date';

// 월 단위 예정 고정비 안내 데이터 생성
export function buildScheduledFixedByDateMap({
  monthDate,
  today,
  fixedRules,
  transactions,
}: {
  monthDate: Date;
  today: Date;
  fixedRules: IFixedRule[];
  transactions: Pick<ITransaction, 'fixed_rule_id' | 'origin_date'>[];
}): ScheduledFixedByDateMap {
  const result: ScheduledFixedByDateMap = {};

  // 과거 달이면 예정 고정비 없음
  if (isBeforeMonth(monthDate, today)) {
    return result;
  }

  const todayStr = formatLocalDate(today);

  // 이미 생성된 고정비 거래 set
  const existingOccurrenceSet = new Set<string>();
  for (const tx of transactions) {
    if (!tx.fixed_rule_id || !tx.origin_date) continue;
    existingOccurrenceSet.add(`${tx.fixed_rule_id}__${tx.origin_date}`);
  }

  for (const rule of fixedRules) {
    // 해당 월에 발생하는 날짜들
    const dates = getFixedRuleDates(rule, monthDate);

    for (const date of dates) {
      // 현재 달이면 오늘 포함 과거 날짜 제외
      if (isSameMonth(monthDate, today) && date <= todayStr) continue;

      const occurrenceKey = `${rule.id}__${date}`;

      // 이미 생성된 거래가 있으면 예정 표시하지 않음
      if (existingOccurrenceSet.has(occurrenceKey)) continue;

      const info: ScheduledFixedInfo = {
        fixed_rule_id: rule.id,
        title: rule.title,
        amount: rule.amount,
        type: rule.type,
        category_id: rule.category_id,
      };

      (result[date] ??= []).push(info);
    }
  }

  return result;
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function isBeforeMonth(a: Date, b: Date) {
  return (
    a.getFullYear() < b.getFullYear() ||
    (a.getFullYear() === b.getFullYear() && a.getMonth() < b.getMonth())
  );
}
