'use client';

import React, { useState } from 'react';
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
  children?: React.ReactNode;
}

export function TransactionFilter({
  month,
  onMonthChange,
  filters,
  onFiltersChange,
  children,
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
  const [onSearch, setOnSearch] = useState<boolean>(false);
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
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex items-center gap-1 border border-none px-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="min-w-12 text-center text-base font-semibold sm:min-w-8 sm:text-xl">
            <p className="text-muted-foreground text-xs font-light">
              {yearDisplay(selectedMonth)}
            </p>
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
          <div className="ml-auto flex">
            <div
              className={`relative sm:ml-auto sm:block ${onSearch ? 'block' : 'hidden'}`}
            >
              <div>
                <Input
                  placeholder="검색어를 입력해주세요"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="mr-auto w-60 rounded-full text-xs"
                />
                <div className="absolute top-2/5 right-0 flex -translate-y-1/2 gap-1">
                  {searchValue && (
                    <div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleClearSearch}
                        className="mr-auto"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {onSearch ? (
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="right-auto h-8 w-8 sm:hidden"
                  onClick={() => setOnSearch(!onSearch)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="right-auto h-8 w-8 sm:hidden"
                onClick={() => setOnSearch(!onSearch)}
              >
                <Search className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4">{children}</div>
      <div className="mt-4 flex gap-2">
        <div>
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
        </div>
      </div>
    </div>
  );
}
