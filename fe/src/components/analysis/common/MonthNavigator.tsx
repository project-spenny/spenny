'use client';

import MonthPicker from '@/components/common/MonthPicker';
import { useRouter } from 'next/navigation';

type MonthNavigatorProps = {
  year: number;
  month: number;
  baseUrl: string;
};

const MonthNavigator = ({ year, month, baseUrl }: MonthNavigatorProps) => {
  const router = useRouter();

  const handleDateChange = (newYear: number, newMonth: number) => {
    const queryString = `?year=${newYear}&month=${newMonth}`;

    router.push(`${baseUrl}${queryString}`);
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 md:py-10">
      <MonthPicker year={year} month={month} onDateChange={handleDateChange} />
    </div>
  );
};

export default MonthNavigator;
