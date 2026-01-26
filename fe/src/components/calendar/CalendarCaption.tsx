'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  month: i + 1,
  monthDisplay: `${i + 1}월`,
}));

interface CalendarCaptionProps {
  year: number;
  displayMonth: number;
  month: Date;
  income: number;
  expense: number;
  moveMonth: (delta: number) => void;
  navigateMonth: (month: number) => void;
  handleMonthChange: (date: Date) => void;
  children?: React.ReactNode;
}

export const CalendarCaption = ({
  year,
  displayMonth,
  month,
  income,
  expense,
  moveMonth,
  navigateMonth,
  handleMonthChange,
  children,
}: CalendarCaptionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'month' | 'year'>('month');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const handleYearSelect = (selectedYear: number) => {
    const newDate = new Date(selectedYear, month.getMonth(), 1);
    handleMonthChange(newDate);
    setMode('month');
  };

  return (
    <div className="mb-4 w-full">
      <div className="flex flex-col-reverse gap-2 lg:flex-row">
        <div
          className={cn(
            'flex flex-1 items-center justify-between rounded-md px-4 py-3',
            'bg-brand-subtle dark:bg-muted/40',
            'dark:border-border border border-transparent',
            'border-l-brand border-l-4'
          )}
        >
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground text-xs">{year}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-brand-soft/40 h-8 w-8"
                onClick={() => moveMonth(-1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      'hover:bg-brand-soft/40 w-16 justify-center font-semibold',
                      'text-xl tracking-tight sm:text-2xl'
                    )}
                  >
                    {displayMonth}월
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  {mode === 'month' ? (
                    <div className="grid grid-cols-3 p-2">
                      <div
                        onClick={() => setMode('year')}
                        className="hover:bg-accent hover:text-accent-foreground col-span-3 cursor-pointer rounded p-2 text-center font-bold"
                      >
                        {year}
                      </div>
                      {MONTHS.map(({ month, monthDisplay }) => (
                        <div
                          className="hover:bg-accent hover:text-accent-foreground flex h-12 w-12 cursor-pointer flex-col items-center justify-center gap-2 rounded text-center text-xs"
                          onClick={() => {
                            navigateMonth(month);
                            setIsOpen(false);
                          }}
                          key={month}
                        >
                          {monthDisplay}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 p-2">
                      <div
                        className="hover:bg-accent hover:text-accent-foreground col-span-3 cursor-pointer rounded p-2 text-center font-bold"
                        onClick={() => setMode('month')}
                      >
                        {displayMonth}월
                      </div>
                      {years.map((y) => (
                        <div
                          key={y}
                          className="hover:bg-accent hover:text-accent-foreground flex h-12 w-12 cursor-pointer items-center justify-center rounded text-sm"
                          onClick={() => handleYearSelect(y)}
                        >
                          {y}
                        </div>
                      ))}
                    </div>
                  )}
                </PopoverContent>
              </Popover>

              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-brand-soft/40 h-8 w-8"
                onClick={() => moveMonth(1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-1 text-right">
            <div className="flex items-baseline justify-end gap-2">
              <span className="text-muted-foreground text-xs font-medium sm:text-sm">
                수입
              </span>
              <span className="text-sm font-semibold tracking-tight text-blue-500 sm:text-base">
                {income.toLocaleString()}원
              </span>
            </div>

            <div className="flex items-baseline justify-end gap-2">
              <span className="text-muted-foreground text-xs font-medium sm:text-sm">
                지출
              </span>
              <span className="text-sm font-semibold tracking-tight text-red-400 sm:text-base">
                {expense.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        <div className="flex-2">{children}</div>
      </div>
    </div>
  );
};
