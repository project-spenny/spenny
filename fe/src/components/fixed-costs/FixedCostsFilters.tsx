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

  return (
    <div className="flex items-center gap-2">
      {/* 타입 */}
      <Select
        value={type}
        onValueChange={(value) => updateFilter('type', value)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="타입" />
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
        <SelectTrigger className="w-32">
          <SelectValue placeholder="주기" />
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
  );
}
