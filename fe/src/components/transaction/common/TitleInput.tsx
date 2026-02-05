import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
export const TitleInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (type: string) => void;
}) => {
  return (
    <div className="flex items-center">
      <Label className="w-28 pr-2">거래처</Label>
      <Input
        className="text-sm"
        id="title"
        type="text"
        placeholder="거래처를 입력해주세요"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
