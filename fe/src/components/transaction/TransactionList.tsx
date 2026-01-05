'use client';
import { Label } from '@/components/ui/label';
import { TransactionItem } from './TransactionItem';
import { ITransaction } from '@/types/transactions';
import { TransactionFilter } from './TransactionFilter';
interface TransactionListProps {
  transactions: ITransaction[];
  compact?: boolean;
}

export const TransactionList = ({
  transactions,
  compact = false,
}: TransactionListProps) => {
  if (compact) {
    return (
      <div className="flex w-full flex-col items-center space-y-6 p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-xl space-y-6">
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center">
              거래 내역이 없습니다
            </p>
          ) : (
            transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center space-y-6 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-xl space-y-6">
        <Label className="text-xl">가계부</Label>
        <TransactionFilter />
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-center">
            거래 내역이 없습니다
          </p>
        ) : (
          transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))
        )}
      </div>
    </div>
  );
};
