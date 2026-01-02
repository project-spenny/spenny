import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from '@/components/ui/item';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { IFixedRule } from '@/types/fixed-costs';
import { formatFixedRuleCycle } from '@/utils/fixed-costs';
import { THEME_COLOR } from '@/constants/colors';

type FixedCostsListProps = {
  items: IFixedRule[];
  isLoading: boolean;
  onEdit: (rule: IFixedRule) => void;
};

export default function FixedCostsList({
  items,
  isLoading,
  onEdit,
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
        <p>
          등록된 고정비가 없습니다. <br /> 상단의 + 버튼을 눌러 고정비를 추가해
          주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((e) => (
        <Item variant="outline" key={e.id}>
          <ItemContent className="flex flex-row items-center">
            <div className="flex w-24 flex-col gap-1">
              <span className="text-muted-foreground text-xs">
                {formatFixedRuleCycle(e)}
              </span>
              <span
                className={cn(
                  'text-sm font-bold',
                  e.type === 'income' ? THEME_COLOR.INCOME : THEME_COLOR.EXPENSE
                )}
              >
                {e.type === 'income' ? '+' : '-'}
                {e.amount.toLocaleString()}원
              </span>
            </div>
            <ItemTitle className="p-2 text-left">{e.title}</ItemTitle>
            <ItemActions className="ml-auto">
              <Button
                className="cursor-pointer"
                size="sm"
                onClick={() => onEdit(e)}
              >
                <ChevronRight />
              </Button>
            </ItemActions>
          </ItemContent>
        </Item>
      ))}
    </div>
  );
}
