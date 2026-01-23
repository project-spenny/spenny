'use client';
import { useEffect, useState } from 'react';
import { formatMonth } from '@/utils/date';
export const useCalendarNavigation = (
  currentMonth: string,
  onMonthChange: (month: string) => void
) => {
  const [month, setMonth] = useState<Date>(new Date(`${currentMonth}-01`));
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    setMonth(new Date(`${currentMonth}-01`));
  }, [currentMonth]);

  const handleMonthChange = (newMonth: Date) => {
      setMonth(newMonth);
      const monthString = formatMonth(newMonth);
      onMonthChange(monthString);
 };

  const moveMonth = (offset: number) => {
    const newDate = new Date(month.getFullYear(), month.getMonth() + offset, 1);
    handleMonthChange(newDate);
  };

  const year = month.getFullYear();
  const displayMonth = month.getMonth() + 1;

  return {
    month,
    date,
    setDate,
    year,
    displayMonth,
    handleMonthChange,
    moveMonth,
  };
};
