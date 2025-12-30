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
import { IFixedRule } from '@/types/fixed-costs';

type FixedCostsListProps = {
  items: IFixedRule[];
  isLoading: boolean;
  emptyMessage: string;
  onToggleActive: (id: string, nextActive: boolean) => void;
};

export default function FixedCostsList({
  items,
  isLoading,
  emptyMessage,
  onToggleActive,
}: FixedCostsListProps) {
  if (isLoading) {
    return (
      <div className="text-muted-foreground py-8 text-center text-sm">
        고정비 목록을 불러오는 중입니다…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-muted-foreground rounded-md border p-6 text-center text-sm whitespace-pre-line">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((e) => (
        <Item
          variant="outline"
          key={e.id}
          className={cn(!e.is_active && 'opacity-50')}
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
              <Switch
                checked={e.is_active}
                onCheckedChange={(v) => onToggleActive(e.id, v)}
              />
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
