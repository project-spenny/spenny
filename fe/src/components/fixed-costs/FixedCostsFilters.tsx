'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFixedCostsFilters } from '@/hooks/useFixedCostsFilters';
import { formatLocalDate, parseLocalDate } from '@/utils/date';
import RangeDatePicker from './RangeDatePicker';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Filter, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';

export default function FixedCostsFilters() {
  const { searchParams, updateFilter, updateFilters } = useFixedCostsFilters();
  const type = searchParams.get('type') || 'all';
  const cycle = searchParams.get('cycle') || 'all';
  const start = parseLocalDate(searchParams.get('start_date'));
  const end = parseLocalDate(searchParams.get('end_date'));

  const [endEnabled, setEndEnabled] = React.useState<boolean>(!!end);
  React.useEffect(() => {
    if (!end) setEndEnabled(false);
  }, [end]);

  const resetFilters = () => {
    setEndEnabled(false);

    updateFilters({
      type: 'all',
      cycle: 'all',
      start_date: 'all',
      end_date: 'all',
    });
  };

  return (
    <section className="w-full rounded-xl border p-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <Filter className="h-4 w-4" />
          필터
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8"
          onClick={resetFilters}
        >
          <RotateCcw className="mr-1 h-4 w-4" />
          초기화
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* 타입 */}
        <Select
          value={type}
          onValueChange={(value) => updateFilter('type', value)}
        >
          <SelectTrigger
            className={cn(
              'min-w-[96px]',
              type === 'all' && 'text-muted-foreground'
            )}
          >
            <SelectValue>
              {type === 'all' ? '타입' : type === 'income' ? '수입' : '지출'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="income">수입</SelectItem>
            <SelectItem value="expense">지출</SelectItem>
          </SelectContent>
        </Select>

        {/* 반복 주기 */}
        <Select
          value={cycle}
          onValueChange={(value) => updateFilter('cycle', value)}
        >
          <SelectTrigger
            className={cn(
              'min-w-[96px]',
              cycle === 'all' && 'text-muted-foreground'
            )}
          >
            <SelectValue>
              {cycle === 'all' ? '주기' : cycle === 'MONTHLY' ? '월간' : '주간'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="MONTHLY">월간</SelectItem>
            <SelectItem value="WEEKLY">주간</SelectItem>
          </SelectContent>
        </Select>

        {/* 기간 */}
        <RangeDatePicker
          start={start}
          end={end}
          endEnabled={endEnabled}
          onChange={({ start, end, endEnabled }) => {
            setEndEnabled(endEnabled);

            // start가 없으면 전체 초기화
            if (!start) {
              updateFilters({ start_date: 'all', end_date: 'all' });
              return;
            }

            const startStr = formatLocalDate(start);

            // 토글 OFF면 end는 제거
            if (!endEnabled) {
              updateFilters({ start_date: startStr, end_date: 'all' });
              return;
            }

            // 토글 ON인데 end가 아직 없으면: start만 유지하고 end는 비움
            if (!end) {
              updateFilters({ start_date: startStr, end_date: 'all' });
              return;
            }

            const endStr = formatLocalDate(end);

            // end < start면 swap
            if (endStr < startStr) {
              updateFilters({ start_date: endStr, end_date: startStr });
              return;
            }

            updateFilters({ start_date: startStr, end_date: endStr });
          }}
        />
      </div>

      {/* 검색 */}
      <div className="mt-2 min-w-[180px] flex-1">
        <Input placeholder="검색..." className="h-9" />
      </div>
    </section>
  );
}
