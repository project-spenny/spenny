import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
export const AmountInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (type: string) => void;
}) => {
  return (
    <div className="flex items-center">
      <Label className="w-30 pr-2">금액</Label>
      <Input
        id="amount"
        type="number"
        placeholder="금액을 입력하세요"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min="0"
        className="text-right"
      />
      <Label className="pl-2">원</Label>
    </div>
  );
};
