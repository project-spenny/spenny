import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
export const TypeSelector = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (type: string) => void;
}) => {
  return (
    <div className="flex items-center">
      <Label className="w-28 pr-2">거래유형</Label>
      <div className="grid w-full grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange('income')}
          className={cn(
            'cursor-pointer rounded-lg border-2 px-6 py-3 font-medium transition-all',
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
            'cursor-pointer rounded-lg border-2 px-6 py-3 font-medium transition-all',
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
