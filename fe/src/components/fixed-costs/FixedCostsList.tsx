import FixedCostItem from './FixedCostItem';
import { IFixedRule } from '@/types/fixed-costs';

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
  return (
    <div className="flex w-full flex-col items-center space-y-6 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-xl space-y-6">
        {isLoading ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            고정비 목록을 불러오는 중입니다…
          </p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground text-center">
            등록된 고정비가 없습니다
          </p>
        ) : (
          <div className="space-y-2">
            {items.map((rule) => (
              <FixedCostItem key={rule.id} rule={rule} onEdit={onEdit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
