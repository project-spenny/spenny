'use client';
import { useState } from 'react';
import { Calendar as CalendarView } from '@/components/ui/calendar';
import { DayProps } from 'react-day-picker';

const Day = (props: DayProps) => {
  const dateKey = props.day.date.toISOString().split('T')[0];
  return (
    <div className="relative flex h-24 w-24 flex-col items-center justify-center bg-yellow-200">
      {dateKey}
    </div>
  );
};

export const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <CalendarView
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow-sm"
      captionLayout="dropdown"
      components={{ Day: Day }}
    />
  );
};
