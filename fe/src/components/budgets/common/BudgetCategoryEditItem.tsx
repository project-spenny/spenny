import { CATEGORIES, Category } from '@/constants/categories';
import { HelpCircle, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type BudgetCategoryEditItemProps = {
  category: Category;
  amount: string;
  totalBudgetAmount: number;
  onChange: (key: string, value: string) => void;
  onReset: (key: string) => void;
  inputRef: (el: HTMLInputElement | null) => void;
};

const BudgetCategoryEditItem = ({
  category,
  amount,
  totalBudgetAmount,
  onChange,
  onReset,
  inputRef,
}: BudgetCategoryEditItemProps) => {
  const categoryInfo = CATEGORIES.expense.find(
    (c) => c.category_key === category.category_key
  );
  const iconSrc = category.icon || categoryInfo?.icon || '';

  const percent =
    totalBudgetAmount > 0
      ? Math.round((Number(amount || 0) / totalBudgetAmount) * 100)
      : 0;

  return (
    <div className="flex items-center gap-2 py-1">
      {/* 아이콘 원형 배경 */}
      <div className="bg-brand-subtle dark:bg-brand/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
        {iconSrc ? (
          <Image src={iconSrc} alt={category.name_ko} width={24} height={24} />
        ) : (
          // 기본 아이콘
          <HelpCircle size={20} className="text-muted-foreground" />
        )}
      </div>

      {/* 카테고리명 */}
      <div className="flex flex-1 items-center gap-1">
        <p className="text-sm font-semibold">{category.name_ko}</p>
        {percent > 0 && (
          <Badge
            className={cn(
              'px-2 py-0.5 font-semibold',
              Number(amount) > totalBudgetAmount
                ? 'bg-destructive/10 text-destructive dark:bg-destructive/10'
                : 'bg-brand-subtle dark:bg-brand/10 text-brand'
            )}
          >
            {Number(amount) > totalBudgetAmount
              ? `+${Math.min(percent, 100)}%`
              : `${percent}%`}
          </Badge>
        )}
      </div>

      {/* 금액 입력부 */}
      <div className="relative w-36">
        <Input
          ref={inputRef}
          type="text"
          placeholder="0"
          value={amount ? Number(amount).toLocaleString() : ''}
          onChange={(e) => onChange(category.category_key, e.target.value)}
          className="focus-visible:ring-brand-soft h-9 pr-7 text-right"
        />
        {amount && (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive absolute top-1/2 left-0.5 h-8 w-8 shrink-0 -translate-y-1/2"
            onClick={() => onReset(category.category_key)}
          >
            <X size={16} />
          </Button>
        )}
        <span className="text-muted-foreground absolute top-1/2 right-2.5 -translate-y-1/2 text-xs">
          원
        </span>
      </div>
    </div>
  );
};

export default BudgetCategoryEditItem;
