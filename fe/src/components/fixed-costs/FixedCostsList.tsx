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
  if (isLoading) {
    return (
      <div className="text-muted-foreground py-8 text-center text-sm">
        고정비 목록을 불러오는 중입니다…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-muted-foreground rounded-md border p-6 text-center text-sm whitespace-pre-line">
        <p>
          등록된 고정비가 없습니다. <br /> 상단의 + 버튼을 눌러 고정비를 추가해
          주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((rule) => (
        <FixedCostItem key={rule.id} rule={rule} onEdit={onEdit} />
      ))}
    </div>
  );
}
