'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TitleInput } from '../transaction/common/TitleInput';
import { TypeSelector } from '../transaction/common/TypeSelector';
import { CategorySelector } from '../transaction/common/CategorySelector';
import { AmountInput } from '../transaction/common/AmountInput';
import { DatePicker } from '../transaction/common/DatePicker';
import { cn } from '@/lib/utils';
import { useFixedCostForm } from '@/hooks/useFixedCostForm';
import { toast } from 'sonner';

const WEEKDAYS = [
  { label: '월', value: 1 },
  { label: '화', value: 2 },
  { label: '수', value: 3 },
  { label: '목', value: 4 },
  { label: '금', value: 5 },
  { label: '토', value: 6 },
  { label: '일', value: 7 },
] as const;

const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function FixedCostCreateForm() {
  const {
    formData,
    categoryOpen,
    setCategoryOpen,
    UpdateField,
    validateFormData,
  } = useFixedCostForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errorMsg = validateFormData();
    if (errorMsg) {
      toast(errorMsg);
      return;
    }
    console.log('submit payload', formData);
  };

  return (
    <div className="flex h-full flex-col px-6">
      <form onSubmit={handleSubmit} className="flex h-full flex-col space-y-6">
        <div className="border-b pb-4">
          <Label className="text-xl">고정비 추가</Label>
        </div>

        <TitleInput
          value={formData.title}
          onChange={(title) => UpdateField('title', title)}
        />

        <TypeSelector
          value={formData.type}
          onChange={(type) => {
            UpdateField('type', type);
            UpdateField('category_id', '');
          }}
        />

        <CategorySelector
          transactionType={formData.type}
          value={formData.category_id}
          open={categoryOpen}
          onOpenChange={setCategoryOpen}
          onChange={(category) => UpdateField('category_id', category)}
        />

        <AmountInput
          value={formData.amount}
          onChange={(amount) => UpdateField('amount', amount)}
        />

        {/* 고정비 영역 */}
        {/* 시작일 */}
        <div className="space-y-2">
          <Label>시작일</Label>
          <DatePicker
            value={formData.start_date}
            onChange={(date) => UpdateField('start_date', date)}
          />
        </div>

        {/* 반복 주기 */}
        <div className="space-y-2">
          <Label>반복 주기</Label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                UpdateField('cycle', 'WEEKLY');
                UpdateField('weekday', null);
                UpdateField('monthday', null);
              }}
              className={cn(
                'cursor-pointer rounded-lg border-2 px-6 py-3 font-medium transition-all',
                formData.cycle === 'WEEKLY'
                  ? 'border-gray-500'
                  : 'border-gray-300 hover:border-gray-400'
              )}
            >
              주간
            </button>

            <button
              type="button"
              onClick={() => {
                UpdateField('cycle', 'MONTHLY');
                UpdateField('weekday', null);
                UpdateField('monthday', null);
              }}
              className={cn(
                'cursor-pointer rounded-lg border-2 px-6 py-3 font-medium transition-all',
                formData.cycle === 'MONTHLY'
                  ? 'border-gray-500'
                  : 'border-gray-300 hover:border-gray-400'
              )}
            >
              월간
            </button>
          </div>
        </div>

        {/* 주간 : 요일 버튼 */}
        {formData.cycle === 'WEEKLY' && (
          <div className="space-y-2">
            <Label>반복 요일</Label>
            <div className="grid grid-cols-7 gap-2">
              {WEEKDAYS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => UpdateField('weekday', d.value)}
                  className={cn(
                    'h-10 rounded-md border text-sm font-medium transition-colors',
                    formData.weekday === d.value
                      ? 'border-gray-500'
                      : 'border-gray-300 hover:border-gray-400'
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 월간 : 날짜 Select */}
        {formData.cycle === 'MONTHLY' && (
          <div className="space-y-2">
            <Label>반복 날짜</Label>
            <Select
              value={formData.monthday ? String(formData.monthday) : ''}
              onValueChange={(v) => UpdateField('monthday', Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="날짜를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {MONTH_DAYS.map((d) => (
                  <SelectItem key={d} value={String(d)}>
                    {d}일
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <p className="text-muted-foreground text-xs">
              29~31일은 해당 월에 날짜가 없으면 말일로 자동 조정돼요.
            </p>
          </div>
        )}

        <div className="mt-auto border-t pt-4 pb-4">
          <Button type="submit" className="w-full">
            저장
          </Button>
        </div>
      </form>
    </div>
  );
}
