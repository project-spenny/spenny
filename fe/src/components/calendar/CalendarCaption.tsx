'use client';

import MonthPicker from '../common/MonthPicker';
import { cn } from '@/lib/utils';

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
          <MonthPicker
            year={year}
            month={displayMonth}
            onDateChange={(selectedYear, selectedMonth) => {
              // 연도가 바뀌었을 때
              if (selectedYear !== year) {
                const newDate = new Date(selectedYear, month.getMonth(), 1);
                handleMonthChange(newDate);
              }
              // 월이 바뀌었을 때
              else {
                navigateMonth(selectedMonth);
              }
            }}
            onMoveClick={moveMonth}
          />

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
