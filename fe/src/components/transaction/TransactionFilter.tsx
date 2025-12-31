// app/transactions/components/TransactionFilter.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
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

export function TransactionFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getCurrentMonth = () => {
    const startDate = searchParams.get('start_date');
    if (startDate) {
      return new Date(startDate);
    }
    return new Date();
  };
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const updateMonthFilter = (date: Date) => {
    const params = new URLSearchParams(searchParams);

    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    params.set('start_date', formatDate(startDate));
    params.set('end_date', formatDate(endDate));

    router.push(`/history?${params.toString()}`);
  };
  const handlePreviousMonth = () => {
    const newMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() - 1,
      1
    );
    setSelectedMonth(newMonth);
    updateMonthFilter(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + 1,
      1
    );
    setSelectedMonth(newMonth);
    updateMonthFilter(newMonth);
  };
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/history?${params.toString()}`);
  };
  const [searchValue, setSearchValue] = useState(
    searchParams.get('queryString') || ''
  );
  const handleSearch = () => {
    updateFilter('queryString', searchValue);
  };

  const handleClearSearch = () => {
    setSearchValue('');
    updateFilter('queryString', '');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  const monthDisplay = (date: Date) => {
    const month = date.getMonth() + 1;
    return `${String(month)}월`;
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
          value={searchParams.get('type') || 'all'}
          onValueChange={(value) => updateFilter('type', value)}
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
