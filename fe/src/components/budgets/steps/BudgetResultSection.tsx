import { Badge } from '@/components/ui/badge';
import BudgetResultRow from '@/components/budgets/steps/BudgetResultRow';
import { CalculatedBudgetItem } from '@/types/budgetGuide';

type BudgetResultSectionProps = {
  title: string;
  totalAmount: number;
  percent: number;
  description: string;
  items: CalculatedBudgetItem[];
  textColor: string;
  badgeColor: string;
};

const BudgetResultSection = ({
  title,
  totalAmount,
  percent,
  description,
  items,
  textColor,
  badgeColor,
}: BudgetResultSectionProps) => {
  return (
    <div className="space-y-4">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-1">
          <div
            className={`flex items-center gap-2 text-base font-bold md:text-lg ${textColor}`}
          >
            {title}
            <Badge
              className={`${badgeColor} border-none px-1.5 py-0.5 text-[10px] font-bold md:text-xs`}
            >
              {percent}%
            </Badge>
          </div>

          <p className="text-muted-foreground text-xs font-medium break-keep md:text-sm">
            {description}
          </p>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold whitespace-nowrap md:text-lg">
            {totalAmount.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 아이템 그리드 */}
      <div className="grid gap-2 px-2 py-2 md:grid-cols-2 md:px-4">
        {items.map((item) => (
          <BudgetResultRow
            key={item.categoryId}
            item={item}
            badgeColor={badgeColor}
          />
        ))}
      </div>
    </div>
  );
};

export default BudgetResultSection;
