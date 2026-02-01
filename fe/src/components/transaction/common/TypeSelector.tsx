import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { FixedCostType } from '@/types/fixed-costs';

type Props = {
  value: FixedCostType;
  onChange: (type: Exclude<FixedCostType, ''>) => void; // ''은 선택 결과로 나오면 안 됨
};

export const TypeSelector = ({ value, onChange }: Props) => {
  return (
    <div className="flex items-center">
      <Label className="w-28 pr-2">거래 유형</Label>
      <div className="grid w-full grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange('income')}
          className={cn(
            'cursor-pointer rounded-lg border-2 px-6 py-2 text-sm font-medium transition-all',
            value === 'income'
              ? 'border-gray-500'
              : 'border-gray-300 hover:border-gray-400'
          )}
        >
          수입
        </button>
        <button
          type="button"
          onClick={() => onChange('expense')}
          className={cn(
            'cursor-pointer rounded-lg border-2 px-6 py-2 text-sm font-medium transition-all',
            value === 'expense'
              ? 'border-gray-500'
              : 'border-gray-300 hover:border-gray-400'
          )}
        >
          지출
        </button>
      </div>
    </div>
  );
};
