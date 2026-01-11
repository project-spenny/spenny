import { Badge } from '@/components/ui/badge';
import BudgetResultRow from '@/components/budget/steps/BudgetResultRow';
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
    <div className="group space-y-4">
      {/* 섹션 헤더 */}
      <div className="flex items-end justify-between px-1">
        <div className="space-y-1">
          <div
            className={`flex items-center gap-2 text-lg font-bold ${textColor}`}
          >
            {title}
            <Badge
              className={`${badgeColor} border-none px-2 py-0.5 font-bold`}
            >
              {percent}%
            </Badge>
          </div>

          <p className="text-muted-foreground text-sm font-medium">
            {description}
          </p>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold">
            {totalAmount.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 아이템 그리드 */}
      <div className="grid gap-2 md:grid-cols-2">
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
