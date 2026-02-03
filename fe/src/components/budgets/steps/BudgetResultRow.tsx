import { Badge } from '@/components/ui/badge';
import { CalculatedBudgetItem } from '@/types/budgetGuide';
import { Card } from '@/components/ui/card';

interface RowProps {
  item: CalculatedBudgetItem;
  badgeColor: string;
}

const BudgetResultRow = ({ item, badgeColor }: RowProps) => (
  <Card className="border-border/50 justify-between px-4 py-3">
    <div className="flex items-baseline justify-between">
      <div className="flex gap-1 whitespace-nowrap">
        <span className="text-sm font-medium">{item.name}</span>
        <Badge className={`${badgeColor} px-1.5 py-0.5 text-[10px] md:text-xs`}>
          {(item.weight * 100).toFixed(1)}%
        </Badge>
      </div>

      <span className="text-sm font-bold whitespace-nowrap md:text-base">
        {item.amount.toLocaleString()}원
      </span>
    </div>
  </Card>
);

export default BudgetResultRow;
