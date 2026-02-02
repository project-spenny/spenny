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

function formatRuleRange(rule: IFixedRule) {
  const start = rule.start_date;
  const end = rule.end_date ?? '';
  return end ? `${start} ~ ${end}` : `${start} ~`;
}

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
        'hover:border-brand-soft relative cursor-pointer transition-colors',
        isEnded && 'opacity-60'
      )}
      onClick={handleClick}
    >
      <ItemContent className="flex flex-col gap-2">
        {/* 상단: 기간 / 상태 뱃지 */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="h-5 px-2 text-xs">
            {formatRuleRange(rule)}
          </Badge>

          {isEnded && (
            <Badge
              variant="secondary"
              className="border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400"
            >
              종료됨
            </Badge>
          )}
        </div>

        {/* 본문 */}
        <div className="flex flex-row items-center pr-5">
          <div className="flex w-32 flex-col gap-1">
            <span className="text-muted-foreground text-xs">
              {formatFixedRuleCycle(rule)}
            </span>
            <span
              className={cn(
                'text-sm font-bold',
                rule.type === 'income'
                  ? THEME_COLOR.INCOME
                  : THEME_COLOR.EXPENSE
              )}
            >
              {rule.type === 'income' ? '+' : '-'}
              {rule.amount.toLocaleString()}원
            </span>
          </div>

          <div className="min-w-0 flex-1 pl-2">
            <ItemTitle className="text-muted-foreground text-xs">
              {categoryName}
            </ItemTitle>
            <ItemTitle className="line-clamp-2 text-sm font-medium">
              {rule.title}
            </ItemTitle>
          </div>
        </div>
      </ItemContent>

      <ChevronRight className="absolute top-1/2 right-3 -translate-y-1/2" />
    </Item>
  );
}
