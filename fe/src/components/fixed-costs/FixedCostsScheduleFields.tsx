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
import type { IFixedCostFormData } from '@/hooks/useFixedCostForm';

type Props = {
  formData: IFixedCostFormData;
  UpdateField: <K extends keyof IFixedCostFormData>(
    key: K,
    value: IFixedCostFormData[K]
  ) => void;
};

export default function FixedCostScheduleFields({
  formData,
  UpdateField,
}: Props) {
  return (
    <>
      {/* 시작일 */}
      <div className="space-y-2">
        <Label>시작일</Label>
        <DatePicker
          value={formData.start_date}
          onChange={(date) => UpdateField('start_date', date)}
          hideLabel
        />
      </div>

      {/* 종료일 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>종료일 (선택)</Label>
          <Switch
            checked={formData.end_date !== null}
            onCheckedChange={(checked) => {
              UpdateField('end_date', checked ? new Date() : null);
            }}
          />
        </div>

        {formData.end_date && (
          <DatePicker
            value={formData.end_date}
            onChange={(date) => UpdateField('end_date', date)}
            hideLabel
          />
        )}

        <p className="text-muted-foreground text-xs">
          종료일을 설정하려면 오른쪽 스위치를 켜세요.
        </p>
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
    </>
  );
}
