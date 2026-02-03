'use client';
import { ITransaction } from '@/types/transactions';
import {
  Item,
  ItemContent,
  ItemTitle,
} from '@/components/ui/item';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDateKR } from '@/utils/date';
import { CATEGORIES } from '@/constants/categories';
import { useSelected } from '@/app/(app)/history/TransactionContext';

interface TransactionItemProps {
  transaction: ITransaction;
  onEdit?: (tx: ITransaction) => void;
}
export const TransactionItem = ({
  transaction,
  onEdit,
}: TransactionItemProps) => {
  const { openEdit } = useSelected();
  const handleClick = () => {
    if (onEdit) {
      onEdit(transaction);
    }
    openEdit(transaction);
  };
  return (
    <Item
      variant="outline"
      className="hover:border-brand-soft cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <ItemContent className="flex flex-row items-center gap-2 sm:gap-3">
        <div className="flex w-20 shrink-0 flex-col gap-0.5 sm:w-28 sm:gap-1">
          <span className="text-muted-foreground text-[10px] sm:text-xs">
            {formatDateKR(new Date(transaction.date))}
          </span>
          <span
            className={cn(
              'text-xs font-bold sm:text-sm',
              transaction.type === 'income' ? 'text-blue-400' : 'text-red-400'
            )}
          >
            {transaction.type === 'income' ? '+' : '-'}
            {transaction.amount.toLocaleString()}원
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <ItemTitle className="text-muted-foreground text-[10px] sm:text-xs">
            {
              CATEGORIES[transaction.type].find(
                (cat) => cat.category_key === transaction.category_id
              )?.name_ko
            }
          </ItemTitle>
          <ItemTitle className="truncate text-xs sm:text-sm">
            {transaction.title}
          </ItemTitle>
        </div>
        <div className="shrink-0">
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </ItemContent>
    </Item>
  );
};
