import { CATEGORIES, Category } from '@/constants/categories';
import { HelpCircle, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { MAX_BUDGET_AMOUNT } from '@/constants/budget';
import PercentageBadge from '@/components/budgets/common/PercentageBadge';
import { cn } from '@/lib/utils';
import { useState } from 'react';

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
  amount = '',
  totalBudgetAmount,
  onChange,
  onReset,
  inputRef,
}: BudgetCategoryEditItemProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const categoryInfo = CATEGORIES.expense.find(
    (c) => c.category_key === category.category_key
  );
  const iconSrc = category.icon || categoryInfo?.icon || '';

  const percent =
    totalBudgetAmount > 0
      ? Math.round((Number(amount || 0) / totalBudgetAmount) * 100)
      : 0;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');

    // 10억 초과 입력 시도 시 10억으로 고정
    if (Number(value) > MAX_BUDGET_AMOUNT) {
      onChange(category.category_key, MAX_BUDGET_AMOUNT.toString());
      return;
    }

    onChange(category.category_key, value);
  };

  return (
    <div className="flex items-center gap-2 py-1">
      {/* 아이콘 원형 배경 */}
      <div className="bg-brand-subtle dark:bg-brand/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full md:h-10 md:w-10">
        {iconSrc ? (
          <Image src={iconSrc} alt={category.name_ko} width={20} height={20} />
        ) : (
          // 기본 아이콘
          <HelpCircle size={20} className="text-muted-foreground" />
        )}
      </div>

      {/* 카테고리명 */}
      <div className="flex flex-1 items-center gap-1">
        <p className="text-xs font-semibold md:text-sm">{category.name_ko}</p>
        {percent > 0 && <PercentageBadge percentage={percent} />}
      </div>

      {/* 금액 입력부 */}
      <div className="relative w-32 md:w-38">
        <Input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={
            isFocused
              ? amount
              : amount !== ''
                ? Number(amount).toLocaleString()
                : ''
          }
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleAmountChange}
          className={cn(
            'focus-visible:ring-brand-soft h-9 pr-7 text-right text-xs tracking-tight md:text-sm',
            Number(amount) >= MAX_BUDGET_AMOUNT &&
              'focus-visible:ring-destructive/50'
          )}
        />

        {isFocused && Number(amount) >= MAX_BUDGET_AMOUNT && (
          <div className="animate-in fade-in zoom-in absolute -top-6 right-0 duration-200">
            <span className="text-destructive bg-background rounded border px-2 py-0.5 text-xs font-bold whitespace-nowrap shadow-sm">
              최대 10억 원까지 가능
            </span>
          </div>
        )}

        {amount && (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive absolute top-1/2 left-0.5 h-6 w-6 shrink-0 -translate-y-1/2 md:h-8 md:w-8"
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
