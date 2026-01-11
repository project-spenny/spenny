import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/constants/categories';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Image from 'next/image';

interface CategorySelectorProps {
  transactionType: string;
  value: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (category: string) => void;
}

export const CategorySelector = ({
  transactionType,
  value,
  open,
  onOpenChange,
  onChange,
}: CategorySelectorProps) => {
  if (!transactionType) return null;

  const categories =
    transactionType === 'income' ? CATEGORIES.income : CATEGORIES.expense;

  return (
    <div className="flex items-center">
      <Label className="w-28 pr-2">카테고리</Label>
      <div className="w-full">
        <Popover open={open} onOpenChange={onOpenChange}>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" className="w-full">
              {value === ''
                ? '선택'
                : categories.find((cat) => cat.category_key === value)
                    ?.name_ko || '선택'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="grid grid-cols-3">
              {categories.map((cat) => (
                <div
                  onClick={() => {
                    onChange(cat.category_key);
                    onOpenChange(false);
                  }}
                  className="flex h-20 w-24 cursor-pointer flex-col items-center justify-center gap-2 text-center text-sm hover:bg-gray-100"
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
