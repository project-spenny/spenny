'use client';

import { Item, ItemContent, ItemTitle } from '@/components/ui/item';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { IFixedRule } from '@/types/fixed-costs';
import { formatFixedRuleCycle } from '@/utils/fixed-costs/fixedCosts';
import { isEndedFixedRule } from '@/utils/fixed-costs/rule';
import { THEME_COLOR } from '@/constants/colors';
import { CATEGORIES } from '@/constants/categories';
import { Badge } from '../ui/badge';

type FixedCostItemProps = {
  rule: IFixedRule;
  onEdit?: (rule: IFixedRule) => void;
};

export default function FixedCostItem({ rule, onEdit }: FixedCostItemProps) {
  const isEnded = isEndedFixedRule(rule);

  const handleClick = () => {
    onEdit?.(rule);
  };

  const categoryName = CATEGORIES[rule.type].find(
    (cat) => cat.category_key === rule.category_id
  )?.name_ko;

  return (
    <Item
      variant="outline"
      className={cn(
        'hover:border-brand-soft cursor-pointer transition-colors',
        isEnded ? 'opacity-60' : ''
      )}
      onClick={handleClick}
    >
      <ItemContent className="flex flex-row items-center">
        {/* 좌측: 주기 + 금액 */}
        <div className="flex w-32 flex-col gap-1">
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

        {/* 중앙: 카테고리 + 제목 */}
        <div className="pl-2">
          <ItemTitle className="text-muted-foreground pl-2 text-left text-xs">
            {categoryName}
          </ItemTitle>
          <ItemTitle className="p-2 text-left">
            {rule.title}
            {isEnded && (
              <Badge variant="secondary" className="h-5 px-2 text-xs">
                종료됨
              </Badge>
            )}
          </ItemTitle>
        </div>

        {/* 우측 */}
        <div className="ml-auto">
          <ChevronRight />
        </div>
      </ItemContent>
    </Item>
  );
}
