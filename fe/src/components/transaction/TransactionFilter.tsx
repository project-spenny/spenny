'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { Search, ChevronRight, ChevronLeft } from 'lucide-react';
import { TransactionFilters } from '@/app/(app)/history/actions';

interface TransactionFilterProps {
  month: string; // 'YYYY-MM' 형식
  onMonthChange: (month: string) => void;
  filters?: Omit<TransactionFilters, 'start_date' | 'end_date'>;
  onFiltersChange?: (
    filters: Omit<TransactionFilters, 'start_date' | 'end_date'>
  ) => void;
}

export function TransactionFilter({
  month,
  onMonthChange,
  filters,
  onFiltersChange,
}: TransactionFilterProps) {
  // month를 Date로 변환
  const selectedMonth = new Date(`${month}-01`);

  const handlePreviousMonth = () => {
    const newDate = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() - 1,
      1
    );
    const newMonth = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`;
    onMonthChange(newMonth);
  };

  const handleNextMonth = () => {
    const newDate = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + 1,
      1
    );
    const newMonth = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}`;
    onMonthChange(newMonth);
  };

  const updateFilter = (
    key: keyof Omit<TransactionFilters, 'start_date' | 'end_date'>,
    value: string | undefined
  ) => {
    if (!onFiltersChange) return;
    const newFilters = { ...filters };
    if (value && value !== 'all') {
      (newFilters as Record<string, string | undefined>)[key] = value;
    } else {
      delete (newFilters as Record<string, string | undefined>)[key];
    }
    onFiltersChange(newFilters);
  };

  const [searchValue, setSearchValue] = useState(filters?.searchQuery || '');

  const handleSearch = () => {
    updateFilter('searchQuery', searchValue);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    updateFilter('searchQuery', undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const monthDisplay = (date: Date) => {
    const m = date.getMonth() + 1;
    return `${String(m)}월`;
  };

  const yearDisplay = (date: Date) => {
    const year = date.getFullYear();
    return `${String(year)}년`;
  };

  return (
    <div className="flex-col">
      <div className="m-4 ml-0 text-2xl font-semibold">
        {yearDisplay(selectedMonth)}
      </div>
      <div className="flex gap-2">
        <div className="flex items-center gap-1 rounded-md border px-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="min-w-24 text-center text-sm font-medium">
            {monthDisplay(selectedMonth)}
          </span>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Select
          value={filters?.type || 'all'}
          onValueChange={(value) =>
            updateFilter('type', value as 'income' | 'expense' | undefined)
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="유형" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="income">수입</SelectItem>
            <SelectItem value="expense">지출</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative max-w-lg flex-1">
          <Input
            placeholder="검색..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full"
          />
          <div className="absolute top-1/2 right-1 flex -translate-y-1/2 gap-1">
            {searchValue && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
