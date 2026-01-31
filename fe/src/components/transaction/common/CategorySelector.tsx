import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/constants/categories';
import { Category } from '@/constants/categories';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Image from 'next/image';
import { se } from 'date-fns/locale';

interface CategorySelectorProps {
  transactionType: string;
  value: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (category: string) => void;
}

const SelectedIcon = (categories: Category[], value: string) => {
  const selected = categories.find((cat) => cat.category_key === value);
  return selected ? (
    <div className="flex items-center gap-2">
      <Image
        src={selected.icon}
        alt={selected.name_ko}
        width={22}
        height={22}
      />
      <span>{selected.name_ko}</span>
    </div>
  ) : (
    '선택'
  );
};

export const CategorySelector = ({
  transactionType,
  value,
  open,
  onOpenChange,
  onChange,
}: CategorySelectorProps) => {
  const categories =
    transactionType === 'income' ? CATEGORIES.income : CATEGORIES.expense;
  const isDisabled = !transactionType;
  return (
    <div className="flex items-center">
      <Label className="w-28 pr-2">카테고리</Label>
      <div className="w-full">
        <Popover open={open} onOpenChange={onOpenChange}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-8 w-full text-xs"
              disabled={isDisabled}
            >
              {isDisabled
                ? '거래유형을 먼저 선택하세요'
                : SelectedIcon(categories, value)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="grid grid-cols-4">
              {categories.map((cat) => (
                <div
                  onClick={() => {
                    onChange(cat.category_key);
                    onOpenChange(false);
                  }}
                  className="flex h-18 w-18 cursor-pointer flex-col items-center justify-center gap-2 text-center text-sm hover:bg-gray-100"
                  key={cat.category_key}
                >
                  <Image
                    src={cat.icon}
                    alt={cat.name_ko}
                    width={22}
                    height={22}
                  />
                  <p className="text-muted-foreground text-xs">{cat.name_ko}</p>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
