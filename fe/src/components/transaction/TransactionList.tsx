'use client';
import { useMemo } from 'react';
import { TransactionItem } from './TransactionItem';
import { ITransaction } from '@/types/transactions';
import { TransactionFilter } from './TransactionFilter';

interface TransactionListProps {
  transactions: ITransaction[];
  compact?: boolean;
  onEdit?: (tx: ITransaction) => void;
  onCreate?: () => void;
}

// 날짜별로 그룹화
function groupByDate(transactions: ITransaction[]) {
  const groups: Record<string, ITransaction[]> = {};

  for (const tx of transactions) {
    const date = tx.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(tx);
  }

  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}

// 날짜 포맷 함수
function formatDateHeader(dateStr: string) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];
  return `${month}월 ${day}일 (${weekday})`;
}

export const TransactionList = ({
  transactions,
  compact = false,
  onEdit,
}: TransactionListProps) => {
  const groupedTransactions = useMemo(
    () => groupByDate(transactions),
    [transactions]
  );

  if (compact) {
    return (
      <div className="flex w-full flex-col items-center space-y-6 p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-xl space-y-6">
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center">
              거래 내역이 없습니다
            </p>
          ) : (
            groupedTransactions.map(([date, txs]) => (
              <div key={date} className="space-y-3">
                <h3 className="text-muted-foreground text-sm font-medium">
                  {formatDateHeader(date)}
                </h3>
                {txs.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onEdit={onEdit}
                  />
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center space-y-6 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-xl space-y-6">
        <TransactionFilter />
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-center">
            거래 내역이 없습니다
          </p>
        ) : (
          groupedTransactions.map(([date, txs]) => (
            <div key={date} className="space-y-3">
              <h3 className="text-muted-foreground text-sm font-medium">
                {formatDateHeader(date)}
              </h3>
              {txs.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
