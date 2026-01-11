import { Badge } from '@/components/ui/badge';
import { CalculatedBudgetItem } from '@/types/budgetGuide';
import { Card } from '@/components/ui/card';

interface RowProps {
  item: CalculatedBudgetItem;
  badgeColor: string;
}

const BudgetResultRow = ({ item, badgeColor }: RowProps) => (
  <Card className="justify-between p-4">
    <div className="flex items-baseline justify-between">
      <div className="flex gap-2">
        <span>{item.name}</span>
        <Badge className={`${badgeColor} text-xs`}>
          {(item.weight * 100).toFixed(1)}%
        </Badge>
      </div>

      <span className="text-base font-bold">
        {item.amount.toLocaleString()}원
      </span>
    </div>
  </Card>
);

export default BudgetResultRow;
