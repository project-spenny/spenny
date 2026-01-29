'use client';

import MonthPicker from '@/components/common/MonthPicker';
import { useRouter } from 'next/navigation';

type MonthNavigatorProps = {
  year: number;
  month: number;
  baseUrl: string;
  disabled: boolean;
};

const MonthNavigator = ({
  year,
  month,
  baseUrl,
  disabled,
}: MonthNavigatorProps) => {
  const router = useRouter();

  const handleDateChange = (newYear: number, newMonth: number) => {
    if (disabled) return;

    const queryString = `?year=${newYear}&month=${newMonth}`;

    router.push(`${baseUrl}${queryString}`);
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 md:py-10">
      <MonthPicker
        year={year}
        month={month}
        onDateChange={handleDateChange}
        disabled={disabled}
      />

      {disabled && (
        <span className="text-destructive text-sm">
          예산 추천 중에는 월 변경이 제한됩니다.
        </span>
      )}
    </div>
  );
};

export default MonthNavigator;
