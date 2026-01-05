'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarView } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { type DayButton, getDefaultClassNames } from 'react-day-picker';
import { Button } from '../ui/button';
import ResponsivePanel from '../panel/ResponsivePanel';
import { useCalendar } from '@/context/CalendarContext';
import { ITransaction } from '@/types/transactions';

interface CalendarProps {
  currentMonth: string;
  transactions: ITransaction[];
}
const CustomDay = ({
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) => {
  const ref = useRef<HTMLButtonElement>(null);
  const defaultClassNames = getDefaultClassNames();
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  return (
    <Button
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={modifiers.selected}
      {...props}
      className={cn(
        'data-[selected-single=true]:border-2',
        'flex flex-col items-center justify-start gap-0.5 pt-1',
        'aspect-square w-full',
        'min-h-[60px] sm:min-h-[64px] md:min-h-[80px] lg:min-h-[120px]',
        defaultClassNames.day
      )}
    >
      <div className="flex flex-col gap-0.5 sm:gap-1 md:gap-2">
        <span className="text-sm font-medium sm:text-base md:text-lg">
          {day.date.getDate()}
        </span>
        <div className="flex flex-col text-[10px] sm:text-xs md:text-sm">
          <span className="text-red-400">+4000</span>
          <span className="text-blue-400">-2000</span>
        </div>
      </div>
    </Button>
  );
};

export const Calendar = ({ currentMonth, transactions }: CalendarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [month, setMonth] = useState<Date>(new Date(`${currentMonth}-01`));
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { selectedDate, isOpen, open, close } = useCalendar();

  const handleMonthChange = (newMonth: Date) => {
    setMonth(newMonth);
    
    const params = new URLSearchParams(searchParams.toString());
    const monthString = `${newMonth.getFullYear()}-${String(newMonth.getMonth() + 1).padStart(2, '0')}`;
    params.set('month', monthString);
    
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="ml-4 w-full">
      <CalendarView
        mode="single"
        selected={date}
        onSelect={setDate}
        onMonthChange={handleMonthChange}
        onDayClick={(day) => open(day)}
        className="rounded-md border shadow-sm"
        captionLayout="dropdown"
        components={{ DayButton: CustomDay }}
      />
      <ResponsivePanel isOpen={isOpen} setIsOpen={close}>
        hi
      </ResponsivePanel>
    </div>
  );
};
