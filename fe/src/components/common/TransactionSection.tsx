import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';
import { Transaction } from '@/types/testTransaction';
import { cn } from '@/lib/utils';

const TransactionSection = ({ data }: { data: Transaction[] }) => {
  return (
    <section className="flex flex-col gap-4 p-6">
      {data.map((item) => (
        <TransactionItem key={item.id} item={item} />
      ))}
    </section>
  );
};

export default TransactionSection;

const TransactionItem = ({ item }: { item: Transaction }) => {
  return (
    <div className="bg-secondary/80 flex w-full items-center justify-between gap-4 rounded-lg border p-6">
      {/* 금액/카테고리 */}
      <div className="flex flex-1 items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-lg font-bold">{item.title}</div>
          <div className="text-muted-foreground text-sm font-medium">
            {item.category_id}
          </div>
        </div>

        <div
          className={cn(
            'text-lg font-bold',
            item.type === 'income' ? 'text-blue-400' : 'text-red-400'
          )}
        >
          {item.type === 'income' ? '+' : '-'}
          {item.amount.toLocaleString()}원
        </div>
      </div>

      {/* 상세 내역 보기 */}
      <div>
        <Button
          variant="outline"
          size="icon"
          className="bg-background/60 h-12 w-12 cursor-pointer rounded-full shadow-md"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};
