import type { FixedTransactionInsert, IFixedRule } from '@/types/fixed-costs';
import { getFixedRuleDates } from './getRuleDates';

type SyncDeps = {
  fetchFixedRules: (args: {
    userId: string;
    startDate: string;
    endDate: string;
  }) => Promise<IFixedRule[]>;

  fetchExistingKeys: (args: {
    userId: string;
    ruleIds: string[];
    startDate: string;
    endDate: string;
  }) => Promise<Set<string>>;

  insertTransactions: (args: {
    rows: FixedTransactionInsert[];
  }) => Promise<void>;
};

// 고정비 규칙별로 해당 월에 발생하는 날짜 목록 계산
const getRuleDatesMap = (rules: IFixedRule[], monthDate: Date) => {
  const map = new Map<string, string[]>();

  for (const rule of rules) {
    const dates = getFixedRuleDates(rule, monthDate);
    if (dates.length > 0) map.set(rule.id, dates);
  }

  return map;
};

// 아직 생성되지 않은 거래만 payload 목록 생성
const buildMissingInserts = ({
  userId,
  rules,
  ruleDatesMap,
  existingSet,
  endDate,
}: {
  userId: string;
  rules: IFixedRule[];
  ruleDatesMap: Map<string, string[]>;
  existingSet: Set<string>;
  endDate: string;
}) => {
  const inserts: FixedTransactionInsert[] = [];

  for (const rule of rules) {
    const dates = ruleDatesMap.get(rule.id);
    if (!dates) continue;

    for (const date of dates) {
      if (date > endDate) continue;

      const key = `${rule.id}__${date}`;
      if (existingSet.has(key)) continue;

      inserts.push({
        user_id: userId,
        fixed_rule_id: rule.id,
        date,
        title: rule.title,
        type: rule.type,
        amount: rule.amount,
        category_id: rule.category_id,
      });
    }
  }

  return inserts;
};

// 고정비 규칙을 기준으로 특정 월의 거래 동기화
export const syncByMonthShared = async (
  deps: SyncDeps,
  args: {
    userId: string;
    monthDate: Date;
    startDate: string;
    endDate: string;
    generateThroughDate?: string;
  }
) => {
  const { userId, monthDate, startDate, endDate, generateThroughDate } = args;

  // 생성 범위 상한 : 월말(endDate)과 generateThroughDate 중 더 이른 날짜
  const effectiveEndDate =
    generateThroughDate && generateThroughDate < endDate
      ? generateThroughDate
      : endDate;
  if (startDate > effectiveEndDate) return { createdCount: 0 };

  // 해당 월에 유효한 고정비 규칙 조회
  const rules = await deps.fetchFixedRules({
    userId,
    startDate,
    endDate,
  });
  if (rules.length === 0) return { createdCount: 0 };

  // 규칙별 월 발생 날짜 계산
  const ruleDatesMap = getRuleDatesMap(rules, monthDate);
  const ruleIds = [...ruleDatesMap.keys()];
  if (ruleIds.length === 0) return { createdCount: 0 };

  // 이미 생성된 거래 조회
  const existingSet = await deps.fetchExistingKeys({
    userId,
    ruleIds,
    startDate,
    endDate: effectiveEndDate,
  });

  // 누락된 날짜만 insert payload 생성
  const inserts = buildMissingInserts({
    userId,
    rules,
    ruleDatesMap,
    existingSet,
    endDate: effectiveEndDate,
  });

  if (inserts.length === 0) return { createdCount: 0 };

  // 누락만 생성
  await deps.insertTransactions({ rows: inserts });

  return { createdCount: inserts.length };
};
