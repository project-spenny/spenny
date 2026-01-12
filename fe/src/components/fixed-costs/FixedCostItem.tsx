'use client';

import { Item, ItemContent, ItemTitle } from '@/components/ui/item';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { IFixedRule } from '@/types/fixed-costs';
import { formatFixedRuleCycle } from '@/utils/fixed-costs';
import { THEME_COLOR } from '@/constants/colors';

type FixedCostItemProps = {
  rule: IFixedRule;
  onEdit?: (rule: IFixedRule) => void;
};

export default function FixedCostItem({ rule, onEdit }: FixedCostItemProps) {
  const handleClick = () => {
    onEdit?.(rule);
  };

  return (
    <Item
      variant="outline"
      className="hover:border-brand-soft cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <ItemContent className="flex flex-row items-center">
        <div className="flex w-24 flex-col gap-1">
          <span className="text-muted-foreground text-xs">
            {formatFixedRuleCycle(rule)}
          </span>
          <span
            className={cn(
              'text-sm font-bold',
              rule.type === 'income' ? THEME_COLOR.INCOME : THEME_COLOR.EXPENSE
            )}
          >
            {rule.type === 'income' ? '+' : '-'}
            {rule.amount.toLocaleString()}원
          </span>
        </div>

        <ItemTitle className="p-2 text-left">{rule.title}</ItemTitle>

        <div className="ml-auto">
          <ChevronRight />
        </div>
      </ItemContent>
    </Item>
  );
}
