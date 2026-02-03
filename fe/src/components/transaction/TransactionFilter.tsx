'use client';

import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '../ui/button';
import { X, Search, RotateCcw } from 'lucide-react';
import { TransactionFilters } from '@/app/(app)/history/actions';
import { CATEGORIES } from '@/constants/categories';
import Image from 'next/image';
import MonthPicker from '../common/MonthPicker';

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
  const [yearStr, monthStr] = month.split('-');
  const year = parseInt(yearStr, 10);
  const monthNum = parseInt(monthStr, 10);

  const handleDateChange = (selectedYear: number, selectedMonth: number) => {
    const newMonth = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
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
  const [categoryOpen, setCategoryOpen] = useState(false);

  // type 필터에 따라 카테고리 목록 결정
  const availableCategories = useMemo(() => {
    if (filters?.type === 'income') return CATEGORIES.income;
    if (filters?.type === 'expense') return CATEGORIES.expense;
    return [...CATEGORIES.income, ...CATEGORIES.expense];
  }, [filters?.type]);

  // 유형 변경 시 카테고리 초기화
  const handleTypeChange = (value: string) => {
    if (!onFiltersChange) return;
    const newFilters = { ...filters };
    if (value === 'all') {
      delete (newFilters as Record<string, string | undefined>).type;
    } else {
      (newFilters as Record<string, string | undefined>).type = value;
    }
    // 유형 변경 시 카테고리 초기화
    delete (newFilters as Record<string, string | undefined>).category_id;
    onFiltersChange(newFilters);
  };
  const handleSearch = () => {
    updateFilter('searchQuery', searchValue);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    updateFilter('searchQuery', undefined);
  };

  const handleClearAllFilters = () => {
    setSearchValue('');
    setOnSearch(false);
    if (onFiltersChange) {
      onFiltersChange({});
    }
  };

  const hasActiveFilters =
    !!filters?.type || !!filters?.category_id || !!filters?.searchQuery;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex-col">
      <div className="flex flex-col gap-2">
        <div className="flex w-full items-center gap-1 px-2">
          <MonthPicker
            year={year}
            month={monthNum}
            onDateChange={handleDateChange}
          />
          <div className="ml-auto flex sm:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setOnSearch(!onSearch)}
            >
              {onSearch ? (
                <X className="h-4 w-4" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="ml-auto hidden sm:block">
            <div className="relative">
              <Input
                placeholder="검색어를 입력해주세요"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-48 rounded-full pr-8 text-xs md:w-60"
              />
              {searchValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleClearSearch}
                  className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
        {onSearch && (
          <div className="px-2 sm:hidden">
            <div className="relative">
              <Input
                placeholder="검색어를 입력해주세요"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-full pr-8 text-xs"
              />
              {searchValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleClearSearch}
                  className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="mt-4">{children}</div>
      <div className="mt-4 flex items-center gap-2">
        <Select
          value={filters?.type || 'all'}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger className="w-28 sm:w-32">
            <SelectValue placeholder="유형" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 내역</SelectItem>
            <SelectItem value="income">수입</SelectItem>
            <SelectItem value="expense">지출</SelectItem>
          </SelectContent>
        </Select>
        <div>
          <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-36 justify-start text-sm"
                disabled={!filters?.type}
              >
                {!filters?.type
                  ? '유형 먼저 선택'
                  : filters?.category_id
                    ? (() => {
                        const selected = availableCategories.find(
                          (cat) => cat.category_key === filters.category_id
                        );
                        return selected ? (
                          <div className="flex items-center gap-2">
                            <Image
                              src={selected.icon}
                              alt={selected.name_ko}
                              width={18}
                              height={18}
                            />
                            <span>{selected.name_ko}</span>
                          </div>
                        ) : (
                          '모든 카테고리'
                        );
                      })()
                    : '모든 카테고리'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <div
                onClick={() => {
                  updateFilter('category_id', 'all');
                  setCategoryOpen(false);
                }}
                className="hover:bg-accent mb-2 cursor-pointer rounded p-2 text-center text-sm"
              >
                모든 카테고리
              </div>
              <div className="grid grid-cols-4 gap-1">
                {availableCategories.map((cat) => (
                  <div
                    key={cat.category_key}
                    onClick={() => {
                      updateFilter('category_id', cat.category_key);
                      setCategoryOpen(false);
                    }}
                    className="hover:bg-accent flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded text-center"
                  >
                    <Image
                      src={cat.icon}
                      alt={cat.name_ko}
                      width={22}
                      height={22}
                    />
                    <p className="text-muted-foreground text-xs">
                      {cat.name_ko}
                    </p>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClearAllFilters}
            className="ml-auto h-8 w-8 shrink-0"
            title="필터 초기화"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
