'use client';
import { useState } from 'react';
import { Calendar as CalendarView } from '@/components/ui/calendar';
import { type DayButton } from 'react-day-picker';
import { Button } from '../ui/button';

const CustomDay = ({
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      {...props}
      className="h-24 w-24"
    >
      <div className="flex flex-col gap-2">
        <span className="text-lg">{day.date.getDate()}</span>
        <div className="flex flex-col text-xs">
          <span className="text-red-400">+4000</span>
          <span className="text-blue-400">-2000</span>
        </div>
      </div>
    </Button>
  );
};

export const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="ml-4 w-full bg-red-300">
      <CalendarView
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow-sm"
        captionLayout="dropdown"
        components={{ DayButton: CustomDay }}
      />
    </div>
  );
};
