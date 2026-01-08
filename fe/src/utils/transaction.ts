import { ITransaction } from '@/types/transactions';

export const isExpense = (
  t: ITransaction
): t is ITransaction & { type: 'expense' } => t.type === 'expense';

export const isFixedExpense = (t: ITransaction) =>
  isExpense(t) && Boolean(t.fixed_rule_id);

// YYYY-MM-DD 형식 문자열 날짜 비교
export const isOnOrBefore = (a: string, b: string) => a <= b;

// 조건에 맞는 거래 합계
export const sumTransactionAmount = (
  transactions: ITransaction[],
  predicate?: (t: ITransaction) => boolean
) =>
  transactions.reduce((acc, t) => {
    if (predicate && !predicate(t)) return acc;
    return acc + (Number.isFinite(t.amount) ? t.amount : 0);
  }, 0);

// 특정 기준일(until)까지의 총 지출 합계
export const sumExpenseUntil = (transactions: ITransaction[], until: string) =>
  sumTransactionAmount(
    transactions,
    (t) => isExpense(t) && isOnOrBefore(t.date, until)
  );

// 특정 기준일(until)까지의 고정비 지출 합계
export const sumFixedExpenseUntil = (
  transactions: ITransaction[],
  until: string
) =>
  sumTransactionAmount(
    transactions,
    (t) => isFixedExpense(t) && isOnOrBefore(t.date, until)
  );
