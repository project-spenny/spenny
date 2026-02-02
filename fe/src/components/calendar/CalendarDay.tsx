import { Button } from "../ui/button";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { formatLocalDate } from "@/utils/date";
import { type DayButton, getDefaultClassNames } from 'react-day-picker';
import { ITransaction } from "@/types/transactions";

interface DayData {
  income: number;
  expense: number;
  transactions: ITransaction[];
}

export const CalendarDay = ({
  day,
  modifiers,
  dayData,
  ...props
}: React.ComponentProps<typeof DayButton> & { dayData?: DayData }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const defaultClassNames = getDefaultClassNames();
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  return (
    <Button
      ref={ref}
      variant="ghost"
      data-day={formatLocalDate(day.date)}
      data-selected-single={modifiers.selected}
      {...props}
      className={cn(
        'flex flex-col items-center justify-start',
        'h-full min-h-0 w-full min-w-0 overflow-hidden',
        'p-0.5 sm:p-2 sm:pt-1',
        'gap-0 sm:gap-1',
        defaultClassNames.day
      )}
    >
      <div className="flex w-full flex-col items-center gap-0 overflow-hidden sm:gap-0.5 md:gap-1">
        <span className="text-xs font-medium sm:text-base md:text-lg">
          {day.date.getDate()}
        </span>
        {dayData && (dayData.income > 0 || dayData.expense > 0) && (
          <div className="flex w-full flex-col items-center overflow-hidden text-[6px] leading-tight sm:text-[10px] md:text-xs">
            {dayData.income > 0 && (
              <span className="text-blue-500">
                +{dayData.income.toLocaleString()}
              </span>
            )}
            {dayData.expense > 0 && (
              <span className="text-red-500">
                -{dayData.expense.toLocaleString()}
              </span>
            )}
          </div>
        )}
      </div>
    </Button>
  );
};