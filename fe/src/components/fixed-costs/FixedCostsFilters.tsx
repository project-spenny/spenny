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
import { Input } from '../ui/input';
import { Search, LayoutGrid, Repeat, RotateCcw, Check } from 'lucide-react';
import { Button } from '../ui/button';

type LocalFilters = {
  type: string;
  cycle: string;
  start?: Date;
  end?: Date;
  query: string;
};

export default function FixedCostsFilters() {
  const { searchParams, updateFilters } = useFixedCostsFilters();

  // 로컬 상태로 필터 초기값 설정
  const [localFilters, setLocalFilters] = React.useState<LocalFilters>({
    type: searchParams.get('type') || 'all',
    cycle: searchParams.get('cycle') || 'all',
    start: parseLocalDate(searchParams.get('start_date')),
    end: parseLocalDate(searchParams.get('end_date')),
    query: searchParams.get('query') ?? '',
  });

  const [endEnabled, setEndEnabled] = React.useState<boolean>(
    !!localFilters.end
  );

  // URL(searchParams)이 바뀌면 로컬 상태도 동기화
  React.useEffect(() => {
    const nextStart = parseLocalDate(searchParams.get('start_date'));
    const nextEnd = parseLocalDate(searchParams.get('end_date'));

    setLocalFilters({
      type: searchParams.get('type') || 'all',
      cycle: searchParams.get('cycle') || 'all',
      start: nextStart,
      end: nextEnd,
      query: searchParams.get('query') ?? '',
    });

    // URL에 end_date가 있으면 토글 ON, 없으면 OFF
    setEndEnabled(!!nextEnd);
  }, [searchParams.toString()]);

  // 검색 실행 함수
  const handleApply = () => {
    const startStr = localFilters.start
      ? formatLocalDate(localFilters.start)
      : 'all';
    const endStr =
      endEnabled && localFilters.end
        ? formatLocalDate(localFilters.end)
        : 'all';

    // start가 없으면 기간은 둘 다 해제
    if (startStr === 'all') {
      updateFilters({
        type: localFilters.type,
        cycle: localFilters.cycle,
        start_date: 'all',
        end_date: 'all',
        query: localFilters.query || 'all',
      });
      return;
    }

    // end가 없으면 start만 유지
    if (endStr === 'all') {
      updateFilters({
        type: localFilters.type,
        cycle: localFilters.cycle,
        start_date: startStr,
        query: localFilters.query || 'all',
      });
      return;
    }

    // 둘 다 있으면 swap 보정
    const from = endStr < startStr ? endStr : startStr;
    const to = endStr < startStr ? startStr : endStr;

    updateFilters({
      type: localFilters.type,
      cycle: localFilters.cycle,
      start_date: from,
      end_date: to,
      query: localFilters.query || 'all',
    });
  };

  const handleReset = () => {
    setLocalFilters({
      type: 'all',
      cycle: 'all',
      start: undefined,
      end: undefined,
      query: '',
    });
    setEndEnabled(false);
    updateFilters({
      type: 'all',
      cycle: 'all',
      start_date: 'all',
      end_date: 'all',
      query: 'all',
    });
  };

  return (
    <section className="bg-brand-subtle/30 border-brand-soft/20 w-full rounded-lg border p-4 shadow-sm dark:bg-neutral-900 dark:text-neutral-100">
      <div className="flex flex-col gap-4">
        {/* 검색창 */}
        <div className="group relative">
          <Search className="text-brand-neutral group-focus-within:text-brand absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 transition-colors" />
          <Input
            value={localFilters.query}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                query: e.target.value,
              }))
            }
            placeholder="어떤 내역을 찾으시나요?"
            className="ring-brand-neutral/20 focus-visible:ring-brand-soft placeholder:text-brand-neutral h-10 border-none bg-white pl-11 shadow-sm ring-1"
          />
        </div>

        {/* 필터 컨트롤 그룹 */}
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={localFilters.type}
            onValueChange={(v) =>
              setLocalFilters((prev) => ({ ...prev, type: v }))
            }
          >
            <SelectTrigger className="ring-brand-neutral/20 focus:ring-brand h-10 min-w-[120px] flex-1 border-none bg-white ring-1 md:w-[140px] md:flex-none">
              <div className="flex items-center gap-2">
                <LayoutGrid className="text-brand h-4 w-4 opacity-60" />
                <SelectValue placeholder="타입" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 타입</SelectItem>
              <SelectItem value="income">수입</SelectItem>
              <SelectItem value="expense">지출</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={localFilters.cycle}
            onValueChange={(v) =>
              setLocalFilters((prev) => ({ ...prev, cycle: v }))
            }
          >
            <SelectTrigger className="ring-brand-neutral/20 focus:ring-brand h-10 min-w-[120px] flex-1 border-none bg-white ring-1 md:w-[140px] md:flex-none">
              <div className="flex items-center gap-2">
                <Repeat className="text-brand h-4 w-4 opacity-60" />
                <SelectValue placeholder="주기" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 주기</SelectItem>
              <SelectItem value="MONTHLY">월간</SelectItem>
              <SelectItem value="WEEKLY">주간</SelectItem>
            </SelectContent>
          </Select>

          <RangeDatePicker
            start={localFilters.start}
            end={localFilters.end}
            endEnabled={endEnabled}
            onChange={({ start, end, endEnabled }) => {
              setEndEnabled(endEnabled);
              setLocalFilters((prev) => ({ ...prev, start, end }));
            }}
          />
        </div>

        {/* 액션 버튼 그룹 */}
        <div className="border-brand-soft/10 flex items-center justify-end gap-2 border-t pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-brand-neutral hover:text-brand-strong hover:bg-brand-soft/20 h-9 px-4 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          >
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            초기화
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            className="bg-brand hover:bg-brand-strong h-9 rounded-lg px-6 text-white shadow-md transition-all active:scale-95"
          >
            <Check className="mr-1.5 h-4 w-4" />
            조건 적용하기
          </Button>
        </div>
      </div>
    </section>
  );
}
