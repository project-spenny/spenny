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
      <ItemContent className="flex flex-row items-center">
        <div className="flex w-32 flex-col gap-1">
          <span className="text-muted-foreground text-xs">
            {formatDateKR(new Date(transaction.date))}
          </span>
          <span
            className={cn(
              'text-sm font-bold',
              transaction.type === 'income' ? 'text-blue-400' : 'text-red-400'
            )}
          >
            {transaction.type === 'income' ? '+' : '-'}
            {transaction.amount.toLocaleString()}원
          </span>
        </div>
        <div>
          <ItemTitle className="text-muted-foreground pl-2 text-left text-xs">
            {
              CATEGORIES[transaction.type].find(
                (cat) => cat.category_key === transaction.category_id
              )?.name_ko
            }
          </ItemTitle>
          <ItemTitle className="p-2 text-left">{transaction.title}</ItemTitle>
        </div>
        <div className='ml-auto'>
          <ChevronRight />
        </div>
      </ItemContent>
    </Item>
  );
};
