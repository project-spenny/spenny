import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from '@/components/ui/item';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { FixedCostListItem } from '@/types/fixed-costs.mock.types';

type FixedCostsListProps = {
  items: FixedCostListItem[];
};

export default function FixedCostsList({ items }: FixedCostsListProps) {
  return (
    <div className="space-y-2">
      {items.map((e) => (
        <Item
          variant="outline"
          key={e.id}
          className={cn(!e.isActive && 'opacity-50')}
        >
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
              <Switch checked={e.isActive} />
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
