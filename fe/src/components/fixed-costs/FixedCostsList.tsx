import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from '@/components/ui/item';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

type FixedCostListItem = {
  id: string;
  title: string;
  type: 'income' | 'expense';
  amount: number;
  displayCycle?: string;
  isActive: boolean;
};

const MOCK_FIXED_COSTS: FixedCostListItem[] = [
  {
    id: '1',
    title: '넷플릭스',
    type: 'expense',
    displayCycle: '매달 25일',
    amount: 17000,
    isActive: true,
  },
  {
    id: '2',
    title: '헬스장',
    type: 'expense',
    displayCycle: '매주 월요일',
    amount: 45000,
    isActive: false,
  },
];

export default function FixedCostsList() {
  return (
    <div className="space-y-2">
      {MOCK_FIXED_COSTS.map((e) => (
        <Item variant="outline" key={e.id}>
          <ItemContent className="flex flex-row items-center">
            <div className="flex w-24 flex-col gap-1">
              <span className="text-muted-foreground text-xs">
                {e.displayCycle}
              </span>
              <span
                className={cn(
                  'text-sm font-bold',
                  e.type === 'income' ? 'text-blue-400' : 'text-red-400'
                )}
              >
                {e.type === 'income' ? '+' : '-'}
                {e.amount.toLocaleString()}원
              </span>
            </div>
            <ItemTitle className="p-2 text-left">{e.title}</ItemTitle>
            <ItemActions className="ml-auto">
              <Button className="cursor-pointer" size="sm">
                <ChevronRight />
              </Button>
            </ItemActions>
          </ItemContent>
        </Item>
      ))}
    </div>
  );
}
