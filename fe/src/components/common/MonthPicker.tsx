'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  month: i + 1,
  monthDisplay: `${i + 1}월`,
}));

interface MonthPickerProps {
  year: number;
  month: number;
  onDateChange: (year: number, month: number) => void; // 날짜 변경 시
  onMoveClick?: (delta: number) => void; // 화살표 이동 시
  className?: string;
}

const MonthPicker = ({
  year,
  month,
  onDateChange,
  onMoveClick,
}: MonthPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'month' | 'year'>('month');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  // 연도 선택 핸들러
  const handleYearSelect = (selectedYear: number) => {
    onDateChange(selectedYear, month);
    setMode('month'); // 연도 선택 후 월 선택 모드로 돌아가기
  };

  // 월 선택 핸들러
  const handleMonthSelect = (selectedMonth: number) => {
    onDateChange(year, selectedMonth);
    setIsOpen(false); // 팝오버 닫기
  };

  // 화살표 이동 핸들러
  const handleMove = (delta: number) => {
    if (onMoveClick) {
      // 전용 함수가 있으면 사용
      onMoveClick(delta);
    } else {
      // 없으면 직접 계산해서 onDateChange 호출
      const targetDate = new Date(year, month - 1 + delta, 1);
      onDateChange(targetDate.getFullYear(), targetDate.getMonth() + 1);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <span className="text-brand text-sm font-bold">{year}</span>
      <div className="flex items-center gap-2">
        {/* 이전 달 이동 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-brand-soft/40 h-8 w-8"
          onClick={() => handleMove(-1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* 연/월 선택 */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'hover:bg-brand-soft/40 w-16 justify-center font-semibold',
                'text-xl tracking-tight sm:text-2xl'
              )}
            >
              {month}월
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
                    onClick={() => handleMonthSelect(month)}
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
                  {month}월
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

        {/* 다음 달 이동 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-brand-soft/40 h-8 w-8"
          onClick={() => handleMove(1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MonthPicker;
