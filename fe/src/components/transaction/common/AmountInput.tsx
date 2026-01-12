import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { QuickAmountButtons } from './QuickAmountButtons';
export const AmountInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (type: string) => void;
}) => {
  return (
    <div className="flex items-start gap-2">
      <Label className="w-26 pr-2">금액</Label>
      <div className="flex w-full flex-col gap-2">
        <div className="bg-background flex items-center gap-2">
          <Input
            id="amount"
            type="number"
            placeholder="금액을 입력하세요"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            min="0"
            className="focus-visible:border-brand h-12 flex-1 [appearance:textfield] rounded-none border-0 border-b-1 text-right !text-2xl focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="text-lg font-medium">원</span>
        </div>
        <QuickAmountButtons
          value={value}
          onClick={(value) => onChange(value)}
        />
      </div>
    </div>
  );
};
