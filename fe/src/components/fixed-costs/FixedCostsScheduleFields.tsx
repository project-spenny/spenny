'use client';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { DatePicker } from '@/components/transaction/common/DatePicker';
import { WEEKDAYS, MONTH_DAYS } from '@/constants/fixed-costs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { FixedCostFormValues } from '@/schemas/fixedCosts';

type Props = {
  form: UseFormReturn<FixedCostFormValues>;
};

export default function FixedCostScheduleFields({ form }: Props) {
  const { control, watch, setValue } = form;

  const cycle = watch('cycle');
  const endDate = watch('end_date');
  const weekday = watch('weekday');

  return (
    <>
      {/* 시작일 */}
      <div className="flex">
        <Label className="w-28 pr-2">시작일</Label>
        <Controller
          control={control}
          name="start_date"
          render={({ field }) => (
            <DatePicker
              value={field.value}
              onChange={(date) => field.onChange(date)}
              hideLabel
            />
          )}
        />
      </div>

      {/* 종료일 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>종료일 (선택)</Label>
          <Switch
            checked={endDate !== null}
            onCheckedChange={(checked) => {
              setValue('end_date', checked ? new Date() : null, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
          />
        </div>
        <p className="text-muted-foreground text-xs">
          종료일을 설정하려면 오른쪽 스위치를 켜세요.
        </p>
        {endDate && (
          <Controller
            control={control}
            name="end_date"
            render={({ field }) => (
              <DatePicker
                value={field.value as Date}
                onChange={(date) => field.onChange(date)}
                hideLabel
              />
            )}
          />
        )}
      </div>

      {/* 반복 주기 */}
      <div className="flex items-center space-y-2">
        <Label className="w-28 pr-2">반복 주기</Label>
        <div className="grid w-full grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              setValue('cycle', 'WEEKLY', {
                shouldDirty: true,
                shouldValidate: true,
              });
              setValue('weekday', null, { shouldDirty: true });
              setValue('monthday', null, { shouldDirty: true });
            }}
            className={cn(
              'cursor-pointer rounded-lg border-2 px-6 py-2 text-sm font-medium transition-all',
              cycle === 'WEEKLY'
                ? 'border-brand-strong bg-brand-soft/20 text-brand-strong dark:border-brand-soft dark:bg-brand-soft/10 dark:text-brand-soft'
                : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
            )}
          >
            주간
          </button>

          <button
            type="button"
            onClick={() => {
              setValue('cycle', 'MONTHLY', {
                shouldDirty: true,
                shouldValidate: true,
              });
              setValue('weekday', null, { shouldDirty: true });
              setValue('monthday', null, { shouldDirty: true });
            }}
            className={cn(
              'cursor-pointer rounded-lg border-2 px-6 py-2 text-sm font-medium transition-all',
              cycle === 'MONTHLY'
                ? 'border-brand-strong bg-brand-soft/20 text-brand-strong dark:border-brand-soft dark:bg-brand-soft/10 dark:text-brand-soft'
                : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
            )}
          >
            월간
          </button>
        </div>
      </div>

      {/* 주간 : 요일 버튼 */}
      {cycle === 'WEEKLY' && (
        <div className="space-y-5">
          <Label className="w-28 pr-2">반복 요일</Label>
          <div className="grid grid-cols-7 gap-2">
            {WEEKDAYS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() =>
                  setValue('weekday', d.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                className={cn(
                  'h-10 rounded-md border text-sm font-medium transition-all',
                  weekday === d.value
                    ? 'border-brand-strong bg-brand-soft/20 text-brand-strong dark:border-brand-soft dark:bg-brand-soft/10 dark:text-brand-soft'
                    : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 월간 : 날짜 Select */}
      {cycle === 'MONTHLY' && (
        <>
          <div className="flex items-center">
            <Label className="w-28 pr-2">반복 날짜</Label>

            <Controller
              control={control}
              name="monthday"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                >
                  <SelectTrigger className="w-full">
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
              )}
            />
          </div>
          <p className="text-muted-foreground text-xs">
            29~31일은 해당 월에 날짜가 없으면 말일로 자동 조정돼요.
          </p>
        </>
      )}
    </>
  );
}
