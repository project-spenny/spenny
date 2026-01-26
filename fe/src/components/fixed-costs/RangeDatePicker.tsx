'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { formatLocalDate } from '@/utils/date';
import type { DateRange } from 'react-day-picker';

type Props = {
  start?: Date;
  end?: Date;
  endEnabled: boolean;
  onChange: (next: { start?: Date; end?: Date; endEnabled: boolean }) => void;
};

export default function RangeDatePicker({
  start,
  end,
  endEnabled,
  onChange,
}: Props) {
  const selected: DateRange | undefined = start
    ? { from: start, to: endEnabled ? end : undefined }
    : undefined;

  const label = React.useMemo(() => {
    if (!start) return '기간 선택';
    if (!endEnabled || !end) return formatLocalDate(start);
    return `${formatLocalDate(start)} → ${formatLocalDate(end)}`;
  }, [start, end, endEnabled]);

  const handleToggleEnd = (checked: boolean) => {
    if (!checked) {
      // 종료일 기능 OFF : end 제거
      onChange({ start, end: undefined, endEnabled: false });
      return;
    }

    // 종료일 기능 ON : start가 있으면 end 기본값을 start로 설정
    if (start) {
      onChange({ start, end: end ?? start, endEnabled: true });
    } else {
      // start가 없으면 토글만 켜두고, 사용자가 날짜를 찍으면 start부터 잡히게
      onChange({ start: undefined, end: undefined, endEnabled: true });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-[260px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{label}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-3" align="start">
        <Calendar
          mode="range"
          selected={selected}
          onSelect={(range) => {
            if (!range?.from) return;

            // 토글 OFF면 단일 날짜처럼 from만 유지
            if (!endEnabled) {
              onChange({
                start: range.from,
                end: undefined,
                endEnabled: false,
              });
              return;
            }

            // 토글 ON이면 range 유지
            // 1번 클릭: from만 생김 (to 없음)
            // 2번 클릭: to 생김
            onChange({
              start: range.from,
              end: range.to ?? undefined,
              endEnabled: true,
            });
          }}
          numberOfMonths={1}
        />

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Label className="text-sm">종료일</Label>
            <Switch checked={endEnabled} onCheckedChange={handleToggleEnd} />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              onChange({ start: undefined, end: undefined, endEnabled: false })
            }
          >
            초기화
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
